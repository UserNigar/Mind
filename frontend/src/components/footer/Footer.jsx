import React, { useState } from "react";
import "./Footer.css";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="navigation">
      <ul>
        <li className={`list ${activeIndex === 0 ? "active" : ""}`} onClick={() => setActiveIndex(0)}>
          <a href="#">
            <span className="icon">
              <HomeOutlinedIcon sx={{fontSize:90}} />
            </span>
            <span className="text">Home</span>
          </a>
        </li>

        <li className={`list ${activeIndex === 1 ? "active" : ""}`} onClick={() => setActiveIndex(1)}>
          <a href="#">
            <span className="icon">
              <PersonOutlineIcon  sx={{fontSize:90}}/>
            </span>
            <span className="text">Profile</span>
          </a>
        </li>

        <li className={`list ${activeIndex === 2 ? "active" : ""}`} onClick={() => setActiveIndex(2)}>
          <a href="#">
            <span className="icon">
              <ChatBubbleOutlineIcon  sx={{fontSize:90}}/>
            </span>
            <span className="text">Messages</span>
          </a>
        </li>

        <li className={`list ${activeIndex === 3 ? "active" : ""}`} onClick={() => setActiveIndex(3)}>
          <a href="#">
            <span className="icon">
              <ImageOutlinedIcon sx={{fontSize:90}} />
            </span>
            <span className="text">Photos</span>
          </a>
        </li>

        <li className={`list ${activeIndex === 4 ? "active" : ""}`} onClick={() => setActiveIndex(4)}>
          <a href="#">
            <span className="icon">
              <SettingsOutlinedIcon  sx={{fontSize:90}}/>
            </span>
            <span className="text">Settings</span>
          </a>
        </li>

        <div className="indicator" style={{ transform: `translateX(${activeIndex * 100}%)` }}></div>
      </ul>
    </div>
  );
};

export default Footer;
