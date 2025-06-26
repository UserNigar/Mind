import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import images from "../../../assets/Illustration@2x.png";
import "./UserProfile.scss";
import { deleteArticle, fetchMyArticles } from "../../../Redux/ArticleSlice";
import { updateUser } from "../../../Redux/UserSlice";
import { followUser, unfollowUser, fetchFollowData } from "../../../Redux/FollowersSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const { myArticles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);
  const { followers, following, loading: followLoading } = useSelector((state) => state.follow);

  // Modal açılıb-bağlanması üçün state
  const [modalOpen, setModalOpen] = useState(false);
  // Edit edilən sahə
  const [editField, setEditField] = useState(null);
  // Form məlumatları modal üçün
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyArticles());
      dispatch(fetchFollowData(currentUser._id));
      setFormData({
        username: currentUser.username || "",
        name: currentUser.name || "",
        surname: currentUser.surname || "",
        email: currentUser.email || "",
      });
    }
  }, [dispatch, currentUser]);

  const openEditModal = (field) => {
    setEditField(field);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditField(null);
    // Formu cari istifadəçi məlumatı ilə yenilə (əgər redaktədən imtina edilibsə)
    setFormData({
      username: currentUser.username || "",
      name: currentUser.name || "",
      surname: currentUser.surname || "",
      email: currentUser.email || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editField) return;

    const updatedData = { [editField]: formData[editField] };

    dispatch(updateUser({ id: currentUser._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success(`${editField} uğurla yeniləndi`);
        closeModal();
      })
      .catch(() => {
        toast.error(`${editField} yenilənərkən xəta baş verdi`);
      });
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
      .catch(() => toast.error("Xəta baş verdi"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu məqaləni silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteArticle(id));
    }
  };

  const handleFollow = (userId) => {
    if (followLoading) return;
    dispatch(followUser(userId))
      .unwrap()
      .then(() => toast.success("İzləmə uğurla əlavə edildi"))
      .catch(() => toast.error("İzləmə zamanı xəta baş verdi"));
  };

  const handleUnfollow = (userId) => {
    if (followLoading) return;
    dispatch(unfollowUser(userId))
      .unwrap()
      .then(() => toast.success("İzləmədən çıxarıldı"))
      .catch(() => toast.error("İzləmədən çıxarılma zamanı xəta baş verdi"));
  };

  if (!currentUser) {
    return (
      <section id="userControl">
        <div className="userControl">
          <div className="imageinlogin">
            <img src={images} alt="" className="img" />
          </div>
          <div className="usercontrol-text">
            <p>
              Platformamızın yeniliklərindən xəbərdar olmaq və icmaya qoşulmaq üçün daxil olun və ya qeydiyyatdan keçin!
            </p>
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

          <div className="fields">
            {["username", "name", "surname", "email"].map((field) => (
              <div className="field" key={field}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                <span>{formData[field] || "—"}</span>{" "}
                <button onClick={() => openEditModal(field)}>Redaktə et</button>
              </div>
            ))}
          </div>

          <div className="follow-section">
            <h3>İzləyicilər ({followers.length})</h3>
            <ul>
              {followers.map((f) => (
                <li key={f._id}>
                  {f.username}{" "}
                  {following.some((u) => u._id === f._id) ? (
                    <button onClick={() => handleUnfollow(f._id)}>İzləmədən çıx</button>
                  ) : (
                    <button onClick={() => handleFollow(f._id)}>İzləyin</button>
                  )}
                </li>
              ))}
            </ul>

            <h3>İzlədiklərim ({following.length})</h3>
            <ul>
              {following.map((f) => (
                <li key={f._id}>
                  {f.username}{" "}
                  <button onClick={() => handleUnfollow(f._id)}>İzləmədən çıx</button>
                </li>
              ))}
            </ul>
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editField && `Redaktə et: ${editField.charAt(0).toUpperCase() + editField.slice(1)}`}</h3>
            <input
              type="text"
              name={editField}
              value={formData[editField] || ""}
              onChange={handleInputChange}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Yadda saxla</button>
              <button onClick={closeModal} className="cancel-btn">İmtina et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
