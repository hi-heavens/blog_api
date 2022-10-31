const express = require('express');
// const authController = require('../controllers/auth');
const articleController = require('../controllers/articleController')

const router = express.Router();

router.route('/')
.post(articleController.createBlog)
.get(articleController.getAllBlogs);

module.exports = router;