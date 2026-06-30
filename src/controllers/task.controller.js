const taskService = require('../services/task.service');

const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

const getAllTasks = catchAsync(async (req, res) => {
    const { priority, ...filters } = req.query;
    let tasks;

    if (priority) {
        tasks = await taskService.filterByPriority(priority);
    } else if (Object.keys(filters).length > 0) {
        tasks = await taskService.advancedFilter(req.query);
    } else {
        tasks = await taskService.getAllTasks();
    }

    res.json({
        status: 'success',
        results: tasks.length,
        data: tasks
    });
});

const getTask = catchAsync(async (req, res) => {
    const task = await taskService.getTask(req.params.id);
    if (!task) {
        return res.status(404).json({
            status: 'error',
            message: 'Task not found'
        });
    }
    res.json({ status: 'success', data: task });
});

const createTask = catchAsync(async (req, res) => {
    const { title, description, priority } = req.body;

    if (!title) {
        return res.status(400).json({
            status: 'error',
            message: 'Title is required'
        });
    }

    const task = await taskService.createTask({ title, description, priority });
    res.status(201).json({ status: 'success', data: task });
});

const updateTask = catchAsync(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) {
        return res.status(404).json({
            status: 'error',
            message: 'Task not found'
        });
    }
    res.json({ status: 'success', data: task });
});

const deleteTask = catchAsync(async (req, res) => {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            status: 'error',
            message: 'Task not found'
        });
    }
    res.json({ status: 'success', message: 'Task deleted successfully' });
});

const getDuplicates = catchAsync(async (req, res) => {
    const duplicates = await taskService.findDuplicateTasks();
    res.json({
        status: 'success',
        results: duplicates.length,
        data: duplicates
    });
});

const performanceTest = catchAsync(async (req, res) => {
    res.json({
        status: 'success',
        message: 'Performance test coming soon!'
    });
});

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getDuplicates,
    performanceTest
};