// components/AuthTokenInput.js
import React, { useEffect, useState } from 'react';
import ApiService from '../services/api';
import SocketService from '../services/socket';

const AuthTokenInput = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function fetchData() {
      const token = await ApiService.getAuthToken();
      await SocketService.setAuthToken();
      setToken(token);
    }
    fetchData();
  }, []);

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleSetToken = async () => {
    await ApiService.setAuthToken(token);
    // SocketService.setAuthToken(token);
    window.location.reload();
  };

  return (
    <div className="auth-token-input">
      <input
        type="text"
        value={token}
        onChange={handleTokenChange}
        placeholder="Enter Auth Token"
      />
      <button onClick={handleSetToken}>Set token</button>
    </div>
  );
};

export default AuthTokenInput;
