import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import images from "../../../assets/Illustration@2x.png";
import { deleteArticle, fetchMyArticles } from "../../../Redux/ArticleSlice";
import { updateUser, getUsers } from "../../../Redux/UserSlice"; // getUsers əlavə et
import { followUser, unfollowUser, fetchFollowData } from "../../../Redux/FollowersSlice";

const EditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);

  // Bütün istifadəçilər siyahısı
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.users.currentUser);

  // Form məlumatları (bütün sahələr üçün)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
  });

  // Yeni username istifadə edilə bilər yoxsa yox - state
  const [usernameTaken, setUsernameTaken] = useState(false);

  useEffect(() => {
    // İstifadəçiləri gətir (yalnız bir dəfə və ya lazım olduqda)
    dispatch(getUsers());
  }, [dispatch]);

  // currentUser və users dəyişdikdə formu doldur və username yoxla
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        name: currentUser.name || "",
        surname: currentUser.surname || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  // username dəyişəndə yoxlama apar
  useEffect(() => {
    if (!formData.username) {
      setUsernameTaken(false);
      return;
    }
    // currentUser-un öz username-i çıxmaq şərtilə digər istifadəçilərin username-ləri ilə müqayisə
    const isTaken = users.some(
      (user) =>
        user.username.toLowerCase() === formData.username.toLowerCase() &&
        user._id !== currentUser?._id
    );
    setUsernameTaken(isTaken);
  }, [formData.username, users, currentUser]);

  // Input dəyişəndə
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit edəndə bütün sahələri göndər
  const handleSubmit = (e) => {
    e.preventDefault();

    if (usernameTaken) {
      toast.error("Bu istifadəçi adı artıq mövcuddur!");
      return;
    }

    const updatedData = {
      username: formData.username,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    };

    dispatch(updateUser({ id: currentUser._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Məlumatlar uğurla yeniləndi");
      })
      .catch(() => {
        toast.error("Məlumatlar yenilənərkən xəta baş verdi");
      });
  };

  // Şəkil dəyişmə funksiyası
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

          {/* İndi bütün sahələr üçün ümumi form */}
          <form onSubmit={handleSubmit} className="edit-form mt-3" noValidate>
            {["username", "name", "surname", "email"].map((field) => (
              <div className="form-group mb-2 position-relative" key={field}>
                <label htmlFor={field} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  className="form-control"
                  value={formData[field]}
                  onChange={handleInputChange}
                  style={field === "username" && usernameTaken ? { borderColor: "red" } : {}}
                />
                {/* Username sahəsində problem varsa "x" göstərin */}
                {field === "username" && usernameTaken && (
                  <span
                    style={{
                      color: "red",
                      position: "absolute",
                      right: "10px",
                      top: "35px",
                      fontWeight: "bold",
                      cursor: "default",
                    }}
                    title="Bu istifadəçi adı artıq mövcuddur!"
                  >
                    ×
                  </span>
                )}
              </div>
            ))}

            <button type="submit" className="btn btn-primary mt-2" disabled={usernameTaken}>
              Yadda saxla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
