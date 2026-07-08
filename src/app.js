const express = require('express');
const taskRoutes = require('./routes/v1/task.routes');
const authRoutes = require('./routes/v1/auth.routes');

const app = express();

app.use(express.json());

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Something went wrong'
    });
});

module.exports = app;