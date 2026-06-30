const Task = require('../models/task.model');

class TaskService {
    async createTask(data) {
        const task = new Task(data);
        await task.save();
        return task;
    }

    async getTask(id) {
        return await Task.findById(id);
    }

    async updateTask(id, data) {
        return await Task.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    async deleteTask(id) {
        return await Task.findByIdAndDelete(id);
    }
async getAllTasks() {
    return await Task.find().lean();
}
  async filterByPriority(priority) {
    return await Task.find({ priority }).lean();
}

    async findDuplicateTasks() {
        return await Task.aggregate([
            { $group: { _id: '$title', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);
    }
async advancedFilter(filters) {
    const query = {};
    if (filters.priority) query.priority = filters.priority;
    if (filters.completed !== undefined) {
        query.completed = filters.completed === 'true';
    }
    if (filters.search) {
        query.$text = { $search: filters.search };
    }

    let result = Task.find(query).lean(); 
    if (filters.sort) {
        const [field, order] = filters.sort.split(':');
        result = result.sort({ [field]: order === 'desc' ? -1 : 1 });
    }

    if (filters.page && filters.limit) {
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 10;
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(limit);
    }

    return await result;
}
}

module.exports = new TaskService();