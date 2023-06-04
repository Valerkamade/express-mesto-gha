const { ERROR_INCORRECT_DATA, ERROR_DEFAULT, ERROR_NOT_FOUND } = require('./errors');

module.exports.errorValidation = (res) => {
  res.status(ERROR_INCORRECT_DATA)
    .send({ message: 'Переданы некорректные данные для удаления' });
};

module.exports.errorDefault = (res, err) => {
  res.status(ERROR_DEFAULT)
    .send({ message: err.message });
};

module.exports.errorNotFound = (res, cardId) => {
  res.status(ERROR_NOT_FOUND)
    .send({ message: `Передан не существующий id:${cardId}` });
};
