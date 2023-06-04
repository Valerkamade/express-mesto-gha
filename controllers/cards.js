const Card = require('../models/card');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../errors/errors');

const STATUS_OK = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_DEFAULT)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('NotID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.message === 'NotID') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: `Передан не существующий id:${cardId} карточки` });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('NotID'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.message === 'NotID') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: `Передан не существующий id:${_id} карточки` });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotID'))
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else if (err.message === 'NotID') {
        return res.status(ERROR_NOT_FOUND).send({ message: `Карточка с указанным id: ${cardId} не найдена` });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};
