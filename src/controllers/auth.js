const User = require('../models/userModel');

exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password
        })

        res.status(201).json({
            status: 'success',
            data: {
                message: 'User created successfully',
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