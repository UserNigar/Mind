import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../../../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, User, Lock, LogIn, CheckCircle, XCircle } from 'lucide-react';
import logologin from "../../../assets/mylogo2.png";


const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-3"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `pulse ${Math.random() * 3 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};


const MessageModal = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${bgColor} text-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center transform transition-all duration-500 ease-out`}>
        <div className="flex items-center justify-center mb-4">
          <Icon size={40} />
        </div>
        <h3 className="text-xl font-semibold mb-4">
          {type === 'success' ? 'Uğurlu!' : 'Xəta!'}
        </h3>
        <p className="mb-6 text-base opacity-90">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white text-gray-800 font-medium rounded-full transition-colors duration-300 shadow-sm"
        >
          Bağla
        </button>
      </div>
    </div>
  );
};

const Login = ({ darkmode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [token, setToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await dispatch(loginUser(formData));

    const payload = result.payload;

    if (result.meta.requestStatus === 'fulfilled') {
      if (payload.user?.isBlocked) {
        setModalMessage('Sizin istifadəçinizə məhdudiyyət qoyulub!');
        setModalType('error');
        setShowModal(true);
        return;
      }

      const userToken = payload.token;
      localStorage.setItem('token', userToken);
      setToken(userToken);

      const decoded = jwtDecode(userToken);
      const timeLeft = decoded.exp * 1000 - Date.now();

      setTimeout(() => {
        dispatch(logoutUser());
        localStorage.removeItem('token');
        setModalMessage("Sessiya vaxtı bitdi! Zəhmət olmasa yenidən daxil olun.");
        setModalType('error');
        setShowModal(true);
        navigate('/login');
      }, timeLeft);

      setModalMessage('Uğurla daxil oldunuz!');
      setModalType('success');
      setShowModal(true);
      navigate('/profile');
    } else {
      setModalMessage(payload?.message || 'İstifadəçi adı və ya şifrə yanlışdır!');
      setModalType('error');
      setShowModal(true);
    }
  } catch (err) {
    console.error("Login error:", err);
    setModalMessage('Daxil olarkən bir xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    setModalType('error');
    setShowModal(true);
  }
};


  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <section
      id='login-card'
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden
        ${darkmode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'} 
        transition-all duration-700 ease-out`}
    >
      <AnimatedBackground />
      

      <button
        onClick={() => setDarkMode(!darkmode)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-md transition-all duration-500 ease-out z-40 ${
          darkmode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'
        }`}
      >
        {darkmode ? '☀️' : '🌙'}
      </button>

      <div className={`flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8 p-8 rounded-3xl shadow-lg backdrop-blur-md border transition-all duration-700 ease-out ${
        darkmode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/30'
      }`}>


        <div className="login-logo flex-shrink-0 mb-8 lg:mb-0 lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur-xl opacity-20"></div>
            <img
              src={logologin}
              alt="logo"
              className="relative h-auto max-h-[350px] w-full max-w-md object-contain rounded-xl shadow-lg transition-all duration-500 ease-out"
            />
          </div>
        </div>


        <div className={`card-login w-full lg:w-1/2 p-8 rounded-2xl text-center transition-all duration-700 ease-out ${
          darkmode ? 'bg-gray-700/60 text-white' : 'bg-white/70 text-gray-800'
        } shadow-md border backdrop-blur-sm ${
          darkmode ? 'border-gray-600' : 'border-white/40'
        }`}>
          

          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <User size={28} className="text-white" />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${
              darkmode ? 'text-white' : 'text-gray-800'
            }`}>
              Salam, Xoş gəlmisiniz 👋🏻
            </h2>
            <p className={`text-base ${darkmode ? 'text-gray-300' : 'text-gray-600'}`}>
              Hesabınıza daxil olun
            </p>
          </div>

          <form className="card-logindetail flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="username"
                placeholder='İstifadəçi adınızı daxil edin'
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base transition-all duration-500 ease-out shadow-sm focus:outline-none focus:ring-0 ${
                  darkmode 
                    ? 'bg-gray-800/40 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white/60 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400'
                } ${formData.username ? 'border-green-300' : ''}`}
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='Şifrənizi daxil edin'
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl text-base transition-all duration-500 ease-out shadow-sm focus:outline-none focus:ring-0 ${
                  darkmode 
                    ? 'bg-gray-800/40 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white/60 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400'
                } ${formData.password ? 'border-green-300' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>


            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-3 rounded-xl font-semibold text-white text-base transition-all duration-500 ease-out flex items-center justify-center space-x-2 shadow-md ${
                status === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Yüklənir...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Daxil ol</span>
                </>
              )}
            </button>
          </form>

          {token && (
            <div className={`token-box mt-6 text-left p-4 rounded-xl border shadow-sm transition-all duration-500 ease-out ${
              darkmode ? 'bg-gray-800/40 border-gray-600' : 'bg-gray-50/60 border-gray-200'
            }`}>
              <h3 className={`text-sm font-medium mb-2 ${
                darkmode ? 'text-gray-300' : 'text-gray-700'
              }`}>Token:</h3>
              <textarea
                readOnly
                value={token}
                className={`w-full h-20 p-3 text-sm rounded-lg border resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-300 ${
                  darkmode 
                    ? 'bg-gray-900/50 border-gray-700 text-gray-200' 
                    : 'bg-white/70 border-gray-300 text-gray-800'
                }`}
              />
            </div>
          )}

          {error && !showModal && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">Xəta: {error}</p>
            </div>
          )}

          <div className="mt-6">
            <p className={`text-sm mb-3 ${darkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              Hesabınız yoxdur?
            </p>
            <a
              href="/register"
              className={`inline-block px-6 py-2 rounded-full border font-medium transition-all duration-500 ease-out ${
                darkmode 
                  ? 'border-gray-600 text-gray-300' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              Qeydiyyat
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <MessageModal
          message={modalMessage}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default Login;