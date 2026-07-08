const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

router
    .route('/')
    .get(protect, taskController.getAllTasks)
    .post(protect, taskController.createTask);

router
    .route('/:id')
    .get(protect, taskController.getTask)
    .put(protect, authorize('admin', 'manager'), taskController.updateTask)
    .delete(protect, authorize('admin'), taskController.deleteTask);

router.get('/duplicates', protect, authorize('admin'), taskController.getDuplicates);
router.get('/performance-test', protect, taskController.performanceTest);

module.exports = router;