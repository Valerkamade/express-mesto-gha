const router = require('express').Router();
const { validateCard } = require('../utils/validate');
const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards); // запросить карточки
router.post('/', validateCard, createCard); // создать карточку
router.put('/:cardId/likes', validateCard, likeCard); // поставить лайк
router.delete('/:cardId/likes', validateCard, dislikeCard); // удалить лайк
router.delete('/:cardId', validateCard, deleteCard); // удалить карточку

module.exports = router;
