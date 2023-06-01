const Card = require('../models/card'); 
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT
} = require('../errors/errors')

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then(cards => res.send(cards))
    .catch(err => res.status(ERROR_DEFAULT)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then(card => res.send(card))
    .catch(err => {
      if (!name || !link || err.message) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные при создании пользователя` });
        return;
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: err.message })
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: _id } },
    { new: true })
    .then(card => res.send(card))
    .catch(err => {
      if (!Card[cardId]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Передан не существующий id:${cardId} карточки` });
        return;
      } else if (!cardId) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные для постановки лайка` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message })
      }
    })
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: _id } },
    { new: true })
    .then(card => res.send(card))
    .catch(err => {
      if (!Card[_id]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Передан не существующий id:${_id} карточки` });
        return;
      } else if (!id) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные для снятия лайка` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message })
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.send({ message: `Карточка с указанным id: ${cardId} не найдена` });
        return
      }
      res.send({ message: "Пост удалён" })
    })
    .catch(() => {
      if (!Card[cardId]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` })
      }
    });
};