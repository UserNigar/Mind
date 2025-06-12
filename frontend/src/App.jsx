import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import './App.css';
import Home from './components/pages/Home.jsx';
import RegisterForm from './components/pages/register/Register.jsx';
import Login from './components/pages/login/Login.jsx';
import UserProfile from './components/pages/UserProfile/UserProfile.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}
      >
        <Route index element={<Home />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="login" element={<Login />} /> {/* 🔹 Login route-u əlavə olundu */}
      </Route>
    </Routes>
  );
}

export default App;
