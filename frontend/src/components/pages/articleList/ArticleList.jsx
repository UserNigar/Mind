import React, { useEffect, useState } from "react";
import axios from "axios";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h2>Məqalələr</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {articles.map((article) => (
        <div key={article._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            {article.author?.photo && (
              <img
                src={`http://localhost:5050/photos/${article.author.photo}`}
                alt={article.author.username}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            )}
            <span>{article.author?.username || "Naməlum istifadəçi"}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
