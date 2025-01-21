// services/api.js
import axios from 'axios';

const API_URL = 'https://api-dev.aylinhontas.edein.name/api/v1';

const ApiService = {
  getAuthToken: () => {
    return localStorage.getItem('authToken') || '';
  },
  getUserId: () => {
    return localStorage.getItem('userId') || '';
  },
  setAuthToken: async (authToken) => {
    const user = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: 'Bearer ' + authToken },
    });
    localStorage.setItem('userId', user.data.id);
    return localStorage.setItem('authToken', authToken);
  },
  getChats: async (page, take) => {
    try {
      const token = ApiService.getAuthToken();
      const res = await axios.get(`${API_URL}/chats`, {
        params: { page, take },
        headers: { Authorization: 'Bearer ' + token },
      });
      return res.data;
    } catch {
      return { result: [] };
    }
  },
  deleteChat: (id) => {
    const token = ApiService.getAuthToken();
    return axios.delete(`${API_URL}/chats/${id}`, {
      headers: { Authorization: 'Bearer ' + token },
    });
  },
  getMessages: async (chatId, page, take) => {
    try {
      const token = ApiService.getAuthToken();
      const res = await axios.get(
        `${API_URL}/chat-messages/chats/${chatId}/messages`,
        {
          headers: { Authorization: 'Bearer ' + token },
          params: { page, take },
        }
      );
      return res.data;
    } catch {
      return [];
    }
  },
  sendFileMessage: async (chatId, file) => {
    try {
      const token = ApiService.getAuthToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        `${API_URL}/chat-messages/chats/${chatId}/messages/file`,
        formData,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      return res.data;
    } catch {
      return null;
    }
  },
};

export default ApiService;
