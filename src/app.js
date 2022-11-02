const express = require('express');
const userRouter = require('./routes/userRoute');
const articleRouter = require('./routes/articleRoute');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blogs', articleRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `The route ${req.originalUrl} does not exist! 💨`
    })
});

module.exports = app;