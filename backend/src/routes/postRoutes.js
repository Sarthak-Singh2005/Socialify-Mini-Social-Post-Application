import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addComment, createPost, getPosts, toggleLike } from '../controllers/postController.js'

const router = Router()
router.get('/:all', authMiddleware, getPosts)
router.post('/', authMiddleware, createPost)
router.post('/:id/like', authMiddleware, toggleLike)
router.post('/:id/comment', authMiddleware, addComment)
export default router
