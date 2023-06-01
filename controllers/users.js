const User = require('../models/user');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT
} = require('../errors/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate(['name', 'about', 'avatar'])
    .then(users => res.send(users))
    .catch(err => {
      res.status(ERROR_DEFAULT)
        .send({ message: err.message });
      return;
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id: ${userId} не найден` });
        return;
      };
      res.send(user);
    })
    .catch(err => {
      if (!User[userId]) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Пользователь по указанному id: ${userId} не найден` });
        return;
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: err.message })
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      if (!name || !about || !avatar) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные при создании пользователя` });
        return;
      } else if (err.message) {
        res.status(ERROR_INCORRECT_DATA)
          .send({
            messsage: Object.keys(err.errors).reduce((acc, key) => {
              acc.push(err.errors[`${key}`].message);
              return acc
            }, []).join('. ')
          })
        return;
      } else {
        res.status(ERROR_DEFAULT)
          .send({ message: err.message })
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false
  })
    .then(user => res.send(user))

    .catch(err => {
      if (!name || !about || err.message) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные при создании пользователя` });
        return;
      } else if (!User[_id]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message })
      }
    });
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false
  })
    .then(user => res.send(user))
    .catch(err => {
      if (!User[_id]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      } else if (!avatar) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: `Переданы некорректные данные при создании пользователя` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: err.message })
      }
    });
}