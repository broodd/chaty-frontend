// services/socket.js
import { io } from 'socket.io-client';
import ApiService from './api';

let socket;

const SocketService = {
  setAuthToken: () => {
    const token = ApiService.getAuthToken();

    // if user change token => disconect prev socket
    if (socket) socket.disconnect();

    socket = io('wss://api-dev.aylinhontas.edein.name', {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    // just for development test
    window.socket = socket;
  },
  sendMessage: ({ text, file, chatId }) => {
    const message = {
      text,
      chat: { id: chatId },
    };
    socket?.emit('CHAT_SEND_MESSAGE', message);
  },
  readMessage: (messageId, chatId) => {
    socket?.emit('CHAT_READ_MESSAGE', { id: messageId, chat: { id: chatId } });
  },
  onReceiveMessage: (callback) => {
    setTimeout(() => {
      socket?.on('CHAT_RECEIVE_MESSAGE', callback);
    }, 300);
  },
  onReadMessage: (callback) => {
    socket?.on('CHAT_READ_MESSAGE', callback);
  },
  onReceiveError: () => {
    socket?.on('SOCKET_ERROR', (error) => {
      console.error('--- SOCKET_ERROR', error);
    });
  },
};

export default SocketService;
