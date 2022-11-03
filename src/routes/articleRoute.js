const express = require('express');
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController')

const router = express.Router();

router.route('/').get(articleController.getAllBlogs);

router.post('/create', authController.protectCreateBlog, articleController.createBlog);

router.route('/all').get(authController.protectCreateBlog, articleController.getUserBlogs);

router.route('/:id').get(articleController.getBlog)
.put(authController.protectCreateBlog, articleController.updateBlog)
.delete(authController.protectCreateBlog, articleController.deleteBlog);

module.exports = router;