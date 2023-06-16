const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, STATUS_OK, ERROR_DEFAULT} = require('../utils/constants');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectData = require('../errors/incorrect-data');

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate(['name', 'about', 'avatar'])
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_DEFAULT)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для запроса пользователя'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Пользователь по указанному id: ${userId} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // console.log(email);
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError(`Пользователь по указанному id:${_id} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(`Пользователь по указанному id:${_id} не найден`));
      } else if (err.name === 'ValidationError') {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send('Авторизация прошла успешно');
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(new Error('NotID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectData('Переданы некорректные данные для запроса пользователя'));
      } else if (err.message === 'NotID') {
        next(new NotFoundError(`Пользователь по указанному id: ${_id} не найден`));
      } else {
        next(err);
      }
    });
};
