import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io } from 'socket.io-client';

import CreateRoom from '../components/CreateRoom';
import SoloChat from '../components/SoloChat';
import Rooms from '../components/Rooms';
import Friends from '../components/Friends';
import { UserContext } from '../context/UserContext';


const ChatRoom = () => {
    const { user } = useContext(UserContext);
    const userId = user._id;

    const chatRoomOP = [
        { option: 'Rooms', id: 'rooms' },
        { option: 'Solo Chat', id: 'solochat' },
        { option: 'Create Room', id: 'createroom' },
        { option: 'Friends', id: 'friends' }

    ];
    const [socket, setSocket] = useState(null)
    const [showOp, setShowOp] = useState('rooms');

    useEffect(() => {
        if (!user) return;
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to chat room with ID: ', newSocket.id);
            if (userId) {
                newSocket.emit('join_user_room', userId);
            }
        })

        return () => {
            newSocket.off('connect');
            newSocket.disconnect();
            console.log("disconnected from chat room ")
        }
    }, [userId]);

    return (

        <div className='border border-pink/20 rounded-2xl flex-1 flex flex-col  overflow-hidden'>
            <div className='w-full  border-pink/20 border-b flex items-center px-2 justify-between text-pink'>
                <div className='h-15'></div>
                <ul className='xs:flex gap-2 hidden'>
                    {
                        chatRoomOP.map((op, idx) => (
                            <li key={op.id} className={`text-sm px-2 py-1 border border-pink/20 rounded-xl hover:opacity-90 transition-all cursor-pointer ${showOp == op.id ? 'bg-primary' : 'bg-[#140B2D] '}`}
                                onClick={() => setShowOp(op.id)}
                            >{op.option}</li>
                        ))
                    }
                </ul>
                <div className='xs:hidden border p-1 relative rounded hover:bg-primary group'>
                    <i className='fa-solid fa-bars '></i>
                    <ul className=' pointer-events-none group-hover:pointer-events-auto absolute top-full right-0 w-30  z-30 group-hover:opacity-100 border border-pink/20 opacity-0 group-hover:translate-y-0 translate-y-1.5'>
                        {
                            chatRoomOP.map((op, idx) => (
                                <li
                                    key={op.id || idx}
                                    className={`text-sm px-2 py-1 border-b  border-pink/20 hover:bg-primary transition-all cursor-pointer ${showOp == op.id ? 'bg-primary' : 'bg-[#140B2D] '}`}
                                    onClick={() => setShowOp(op.id)}
                                >{op.option}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <AnimatePresence>
                {showOp == 'rooms' && <Rooms socket={socket} />}
                {showOp == 'solochat' && <SoloChat socket={socket} />}
                {showOp == 'createroom' && <CreateRoom socket={socket} />}
                {showOp == 'friends' && <Friends socket={socket} />}
            </AnimatePresence>


        </div>

    )
}

export default ChatRoom