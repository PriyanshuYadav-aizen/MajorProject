// backend/config/db.js
import mongoose from 'mongoose';
import { isDemoMode } from '../data/demoData.js';

const connectDB = async () => {
  if (isDemoMode()) {
    console.log('Demo mode enabled: using local dummy data instead of MongoDB.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;