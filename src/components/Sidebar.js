// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { Link } from 'react-router-dom';

import AuthTokenInput from './AuthTokenInput';

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pagesLength = Math.ceil(totalCount / limit);

  const fetchChats = async () => {
    const response = await ApiService.getChats(page, limit);
    setChats(response.result);
    setTotalCount(response.count);
  };

  useEffect(() => {
    fetchChats();
  }, [page, limit]);

  return (
    <div className="sidebar">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div>
          <Link to="chats">
            <h2>Chats</h2>
          </Link>

          <ul className="chats">
            {chats.map((chat) => (
              <li key={chat.id}>
                <Link to={`/chats/${chat.id}`}>
                  <div className="name">{chat.participant.name}</div>
                  <div className="email">{chat.participant.email}</div>
                  <div className="message">{chat.lastMessage?.text}</div>
                  {chat.__new_messages_count > 0 && (
                    <div className="count">{chat.__new_messages_count}</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {pagesLength > 1 && (
            <div className="pagination">
              <button
                className="prev"
                onClick={() => page > 1 && setPage(page - 1)}
              >
                Prev Page
              </button>

              <div className="numbers">
                {Array.from({ length: pagesLength }, (_, i) => i + 1).map(
                  (index) => (
                    <span
                      className={page === index ? 'active' : ''}
                      onClick={() => setPage(index)}
                      key={index}
                    >
                      {index}
                    </span>
                  )
                )}
              </div>

              <button
                className="next"
                onClick={() => page < pagesLength && setPage(page + 1)}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
        <AuthTokenInput />
      </div>
    </div>
  );
};

export default Sidebar;
