import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';

const demoEmail = 'demo@healthassist.com';

const seedDemoData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = new User({ email: demoEmail, password: 'demo123' });
  }

  user.profile = {
    firstName: 'Demo',
    lastName: 'User',
    dateOfBirth: new Date('1998-06-15'),
    gender: 'Female',
    phone: '+91 98765 43210',
    address: 'New Delhi, India'
  };
  user.healthProfile = {
    conditions: ['Mild seasonal allergies'],
    allergies: ['Dust'],
    medications: ['Cetirizine 10 mg when required'],
    symptoms: [
      {
        description: 'Occasional sneezing and runny nose',
        date: new Date('2026-10-20'),
        severity: 'Mild'
      }
    ],
    medicalHistory: []
  };

  await user.save();

  const hasMessages = await ChatMessage.exists({ userId: user._id });
  if (!hasMessages) {
    await ChatMessage.create({
      userId: user._id,
      role: 'assistant',
      content:
        'Hello! I am your health assistant. Ask me about your allergies, medicines, symptoms, or general wellness.'
    });
  }

  console.log(`Dummy data seeded for ${demoEmail}`);
  console.log(`Demo password: demo123`);
};

seedDemoData()
  .catch(error => {
    console.error('Unable to seed dummy data:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
