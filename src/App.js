import { Routes, Route } from 'react-router-dom';
import ChatMessages from './components/ChatMessages';
import Sidebar from './components/Sidebar';

import './App.css';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/chats/:id" element={<ChatMessages />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
