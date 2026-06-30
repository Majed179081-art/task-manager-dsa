const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [50, 'Title must be at most 50 characters'],
        index: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
        index: true
    },
    completed: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

taskSchema.virtual('isOverdue').get(function() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.createdAt < sevenDaysAgo;
});

taskSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

taskSchema.index({ priority: 1, completed: 1 });
taskSchema.index({ priority: 1, createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

taskSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Task', taskSchema);