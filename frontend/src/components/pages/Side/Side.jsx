import React from "react";

import "./ArticleListWithSidebar.scss";
import ArticleList from "../articleList/ArticleList";

const ArticleListWithSidebar = () => {
  return (
    <div className="container-layout">
      <div className="right-sidebar">
        <div className="profile-box">
          <img
            src="/default-avatar.png"
            alt="user"
            className="profile-avatar"
          />
          <h3>İstifadəçi adı</h3>
          <p>Profil haqqında qısa info...</p>
        </div>
        <div className="menu-box">
          <h4>Menu</h4>
          <ul>
            <li>🏠 Ana səhifə</li>
            <li>➕ Yeni post</li>
            <li>💬 Mesajlar</li>
            <li>⚙️ Ayarlar</li>
          </ul>
        </div>
      </div>
      <div className="article-list">
        <ArticleList />
      </div>
    </div>
  );
};

export default ArticleListWithSidebar;
