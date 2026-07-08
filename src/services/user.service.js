const User = require('../models/user.model');

class UserService {
    async createUser(data) {
        const user = new User(data);
        await user.save();
        return user;
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }
}

module.exports = new UserService();