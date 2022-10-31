const express = require('express');
const userRouter = require('./routes/userRoute');
const articleRouter = require('./routes/articleRoute');

const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/blog', articleRouter);

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid route'
    })
});

module.exports = app;