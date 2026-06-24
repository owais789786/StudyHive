import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage(''); // Send karne k baad clear
  };

  const handleKeyDown = (e) => {
    // Shift + Enter par new line, sirf Enter par submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 w-full  bg-linear-to-t from-[#0e0d22] via-[#0e0d22]/95 to-transparent border-t border-pink/10 backdrop-blur-md z-30">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-5xl mx-auto w-full bg-[#110E1F]/90 border border-violet-500/50 rounded-full px-4 py-2 focus-within:border-violet-500/60 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
        
        {/* Attachment/Plus Button */}
        <button type="button" className="text-pink/50 hover:text-pink transition-colors cursor-pointer text-lg">
          <i className="fa-solid fa-plus"></i>
        </button>

        {/* Text Area / Input */}
        <textarea
          
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-0 text-[#E2E0FF] placeholder-pink/30 font-sniglet text-[14.5px] outline-hidden focus:ring-0 resize-none max-h-24 custom-scrollbar py-1"
          style={{ minHeight: '24px' }}
        />

        {/* Action Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            message.trim() 
              ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-[0_0_10px_rgba(145,46,220,0.4)]' 
              : 'bg-pink/5 text-pink/20 cursor-not-allowed'
          }`}
        >
          <i className="fa-solid fa-paper-plane text-sm"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;