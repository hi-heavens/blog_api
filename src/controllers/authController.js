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

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // To check if email and/or password was provided by the client
    if (!email || !password) return next(new AppError('Please provide a valid email and/or password!', 400))

    // Check if the email exist and the password is correct
    let user = await User.findOne({email}).select('+password'); // the select method return the password field with the request
    if(!user) return next(new AppError('Incorrect email and/or password. Try again!!', 401));
    console.log(user);
    res.status(200).json({status: 'success'})
});