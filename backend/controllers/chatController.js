// backend/controllers/chatController.js
import ChatMessage from '../models/ChatMessage.js';
import { generateHealthResponse } from '../services/geminiService.js';
import { demoChatMessages, isDemoMode } from '../data/demoData.js';

const generateProfileResponse = (message, healthProfile) => {
  const query = message.toLowerCase();
  const conditions = healthProfile.conditions.join(', ');
  const allergies = healthProfile.allergies.join(', ');
  const medications = healthProfile.medications.join(', ');

  if (query.includes('allerg') || query.includes('sneez') || query.includes('runny')) {
    return `Your demo profile shows ${conditions}. Your listed allergy is ${allergies}, and you use ${medications}. Avoid known triggers, keep your surroundings dust-free, and follow the medicine instructions given by your healthcare provider. This is general health information, not medical advice.`;
  }

  if (query.includes('medicine') || query.includes('medication')) {
    return `Your demo profile lists ${medications}. Do not start, stop, or change a medicine without consulting a qualified healthcare provider. This is general health information, not medical advice.`;
  }

  if (query.includes('headache') || query.includes('pain') || query.includes('symptom')) {
    return 'For a mild symptom, rest, drink enough water, and note when it happens. If the symptom is severe, persistent, suddenly worsening, or unusual for you, contact a healthcare provider. This is general health information, not medical advice.';
  }

  if (query.includes('profile') || query.includes('health')) {
    return `Based on your demo profile, you have ${conditions}. Your recorded symptom is ${healthProfile.symptoms[0].description}. Ask me about allergies, medicines, or symptoms for a more specific answer. This is general health information, not medical advice.`;
  }

  return 'I am working in demo mode with your sample health profile. You can ask about your seasonal allergies, dust allergy, cetirizine medicine, sneezing, runny nose, or general wellness. This is general health information, not medical advice.';
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (isDemoMode()) {
      const userMessage = {
        _id: `demo-user-message-${Date.now()}`,
        userId,
        role: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString()
      };
      const assistantMessage = {
        _id: `demo-assistant-message-${Date.now()}`,
        userId,
        role: 'assistant',
        content: generateProfileResponse(message, req.user.healthProfile),
        timestamp: new Date().toISOString()
      };
      demoChatMessages.push(userMessage, assistantMessage);
      return res.json({ userMessage, assistantMessage });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      userId,
      role: 'user',
      content: message
    });

    // Get chat history
    const chatHistory = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20);

    // Generate response with user profile context
    const assistantResponse = process.env.CHATBOT_MODE === 'local'
      ? generateProfileResponse(message, req.user.healthProfile)
      : await generateHealthResponse(
          message,
          req.user.healthProfile,
          chatHistory
        );

    // Save assistant response
    const assistantMessage = await ChatMessage.create({
      userId,
      role: 'assistant',
      content: assistantResponse
    });

    res.json({
      userMessage,
      assistantMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoChatMessages.filter(message => message.userId === req.user._id));
    }

    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};