const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const IncorrectData = require('../errors/incorrect-data');
const NotAccess = require('../errors/not-access');
const { STATUS_OK } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
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
        next(err);
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
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для постановки лайка'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Передан не существующий id:${cardId} карточки`));
      } else {
        next(err);
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
        next(new NotFoundError(`Передан не существующий id:${cardId} карточки`));
      } else if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
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
        return Promise.reject(new NotAccess('Нельзя удалять чужие карточки'));
      }
      return Card.findOneAndDelete(cardId)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для удаления карточки'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Карточка с указанным id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};
