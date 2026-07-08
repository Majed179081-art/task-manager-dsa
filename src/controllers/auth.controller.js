const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Email already registered'
        });
    }

    const user = await userService.createUser({ name, email, password });
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        data: user
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: { user, token }
    });
});

module.exports = { register, login };