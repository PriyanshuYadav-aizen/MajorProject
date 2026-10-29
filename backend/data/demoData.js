const demoUser = {
  _id: 'demo-user-001',
  email: 'demo@healthassist.com',
  password: 'demo123',
  profile: {
    firstName: 'Demo',
    lastName: 'User',
    dateOfBirth: '1998-06-15',
    gender: 'Female',
    phone: '+91 98765 43210',
    address: 'New Delhi, India'
  },
  healthProfile: {
    conditions: ['Mild seasonal allergies'],
    allergies: ['Dust'],
    medications: ['Cetirizine 10 mg when required'],
    symptoms: [
      {
        description: 'Occasional sneezing and runny nose',
        date: '2026-10-20',
        severity: 'Mild'
      }
    ],
    medicalHistory: []
  }
};

const demoMessages = [
  {
    _id: 'demo-message-001',
    userId: demoUser._id,
    role: 'assistant',
    content:
      'Hello! I am your demo health assistant. Ask me about your allergies, medicines, symptoms, or general wellness.',
    timestamp: new Date().toISOString()
  }
];

export const getDemoUser = () => ({
  ...demoUser,
  profile: { ...demoUser.profile },
  healthProfile: {
    ...demoUser.healthProfile,
    conditions: [...demoUser.healthProfile.conditions],
    allergies: [...demoUser.healthProfile.allergies],
    medications: [...demoUser.healthProfile.medications],
    symptoms: [...demoUser.healthProfile.symptoms],
    medicalHistory: [...demoUser.healthProfile.medicalHistory]
  }
});

export const updateDemoUser = ({ profile, healthProfile }) => {
  if (profile) {
    demoUser.profile = { ...demoUser.profile, ...profile };
  }
  if (healthProfile) {
    demoUser.healthProfile = { ...demoUser.healthProfile, ...healthProfile };
  }
  return getDemoUser();
};

export const demoChatMessages = demoMessages;

export const isDemoMode = () => process.env.DEMO_MODE === 'true';
