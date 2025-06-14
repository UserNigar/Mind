import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUser } from '../../../Redux/UserSlice';

const UserProfile = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const photoInputRef = useRef(null);

  // Inline edit üçün state-lər
  const [editMode, setEditMode] = useState({
    username: false,
    name: false,
    surname: false,
    email: false,
  });

  // Form məlumatları
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    email: currentUser?.email || '',
  });

  if (!currentUser) {
    return (
      <div className="card profile">
        <h2>Profil</h2>
        <p style={{ color: 'red' }}>Please login to view your profile.</p>
      </div>
    );
  }

  // Şəkil dəyişmə funksiyası
  const handlePhotoChange = () => {
    const file = photoInputRef.current.files[0];
    if (!file) {
      toast.error('Zəhmət olmasa şəkil seçin!');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    dispatch(updateUser({ id: currentUser._id, updatedData: formData }))
      .unwrap()
      .then(() => {
        toast.success('Şəkil uğurla yeniləndi');
      })
      .catch((error) => {
        let message = 'Şəkil yenilənərkən xəta baş verdi';
        if (typeof error === 'string') {
          message = error;
        } else if (error && typeof error.message === 'string') {
          message = error.message;
        }
        toast.error(message);
      });
  };

  // Edit düyməsinə basanda edit rejimini açır
  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  // Dəyişiklik zamanı input dəyərlərini yadda saxlayır
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dəyişiklikləri yadda saxla
  const handleSave = (field) => {
    const updatedData = { [field]: formData[field] };

    dispatch(updateUser({ id: currentUser._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success(`${field} uğurla yeniləndi`);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      })
      .catch((error) => {
        let message = `${field} yenilənərkən xəta baş verdi`;
        if (typeof error === 'string') {
          message = error;
        } else if (error && typeof error.message === 'string') {
          message = error.message;
        }
        toast.error(message);
      });
  };

  // Edit rejimini ləğv et və əvvəlki dəyəri bərpa et
  const handleCancel = (field) => {
    setFormData((prev) => ({ ...prev, [field]: currentUser[field] || '' }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  // Render üçün köməkçi komponent
  const renderEditableField = (field, label) => (
    <div className="border p-2 mb-3">
      <p>{label}:</p>
      {!editMode[field] ? (
        <>
          <h5 className="card-title">{formData[field] || '—'}</h5>
          <button
            className="btn btn-primary"
            onClick={() => handleEditClick(field)}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <button
            className="btn btn-success me-2"
            onClick={() => handleSave(field)}
          >
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleCancel(field)}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="container mt-5 page">
      <h3>Personal Information</h3>
      <div className="card bg-dark text-white p-3">
        <img
          src={`http://localhost:5050/photos/${currentUser.photo}`}
          alt="Profile"
          className="profile-photo"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <input
          type="file"
          id="photoInp"
          name="photo"
          className="form-control mt-2"
          ref={photoInputRef}
        />
        <button
          className="btn btn-primary w-25 mt-2"
          id="changePhotoBtn"
          onClick={handlePhotoChange}
        >
          Change Photo
        </button>

        <div className="card-body">
          {renderEditableField('username', 'Username')}
          {renderEditableField('name', 'Name')}
          {renderEditableField('surname', 'Surname')}
          {renderEditableField('email', 'Email')}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
