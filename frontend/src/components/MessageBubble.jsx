const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary' : 'bg-gray-300'
        }`}>
          <span className="text-sm text-white">
            {isUser ? '👤' : '🤖'}
          </span>
        </div>
  
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div className={`rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {timestamp}
          </span>
        </div>
      </div>
    );
  };
  
  export default MessageBubble;