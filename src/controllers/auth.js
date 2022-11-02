const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
        const { first_name, last_name, email, password } = req.body;
        const user = new User({
            first_name,
            last_name,
            email,
            password
        })
        const savedUser = await user.save();
        const token = jwt.sign({ id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: savedUser
            }
        })
})