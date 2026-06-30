const { PRIORITY_ORDER } = require('../config/constants');

class DSAUtils {
    static filterByPriority(tasks, priority) {
        if (!tasks || tasks.length === 0) return [];

        const sorted = [...tasks].sort((a, b) => 
            PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
        );

        let left = 0;
        let right = sorted.length - 1;
        const result = [];

        while (left <= right) {
            if (sorted[left]?.priority === priority) {
                result.push(sorted[left]);
            }
            if (left !== right && sorted[right]?.priority === priority) {
                result.push(sorted[right]);
            }
            left++;
            right--;
        }

        return result;
    }

    static findDuplicates(tasks) {
        if (!tasks || tasks.length === 0) return [];

        const seen = new Set();
        const duplicates = [];

        for (const task of tasks) {
            if (seen.has(task.title)) {
                duplicates.push(task);
            } else {
                seen.add(task.title);
            }
        }

        return duplicates;
    }

    static advancedFilter(tasks, filters) {
        let result = [...tasks];

        if (filters.priority) {
            result = result.filter(task => task.priority === filters.priority);
        }

        if (filters.completed !== undefined) {
            const isCompleted = filters.completed === 'true';
            result = result.filter(task => task.completed === isCompleted);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(task => 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            result.sort((a, b) => {
                if (order === 'desc') {
                    return a[field] > b[field] ? -1 : 1;
                }
                return a[field] < b[field] ? -1 : 1;
            });
        }

        if (filters.page && filters.limit) {
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const start = (page - 1) * limit;
            const end = page * limit;
            result = result.slice(start, end);
        }

        return result;
    }

    static createIndexMap(tasks) {
        const map = new Map();
        for (const task of tasks) {
            map.set(task.id, task);
        }
        return map;
    }
}

module.exports = DSAUtils;