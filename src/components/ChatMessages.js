// components/ChatMessages.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ApiService from '../services/api';
import SocketService from '../services/socket';

const ChatMessages = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [newMessage, setNewMessage] = useState('');
  const isInitialMount = useRef(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMessages();

    setTimeout(() => {
      document.querySelector('#messages-scroll').scrollTop =
        document.querySelector('.messages').scrollHeight;
    }, 200);
  }, [page, chatId]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    SocketService.onReceiveMessage(({ message }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(() => {
        document.querySelector('#messages-scroll').scrollTop =
          document.querySelector('.messages').scrollHeight;
      }, 100);
    });

    SocketService.onReadMessage(({ message }) => {
      // ...
    });
    SocketService.onReceiveError();
  }, []);

  const fetchMessages = async () => {
    const userId = ApiService.getUserId();
    setUserId(userId);

    const response = await ApiService.getMessages(chatId, page, limit);
    setMessages(response);

    const lastMessage = response[response.length - 1];
    if (lastMessage && !lastMessage.readAt && lastMessage.ownerId !== userId)
      readMessage(lastMessage.id);
  };

  const sendMessage = () => {
    if (file) return sendFile();

    SocketService.sendMessage({ text: newMessage, chatId });
    setNewMessage('');
  };

  const readMessage = (messageId) => {
    SocketService.readMessage(messageId, chatId);
  };

  const handleFileChange = (event) => {
    try {
      const res = event.target.files[0];
      setFile(res);
    } catch {
      setFile(null);
    }
  };

  const sendFile = async () => {
    if (!file) return;

    await ApiService.sendFileMessage(chatId, file);
    setFile(null);
  };

  return (
    <div className="messages-container">
      <h2>Messages</h2>

      <div
        id="messages-scroll"
        style={{
          height: '100%',
          overflowY: 'auto',
          marginBottom: '20px',
          marginRight: '-20px',
          paddingRight: '20px',
        }}
      >
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={
                message.ownerId === userId
                  ? 'message message-sender'
                  : 'message message-receiver'
              }
            >
              {message.file ? (
                <div className="image">
                  <img src={message.file.src} alt="" />
                </div>
              ) : (
                <div className="text">
                  {message.text}
                  <small>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              )}
              {message.readAt && message.ownerId === userId && (
                <small>
                  Viewed at
                  {new Date(message.readAt).toLocaleTimeString()}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="send-message">
        <textarea
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatMessages;
