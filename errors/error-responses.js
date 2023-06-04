const { ERROR_INCORRECT_DATA, ERROR_DEFAULT } = require('./errors');

module.exports.errorValidation = (res, err) => {
  if (err.name === 'ValidationError') {
    return res.status(ERROR_INCORRECT_DATA)
      .send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
};

module.exports.errorDefault = (res, err) => {
  res.status(ERROR_DEFAULT)
    .send({ message: err.message });
};
