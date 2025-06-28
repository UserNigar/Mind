import React from "react";

import "./ArticleListWithSidebar.scss";
import ArticleList from "../articleList/ArticleList";
import { Link } from "react-router";

const ArticleListWithSidebar = () => {
  return (
    <div className="container-layout">
      <div className="right-sidebar">
        {/* <div className="profile-box">
          <img
            src="/default-avatar.png"
            alt="user"
            className="profile-avatar"
          />
          <h3>İstifadəçi adı</h3>
          <p>Profil haqqında qısa info...</p>
        </div> */}
        <div className="menu-box">
          <ul>
            <li><Link to={"/"}> Esas sehife</Link></li>
            <li><Link to={"/chat"}>➕ Yeni post</Link></li>
            <li><Link to={"/chat"}>💬 Mesajlar</Link></li>
            <li><Link>⚙️ Ayarlar</Link></li>
            <li>⚙️ Ayarlar</li>
            <li>⚙️ Ayarlar</li>
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
