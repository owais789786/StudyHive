import { useState, useEffect, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { showSuccess, showError, showInfo } from '../utils/toast';
import { SocketContext } from '../context/SocketContext';
import { UserContext } from '../context/UserContext';

const deriveChatId = (sender, receiver) => {
  const ids = [String(sender), String(receiver)].sort();
  return `${ids[0]}_${ids[1]}`;
};

const Friends = () => {
  const { user } = useContext(UserContext);
  const { connected, sendInvite, cancelInvite, acceptInvite, rejectInvite, subscribe, joinRoom } = useContext(SocketContext);

  const [open, setOpen] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const img = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/friends`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setAllUsers(response.data.data.allUsers || []);
        setInvites(response.data.data.invites || []);
      }
    } catch (error) {
      console.error('Failed to fetch friends', error);
      showError('Unable to load friends list');
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchUsers();
  }, [user?._id]);

  useEffect(() => {
    if (!connected || !subscribe) return;

    const unsubscribeSendingFailed = subscribe('sending_invite_failed', (message) => {
      showError(message || 'Invite failed');
    });

    const unsubscribeReceiveInvite = subscribe('receive_invite', (data) => {
      setInvites((prev) => [data, ...prev]);
      showInfo('New invitation received');
    });

    const unsubscribeInviteSent = subscribe('invite_sent', (data) => {
      setInvites((prev) => [data, ...prev]);
      showSuccess('Invite sent');
    });

    const unsubscribeInviteCanceled = subscribe('invite_canceled', (data) => {
      setInvites((prev) => prev.filter((invite) => invite._id !== data._id));
      showInfo('Invitation canceled');
    });

    const unsubscribeInviteCanceledBySender = subscribe('invite_canceled_by_sender', (data) => {
      setInvites((prev) => prev.filter((invite) => invite._id !== data._id));
      showInfo('Request canceled by sender');
    });

    const unsubscribeInviteAccepted = subscribe('invite_accepted', (data) => {
      setInvites((prev) => prev.map((invite) => (invite._id === data._id ? data : invite)));
      showSuccess('Invitation accepted');
      if (data?.sender?._id && data?.receiver?._id) {
        joinRoom(deriveChatId(data.sender._id, data.receiver._id));
      }
    });

    const unsubscribeInviteRejected = subscribe('invite_rejected', (data) => {
      setInvites((prev) => prev.filter((invite) => invite._id !== data._id));
      showInfo('Invitation rejected');
    });

    return () => {
      unsubscribeSendingFailed();
      unsubscribeReceiveInvite();
      unsubscribeInviteSent();
      unsubscribeInviteCanceled();
      unsubscribeInviteCanceledBySender();
      unsubscribeInviteAccepted();
      unsubscribeInviteRejected();
    };
  }, [subscribe, joinRoom]);

  const handleInvite = (signal, payload) => {
    if (!user?._id) return;

    switch (signal) {
      case 'send_invite':
        sendInvite({ sender: user._id, receiver: payload });
        break;
      case 'cancel_invite':
        cancelInvite(payload);
        break;
      case 'accept_invite':
        acceptInvite(payload);
        break;
      case 'reject_invite':
        rejectInvite(payload);
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 0.2 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='flex-1 flex flex-col sm:grid md:grid-cols-3 sm:grid-cols-5 p-2 gap-2'
      >
        <div
          className={`order sm:bg-none transition-all  sm:h-auto duration-300 min-h-15  relative border-pink/10 rounded-lg md:grid md:grid-cols-2 gap-2 md:col-span-2 sm:col-span-3 p-2 overflow-y-scroll custom-scrollbar`}
        >
          {allUsers.length > 0 ? (
            allUsers.map((listedUser) => (
              <div
                key={listedUser._id}
                className='w-full min-h-15 h-20 flex flex-row items-center justify-between p-2 bg-[#110E1F] rounded-lg shadow-[0_0_25px_-5px_rgba(140,48,229,0.4)]'
              >
                <div className='flex items-center gap-3'>
                  <img src={img} alt='avatar' className='w-15 h-15 rounded-full object-cover' />
                  <p className='text-pink font-dosis text-xl'>{listedUser.name}</p>
                </div>
                <button
                  className='text-pink transition-opacity text-sm cursor-pointer hover:opacity-90 font-sniglet px-3 py-1.5 rounded-lg bg-[#8C30E5]'
                  onClick={() => handleInvite('send_invite', listedUser._id)}
                >
                  Invite
                </button>
              </div>
            ))
          ) : (
            <p className='md:col-span-2 text-pink/70 font-dosis p-2 text-center'>No users found</p>
          )}

          <button
            className='text-pink absolute rounded-full bottom-0 left-1/2 -translate-x-1/2 sm:hidden px-2 py-1 cursor-pointer hover:bg-pink/10 transition-colors'
            onClick={() => setOpen(!open)}
          >
            <i className='fa-solid fa-caret-up'></i>
          </button>
        </div>

        <div
          className={`min-h-15   sm:h-auto sm:bg-none transition-all duration-300 border-pink/10 border rounded-lg md:col-span-1 sm:col-span-2 flex gap-2 p-2 flex-col overflow-y-scroll custom-scrollbar`}
        >
          {invites.length > 0 ? (
            invites.map((invite) =>
              invite.receiver?._id?.toString() === user?._id?.toString() ? (
                <div
                  key={invite._id}
                  className='w-full shadow-[0_0_25px_-5px_rgba(140,48,229,0.4)] rounded-lg bg-[#110E1F] min-h-15 p-3 flex flex-col gap-2'
                >
                  <div className='flex gap-3 items-center'>
                    <img src={img} alt='sender' className='w-12 h-12 rounded-full object-cover' />
                    <div className='flex flex-col'>
                      <p className='text-pink font-dosis text-lg leading-tight'>{invite.sender?.name}</p>
                      <span className='text-gray-400 text-[10px]'>Received Request</span>
                    </div>
                  </div>
                  <div className='flex gap-2 mt-1'>
                    <button
                      className='px-3 py-1 bg-[#7008E7] hover:opacity-80 text-white text-xs font-sniglet rounded transition-all cursor-pointer'
                      onClick={() => handleInvite('accept_invite', invite)}
                    >
                      Accept
                    </button>
                    <button
                      className='px-3 py-1 bg-grey1 hover:opacity-80 text-white text-xs font-sniglet rounded transition-all cursor-pointer'
                      onClick={() => handleInvite('reject_invite', invite)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : invite.sender?._id?.toString() === user?._id?.toString() ? (
                <div
                  key={invite._id}
                  className='w-full shadow-[0_0_25px_-5px_rgba(140,48,229,0.2)] rounded-lg bg-[#110E1F] min-h-15 p-3 flex flex-col gap-2'
                >
                  <div className='flex gap-3 items-center'>
                    <img src={img} alt='receiver' className='w-12 h-12 rounded-full object-cover' />
                    <div className='flex flex-col'>
                      <p className='text-pink font-dosis text-lg leading-tight'>{invite.receiver?.name}</p>
                      <span className='text-gray-400 text-[10px]'>Sent Request</span>
                    </div>
                  </div>
                  <div className='mt-1'>
                    <button
                      className='px-3 py-1 bg-red-600/80 hover:bg-red-700 text-white text-xs font-sniglet rounded transition-all cursor-pointer'
                      onClick={() => handleInvite('cancel_invite', invite)}
                    >
                      Cancel invite
                    </button>
                  </div>
                </div>
              ) : null,
            )
          ) : (
            <p className='md:col-span-2 text-pink/70 font-dosis p-2 text-center'>No invites found</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Friends;
