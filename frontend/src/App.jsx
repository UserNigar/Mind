import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import './App.css';
import Home from './components/pages/Home.jsx';
import RegisterForm from './components/pages/register/Register.jsx';
import Login from './components/pages/login/Login.jsx';
import UserProfile from './components/pages/UserProfile/UserProfile.jsx';
import { Toaster } from 'react-hot-toast'; // 🔸 toast əlavə edildi
import Chat from './components/chat/Chat.jsx';
import Share from './components/pages/share/Share.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* ✅ toast UI burada göstərilir */}
      <Routes>
        <Route
          path="/"
          element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}
        >
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="login" element={<Login />} />
           <Route path="chat" element={<Chat />} />
            <Route path="share" element={<Share />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

