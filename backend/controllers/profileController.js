// backend/controllers/profileController.js
import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile, healthProfile } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }
    
    if (healthProfile) {
      user.healthProfile = { ...user.healthProfile, ...healthProfile };
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};