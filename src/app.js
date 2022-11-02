const express = require('express');
const userRouter = require('./routes/userRoute');
const articleRouter = require('./routes/articleRoute');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blogs', articleRouter);

app.all('*', (req, res, next) => {
    const err = new Error(`The route ${req.originalUrl} does not exist! 💨`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error! 💥';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;