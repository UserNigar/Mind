import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../../../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logologin from "../../../assets/mylogo2.png"; // Ensure this path is correct

// MessageModal Component - Replaces alert() for better UX
const MessageModal = ({ message, type, onClose }) => {
  // Determine background and text color based on message type
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const textColor = 'text-white';

  return (
      // Overlay for the modal, covers the entire screen
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className={`p-8 rounded-xl shadow-2xl ${bgColor} ${textColor} max-w-md w-full text-center transform transition-all duration-300 scale-100 opacity-100`}>
          {/* Modal title based on type */}
          <h3 className="text-2xl font-bold mb-4">
            {type === 'success' ? 'Success!' : 'Error!'}
          </h3>
          {/* Message content */}
          <p className="mb-6 text-lg">{message}</p>
          {/* Close button */}
          <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
  );
};

const Login = ({ darkmode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Destructure status and error from the Redux state
  const { status, error } = useSelector((state) => state.users);

  // State for form input data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State to store the token (if available)
  const [token, setToken] = useState('');

  // State for managing the custom message modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Dispatch the loginUser action
      const result = await dispatch(loginUser(formData));

      // Check if the login was successful
      if (result.meta.requestStatus === 'fulfilled') {
        const userToken = result.payload.token;
        localStorage.setItem('token', userToken); // Store token in local storage
        setToken(userToken); // Update token state

        // Decode the JWT token to get expiration time
        const decoded = jwtDecode(userToken);
        const timeLeft = decoded.exp * 1000 - Date.now(); // Time left until token expires

        // Set a timeout to log out the user when the session expires
        setTimeout(() => {
          dispatch(logoutUser()); // Dispatch logout action
          localStorage.removeItem('token'); // Remove token from local storage
          // Show session timeout message
          setModalMessage("Sessiya vaxtı bitdi! Zəhmət olmasa yenidən daxil olun.");
          setModalType('error');
          setShowModal(true);
          navigate('/login'); // Redirect to login page
        }, timeLeft);

        // Show success message
        setModalMessage('Uğurla daxil oldunuz!');
        setModalType('success');
        setShowModal(true);
        navigate('/profile'); // Redirect to profile page
      } else {
        // Show error message if login failed
        setModalMessage('İstifadəçi adı və ya şifrə yanlışdır!');
        setModalType('error');
        setShowModal(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      // Show generic error message for unexpected errors
      setModalMessage('Daxil olarkən bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      setModalType('error');
      setShowModal(true);
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
      // Main section for the login page, adapts to dark/light mode
      <section
          id='login-card'
          className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 
        ${darkmode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} 
        transition-colors duration-300 ease-in-out`}
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 p-6 rounded-3xl shadow-xl
        ${darkmode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300 ease-in-out">

          {/* Login Logo Section */}
          <div className="login-logo flex-shrink-0 mb-8 md:mb-0 md:w-1/2 flex justify-center">
            <img
                src={logologin}
                alt="logo"
                className="h-auto max-h-[400px] w-full max-w-md object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Login Form Card */}
          <div className="card-login w-full md:w-1/2 p-8 rounded-2xl text-center
          ${darkmode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} shadow-lg border border-gray-200 dark:border-gray-600">
            <h2 className="text-4xl font-extrabold mb-8
            ${darkmode ? 'text-white' : 'text-gray-800'}">
              Salam, Xoş gəlmisiniz 👋🏻
            </h2>
            <form className="card-logindetail flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Username Input */}
              <input
                  type="text"
                  name="username"
                  placeholder='İstifadəçi adınızı daxil edin'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="p-3 px-5 border border-gray-300 rounded-full bg-gray-50 text-base
                transition-all duration-300 ease-in-out shadow-sm
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {/* Password Input */}
              <input
                  type="password"
                  name="password"
                  placeholder='Şifrənizi daxil edin'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="p-3 px-5 border border-gray-300 rounded-full bg-gray-50 text-base
                transition-all duration-300 ease-in-out shadow-sm
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="p-3 rounded-full bg-green-500 text-white text-lg font-semibold cursor-pointer
                transition-all duration-300 ease-in-out hover:bg-green-600
                disabled:bg-green-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {status === 'loading' ? 'Yüklənir...' : 'Login'}
              </button>
            </form>

            {/* Token Display (Optional) */}
            {token && (
                <div className="token-box mt-6 text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner">
                  <h3 className="text-sm font-medium mb-2
                ${darkmode ? 'text-gray-300' : 'text-gray-700'}">Token:</h3>
                  <textarea
                      readOnly
                      value={token}
                      className="w-full h-24 p-3 text-sm rounded-lg border border-gray-300 resize-none
                  bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200
                  focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
            )}

            {/* Error Message Display (handled by modal now, but kept for direct display if needed) */}
            {error && !showModal && ( // Only show if modal is not active
                <p className="error text-red-500 mt-4 text-sm font-medium">Xəta: {error}</p>
            )}

            {/* Registration Link */}
            <a
                href="/register"
                className="block mt-6 text-base font-medium no-underline
              transition-colors duration-200 hover:text-green-600 hover:underline
              ${darkmode ? 'text-gray-300' : 'text-gray-700'}"
            >
              Qeydiyyat
            </a>
          </div>
        </div>

        {/* Render the MessageModal if showModal is true */}
        {showModal && (
            <MessageModal
                message={modalMessage}
                type={modalType}
                onClose={handleCloseModal}
            />
        )}
      </section>
  );
};

export default Login;
