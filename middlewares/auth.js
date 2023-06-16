const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записать пейлоуд в объект запроса

  return next(); // пропустить запрос дальше
};
