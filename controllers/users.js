const User = require('../models/user');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../errors/errors');

const STATUS_OK = 201;

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate(['name', 'about', 'avatar'])
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_DEFAULT)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для запроса пользователя' });
      } else if (err.message === 'NotID') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id: ${userId} не найден` });
      } else {
        return res.status(ERROR_DEFAULT)
          .send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
        // } else if (err.message) {
        //   res.status(ERROR_INCORRECT_DATA)
        //     .send({
        //       message: Object.keys(err.errors).reduce((acc, key) => {
        //         acc.push(err.errors[`${key}`].message);
        //         return acc
        //       }, []).join('. ')
        //     })
        //   return;
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
      } else if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: err.message });
      }
    });
};
