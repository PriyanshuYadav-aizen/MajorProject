// backend/controllers/chatController.js
import ChatMessage from '../models/ChatMessage.js';
import { generateHealthResponse } from '../services/geminiService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

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
    const assistantResponse = await generateHealthResponse(
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
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};