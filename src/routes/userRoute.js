const express = require('express');
const authController = require('../controllers/authController');
const validateController = require('../controllers/validateController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', validateController.validateLogin, authController.login);

module.exports = router;