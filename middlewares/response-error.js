const { ERROR_DEFAULT } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
