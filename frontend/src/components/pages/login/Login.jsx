import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../../../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
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

        // Tokeni saxla
        localStorage.setItem('token', userToken);
        setToken(userToken);

        // Tokeni decode et və vaxtını tap
        const decoded = jwtDecode(userToken);
        const expiresAt = decoded.exp * 1000; // exp saniyə ilədir, millisekunda çevir
        const now = Date.now();
        const timeLeft = expiresAt - now;

        console.log("Token vaxtı qalan saniyə:", Math.floor(timeLeft / 1000));

        // Token vaxtı bitdikdə logout et
        setTimeout(() => {
          dispatch(logoutUser());
          localStorage.removeItem('token');
          alert("Sessiya vaxtı bitdi!");
          navigate('/login');
        }, timeLeft);

        alert('Uğurla daxil oldunuz!');
        navigate('/');
      } else {
        alert('İstifadəçi adı və ya şifrə yanlışdır!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Yüklənir...' : 'Login'}
        </button>
      </form>

      {token && (
        <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>
          <h3>Token:</h3>
          <textarea
            readOnly
            style={{ width: '100%', height: '100px' }}
            value={token}
          />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Xəta: {error}</p>}
      <a href="/register">Qeydiyyat</a>
    </div>
  );
};

export default Login;
