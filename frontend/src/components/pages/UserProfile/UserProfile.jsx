import React, { useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import { useNavigate } from "react-router-dom";
import images from "../../../assets/Illustration@2x.png"
import "./UserProfile.scss";
import { deleteArticle, fetchMyArticles } from "../../../Redux/ArticleSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { myArticles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);

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

  if (!currentUser) {
    return (
      <>
        <section id="userControl">
          <div className="userControl">
            <div className="imageinlogin">
              <img src={images} alt="" className="img" />
            </div>
            <div className="usercontrol-text">
              <div className="mini-us-text">
                <p>
                  Platformamızın sizə təqdim etdiyi yeniliklərdən xəbərdar olmaq, öz fikirlərinizi paylaşmaq və maraqlı insanlarla tanış olmaq üçün indi qeydiyyatdan keçin!
<br /> İcmanın bir parçası olun və səsiniz eşidilsin 🌟
                </p>
              </div>
              <div className="us-button">
                <button onClick={()=>navigate("/login")}>ewfwe</button>
                <button>wefesw</button>
              </div>

            </div>
          </div>
        </section>
      </>
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
          <div>
            <p><strong>İstifadəçi:</strong> {currentUser.username}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
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
