const express = require('express');
const userRouter = require('./routes/user');

const app = express();

app.use(express.json());

app.use('/users', userRouter);

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid route'
    })
});

module.exports = app;