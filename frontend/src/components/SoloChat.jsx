import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'; // Standard import ya motion/react dono theek hain
import ChatMessage from './ChatMessage';

const SoloChat = () => {
    const name = [
        { n: 'Ali', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Owais', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Zeeshan', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy...', lastOnline: '6:26' },
    ];

    const [showList, setShowList] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Screen size detect karne k liye taake mobile aur desktop ka behavior manage ho sake
    useEffect(() => {
        const checkSize = () => setIsMobile(window.innerWidth < 640); // 640px se choti mobile screen
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    return (
        <div className='flex w-full h-screen overflow-hidden bg-[#12112A] pb-20'>
            <AnimatePresence mode="popLayout">

                {/* 1. SIDEBAR: Mobile par toggle hoga, desktop par hamesha dikhega */}
                {(!isMobile || showList) && (
                    <motion.div
                        key='sidebar'
                        className="w-full sm:w-[clamp(250px,126.92px+19.23vw,300px)] bg-[#12112A] border-r border-pink/10 h-full overflow-hidden shrink-0"
                        initial={isMobile ? { x: -300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobile ? { x: -300, opacity: 0 } : undefined}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Wrapper to stop content squishing */}
                        <div className="min-w-0 flex-1 sm:w-full h-full overflow-y-scroll scrollbar-none ">
                            {name.map((na, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 p-2 bg-pink/2 transition-colors border-b hover:bg-[#110E1F]/20 border-pink/10 items-center cursor-pointer'
                                    onClick={() => isMobile && setShowList(false)} // Mobile par click karne se chat khulegi
                                >
                                    <span className='text-pink w-12 h-12 shrink-0 bg-[#270A48] flex items-center justify-center border-pink/10 border rounded-full'>{na.n[0]}</span>
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex justify-between text-xs items-center text-primary'>
                                            <span className='text-pink font-dosis text-lg'>{na.n}</span>
                                            <span>{na.lastOnline}</span>
                                        </div>
                                        <p className='text-pink/40 text-xs font-sniglet truncate'>{na.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 2. CHATBOX: Mobile par toggle hoga, desktop par hamesha dikhega */}
                {(!isMobile || !showList) && (
                    <motion.div
                        key='chatbox'
                        className='overflow-y-scroll flex-1 h-full overflow-x-hidden custom-scrollbar relative bg-[#0e0d22]'
                        initial={isMobile ? { x: 300, opacity: 0 } : false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={isMobile ? { x: 300, opacity: 0 } : undefined}
                        transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
                    >
                        {/* Back button sirf mobile par show hoga */}
                        {isMobile && (
                            <button
                                className='py-1 px-4 fixed text-lg text-pink font-dosis bg-pink/20 backdrop-blur-2xl border border-pink/10 rounded-full m-3 z-20'
                                onClick={() => setShowList(true)}
                            >
                                ← Back
                            </button>
                        )}

                        <div className='border border-pink'>
                            <div className='w-full p-4 pt-16 sm:pt-4 overflowhidden relative'>
                            <ChatMessage text={'This is a message'} isSender={true} />
                            <ChatMessage senderName={'Owais'} text={'This is a message'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={true} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />
                            <ChatMessage text={'This is a long message...'} isSender={true} />
                            <ChatMessage text={'This is a long message...'} isSender={false} />

                        </div>
                            <input type="text" name="message" id="message" className='absolute bottom-2 left-0 transition-all p-1 bg-primary text-pink ' />
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}

export default SoloChat;