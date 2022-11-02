const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

exports.signup = catchAsync(async (req, res, next) => {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return next(new AppError('Kindly reconfirm registration details and try again!', 401));
        const user = new User({
            first_name,
            last_name,
            email,
            password
        })
        const newUser = await user.save();
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
})