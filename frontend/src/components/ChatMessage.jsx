import React from 'react';

const ChatMessage = ({ text, timestamp, senderName, avatarUrl, isSender }) => {
  return (
    <div className={`flex w-full gap-3 mb-6 items-end ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Avatar with coloured glow */}
      <div className="shrink-0">
        <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-shadow duration-300 ${
          isSender 
            ? 'border-[#912EDC] shadow-[0_0_12px_rgba(145,46,220,0.5)]' 
            : 'border-primary/50 shadow-[0_0_8px_rgba(127,119,221,0.15)]'
        }`}>
          <img 
            src={avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg'} 
            alt={senderName} 
            className="w-full h-full object-cover bg-[#110E1F]"
          />
        </div>
      </div>

      {/* Message body */}
      <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
        
        {/* Sender name */}
        <span className={`text-xs mb-1 px-1 font-medium tracking-wide ${
          isSender ? 'text-primary/70' : 'text-primary/60'
        }`}>
          {isSender ? 'You' : senderName}
        </span>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 text-[14.5px] leading-relaxed shadow-xl backdrop-blur-md  select-none ${
            isSender 
              ? 'bg-linear-to-br from-[#9158E7]/50 to-[#912EDC]/50 text-white font-medium rounded-2xl rounded-tr-none border border-primary/30 shadow-[#9158E7]/20' 
              : 'bg-[#2C1352]/80 text-[#E2E0FF] border border-primary/20 rounded-2xl rounded-tl-none shadow-black/40'
          }`}>
          <p className="wrap-break-words font-normal whitespace-pre-wrap">{text}</p>
          
          {/* Glass highlight for sender bubble */}
          {isSender && (
            <div className="absolute inset-0 rounded-2xl rounded-tr-none bg-linear-to-t from-transparent to-white/10 pointer-events-none" />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-primary mt-1 px-1 ">
          {timestamp || '10:42 PM'}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;