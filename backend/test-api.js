// backend/test-api.js
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Health Assistant API\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Register User
    console.log('\n2️⃣ Testing user registration...');
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    console.log('✅ Registration:', registerData);

    if (!registerData.token) {
      console.error('❌ Registration failed');
      return;
    }

    const token = registerData.token;

    // Test 3: Login
    console.log('\n3️⃣ Testing login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('✅ Login:', loginData);

    // Test 4: Update Profile
    console.log('\n4️⃣ Testing profile update...');
    const profileRes = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-15',
          gender: 'Male'
        },
        healthProfile: {
          conditions: ['Hypertension'],
          allergies: ['Penicillin'],
          medications: ['Lisinopril 10mg']
        }
      })
    });
    const profileData = await profileRes.json();
    console.log('✅ Profile updated:', profileData.profile);
    console.log('✅ Health profile:', profileData.healthProfile);

    // Test 5: Send Chat Message
    console.log('\n5️⃣ Testing chat message...');
    const chatRes = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'I have been having headaches lately. What could be the cause?'
      })
    });
    const chatData = await chatRes.json();
    console.log('✅ User message:', chatData.userMessage.content);
    console.log('✅ Assistant response:', chatData.assistantMessage.content.substring(0, 200) + '...');

    // Test 6: Get Chat History
    console.log('\n6️⃣ Testing chat history...');
    const historyRes = await fetch(`${API_URL}/chat/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const historyData = await historyRes.json();
    console.log(`✅ Chat history: ${historyData.length} messages`);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();