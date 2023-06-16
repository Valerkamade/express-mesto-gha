const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Определение схемы пользователя
const userSchema = new mongoose.Schema({
  name: { // имя пользователя: строка длиной от 2 до 30 символов, по умолчанию Жак-Ив Кусто
    type: String,
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
    default: 'Жак-Ив Кусто',
  },
  about: { // информация о пользователе: строка от 2 до 30 символов, по умолчанию Исследователь
    type: String,
    minlength: [2, 'Маловато символов о себе'],
    maxlength: [30, 'Многовато символов о себе'],
    default: 'Исследователь',
  },
  avatar: { // ссылка на аватар пользователя: строка, имеет значение по усолчанию
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: { // обязателдьное поле почта: уникальная строка
    type: String,
    required: true,
    unique: true,
  },
  password: { // обязательное поле пароль: строка длиной от 8 символов, не передавать в схеме
    type: String,
    required: true,
    minlength: [8, 'Слишком короткий пароль'],
    select: false,
  },
}, { versionKey: false });

//
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
