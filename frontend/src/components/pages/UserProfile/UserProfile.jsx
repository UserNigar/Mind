import React, { useRef } from 'react';
import { useSelector } from 'react-redux';


const UserProfile = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const photoInputRef = useRef(null);

  if (!currentUser) {
    return (
      <div className="card profile">
        <h2>Profil</h2>
        <p style={{ color: 'red' }}>Please login to view your profile.</p>
      </div>
    );
  }
  console.log(currentUser.photo);
  

  return (
    <div className="container mt-5 page">
      <h3>Personal Information</h3>
      <div className="card bg-dark text-white p-3">
        <img
          src={`http://localhost:5050/photos/${currentUser.photo}`}
          alt=""
          className="profile-photo"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <input
          type="file"
          id="photoInp"
          name="avatar"
          className="form-control mt-2"
          ref={photoInputRef}
        />
        <button className="btn btn-primary w-25 mt-2" id="changePhotoBtn">
          Change Photo
        </button>

        <div className="card-body">
          <div className="border p-2 mb-3">
            <p>Username:</p>
            <h5 className="card-title">{currentUser.username}</h5>
            <button className="btn btn-primary" id="usernameEditBtn">Edit</button>
          </div>

          <div className="border p-2 mb-3">
            <p>Name:</p>
            <h5 className="card-title">{currentUser.name || '—'}</h5>
            <button className="btn btn-primary" id="nameEditBtn">Edit</button>
          </div>

          <div className="border p-2 mb-3">
            <p>Surname:</p>
            <h5 className="card-title">{currentUser.surname || '—'}</h5>
            <button className="btn btn-primary" id="surnameEditBtn">Edit</button>
          </div>

          <div className="border p-2">
            <p>Email:</p>
            <h5 className="card-title">{currentUser.email}</h5>
            <button className="btn btn-primary" id="emailEditBtn">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
