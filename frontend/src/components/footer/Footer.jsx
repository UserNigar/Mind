import React, { useState } from "react";
import { Link } from "react-router-dom";  // react-router link
import "./Footer.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const navItems = [
  { label: "Home", Icon: HomeOutlinedIcon, to: "/article" },
  { label: "Profile", Icon: PersonOutlineIcon, to: "/profile" },
  { label: "Share", Icon: ControlPointIcon, to: "/share" },
  { label: "Messages", Icon: ChatBubbleOutlineIcon, to: "/chat" },
  { label: "Settings", Icon: SettingsOutlinedIcon, to: "/myarticle" },
];

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const iconSize = 80;

  return (
    <nav className="navigation" aria-label="Footer navigation">
      <ul>
        {navItems.map(({ label, Icon, to }, index) => (
          <li
            key={label}
            className={`list ${activeIndex === index ? "active" : ""}`}
          >
            <Link
              to={to}
              onClick={() => setActiveIndex(index)}
              aria-current={activeIndex === index ? "page" : undefined}
              className="nav-button"
            >
              <span className="icon">
                <Icon sx={{ fontSize: iconSize }} />
              </span>
              <span className="text">{label}</span>
            </Link>
          </li>
        ))}

        <div
          className="indicator"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
      </ul>
    </nav>
  );
};

export default Footer;
