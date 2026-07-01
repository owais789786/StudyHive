import { useState, useEffect, useRef, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const SoloChat = () => {
  const { user } = useContext(UserContext);
  const { connected, joinRoom, startChatWith, sendMessage: sendSocketMessage, subscribe } = useContext(SocketContext);

  const [showList, setShowList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState([]);
  const [startChat, setStartChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const textareaRef = useRef(null);
  const scrollToLast = useRef(null);

  const fetchChats = async () => {
    if (!user?._id) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/chatlist/${user._id}`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setChats(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchChats();
  }, [user?._id]);

  useEffect(() => {
    if (!connected || !subscribe) return;

    const unsubscribeReceive = subscribe('receive_message', (newMessage) => {
      if (!newMessage || newMessage.chatId !== startChat?.chatId) return;
      setMessages((prev) => [...prev, newMessage]);
    });

    const unsubscribePrevious = subscribe('previous_messages', (data) => {
      setMessages(Array.isArray(data) ? data : []);
    });

    return () => {
      unsubscribeReceive();
      unsubscribePrevious();
    };
  }, [connected, subscribe, startChat?.chatId]);

  useEffect(() => {
    const scrollToBottom = () => {
      scrollToLast.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  const handleChat = (chat) => {
    if (!chat?.chatId) return;
    setShowList(false);
    setStartChat(chat);
    setMessages([]);
  };

  useEffect(() => {
    if (!connected || !startChat) return;

    joinRoom(startChat.chatId);
    startChatWith({ chatId: startChat.chatId });
  }, [connected, joinRoom, startChat, startChatWith]);

  const sendMessage = () => {
    if (!messageText.trim() || !startChat) return;

    sendSocketMessage({
      chatId: startChat.chatId,
      sender: user._id,
      messageType: 'text',
      content: messageText,
    });
    setMessageText('');
    setTextareaRows(1);
  };

  const handleTextareaChange = (value) => {
    const newLines = value.split('\n').length;
    setTextareaRows(Math.min(4, Math.max(1, newLines)));
    setMessageText(value);
  };

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 640);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ type: 'tween', duration: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='text-pink flex-1 flex bg-[#110e1f] min-h-0 relative overflow-hidden'
    >
      <AnimatePresence>
        {(!isMobile || showList) && (
          <motion.div
            key='sidebar'
            className='w-full sm:w-[clamp(250px,126.92px+19.23vw,300px)] bg-[#12112A] border-r border-pink/10 h-full overflow-hidden shrink-0'
            initial={isMobile ? { x: -300, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: -300, opacity: 0 } : undefined}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='p-4 border-b border-pink/10 flex justify-between items-center'>
              <span className='font-semibold text-white'>Chats</span>
            </div>
            <div className='flex-1 overflow-y-auto p-1 scrollbar-none'>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <motion.div
                    key={chat.chatId}
                    className='text-md flex items-center text-white/50 p-2 h-15 hover:bg-white/5 gap-2 rounded cursor-pointer'
                    onClick={() => handleChat(chat)}
                  >
                    <img src={chat.participants.profileImg} alt='' className='w-12 h-12 rounded-full' />
                    <p className='font-dosis font-bold'>{chat.participants.name}</p>
                  </motion.div>
                ))
              ) : (
                <p className='text-sm text-white/60 p-4'>No chats available yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {(!isMobile || !showList) && (
          <motion.div
            key='chatbox'
            className='flex-1 h-full flex-col flex overflow-x-hidden bg-[#0e0d22]'
            initial={isMobile ? { x: 300, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 300, opacity: 0 } : undefined}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
          >
            <div className='h-14 border-b border-pink/10 flex items-center px-4 gap-3 bg-[#140B2D]/50'>
              <button onClick={() => setShowList(true)} className='sm:hidden p-2 hover:bg-white/10 rounded-full text-white'>
                <i className='fa-solid fa-arrow-left'></i>
              </button>
              <span className='font-semibold font-dosis'>{startChat?.participants.name || 'Select a chat'}</span>
            </div>

            <div className='flex-1 overflow-y-auto sm:p-4 p-2 custom-scrollbar bg-red-400/5'>
              {messages.length > 0 ? (
                messages.map((message) => {
                  const senderId = typeof message.sender === 'string' ? message.sender : message.sender?._id;
                  const senderName = typeof message.sender === 'string' ? undefined : message.sender?.name;
                  const avatarUrl = typeof message.sender === 'string' ? undefined : message.sender?.profileImg;

                  return (
                    <ChatMessage
                      key={message._id || `${message.chatId}-${senderId}-${message.content}`}
                      text={message.content}
                      avatarUrl={avatarUrl}
                      senderName={senderName || (senderId === user._id ? 'You' : 'Friend')}
                      isSender={senderId === user._id}
                    />
                  );
                })
              ) : (
                <p className='text-xs text-white/60 w-full text-center pt-5 pointer-events-none'>
                  {startChat ? `Start chat with `  : 'Select chat to start'}
                </p>
              )}
              <div ref={scrollToLast} />
            </div>

            <div className='p-4 border-t border-pink/10 bg-[#140B2D]/30 flex gap-2 items-end'>
              <textarea
                ref={textareaRef}
                rows={textareaRows}
                placeholder='Type a message...'
                className='flex-1 min-h-[3rem] max-h-[9rem] resize-none bg-[#1a1530] border border-pink/20 rounded-2xl px-4 py-3 text-sm outline-none focus:border-pink/50 text-white'
                value={messageText}
                onChange={(e) => handleTextareaChange(e.target.value)}
              />
              <button
                className='bg-primary p-4 rounded-2xl text-sm font-semibold hover:bg-violet-500 transition-colors'
                onClick={sendMessage}
              >
                <i className='fa-solid fa-paper-plane' />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SoloChat;
