const Task = require('../models/task.model');

class TaskService {
    async createTask(data) {
        const task = new Task(data);
        await task.save();
        return task;
    }

    async getTask(id, userId) {
        return await Task.findOne({ _id: id, userId });
    }

    async updateTask(id, userId, data) {
        return await Task.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true, runValidators: true }
        );
    }

    async deleteTask(id, userId) {
        return await Task.findOneAndDelete({ _id: id, userId });
    }

    async getAllTasks(userId, filters = {}) {
        const query = { userId };
        
        if (filters.priority) query.priority = filters.priority;
        if (filters.completed !== undefined) {
            query.completed = filters.completed === 'true';
        }
        if (filters.search) {
            query.$text = { $search: filters.search };
        }

        let result = Task.find(query);

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

        return await result.lean();
    }

    async filterByPriority(userId, priority) {
        return await Task.find({ userId, priority }).lean();
    }

    async findDuplicateTasks(userId) {
        return await Task.aggregate([
            { $match: { userId } },
            { $group: { _id: '$title', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);
    }

    async advancedFilter(userId, filters) {
        const query = { userId };
        
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