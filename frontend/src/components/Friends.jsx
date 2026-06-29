import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext';
import { AnimatePresence, motion } from 'motion/react';
import { showSuccess, showError, showInfo } from '../utils/toast';
import axios from 'axios'

const Friends = ({ socket }) => {
    const [invites, setInvites] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [open, setOpen] = useState(true)
    const { user } = useContext(UserContext);

    const img = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';

    const handleInvite = async (signal, payload) => {
        if (signal === 'send_invite') {
            // Context wala 'user' use ho rha hy aur receiver me parameter wala 'payload'
            const sendData = { sender: user._id, receiver: payload };
            socket.emit('send_invite', sendData);
        } else if (signal === 'cancel_invite') { // Fixed typo: cancle_invite -> cancel_invite
            socket.emit('cancel_invite', payload)
        }
    }

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/friends`, {
                    withCredentials: true
                })
                setAllUsers(res.data.data.allUsers);
                setInvites(res.data.data.invites);
            } catch (error) {
                console.error('Error in fetching users', error)
            }
        }
        getAllUsers();
    }, [])

    useEffect(() => {

        socket.on('sending_invite_failed', (data) => {
            showInfo(data)
        });

        socket.on('receive_invite', (data) => {
            setInvites(prev => {
                const isDuplicated = prev.some(invite => invite._id.toString() === data._id.toString());
                if (isDuplicated) return prev;
                showInfo(`${data.sender.name} invited you`);
                return [...prev, data];
            })

            setAllUsers(prev => {
                return prev.filter(user => data.sender._id.toString() !== user._id.toString())
            })
        });

        socket.on('invite_sent', (data) => {
            setAllUsers(prev => {
                return prev.filter(use => data.receiver._id.toString() !== use._id.toString());
            });

            setInvites(prev => {
                const isDuplicated = prev.some(inv => inv._id.toString() === data._id.toString());
                if (isDuplicated) return prev;
                showInfo(`Invite sent to ${data.receiver.name}`);
                return [...prev, data];
            })
        })

        socket.on('invite_canceled', (data) => {
            setInvites(prev => prev.filter(inv => inv._id.toString() !== data._id.toString()));
            setAllUsers(prev => {
                const isDuplicated = prev.some(use => use._id.toString() === data.receiver._id.toString());
                if (isDuplicated) return prev;
                showInfo(`Invite to ${data.receiver.name} canceled`);
                console.log(data + 'from invite_canceled');
                return [...prev, data.receiver];
            })
        })

        socket.on('invite_canceled_by_sender', (data) => {
            setInvites(prev => prev.filter(inv => inv._id.toString() !== data._id.toString()));
            setAllUsers(prev => {
                const isDuplicated = prev.some(use => use._id.toString() === data.sender._id.toString());
                if (isDuplicated) return prev;
                console.log(data);
                return [...prev, { _id: data.sender._id, name: data.sender.name }];
            })
        })

        return () => {
            socket.off('sending_invite_failed');
            socket.off('receive_invite');
            socket.off('invite_sent');
            socket.off('invite_cenceled');
            socket.off('invite_canceled_by_sender');
        };

    }, [socket]);

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} transition={{ type: 'tween', duration: 0.2 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex-1 flex flex-col sm:grid md:grid-cols-3 sm:grid-cols-5 p-2 gap-2' >

                {/* Left Side: All Users */}
                <div className={`border sm:bg-none transition-all ${!open && 'bg-linear-to-b from-transparent to-primary/20'} duration-300 min-h-15 ${open && 'flex-1'} relative border-pink/10 rounded-lg md:grid md:grid-cols-2 gap-2 md:col-span-2 sm:col-span-3 p-2`}>
                    {allUsers.length > 0 ? (
                        allUsers.map(listedUser => (
                            <div key={listedUser._id} className='w-full min-h-15 h-20 flex flex-row items-center justify-between p-2 bg-[#110E1F] rounded-lg shadow-[0_0_25px_-5px_rgba(140,48,229,0.2)]'>
                                <div className='flex items-center gap-3'>
                                    <img src={img} alt="avatar" className='w-15 h-15 rounded-full object-cover' />
                                    <p className='text-pink font-dosis text-xl'>{listedUser.name}</p>
                                </div>
                                <button className='text-pink transition-opacity text-sm cursor-pointer hover:opacity-90 font-sniglet px-3 py-1.5 rounded-lg bg-[#8C30E5]'
                                    onClick={() => handleInvite('send_invite', listedUser._id)}
                                >Invite</button>
                            </div>
                        ))
                    ) : (<p className='md:col-span-2 text-pink/70 font-dosis p-2 text-center'>No users found</p>)}

                    {/* Fixed class to className */}
                    <button className='text-pink absolute rounded-full bottom-0 left-1/2 -translate-x-1/2 sm:hidden px-2 py-1 cursor-pointer hover:bg-pink/10 transition-colors'
                        onClick={() => setOpen(!open)}
                    ><i className="fa-solid fa-caret-up"></i></button>
                </div>

                {/* Right Side: Invites Box */}
                <div className={`min-h-15 ${!open && 'flex-1'} ${open && 'bg-linear-to-b from-transparent to-primary/20'} sm:bg-none transition-all duration-300 border-pink/10 border rounded-lg md:col-span-1 sm:col-span-2 flex gap-2 p-2 flex-col`} >
                    {invites.length > 0 ? (
                        invites.map(invite => (
                            // Safe checks aur key add ki gayi hy
                            invite.receiver?._id?.toString() === user?._id?.toString() ? (
                                <div key={invite._id} className='w-full shadow-[0_0_25px_-5px_rgba(140,48,229,0.2)] rounded-lg bg-[#110E1F] min-h-15 p-3 flex flex-col gap-2'>
                                    <div className='flex gap-3 items-center'>
                                        <img src={img} alt="sender" className='w-12 h-12 rounded-full object-cover' />
                                        <div className='flex flex-col'>
                                            <p className='text-pink font-dosis text-lg leading-tight'>{invite.sender?.name}</p>
                                            <span className='text-gray-400 text-[10px]'>Received Request</span>
                                        </div>
                                    </div>
                                    <div className='flex gap-2 mt-1'>
                                        <button className='px-3 py-1 bg-[#7008E7] hover:opacity-80 text-white text-xs font-sniglet rounded transition-all cursor-pointer'>Accept</button>
                                        <button className='px-3 py-1 bg-grey1 hover:opacity-80 text-white text-xs font-sniglet rounded transition-all cursor-pointer'>Reject</button>
                                    </div>
                                </div>
                            ) : invite.sender?._id?.toString() === user?._id?.toString() ? (
                                <div key={invite._id} className='w-full shadow-[0_0_25px_-5px_rgba(140,48,229,0.2)] rounded-lg bg-[#110E1F] min-h-15 p-3 flex flex-col gap-2'>
                                    {/* Yahan UI layout theek kiya hy */}
                                    <div className='flex gap-3 items-center'>
                                        <img src={img} alt="receiver" className='w-12 h-12 rounded-full object-cover' />
                                        <div className='flex flex-col'>
                                            <p className='text-pink font-dosis text-lg leading-tight'>{invite.receiver?.name}</p>
                                            <span className='text-gray-400 text-[10px]'>Sent Request</span>
                                        </div>
                                    </div>
                                    <div className='mt-1'>
                                        <button className='px-3 py-1 bg-red-600/80 hover:bg-red-700 text-white text-xs font-sniglet rounded transition-all cursor-pointer'
                                            onClick={() => handleInvite('cancel_invite', invite)}
                                        >Cancel invite</button>
                                    </div>
                                </div>
                            ) : null
                        ))
                    ) : (<p className='md:col-span-2 text-pink/70 font-dosis p-2 text-center'>No invites found</p>)}
                </div>

            </motion.div>
        </AnimatePresence>
    )
}

export default Friends;