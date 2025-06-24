import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);

  const handleClick = (userId) => {
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/users/articles");
        setArticles(res.data);
      } catch (err) {
        setError("Məqalələr yüklənərkən xəta baş verdi");
        console.error(err);
      }
    };

    fetchArticles();
  }, []);

  const handleLike = async (articleId) => {
    if (!currentUser) {
      toast.warning("Əvvəlcə daxil olun!", { position: "top-center", autoClose: 2000 });
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5050/api/users/articles/${articleId}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setArticles((prev) =>
        prev.map((art) =>
          art._id === articleId
            ? { ...art, likes: Array.from({ length: res.data.likes }) }
            : art
        )
      );
    } catch (err) {
      toast.error("Bəyənmə zamanı xəta baş verdi", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const openCommentModal = (articleId) => {
    if (!currentUser) {
      toast.info("Əvvəlcə daxil olun!", { position: "top-center", autoClose: 2000 });
      return;
    }
    setSelectedArticleId(articleId);
    setShowModal(true);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5050/api/users/articles/${selectedArticleId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setArticles((prev) =>
        prev.map((art) =>
          art._id === selectedArticleId ? { ...art, comments: res.data.comments } : art
        )
      );

      setCommentText("");
      setShowModal(false);
      toast.success("Şərh əlavə olundu!", { autoClose: 2000 });
    } catch (err) {
      toast.error("Şərh əlavə olunarkən xəta baş verdi", { autoClose: 2000 });
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2>Məqalələr</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {articles.map((article) => (
        <div
          key={article._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{article.title}</h3>
          <p>{article.content}</p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {article.author?.photo && (
              <img
                src={`http://localhost:5050/photos/${article.author.photo}`}
                alt={article.author.username}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            )}
            <span
              onClick={() => handleClick(article.author?._id)}
              style={{ cursor: "pointer", color: "#4caf50" }}
            >
              {article.author?.username || "Naməlum istifadəçi"}
            </span>
          </div>

          <div className="likes" style={{ marginTop: "10px" }}>
            <button onClick={() => handleLike(article._id)}>
              <i
                className={`fa-heart ${
                  currentUser && article.likes.includes(currentUser._id) ? "fas" : "far"
                }`}
                style={{ color: "red" }}
              ></i>
            </button>
            <span>{article.likes.length} bəyənmə</span>
          </div>

          <div className="comments">
            <button onClick={() => openCommentModal(article._id)}>💬 Şərh et</button>
            {article.comments?.map((c, i) => (
              <div key={i} style={{ marginLeft: "10px", marginTop: "5px" }}>
                <strong>{c.user?.username || "İstifadəçi"}:</strong> {c.text}
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h4>Şərh yaz</h4>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              style={{ width: "100%", marginBottom: "10px" }}
              placeholder="Şərhinizi yazın..."
            ></textarea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={submitComment}>Göndər</button>
              <button onClick={() => setShowModal(false)}>Bağla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
