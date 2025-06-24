import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../../../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./Login.scss";
import logologin from "../../../assets/mylogo2.png";

const Login = ({ darkmode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [token, setToken] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        const userToken = result.payload.token;
        localStorage.setItem('token', userToken);
        setToken(userToken);

        const decoded = jwtDecode(userToken);
        const timeLeft = decoded.exp * 1000 - Date.now();

        setTimeout(() => {
          dispatch(logoutUser());
          localStorage.removeItem('token');
          alert("Sessiya vaxtı bitdi!");
          navigate('/login');
        }, timeLeft);

        alert('Uğurla daxil oldunuz!');
        navigate('/profile');
      } else {
        alert('İstifadəçi adı və ya şifrə yanlışdır!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id='login-card' className={darkmode ? 'dark' : 'ligth'}>
     <div className="login-item">
       <div className="login-logo">
        <img src={logologin} alt="logo" />
      </div>
      <div className="card-login">
        <h2>Salam , Xoş gəlmisiniz👋🏻</h2>
        <form className="card-logindetail" onSubmit={handleSubmit}>
          <input
           type="text"
            name="username"
            placeholder='Istifadeci adinizi daxil edin'
             value={formData.username}
              onChange={handleChange}
               required />
          <input type="password" name="password"
          placeholder='Sifrenizi daxil edin' value={formData.password} onChange={handleChange} required />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Yüklənir...' : 'Login'}
          </button>
        </form>

        {token && (
          <div className="token-box">
            <h3>Token:</h3>
            <textarea readOnly value={token} />
          </div>
        )}

        {error && <p className="error">Xəta: {error}</p>}
        <a href="/register">Qeydiyyat</a>
      </div>
     </div>
    </section>
  );
};

export default Login;
