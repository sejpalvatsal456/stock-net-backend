import express from 'express';
import { create, getAll, getOne, update, remove, search } from '../controllers/product.js';
import { protect, manager } from '../middleware/auth.js';
const router = express.Router();
router.get('/search', protect, search);

router.post('/', protect, manager, create);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.put('/:id', protect, manager, update);
router.delete('/:id', protect, manager, remove);

export default router;
