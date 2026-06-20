import React, { useState, useActionState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserContext } from '../context/UserContext';
import { showError, showSuccess } from '../utils/toast';


// RoomCard.jsx
const RoomCard = () => {
    const room = {
        name: "Owais's Room",
        tags: ["Study", "Coding", "Physics"],
        currentMembers: 8,
        maxMembers: 15,
        isPublic: true,
        isActive: true,
        recentMembers: [{}, {}, {}] // 3 avatars
    };
    const tagColors = [
        { text: '#7eb8f7', border: '#7eb8f7' },   // blue outline
        { text: '#ffffff', border: '#22c55e', bg: '#22c55e' }, // green filled
        { text: '#f59e0b', border: '#f59e0b' },   // amber outline
        { text: '#00F5D4', border: '#00F5D4' },   // cyan outline
        { text: '#9D4EDD', border: '#9D4EDD' },   // purple outline
    ];


    const getTagStyle = (index) => {
        const c = tagColors[index % tagColors.length];
        return {
            color: c.text,
            border: `1.5px solid ${c.border}`,
            backgroundColor: c.bg || 'transparent',
        };
    };
    return (
        <div className='bg-[#110e1f]  border border-violet-500/30 rounded-2xl p-6 
                        flex flex-col gap-4 hover:border-violet-500/60 
                        transition-colors duration-200 col-span-6 xs:col-span-3 sm:col-span-2'>

            {/* Room Name */}
            <h3 className='font-dosis text-[#8b9dc8] text-2xl font-extrabold m-0'>
                {room.name}
            </h3>

            {/* Tags */}
            <div className='flex items-center gap-2 flex-wrap'>
                <span className='font-dosis text-white/40 text-sm'>tags:</span>
                {room.tags?.map((tag, i) => (
                    <span
                        key={tag}
                        className='font-dosis text-sm font-semibold px-4 py-1 rounded-full'
                        style={getTagStyle(i)}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Stats Row */}
            <div className='flex items-center gap-4 flex-wrap'>
                <span className='font-dosis text-white/50 text-sm flex items-center gap-1.5'>
                    <i className="fa-solid fa-user"></i>
                    {room.currentMembers} / {room.maxMembers} members
                </span>
                <span className='font-dosis text-green-400 text-sm flex items-center gap-1.5'>
                    <i className="fa-solid fa-globe"></i>
                    {room.isPublic ? 'Public' : 'Private'}
                </span>
                <span className={`font-dosis text-sm font-bold flex items-center gap-1.5
                                ${room.isActive ? 'text-white' : 'text-white/30'}`}>
                    <i className="fa-regular fa-clock"></i>
                    {room.isActive ? 'Active' : 'Idle'}
                </span>
            </div>

            {/* Divider */}
            <div className='border-t border-white/10' />

            {/* Footer */}
            <div className='flex items-center justify-between'>

                {/* Avatar Stack */}
                <div className='flex'>
                    {room.recentMembers?.slice(0, 3).map((member, i) => (
                        <div
                            key={i}
                            className='w-9 h-9 rounded-full bg-[#1e1535] border-2 border-[#110e1f]
                                       flex items-center justify-center text-white/40 -ml-2.5 first:ml-0'
                        >
                            <i className='fa-solid fa-user'></i>
                        </div>
                    ))}
                </div>

                {/* Join Button */}
                <button className='font-sniglet  text-sm text-white bg-violet-600 
                                   hover:bg-violet-700 px-6 py-2 rounded-full transition-colors'>
                    JOIN ROOM
                </button>

            </div>
        </div>
    );
};

const FormComponent = () => {
    const baseApi = `${import.meta.env.VITE_API_URL}/api/users/room`;
    const { user } = useContext(UserContext);
    console.log(user._id)
    const [selectedOption, setSelectedOption] = useState('public');
    const [state, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            const roomName = formData.get('roomName');
            const roomPassword = formData.get('roomPassword');
            const maxMembers = formData.get('maxMembers');

            const roomTags = formData.get('roomTags').split(',').map(t => t.trim());
            const members = [{ user: user._id, role: 'admin' }];
            const description = formData.get('description');
            const scope = formData.get('roomScope');

            let result;

            try {
                const res = await fetch(baseApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomName, roomPassword, roomTags, members, description, scope, maxMembers
                    }),
                    credentials: 'include'
                })
                result = await res.json();
                console.log(result);
                if (!result.success == true) {
                    throw new Error(result.message || 'Failed to create a room')
                }
                if (result.success == true) { showSuccess(result.message || 'room created successfully kk'); }
                return;

            } catch (error) {
                // showError(error.message);
                return;

            }
        }, null
    )

    return (
        <form action={formAction} className='sm:col-span-2 col-span-3 px-2 gap-5  grid-cols-6 grid w-full'>

            {/* 1. Room Name */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3  '>
                <label htmlFor="roomName" className='font-dosis'>Room Name:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room name' name='roomName' id='roomName' />
            </div>

            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3  '>
                <label htmlFor="roomName" className='font-dosis'>Room Password:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room password' name='roomPassword' id='roomPassword' />
            </div>

            {/* 2. Max Members */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="maxMembers" className='font-dosis'>Max Members:</label>
                <input type="number" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' placeholder='Joining members' name='maxMembers' id='maxMembers' />
            </div>

            {/* 3. Description (RIGHT SIDE PAR POORI 2 ROWS LEGA) */}

            {/* 4. Dusra Room Name (Jo neechay first column mein aayega) */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomTags" className='font-dosis'>Room Tags:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room tags' name='roomTags' id='roomTags' />
            </div>

            <div className='text-pink items-start flex flex-col gap-3 row-span-2 h-full col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomDesc" className='font-dosis'>Description:</label>
                <textarea
                    // Default safe rows
                    rows={3}
                    className='bg-pink/10 resize-none py-2 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full h-full  focus:outline-primary appearance-none'
                    placeholder='For study...'
                    name='description'
                    id='roomDesc'
                />
            </div>
            {/* 5. Room Scope (Jo neechay second column mein aayega) */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label className='font-dosis'>Room Scope:</label>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="radio" name="roomScope" value="public" checked={selectedOption === 'public'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'public' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                            <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'public' ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <span className="font-sniglet text-sm text-pink/50">Public Room</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="radio" name="roomScope" value="private" checked={selectedOption === 'private'} onChange={(e) => setSelectedOption(e.target.value)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'private' ? 'border-primary bg-primary' : 'border-pink/40 group-hover:border-primary'}`}>
                            <div className={`w-2 h-2 rounded-full bg-white transition-transform ${selectedOption === 'private' ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <span className="font-sniglet text-sm text-pink/50">Private Room</span>
                    </label>
                </div>
            </div>

            <div className=' col-span-6 flex items-center '>
                <button className={`border-white/30 border transition-all py-2 px-3 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink bg-primary hover:bg-transparent `}>Create</button>
            </div>
        </form>
    )
}


const ChatRoom = () => {



    const tagsArr = [
        'Study', 'OOP', 'Coding'
    ];
    // helpers — card ke bahar define karo


    const getRandomColor = () => {
        return tagColors[Math.floor(Math.random() * tagColors.length)];
    };

    const [showCreateRoom, setShowCreateRoom] = useState(false);
<<<<<<< HEAD
    const [selectedOption, setSelectedOption] = useState('public');
    const [activeFellow, setActiveFellow] = useState(null);
=======

>>>>>>> a6fe31e (feat: add room/message models, room controller, update chat UI and routes)
    const chatOP = [
        { name: 'Rooms', id: 'rooms' },
        { name: 'Solo Chat', id: 'soloChat' },
        { name: 'Create Room', id: 'createRoom' },
    ]
    const [showOP, setShowOP] = useState('rooms');

    return (
        <div className='min-h-dvh w-full px-1 sm:px-3 sm:py-1 flex flex-col items-center py-1'>
            <p className='text-primary font-dosis font-bold text-3xl '>Live Chat</p>
            <p className='text-pink/20'>Chat with your friends</p>

            <div className='flex flex-col w-full flex-1 border-pink/10 border mt-6  rounded-2xl bg-[#101828]/50 max-w-310 overflow-hidden'>
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
                    <>
                        {showOP == 'createRoom' &&
                            <motion.div className=' flex w-full h-full  pt-4 px-3 pb-3'
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
                                <div className='grid sm:grid-cols-3 gap-5 w-full'>

                                    <FormComponent />
                                    <div className='sm:col-span-1 col-span-3 min-h-100 flex flex-1 bg-pink/5 rounded-xl'></div>
                                </div>

                            </motion.div>
                        }
                        {showOP == 'rooms' &&
                            <motion.div
                                exit={{
                                    opacity: 0
                                }}
                                initial={{
                                    opacity: 0
                                }}
                                animate={{
                                    opacity: 1
                                }}
                                className='grid grid-cols-6 p-3 flex-wrap gap-3'>




<<<<<<< HEAD
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
=======
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
                                <RoomCard />
>>>>>>> a6fe31e (feat: add room/message models, room controller, update chat UI and routes)


<<<<<<< HEAD
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
=======
                            </motion.div>
                        }
                    </>
>>>>>>> a6fe31e (feat: add room/message models, room controller, update chat UI and routes)
                </AnimatePresence>

            </div >
        </div>
    )
}
export default ChatRoom;
