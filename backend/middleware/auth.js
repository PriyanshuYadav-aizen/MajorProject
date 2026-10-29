// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoUser, isDemoMode } from '../data/demoData.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    if (isDemoMode() && token === 'demo-token') {
      req.user = getDemoUser();
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};