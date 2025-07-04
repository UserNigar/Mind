import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5050/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));

    axios.get("http://localhost:5050/api/admin/articles", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setArticles(res.data));
  }, []);

  const blockUser = (id) => {
    axios.patch(`http://localhost:5050/api/admin/users/${id}/block`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5050/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setUsers(users.filter(u => u._id !== id));
    });
  };

  const deleteArticle = (id) => {
    axios.delete(`http://localhost:5050/api/admin/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setArticles(articles.filter(a => a._id !== id));
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <h2 className="text-xl font-semibold mt-6">İstifadəçilər</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} className="flex justify-between items-center border-b py-2">
            {user.username} - {user.email}
            <div className="space-x-2">
              <button onClick={() => blockUser(user._id)} className="bg-yellow-500 px-2 py-1 rounded text-white">
                {user.isBlocked ? "Blokdan Çıxar" : "Blokla"}
              </button>
              <button onClick={() => deleteUser(user._id)} className="bg-red-600 px-2 py-1 rounded text-white">
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Məqalələr</h2>
      <ul>
        {articles.map(article => (
          <li key={article._id} className="flex justify-between items-center border-b py-2">
            {article.title} - <i>{article.author?.username}</i>
            <button onClick={() => deleteArticle(article._id)} className="bg-red-600 px-2 py-1 rounded text-white">
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
