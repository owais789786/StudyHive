import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './UserContext';

export const SocketContext = createContext({
  socket: null,
  connected: false,
  joinUserRoom: () => {},
  joinRoom: () => {},
  startChatWith: () => {},
  sendMessage: () => {},
  sendInvite: () => {},
  cancelInvite: () => {},
  acceptInvite: () => {},
  rejectInvite: () => {},
  subscribe: () => () => {},
});

export const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.connect();
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.emit('join_user_room', user._id);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, user]);

  const joinUserRoom = () => {
    if (!socket || !user) return;
    socket.emit('join_user_room', user._id);
  };

  const joinRoom = (chatId) => {
    if (!socket || !chatId) return;
    socket.emit('join_room', { chatId });
  };

  const startChatWith = (chat) => {
    if (!socket || !chat) return;
    socket.emit('start_chat_with', chat);
  };

  const sendMessage = (payload) => {
    if (!socket || !payload) return;
    socket.emit('send_message', payload);
  };

  const sendInvite = (payload) => {
    if (!socket || !payload) return;
    socket.emit('send_invite', payload);
  };

  const cancelInvite = (payload) => {
    if (!socket || !payload) return;
    socket.emit('cancel_invite', payload);
  };

  const acceptInvite = (payload) => {
    if (!socket || !payload) return;
    socket.emit('accept_invite', payload);
  };

  const rejectInvite = (payload) => {
    if (!socket || !payload) return;
    socket.emit('reject_invite', payload);
  };

  const subscribe = (event, callback) => {
    if (!socket || !event || !callback) return () => {};
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  const value = useMemo(
    () => ({
      socket,
      connected,
      joinUserRoom,
      joinRoom,
      startChatWith,
      sendMessage,
      sendInvite,
      cancelInvite,
      acceptInvite,
      rejectInvite,
      subscribe,
    }),
    [socket, connected],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
