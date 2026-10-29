// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    phone: String,
    address: String
  },
  healthProfile: {
    conditions: [String],
    allergies: [String],
    medications: [String],
    symptoms: [{
      description: String,
      date: Date,
      severity: String
    }],
    medicalHistory: [{
      condition: String,
      diagnosisDate: Date,
      notes: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);