import React, { useState, useActionState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserContext } from '../context/UserContext';
import { showError, showSuccess } from '../utils/toast';
import SoloChat from './SoloChat';

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

            try {
                const res = await fetch(baseApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomName, roomPassword, roomTags, members, description, scope, maxMembers
                    }),
                    credentials: 'include'
                });
                const result = await res.json();
                if (!result.success) {
                    throw new Error(result.message || 'Failed to create a room');
                }
                showSuccess(result.message || 'room created successfully');
                return;
            } catch (error) {
                showError(error.message);
                return;
            }
        }, null
    );

    return (
        <form action={formAction} className='sm:col-span-2 col-span-3 px-2 gap-5 grid-cols-6 grid h-fit w-full'>
            {/* 1. Room Name */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomName" className='font-dosis'>Room Name:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room name' name='roomName' id='roomName' />
            </div>

            {/* Room Password */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomPassword" className='font-dosis'>Room Password:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room password' name='roomPassword' id='roomPassword' />
            </div>

            {/* 2. Max Members */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="maxMembers" className='font-dosis'>Max Members:</label>
                <input type="number" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' placeholder='Joining members' name='maxMembers' id='maxMembers' />
            </div>

            {/* 3. Room Tags */}
            <div className='text-pink items-start flex flex-col gap-3 col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomTags" className='font-dosis'>Room Tags:</label>
                <input type="text" className='bg-pink/10 py-3 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full focus:outline-primary' placeholder='Room tags' name='roomTags' id='roomTags' />
            </div>

            {/* Description */}
            <div className='text-pink items-start flex flex-col gap-3 row-span-2 h-full col-span-6 xs:col-span-3 md:col-span-3'>
                <label htmlFor="roomDesc" className='font-dosis'>Description:</label>
                <textarea
                    rows={3}
                    className='bg-pink/10 resize-none py-2 px-2 rounded-lg font-sniglet outline-transparent outline transition-all w-full h-full focus:outline-primary appearance-none'
                    placeholder='For study...'
                    name='description'
                    id='roomDesc'
                />
            </div>

            {/* 4. Room Scope */}
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

            <div className='col-span-6 flex items-center'>
                <button className='border-white/30 border transition-all py-2 px-3 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink bg-primary hover:bg-transparent'>Create</button>
            </div>
        </form>
    );
};

const ChatRoom = () => {
    
    const [showOP, setShowOP] = useState('rooms');

    const chatOP = [
        { name: 'Rooms', id: 'rooms' },
        { name: 'Solo Chat', id: 'soloChat' },
        { name: 'Create Room', id: 'createRoom' },
    ];

    return (
        <div className='h-dvh py-2 w-full px-1 flex flex-col items-center '>


            <div className='flex flex-col h-dvh w-full flex-1 items-center overflow-hidden  relative border-pink/10 border  rounded-2xl bg-[#101828]/50 max-w-310 '>
                {/* Desktop Tabs */}
                <div className='flex justify-end  items-center   border-b-pink/10 w-full border-b bg-pink/2 '>
                    <ul className='hidden xs:flex gap-2 h-15 px-2 backdrop-blur-2xl items-center'>
                        {chatOP.map(op => (
                            <li key={op.id}>
                                <button className={`border-white/30 border transition-all py-1 px-2 rounded-xl hover:opacity-80 duration-200 cursor-pointer text-pink ${showOP === op.id ? 'bg-primary' : 'bg-transparent'}`} onClick={() => setShowOP(op.id)}>{op.name}</button>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu */}
                    <div className='text-pink xs:hidden my-3 flex border-transparent w-9 h-9 rounded-lg items-center justify-center  text-lg relative group bg-primary hover:bg-transparent hover:border-pink/20 border transition-all mr-2'>
                        <span className='cursor-pointer '><i className="fa-solid fa-bars"></i></span>
                        <ul className='absolute top-full right-0 w-50 flex-col bg-[#242E71] rounded-xl overflow-hidden group-hover:opacity-100 opacity-0 transition-all pointer-events-none group-hover:pointer-events-auto font-sniglet z-50 '>
                            {chatOP.map(op => (
                                <li className='flex' key={op.id}>
                                    <button className={`transition-all py-1 px-2 flex-1 hover:opacity-80 duration-200 cursor-pointer text-sm text-pink ${showOP === op.id ? 'bg-primary' : 'bg-transparent'}`} onClick={() => setShowOP(op.id)}>{op.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {showOP === 'createRoom' && (
                        <motion.div
                            key="createRoom"
                            className='flex w-full h-full  pt-4 px-3 pb-20'
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className='grid sm:grid-cols-3 gap-5 w-full overflow-y-scroll custom-scrollbar'>
                                <FormComponent />
                                <div className='sm:col-span-1 col-span-3 min-h-100 flex flex-1 bg-pink/5 rounded-xl'></div>
                            </div>
                        </motion.div>
                    )}

                    {showOP === 'rooms' && (
                        <motion.div
                            key="rooms"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className=' p-3 w-full overflow-y-scroll scrollbar-none'
                        >
                            <div className='w-full grid grid-cols-6 flex-wrap gap-3 '>
                                <RoomCard />
                            <RoomCard />
                            <RoomCard />
                            <RoomCard />
                            <RoomCard />
                            <RoomCard />
                            </div>
                        </motion.div>
                    )}

                    {showOP === 'soloChat' && (
                        <motion.div
                            key="soloChat"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex w-full flex-1 overflow-hidden relative"
                        >
                            <SoloChat />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatRoom;