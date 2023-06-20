const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const { NotFoundAuth } = require('../errors/not-found-auth');

const handleAuthError = (req, res, next) => next(new NotFoundAuth('Необходима авторизация'));

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(req, res, next);
  }

  req.user = payload; // записать пейлоуд в объект запроса

  return next(); // пропустить запрос дальше
};
