const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const getToken = (user_id) => {
    return (jwt.sign({ id: user_id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}))
}

const decodeToken = async (authorization) => {
    let token = '';
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access to blog(s)', 401));
    }

    return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
}

module.exports = { getToken, decodeToken };