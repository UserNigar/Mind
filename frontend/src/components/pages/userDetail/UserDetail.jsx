import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndArticles = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5050/api/users/${id}`);
        const articleRes = await axios.get(`http://localhost:5050/api/users/${id}/articles`);
        console.log(articleRes);

        setUser(userRes.data);
        setArticles(articleRes.data);
      } catch (err) {
        console.error(err);
        setError("İstifadəçi və ya məqalələr tapılmadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndArticles();
  }, [id]);

  
  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="user-detail">
      <div className="user-header">
        <img
          src={user.photo ? `http://localhost:5050/photos/${user.photo}`  : '/default-avatar.png'}
          alt={`${user.username} profil şəkli`}
          className="user-photo"
        />
        <h2>{user.username}</h2>
      </div>

      <div className="user-posts">
        <h3>{user.username} adlı istifadəçinin məqalələri</h3>
        {articles.length > 0 ? (
          articles.map((article, i) => (
            <div key={i} className="post">
              <h4>{article.title}</h4>
              <p>{article.content}</p>
            </div>
          ))
        ) : (
          <p>Paylaşım yoxdur.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
