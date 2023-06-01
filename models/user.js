const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Маловато символов о себе'],
    maxlength: [30, 'Многовато символов о себе'],
  },
  avatar: {
    type: String,
    required: true,
  }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);