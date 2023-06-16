const { celebrate, Joi, Segments } = require('celebrate');

const regex = /^(https?:\/\/)?[^\s]*\.(jpg|jpeg|png|gif)$/;

module.exports.validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
});

module.exports.validateUserID = celebrate({
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().id().hex().required(),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).min(30).required(),
    link: Joi.string().required(),
  }).unknown(),
});

// module.exports.validateUserID = celebrate({
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

module.exports.validateUserLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
