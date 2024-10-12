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
    SocketService.sendMessage(newMessage, chatId);
    setNewMessage('');
  };

  const readMessage = (messageId) => {
    SocketService.readMessage(messageId, chatId);
  };

  return (
    <div className="messages-container">
      <h2>Messages</h2>

      <div
        id="messages-scroll"
        style={{
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
              <div className="text">
                {message.text}
                <small>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </small>
              </div>
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

      {/* Placeholder example */}
      {!messages.length && (
        <div className="messages">
          <div className="message message-sender">
            <div className="text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
              commodi porro veritatis, quis sin<small>00:08:56</small>
            </div>
            <small>Viewed at 17:19:32</small>
          </div>

          <div className="message message-sender">
            <div className="text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
              commodi porro veritatis, quis sin<small>00:09:01</small>
            </div>
            <small>Viewed at 17:19:32</small>
          </div>

          <div className="message message-receiver">
            <div className="text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
              commodi porro veritatis, quis sin<small>00:09:01</small>
            </div>
          </div>
        </div>
      )}

      <div className="send-message">
        <textarea
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatMessages;
