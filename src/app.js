const express = require('express');
const userRouter = require('./routes/userRoute');
const articleRouter = require('./routes/articleRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blogs', articleRouter);
app.use('/api/v1/blogs/all', articleRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`The route ${req.originalUrl} does not exist! 💨`, 404));
});

app.use(globalErrorHandler);

module.exports = app;