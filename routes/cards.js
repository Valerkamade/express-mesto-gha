const router = require('express').Router();
const { validateCardCreate } = require('../utils/validate');
const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards); // запросить карточки
router.post('/', validateCardCreate, createCard); // создать карточку
router.put('/:cardId/likes', likeCard); // поставить лайк
router.delete('/:cardId/likes', dislikeCard); // удалить лайк
router.delete('/:cardId', deleteCard); // удалить карточку

module.exports = router;
