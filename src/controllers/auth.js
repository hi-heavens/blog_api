const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password
        })

        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        })
    }
}