const router = require('express').Router();
const { validateUser, validateUserID, validateUserAvatar } = require('../utils/validate');
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // запросить пользователей
router.get('/me', getCurrentUser); // запросить информацию об активном пользователе
router.get('/:userId', validateUserID, getUser); // запросить пользователя по id
router.patch('/me', validateUser, updateUserProfile); // изменить данные пользователя name и about
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar); // изменить аватар пользователя

module.exports = router;
