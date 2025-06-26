import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";  // useLocation əlavə edildi
import "./Footer.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// Naviqasiya itemləri
const navItems = [
  { label: "Home", Icon: HomeOutlinedIcon, to: "/article" },
  { label: "Profile", Icon: PersonOutlineIcon, to: "/profile" },
  { label: "Share", Icon: ControlPointIcon, to: "/share" },
  { label: "Messages", Icon: ChatBubbleOutlineIcon, to: "/chat" },
  { label: "Settings", Icon: SettingsOutlinedIcon, to: "/myarticle" },
];

const Footer = () => {
  const location = useLocation(); // aktiv routu almaq üçün
  const [activeIndex, setActiveIndex] = useState(0);
  const iconSize = 23;

  useEffect(() => {
    const currentIndex = navItems.findIndex((item) =>
      location.pathname.startsWith(item.to)
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

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
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            width: `${100 / navItems.length}%`,
          }}
          aria-hidden="true"
        />
      </ul>
    </nav>
  );
};

export default Footer;
