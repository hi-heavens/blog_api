const express = require('express');
const userRouter = require('./routes/userRoute');
const articleRouter = require('./routes/articleRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');
const compression = require('compression');

const app = express();

app.use(express.json());

app.use(compression());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blogs', articleRouter);

app.use('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.all('*', (req, res, next) => {
    next(new AppError(`The route ${req.originalUrl} does not exist! 💨`, 404));
});

app.use(globalErrorHandler);

module.exports = app;