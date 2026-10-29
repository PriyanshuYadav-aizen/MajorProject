import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatHistory();
      setMessages(response.data);
    } catch (err) {
      setError('Failed to load chat history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The initial request synchronizes component state with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    setError('');
    setLoading(true);

    // Add user message immediately for better UX
    const tempUserMessage = {
      _id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      isTemp: true
    };

    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await chatAPI.sendMessage(messageText);
      
      // Replace temp message with real one and add assistant response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTemp);
        return [...filtered, response.data.userMessage, response.data.assistantMessage];
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => !msg.isTemp));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">AI Health Assistant</h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about your health, symptoms, or medical conditions
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Disclaimer:</strong> This is an informational tool only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm mt-2">Ask about symptoms, conditions, or health topics</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default Chat;