const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Authentication required' });
    }
};

const requireAdmin = async (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { requireAuth, requireAdmin }; 