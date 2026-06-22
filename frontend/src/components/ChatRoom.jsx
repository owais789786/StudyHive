import React, { useState, useActionState } from 'react'
import { motion, AnimatePresence } from 'motion/react'


const ChatRoom = () => {

    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [selectedOption, setSelectedOption] = useState('public');
    const [activeFellow, setActiveFellow] = useState(null);
    const chatOP = [
        { name: 'Rooms', id: 'rooms' },
        { name: 'Fellows', id: 'fellows' },
        { name: 'Create Room', id: 'createRoom' },
    ]
    const [showOP, setShowOP] = useState('rooms');

    return (
        <div className='min-h-dvh w-full px-1 sm:px-3 sm:py-1 flex flex-col items-center py-1'>
            <p className='text-primary font-dosis font-bold text-3xl '>Live Chat</p>
            <p className='text-pink/20'>Chat with your friends</p>

            <div className='flex flex-col w-full flex-1 border-pink/10 border mt-6  pb-5 rounded-2xl bg-[#101828]/50 max-w-310 overflow-hidden'>
                <ul className='hidden xs:flex gap-2 px-4 border-b w-full  h-15 backdrop-blur-2xl bg-pink/2 items-center border-b-pink/10'>
                    {chatOP.map(op => (
                        <li>
                            <button className={`border-white/30 border transition-all py-1 px-2 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink ${showOP == op.id ? 'bg-primary' : ' bg-transparent'} `} onClick={() => setShowOP(op.id)}>{op.name}</button>
                        </li>
                    ))}
                </ul>

                <div className='text-pink xs:hidden flex border-transparent w-10 h-10 rounded-lg items-center justify-center  mt-3 ml-4 text-lg relative group bg-primary hover:bg-transparent hover:border-pink/20 border transition-all '>
                    <span className='cursor-pointer'><i className="fa-solid fa-bars"></i></span>
                    <ul className='absolute top-full left-0 w-50  flex-col bg-[#242E71] rounded-xl overflow-hidden group-hover:opacity-100 opacity-0 transition-all pointer-events-none group-hover:pointer-events-auto font-sniglet'>
                        {chatOP.map(op => (
                            <li className='flex '>
                                <button className={`transition-all py-1 px-2 flex-1 hover:opacity-80 duration-200 cursor-pointer text-sm text-pink ${showOP == op.id ? 'bg-primary' : ' bg-transparent'} `} onClick={() => setShowOP(op.id)}>{op.name}</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <AnimatePresence>
                    {showOP == 'createRoom' &&
                        <motion.div className='flex-1 pt-10 px-3 '
                            exit={{
                                opacity: 0
                            }}
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: 1
                            }}
                        >
                            <form action="" className='grid px-2 gap-5 grid-cols-6 w-full'>

                                {/* 1. Room Name */}
                                <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-2  '>
                                    <label htmlFor="roomName" className='font-dosis'>Room Name:</label>
                                    <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room name' name='roomName' id='roomName' />
                                </div>

                                <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-2  '>
                                    <label htmlFor="roomName" className='font-dosis'>Room Password:</label>
                                    <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room password' name='roomPassword' id='roomPassword' />
                                </div>

                                {/* 2. Max Members */}
                                <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-2'>
                                    <label htmlFor="maxMembers" className='font-dosis'>Max Members:</label>
                                    <input type="number" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' placeholder='Joining members' name='maxMembers' id='maxMembers' />
                                </div>

                                {/* 3. Description (RIGHT SIDE PAR POORI 2 ROWS LEGA) */}

                                {/* 4. Dusra Room Name (Jo neechay first column mein aayega) */}
                                <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-2'>
                                    <label htmlFor="roomTags" className='font-dosis'>Room Tags:</label>
                                    <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room tags' name='roomTags' id='roomTags' />
                                </div>

                                <div className='text-pink items-start flex flex-col gap-3 row-span-2 h-full col-span-6 xs:col-span-3 md:col-span-2'>
                                    <label htmlFor="roomDesc" className='font-dosis'>Description:</label>
                                    <textarea
                                        // Default safe rows
                                        rows={1}
                                        className='bg-pink/10 py-2 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full h-full  focus:outline-primary appearance-none'
                                        placeholder='For study...'
                                        name='roomDesc'
                                        id='roomDesc'
                                    />
                                </div>
                                {/* 5. Room Scope (Jo neechay second column mein aayega) */}
                                <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-2'>
                                    <label className='font-dosis'>Room Scope:</label>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <input type="radio" name="roomType" value="public" checked={selectedOption === 'public'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'public' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'public' ? 'scale-100' : 'scale-0'}`} />
                                            </div>
                                            <span className="font-sniglet text-sm text-pink/50">Public Room</span>
                                        </label>

                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <input type="radio" name="roomType" value="private" checked={selectedOption === 'private'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'private' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'private' ? 'scale-100' : 'scale-0'}`} />
                                            </div>
                                            <span className="font-sniglet text-sm text-pink/50">Private Room</span>
                                        </label>
                                    </div>
                                </div>

                            </form>
                            <div className='pt-10 pl-4 flex w-full justify-center'>
                                <button className={`border-white/30 border transition-all py-2 px-3 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink bg-primary hover:bg-transparent `}>Create</button>
                            </div>

                        </motion.div>
                    }
                    {showOP == 'rooms' &&
                        <motion.div>

                        </motion.div>
                    }
                   
            {showOP === 'fellows' && (
            <div className="flex w-full h-[calc(100vh-120px)] overflow-hidden">

                {/* LEFT SIDE: Fellows List */}
                {/* Mobile par tabhi dikhegi jab koi activeFellow selected NAHI hoga */}
                <div className={`w-full md:w-1/3 border-r border-pink/10 flex flex-col ${activeFellow ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-pink/10 text-pink/60 text-sm">
                        Your Fellows
                    </div>
                    <div className="flex-1 overflow-y-auto JSON-list">
                        {/* Sample Fellows Loop */}
                        {['Ali', 'Zain', 'Hamza'].map((fellow) => (
                            <button
                                key={fellow}
                                onClick={() => setActiveFellow(fellow)}
                                className="w-full text-left px-4 py-3 text-pink hover:bg-pink/5 border-b border-pink/5 transition-colors flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs">
                                    {fellow[0]}
                                </div>
                                <span>{fellow}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: Actual Chat Window */}
                {/* Mobile par tabhi dikhegi jab koi activeFellow select HO JAYEGA */}
                <div className={`w-full md:w-2/3 flex flex-col bg-[#101828]/30 ${activeFellow ? 'flex' : 'hidden md:flex'}`}>
                    {activeFellow ? (
                        <div className="flex flex-col h-full">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-pink/10 flex items-center gap-3 bg-pink/2">
                                {/* BACK BUTTON: Sirf mobile par dikhega taake user wapas list par ja sakay */}
                                <button
                                    onClick={() => setActiveFellow(null)}
                                    className="md:hidden text-pink mr-2 cursor-pointer text-lg"
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">
                                    {activeFellow[0]}
                                </div>
                                <span className="text-pink font-semibold">{activeFellow}</span>
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 p-4 overflow-y-auto text-pink/70 text-sm">
                                {/* Messages breakdown goes here */}
                                <p className="text-center text-pink/20 my-4">Conversation started with {activeFellow}</p>
                            </div>

                            {/* Chat Input */}
                            <div className="p-3 border-t border-pink/10 flex gap-2">
                                <input type="text" placeholder="Type a message..." className="bg-pink/10 py-2 px-3 rounded-lg font-sniglet text-pink outline-none flex-1 focus:ring-1 focus:ring-primary" />
                                <button className="bg-primary text-pink px-4 rounded-lg"><i className="fa-solid fa-paper-plane"></i></button>
                            </div>
                        </div>
                    ) : (
                        /* Empty State: Sirf Desktop par dikhega jab tak koi chat select na ho */
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-pink/30">
                            <i className="fa-regular fa-comments text-4xl mb-2"></i>
                            <p className="font-sniglet">Select a fellow to start chatting</p>
                        </div>
                    )}
                </div>

            </div>
        )}
 {
                        showOP == 'fellow' && <Fellow />
                    }
                </AnimatePresence>

            </div >
        </div>
    )
}
export default ChatRoom;
