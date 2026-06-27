import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext';
import { AnimatePresence, motion } from 'motion/react';
import { showSuccess, showError } from '../utils/toast';

import axios from 'axios'


const FriendCard = ({ name, img, receiverId, socket, invites, setInvites }) => {
    const image = img || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';
    const { user } = useContext(UserContext);


    const handleInvite = async () => {
        try {
            const invite = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/friends`, {
                receiver: receiverId,
                sender: user._id
            }, { withCredentials: true });

            const data = invite.data?.data;
            socket.emit('send_invite', data);
        } catch (error) {
            showError('Failed to send invite');
        }
    }

    useEffect(() => {
        if (!socket) return
        socket.on('receive_invite', (data) => {
            setInvites((prev) => [...prev, data]);
        })



        return () => socket.off('receive_invite');

    }, [socket]);

    return (
        <div className='border border-primary/20 hover:border-primary/50 transition-colors  flex items-center gap-4 p-2 flex-col min-w-50 rounded-2xl bg-[#110E1F] '>
            <div className='flex gap-2 items-center'>
                <img src={image} alt="" className='w-12 h-12 rounded-full border-primary border-2 ' />
                <p className='text-pink font-dosis'>{name}</p>
            </div>
            <div>
                <button value={ } className='text-pink  border border-pink/20 rounded p-1 hover:cursor-pointer hover:opacity-90 bg-[#7008E7]' onClick={() => { handleInvite() }} >Invite</button>
            </div>

        </div>
    )
}

const Friends = ({ socket }) => {
    const [invites, setInvites] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/friends`,
                    {
                        withCredentials: true
                    })
                console.log(res);
                if (res.data && res.data.data) {
                    setAllUsers(res.data.data);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getAllUsers();
    }, [])

    return (
        <AnimatePresence>
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
                className='flex-1 flex justify-start flex-col p-2 gap-2'  >
                <div className=' border border-pink/20 rounded flex justify-center items-center'>
                    {invites.length > 0 ? (invites.map((invite) => (
                      ' '
                    ))) : <p className='text-pink/10 pointer-events-none'>No invite sent to you</p>}
                </div>
                <div className='flex '>
                    {allUsers.length > 0 ? (
                        allUsers.map((user) => (
                            <FriendCard name={user.name} receiverId={user._id} socket={socket} invites={invites} setInvites={setInvites} />
                        ))
                    ) : (<p className='text-pink'>No friends found</p>)}
                </div>

            </motion.div>
        </AnimatePresence>
    )
}

export default Friends
