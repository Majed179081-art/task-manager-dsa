const mongoose = require('mongoose');
const Task = require('./src/models/task.model');
const User = require('./src/models/user.model');
require('dotenv').config();

const testIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // ============================================
        // 1. نشوف كل الـ Indexes
        // ============================================
        console.log('📊 User Indexes:');
        const userIndexes = await User.listIndexes();
        console.log(userIndexes.map(i => i.name).join(', ') + '\n');

        console.log('📊 Task Indexes:');
        const taskIndexes = await Task.listIndexes();
        console.log(taskIndexes.map(i => i.name).join(', ') + '\n');

        // ============================================
        // 2. اختبار البحث بالإيميل (مع Index)
        // ============================================
        console.log('🔍 Testing email index...');
        console.time('findByEmail (with index)');
        await User.findOne({ email: 'ahmed@x.com' });
        console.timeEnd('findByEmail (with index)');

        // ============================================
        // 3. اختبار البحث بالpriority (مع Index)
        // ============================================
        console.log('\n🔍 Testing priority index...');
        console.time('findByPriority (with index)');
        await Task.find({ priority: 'high' });
        console.timeEnd('findByPriority (with index)');

        // ============================================
        // 4. اختبار Compound Index (priority + completed)
        // ============================================
        console.log('\n🔍 Testing compound index...');
        console.time('findByPriorityAndCompleted');
        await Task.find({ priority: 'high', completed: false });
        console.timeEnd('findByPriorityAndCompleted');

        // ============================================
        // 5. نشوف خطة التنفيذ (explain)
        // ============================================
        console.log('\n📈 Execution Plan for email search:');
        const explain = await User.find({ email: 'ahmed@x.com' }).explain();
        const stage = explain.queryPlanner.winningPlan.stage;
        console.log(`Stage: ${stage} → ${stage === 'IXSCAN' ? '✅ Index working' : '⚠️ No index'}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testIndexes();