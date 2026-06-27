import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const SoloChat = ({ socket }) => {
    // Mobile par chat aur sidebar switch karne ke liye state (True = Chat Open, False = Sidebar Open)
    const [showList, setShowList] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [messages, setMessages] = useState([]);

    const scrollToLast = useRef(null);


    useEffect(() => {
        const scrollToBottom = () => {
            scrollToLast.current?.scrollIntoView({ behavior: "smooth" });
        };
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        })

    }, [socket])

    useEffect(() => {
        const checkSize = () => setIsMobile(window.innerWidth < 640); // 640px se choti mobile screen
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);


    return (
        <motion.div
            initial={{
                opacity: 0
            }}
            transition={{
                type: 'tween',
                duration: 0.2
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            className='text-pink flex-1 flex bg-[#110e1f] min-h-0 relative overflow-hidden'>
            <AnimatePresence>
                {/* 1. SIDEBAR (User List / Chat List) */}
                {(!isMobile || showList) && (
                    <motion.div
                        key='sidebar'
                        className="w-full sm:w-[clamp(250px,126.92px+19.23vw,300px)] bg-[#12112A] border-r border-pink/10 h-full  overflow-hidden shrink-0"
                        initial={isMobile ? { x: -300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobile ? { x: -300, opacity: 0 } : undefined}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className='p-4 border-b border-pink/10 flex justify-between items-center'>
                            <h3 className='font-bold text-lg'>Chats</h3>
                            {/* Dummy button check karne ke liye ke chat kaise khulegi mobile par */}
                            <button
                                onClick={() => setShowList(true)}
                                className='sm:hidden text-xs bg-primary px-2 py-1 rounded'
                            >
                                Open Chat demo
                            </button>
                        </div>
                        <div className='flex-1 overflow-y-auto p-2 scrollbar-none'>
                            {/* Sidebar content / Users list yahan aayegi */}
                            {messages.map(message => (
                                <p className='text-sm text-white/50 p-2 hover:bg-white/5 rounded cursor-pointer' onClick={() => setShowList(false)}>User 1</p>
                            ))}

                        </div>
                    </motion.div>
                )}

                {/* 2. MAIN CHAT WINDOW */}
                {(!isMobile || !showList) && (
                    <motion.div
                        key='chatbox'
                        className='flex-1 h-full flex-col flex overflow-x-hidden bg-[#0e0d22]'
                        initial={isMobile ? { x: 300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobile ? { x: 300, opacity: 0 } : undefined}
                        transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
                    >
                        {/* Chat Header */}
                        <div className='h-14 border-b border-pink/10 flex items-center px-4 gap-3 bg-[#140B2D]/50'>
                            {/* Mobile Back Button: Chat se wapas sidebar par jaane ke liye */}
                            <button
                                onClick={() => setShowList(true)}
                                className='sm:hidden p-2 hover:bg-white/10 rounded-full text-white'
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <span className='font-semibold'>Active Chat</span>
                        </div>

                        {/* Chat Messages Area */}
                        <div className='flex-1 overflow-y-auto p-4 custom-scrollbar bg-red-400/5'>
                            {/* Messages content yahan aayega */}
                            <p className='text-sm text-white/60'>Select a chat or start messaging...</p>
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <ChatMessage text={'dhcjsdcsjkjkd j jksv kjshdkfh vdfvd kfhvdkfs vsfjkd vjkdfvkj fjksdgh lsfhvd bd'} />
                            <div ref={scrollToLast}></div>
                        </div>

                        {/* Chat Input Field */}
                        <div className='p-4 border-t border-pink/10 bg-[#140B2D]/30 flex gap-2'>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className='flex-1 bg-[#1a1530] border border-pink/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-pink/50'
                            />
                            <button className='bg-primary px-4 py-2 rounded-xl text-sm font-semibold'>Send</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default SoloChat;