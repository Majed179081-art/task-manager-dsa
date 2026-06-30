const express = require('express');
const taskRoutes = require('./routes/v1/task.routes');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/tasks', taskRoutes);


app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;