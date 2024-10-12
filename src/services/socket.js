// services/socket.js
import { io } from 'socket.io-client';
import ApiService from './api';

let socket;

const SocketService = {
  setAuthToken: () => {
    const token = ApiService.getAuthToken();

    if (socket) socket.disconnect();
    socket = io('ws://localhost:8080', {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    window.socket = socket;
  },
  sendMessage: (text, chatId) => {
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
    socket?.on('CHAT_RECEIVE_MESSAGE', callback);
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
