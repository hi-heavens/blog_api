const express = require('express');

const app = express();

app.use(express.json());

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid route'
    })
});

module.exports = app;