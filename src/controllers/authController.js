const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const service = require('../services/userServices');

exports.protectCreateBlog = catchAsync(async (req, res, next) => {
    const requestHeader = req.headers.authorization;

    // Verify the token received and confirm the user exist
    const decode = await service.decodeToken(requestHeader);
    const loginUser = await User.findById(decode.id);
    if (!loginUser) {
        return next(new AppError('The user with the received token does not exist', 401));
    }
    req.user = loginUser;
    next();
});

exports.signup = catchAsync(async (req, res, next) => {
        const { first_name, last_name, email, password } = req.body;

        // Check if the user provided all necessary fields
        if (!first_name || !last_name || !email || !password) return next(new AppError('Kindly reconfirm registration details and try again!', 401));
        const user = new User({
            first_name,
            last_name,
            email,
            password
        })
        const newUser = await user.save();

        // Create a token to be sent to the user after saving to the DB
        const token = service.getToken(newUser._id);

        res.status(201).json({
            status: 'success',
            author_id: user._id,
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

    // In the schema, there is a method to compare the provided password with the DB password using bcrypt
    if (!user || !(await user.correctPassword(password, user.password))) 
        return next(new AppError('Incorrect email and/or password. Try again!!', 401));
    
    // Send login token to the client
    const token = service.getToken(user._id);
    res.status(200).json({
        status: 'success',
        author_id: user._id,
        token,
    })
});