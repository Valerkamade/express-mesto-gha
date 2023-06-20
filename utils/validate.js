const { celebrate, Joi, Segments } = require('celebrate');

const regex = /^(https?:\/\/)?[^\s]*\.(jpg|jpeg|png|gif)$/;

module.exports.validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
});

module.exports.validateUserID = celebrate({
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().id().hex().required(),
  }),
});

module.exports.validateCardID = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().id().hex().required(),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regex).required(),
  }),
});

// module.exports.validateCardLink = celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     link: Joi.string().pattern(regex),
//   }),
// });

module.exports.validateUserCreate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
});

// module.exports.validateUser = celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string(),
//     token: Joi.string().token().required(),
//     userId: Joi.string().id().hex().required(),
//   }).unknown(),
// });

module.exports.validateUserAuth = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
