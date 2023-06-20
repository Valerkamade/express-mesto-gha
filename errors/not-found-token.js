const { ERROR_TOKEN } = require('../utils/constants');

class NotFoundToken extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_TOKEN;
    this.name = 'NotFoundToken';
  }
}

module.exports = NotFoundToken;
