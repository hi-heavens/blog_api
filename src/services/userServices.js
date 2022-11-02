const jwt = require('jsonwebtoken');

const getToken = (user_id) => {
    return (jwt.sign({ id: user_id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}))
}

module.exports = { getToken };