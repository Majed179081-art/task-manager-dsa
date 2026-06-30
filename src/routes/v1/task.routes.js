const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');

router
    .route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createTask);

router
    .route('/:id')
    .get(taskController.getTask)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

router.get('/duplicates', taskController.getDuplicates);
router.get('/performance-test', taskController.performanceTest);

module.exports = router;