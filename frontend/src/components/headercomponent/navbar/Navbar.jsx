import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../Redux/UserSlice";
import { Menu, MenuItem, MenuButton, Dropdown } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import mainlogo from "../../../assets/logo.png";

const Navbar = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  console.log(currentUser);
  

  const LinkBehavior = React.forwardRef(function LinkBehavior(props, ref) {
    return <Link ref={ref} {...props} />;
  });

  return (
    <nav className={`fixed top-0 w-full z-999 px-6 py-4 flex items-center justify-around shadow-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      {/* Sol - Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={mainlogo} alt="Logo" className="h-10 w-auto object-contain" />
      </Link>

      {/* Sağ - Dark mode + User */}
      <div className="flex items-center gap-4">
        {/* 🌙 Toggle */}


        {/* 👤 User menyusu */}
        <Dropdown>
          <MenuButton className="flex items-center px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <PersonIcon fontSize="small" className="mr-1" />
            {currentUser ? currentUser.username : "Sign in..."}
          </MenuButton>
          <Menu>
  {!currentUser ? (
    <>
      <MenuItem component={LinkBehavior} to="/register" className="text-sm">Qeydiyyat</MenuItem>
      <MenuItem component={LinkBehavior} to="/login" className="text-sm">Daxil ol</MenuItem>
    </>
  ) : (
    <>
      {currentUser.role === "admin" && (
        <MenuItem component={LinkBehavior} to="/admin" className="text-sm">
          Admin Panel
        </MenuItem>
      )}
      <MenuItem component={LinkBehavior} to="/profile" className="text-sm">Profil</MenuItem>
      <MenuItem component={LinkBehavior} to="/chat" className="text-sm">Söhbət</MenuItem>
      <MenuItem onClick={handleLogout} component={LinkBehavior} to="/login" className="text-sm">Çıxış</MenuItem>
    </>
  )}
</Menu>

        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
