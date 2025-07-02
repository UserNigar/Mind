import React from "react";
import { Link } from "react-router-dom";
import "./ArticleListWithSidebar.scss";
import ArticleList from "../articleList/ArticleList";
import CustomizedSwitch from "../../sidebarcomp/Nightbtn/Night";
import HomeIcon from '@mui/icons-material/Home'; 
import ShareIcon from '@mui/icons-material/Share';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const ArticleListWithSidebar = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`container-layout ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`left-sidebar ${darkMode ? "sidebar-dark" : "sidebar-light"}`}>
        <div className="menu-box">
          <ul>
            <li><Link className="menu-link" to="/"><HomeIcon sx={{ fontSize: 33, color:"#1F3B73" }} /> Əsas səhifə</Link></li>
            <li><Link className="menu-link" to="/share"><ShareIcon sx={{ fontSize: 33 , color:"#1F3B73" }} /> Yeni post</Link></li>
            <li><Link className="menu-link" to="/chat"><ChatIcon sx={{ fontSize: 33 , color:"#1F3B73" }} /> Mesajlar</Link></li>
            <li><Link className="menu-link" to="/profile"><AccountCircleIcon sx={{ fontSize: 33 , color:"#1F3B73" }} /> Profil</Link></li>
            <li><Link className="menu-link" to ="/editpage"><ManageAccountsIcon sx={{ fontSize: 33 , color:"#1F3B73" }} /> Ayarlar</Link></li>
            <li><Link className="menu-link" to="/editpage"><BookmarksIcon sx={{ fontSize: 33 , color:"#1F3B73" }} /> Sevimlilər</Link></li>
            <li><CustomizedSwitch darkMode={darkMode} setDarkMode={setDarkMode} /></li>
          </ul>
        </div>
      </div>

      <div className={`article-list ${darkMode ? "article-dark" : "article-light"}`}>
        <ArticleList darkMode={darkMode} />
      </div>
    </div>
  );
};

export default ArticleListWithSidebar;
