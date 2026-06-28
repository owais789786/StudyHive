import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext';
import { AnimatePresence, motion } from 'motion/react';
import { showSuccess, showError, showInfo } from '../utils/toast';

import axios from 'axios'

const InviteCard = ({ img, invite, socket }) => {
    const image = img || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';
    const { user } = useContext(UserContext);
    const handleInvite = async (signal) => {
        if (signal == 'cancel') {
            socket.emit('cancel_invite', invite);
            showInfo(`Invite to ${invite.receiver.name} is canceled`)
        } else if (signal == 'reject') {
            socket.emit('reject_invite', invite);
        } else {

        }
    }



    return (
        <div className='border border-primary/20 hover:border-primary/50 transition-colors  flex items-center gap-4 p-2 flex-col min-w-50 rounded-2xl bg-[#110E1F] '>
            <div className='flex gap-2 items-center'>
                <img src={image} alt="" className='w-12 h-12 rounded-full border-primary border-2 ' />
                <p className='text-pink font-dosis'>{invite.sender.name}</p>
            </div>

            {invite.sender._id.toString() == user._id.toString() ?
                (<div>
                    <button className='text-pink  border border-pink/20 rounded p-1 hover:cursor-pointer hover:opacity-90 bg-[#7008E7]' onClick={() => { handleInvite('cancel') }} >Cancel invite</button>
                </div>)
                : invite.receiver._id.toString() == user._id.toString() ?
                    (<div className='flex justify-between w-full p-2'>
                        <button className='text-pink  border border-pink/20 rounded p-1 hover:cursor-pointer hover:opacity-90 bg-[#7008E7]' onClick={() => { handleInvite('reject') }} >Reject</button>
                        <button className='text-pink  border border-pink/20 rounded p-1 hover:cursor-pointer hover:opacity-90 bg-[#7008E7]' onClick={() => { handleInvite('accept') }} >Accept</button>
                    </div>)
                    : null
            }



        </div>
    )
}

const FriendCard = ({ name, img, receiverId, socket }) => {
    const { user } = useContext(UserContext);
    const image = img || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';

    const handleInvite = async () => {
        try {
            const data = { receiver: receiverId, sender: user._id };
            socket.emit('send_invite', data);

        } catch (error) {
            showError('Failed to send invite');
        }
    }

    return (
        <div className='border border-primary/20 hover:border-primary/50 transition-colors  flex items-center gap-4 p-2 flex-col min-w-50 rounded-2xl bg-[#110E1F] '>
            <div className='flex gap-2 items-center'>
                <img src={image} alt="" className='w-12 h-12 rounded-full border-primary border-2 ' />
                <p className='text-pink font-dosis'>{name}</p>
            </div>
            <div>
                <button className='text-pink  border border-pink/20 rounded p-1 hover:cursor-pointer hover:opacity-90 bg-[#7008E7]' onClick={() => { handleInvite() }} >Invite</button>
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
                if (res.data && res.data.data && res.data.data.invites) {
                    setAllUsers(res.data.data.allUsers);
                    setInvites(res.data.data.invites);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getAllUsers();
    }, [])

    useEffect(() => {
        socket.on('invite_canceled', (invite) => {
            setInvites((prevInvites) => {
                return prevInvites.filter(prevInvite => prevInvite.sender._id !== invite.sender._id);
            })
        })
        return () => socket.off('invite_canceled');
    }, []);

    useEffect(() => {
socket.on('invite_rejected',(invite)=>{
    setInvites((prevInvites)=>{
        return prevInvites.filter(prevInvite=> invite.)
    })
})
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
                <div className=' border border-pink/20 rounded flex justify-center items-center gap-4 p-2'>
                    {invites.length > 0 ? (invites.map((invite) => (
                        <InviteCard socket={socket} invite={invite} />
                    ))) : <p className='text-pink/10 pointer-events-none'>No invite sent to you</p>}
                </div>
                <div className='flex '>
                    {allUsers.length > 0 ? (
                        allUsers.map((user) => (
                            <FriendCard name={user.name} receiverId={user._id} socket={socket} invite />
                        ))
                    ) : (<p className='text-pink'>No friends found</p>)}
                </div>

            </motion.div>
        </AnimatePresence>
    )
}

export default Friends
