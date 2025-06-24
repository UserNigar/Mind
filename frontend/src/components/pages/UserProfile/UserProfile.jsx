import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import images from "../../../assets/Illustration@2x.png";
import "./UserProfile.scss";
import { deleteArticle, fetchMyArticles } from "../../../Redux/ArticleSlice";
import { updateUser } from "../../../Redux/UserSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const { myArticles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [editMode, setEditMode] = useState({
    username: false,
    name: false,
    surname: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    name: currentUser?.name || "",
    surname: currentUser?.surname || "",
    email: currentUser?.email || "",
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyArticles());
    }
  }, [dispatch, currentUser]);

  const handleDelete = (id) => {
    if (window.confirm("Bu məqaləni silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteArticle(id));
    }
  };

  const handlePhotoChange = () => {
    const file = photoInputRef.current.files[0];
    if (!file) {
      toast.error("Zəhmət olmasa şəkil seçin!");
      return;
    }

    const form = new FormData();
    form.append("photo", file);

    dispatch(updateUser({ id: currentUser._id, updatedData: form }))
      .unwrap()
      .then(() => toast.success("Şəkil uğurla yeniləndi"))
      .catch((err) => {
        toast.error(err?.message || "Xəta baş verdi");
      });
  };

  const handleEditClick = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field) => {
    const updatedData = { [field]: formData[field] };

    dispatch(updateUser({ id: currentUser._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success(`${field} uğurla yeniləndi`);
        setEditMode((prev) => ({ ...prev, [field]: false }));
      })
      .catch((err) => {
        toast.error(err?.message || `${field} yenilənərkən xəta baş verdi`);
      });
  };

  const handleCancel = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: currentUser[field] || "",
    }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  const renderEditableField = (field, label) => (
    <div className="editable-field">
      <p><strong>{label}:</strong></p>
      {!editMode[field] ? (
        <>
          <p>{formData[field] || "—"}</p>
          <button onClick={() => handleEditClick(field)}>Edit</button>
        </>
      ) : (
        <>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
          />
          <button onClick={() => handleSave(field)}>Save</button>
          <button onClick={() => handleCancel(field)}>Cancel</button>
        </>
      )}
    </div>
  );

  if (!currentUser) {
    return (
      <section id="userControl">
        <div className="userControl">
          <div className="imageinlogin">
            <img src={images} alt="" className="img" />
          </div>
          <div className="usercontrol-text">
            <div className="mini-us-text">
              <p>
                Platformamızın sizə təqdim etdiyi yeniliklərdən xəbərdar olmaq,
                öz fikirlərinizi paylaşmaq və maraqlı insanlarla tanış olmaq üçün indi qeydiyyatdan keçin!
                <br /> İcmanın bir parçası olun və səsiniz eşidilsin 🌟
              </p>
            </div>
            <div className="us-button">
              <button onClick={() => navigate("/login")}>Daxil ol</button>
              <button onClick={() => navigate("/register")}>Qeydiyyat</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="container">
      <div className="profile">
        <h2>İstifadəçi Məlumatları</h2>
        <div className="user-info">
          <img
            src={
              currentUser.photo
                ? `http://localhost:5050/photos/${currentUser.photo}`
                : "/default-profile.png"
            }
            alt={currentUser.username}
            className="user-photo"
          />
          <input type="file" ref={photoInputRef} className="form-control mt-2" />
          <button onClick={handlePhotoChange}>Şəkli dəyiş</button>

          <div className="editable-fields">
            {renderEditableField("username", "İstifadəçi adı")}
            {renderEditableField("name", "Ad")}
            {renderEditableField("surname", "Soyad")}
            {renderEditableField("email", "Email")}
          </div>
        </div>
      </div>

      <div className="articles">
        <h2>Öz Məqalələrim</h2>
        {loading ? (
          <p>Yüklənir...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : myArticles.length === 0 ? (
          <p>Heç bir məqaləniz yoxdur.</p>
        ) : (
          myArticles.map((article) => (
            <div key={article._id} className="article-card">
              <h3>{article.title}</h3>
              <p>{article.content}</p>
              <div className="article-footer">
                <div className="author">
                  <img
                    src={
                      article.author?.photo
                        ? `http://localhost:5050/photos/${article.author.photo}`
                        : "/default-profile.png"
                    }
                    alt={article.author?.username || "İstifadəçi"}
                    className="author-photo"
                  />
                  <span>{article.author?.username || "İstifadəçi"}</span>
                </div>
                <button className="delete-button" onClick={() => handleDelete(article._id)}>
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="new-article">
        <h2>Yeni Məqalə Yarat</h2>
        <input type="text" placeholder="Məqalə başlığı" />
        <textarea placeholder="Məqalə məzmunu"></textarea>
        <button className="submit-button">Paylaş</button>
      </div>
    </div>
  );
};

export default UserProfile;
