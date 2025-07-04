import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../Redux/UserSlice";
import { Menu, MenuItem, MenuButton, Dropdown } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Navbar = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuOpen(false);
     navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const LinkBehavior = React.forwardRef(function LinkBehavior(props, ref) {
    return <Link ref={ref} {...props} />;
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-9950 h-[80px] ${darkMode
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-white text-gray-800 border-b border-gray-200"
        } w-full`}
    >
      <div className="max-w-7xl mx-auto h-full px-4">
        <div className="flex justify-between items-center h-full">
          {/* Sol tərəf: Geri və Loqo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.length > 1 && navigate(-1)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              aria-label="Geri"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${darkMode
                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
              >
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span
                className={`text-xl font-bold hidden sm:block bg-clip-text text-transparent ${darkMode
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  }`}
              >
                LooplY
              </span>
            </Link>
          </div>

          {/* Sağ tərəf */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all duration-300 ${darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </button>

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <Dropdown>
                <MenuButton
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  <PersonIcon />
                  <span>{currentUser ? currentUser.username : "Daxil ol"}</span>
                </MenuButton>
                <Menu
                  className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
                  sx={{
                    ".MuiList-root": {
                      paddingTop: 0,
                      paddingBottom: 0,
                      "& .MuiMenuItem-root": {
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        minHeight: "36px",
                      },
                    },
                    ".MuiPaper-root": {
                      minWidth: "180px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    },
                  }}
                >
                  {!currentUser ? (
                    <>
                      <MenuItem>
                        <Link to="/register" component={LinkBehavior} className="flex gap-2">
                          <AppRegistrationIcon />
                          <span>Qeydiyyat</span>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/login" component={LinkBehavior} className="flex gap-2">
                          <LoginIcon />
                          <span>Daxil ol</span>
                        </Link>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      {currentUser.role === "admin" && (
                        <MenuItem>
                          <Link to="/admin" component={LinkBehavior} className="flex gap-2">
                            <AdminPanelSettingsIcon />
                            <span>Admin Panel</span>
                          </Link>
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogout} className="text-red-600 z-999099">
                        <LogoutIcon />
                        <span>Çıxış</span>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Dropdown>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-xl ${darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 py-2 border-t ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
            }`}
        >
          {!currentUser ? (
            <>
              <Link to="/register" onClick={toggleMobileMenu} className="block py-2">
                Qeydiyyat
              </Link>
              <Link to="/login" onClick={toggleMobileMenu} className="block py-2">
                Daxil ol
              </Link>
            </>
          ) : (
            <>
              {currentUser.role === "admin" && (
                <Link to="/admin" onClick={toggleMobileMenu} className="block py-2">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();

                }}
                className="block text-left text-red-600 py-2 w-full"
              >
                <Link to="/login" onClick={toggleMobileMenu}>
                  Çıxış
                </Link>
              </button>

            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
