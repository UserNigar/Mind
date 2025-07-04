import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import './App.css';
import RegisterForm from './components/pages/register/Register.jsx';
import Login from './components/pages/login/Login.jsx';
import UserProfile from './components/pages/UserProfile/UserProfile.jsx';
import { Toaster } from 'react-hot-toast'; 
import Chat from './components/chat/Chat.jsx';
import Share from './components/pages/share/Share.jsx';
import ArticleList from './components/pages/articleList/ArticleList.jsx';
import UserDetail from './components/pages/userDetail/UserDetail.jsx';
import ArticleListWithSidebar from './components/pages/Side/Side.jsx';
import { useDispatch } from 'react-redux';
import { rehydrateUser } from './Redux/UserSlice.js';
import PrivateRoute from './components/PrivateRouter/PrivateRoute.jsx';
import EditPage from './components/pages/Editpage/EditPage.jsx';
import FollowersList from './components/pages/Follower/FollowerList.jsx';
import SavedArticles from './components/pages/SavedArticle/SavedArticle.jsx';
import AdminDashboard from './components/admin/Adminpanel.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateUser());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Qorunmayan səhifələr */}
        <Route
          path="/register"
          element={<RegisterForm darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/login"
          element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />}
        />

        {/* Qorumalı bütün Layout və alt səhifələri */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<ArticleListWithSidebar darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route path="profile" element={<UserProfile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="share" element={<Share />} />
          <Route path="editpage" element={<EditPage />} />
          <Route path="followers" element={<FollowersList />} />
          <Route path="article" element={<ArticleList />} />
          <Route path="user/:id" element={<UserDetail />} />
           <Route path="favorite" element={<SavedArticles />} />
           <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
