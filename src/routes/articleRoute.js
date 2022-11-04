const express = require('express');
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController')

const router = express.Router();

router.route('/').get(articleController.getAllBlogs);

router.post('/create', authController.protectCreateBlog, articleController.createBlog);

router.route('/all').get(authController.protectCreateBlog, articleController.getUserBlogs);

router.get('/:id', articleController.getBlog)
router.put('/:id', authController.protectCreateBlog, articleController.updateBlog)
router.delete('/:id', authController.protectCreateBlog, articleController.deleteBlog);

module.exports = router;