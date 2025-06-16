import React, { useEffect, useState } from "react";
import axios from "axios";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyArticles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Zəhmət olmasa, məqalələri görmək üçün əvvəlcə daxil olun.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5050/api/users/my-articles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(res.data);
      } catch (err) {
        setError("Məqalələr yüklənərkən xəta baş verdi.");
        console.error("Xəta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, []);

  if (loading) return <p>Yüklənir...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Öz Məqalələrim</h2>
      {articles.length === 0 ? (
        <p>Heç bir məqaləniz yoxdur.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
          >
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={article.author?.photo ? `http://localhost:5050/photos/${article.author.photo}` : "/default-profile.png"}
                alt={article.author?.username || "İstifadəçi"}
                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
              />
              <span>{article.author?.username || "İstifadəçi"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyArticles;
