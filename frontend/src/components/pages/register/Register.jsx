import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUsers, getUsers } from '../../../Redux/UserSlice';
import { User, Mail, Lock, ImagePlus, CheckCircle, XCircle } from 'lucide-react';
import logoregister from "../../../assets/mylogo2.png";


const AnimatedBackground = () => (
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


const MessageModal = ({ message, type, onClose }) => {
  const bgColor = type === 'success'
    ? 'bg-gradient-to-r from-green-400 to-green-500'
    : 'bg-gradient-to-r from-red-400 to-red-500';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${bgColor} text-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center`}>
        <div className="flex items-center justify-center mb-4">
          <Icon size={40} />
        </div>
        <h3 className="text-xl font-semibold mb-4">
          {type === 'success' ? 'Uğurlu!' : 'Xəta!'}
        </h3>
        <p className="mb-6 text-base opacity-90">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white text-gray-800 font-medium rounded-full"
        >
          Bağla
        </button>
      </div>
    </div>
  );
};

const RegisterForm = ({ darkmode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users?.users ?? []);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    photo: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'photo' ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usernameExists = users.some((u) => u?.username === formData.username);
    const emailExists = users.some((u) => u?.email === formData.email);

    if (usernameExists || emailExists) {
      setModalMessage("Username və ya email artıq mövcuddur!");
      setModalType("error");
      setShowModal(true);
      return;
    }

    const newUser = new FormData();
    Object.entries(formData).forEach(([key, value]) => newUser.append(key, value));
    newUser.append("id", Date.now());

    dispatch(createUsers(newUser));
    setModalMessage("Qeydiyyat uğurla tamamlandı!");
    setModalType("success");
    setShowModal(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <section
      id="register-card"
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden 
        ${darkmode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} 
        transition-all duration-700 ease-out`}
    >
      <AnimatedBackground />

      <div className={`flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8 p-8 rounded-3xl shadow-lg backdrop-blur-md border transition-all duration-700 ease-out ${
        darkmode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-white/30'
      }`}>
        

        <div className="flex-shrink-0 lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur-xl opacity-20"></div>
            <img
              src={logoregister}
              alt="Register logo"
              className="relative h-auto max-h-[350px] w-full max-w-md object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>


        <div className={`lg:w-1/2 p-8 rounded-2xl text-center shadow-md border backdrop-blur-sm ${
          darkmode ? 'bg-gray-700/60 text-white border-gray-600' : 'bg-white/70 text-gray-800 border-white/40'
        }`}>
          <h2 className="text-3xl font-bold mb-6">Qeydiyyat</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-5 text-left">
            {[
              { name: 'username', type: 'text', placeholder: 'İstifadəçi adı', icon: <User size={18} /> },
              { name: 'name', type: 'text', placeholder: 'Ad', icon: <User size={18} /> },
              { name: 'surname', type: 'text', placeholder: 'Soyad', icon: <User size={18} /> },
              { name: 'email', type: 'email', placeholder: 'Email', icon: <Mail size={18} /> },
              { name: 'password', type: 'password', placeholder: 'Şifrə', icon: <Lock size={18} /> }
            ].map((field) => (
              <div className="relative" key={field.name}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">{field.icon}</div>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base transition-all duration-300 shadow-sm focus:outline-none focus:border-blue-400 ${
                    darkmode
                      ? 'bg-gray-800/40 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white/60 border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                />
              </div>
            ))}

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <ImagePlus size={18} />
              </div>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer transition-all ${
                  darkmode ? 'bg-gray-800/40 border-gray-600 text-white' : 'bg-white/60 border-gray-200 text-gray-800'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl transition-all shadow-md"
            >
              Qeydiyyatdan keç
            </button>
          </form>

          <p className={`mt-6 text-sm ${darkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            Artıq hesabınız var?
            <a href="/login" className="ml-2 underline hover:text-blue-500">Daxil olun</a>
          </p>
        </div>
      </div>

      {showModal && (
        <MessageModal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default RegisterForm;
