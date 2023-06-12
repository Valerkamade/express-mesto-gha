const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const {
  ERROR_DEFAULT,
} = require('../errors/errors');
const IncorrectData = require('../errors/incorrect-data');

const STATUS_OK = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_DEFAULT)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для постановки лайка'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Передан не существующий id:${cardId} карточки`));
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  ).orFail(new Error('NotID'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotID') {
        next(new NotFoundError(`Передан не существующий id:${_id} карточки`));
      } else if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для снятия лайка'));
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail(new Error('NotID'))
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new Error('Нельзя удалять чужие карточки'));
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для удаления карточки'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`));
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};
