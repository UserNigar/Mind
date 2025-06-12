// RegisterForm.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUsers, getUsers } from '../../../Redux/UserSlice';

const RegisterForm = () => {
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

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  console.log(users);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usernameExists = users.some((user) => user?.username === formData.username);
    const emailExists = users.some((user) => user?.email === formData.email);

    if (usernameExists || emailExists) {
      alert('Username və ya email artıq mövcuddur!');
      return;
    }

    const newUser = new FormData();
    newUser.append('id', Date.now());
    newUser.append('username', formData.username);
    newUser.append('name', formData.name);
    newUser.append('surname', formData.surname);
    newUser.append('email', formData.email);
    newUser.append('password', formData.password);
    newUser.append('photo', formData.photo);

    dispatch(createUsers(newUser));
    alert('Qeydiyyat uğurla tamamlandı!');
  };

  return (
    <div className="card register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
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
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <a href="/sign-in">Login</a>
    </div>
  );
};

export default RegisterForm;
