import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    blockedUsers: 0,
    activeUsers: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, articleRes] = await Promise.all([
          axios.get("http://localhost:5050/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5050/api/admin/articles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedUsers = userRes.data;
        const fetchedArticles = articleRes.data;

        setUsers(fetchedUsers);
        setArticles(fetchedArticles);
        setStats({
          totalUsers: fetchedUsers.length,
          totalArticles: fetchedArticles.length,
          blockedUsers: fetchedUsers.filter((u) => u.isBlocked).length,
          activeUsers: fetchedUsers.filter((u) => !u.isBlocked).length,
        });
      } catch (err) {
        console.error("Data fetch error:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [token]);

  const blockUser = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5050/api/admin/users/${id}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
      );
      setUsers(updatedUsers);
      setStats({
        ...stats,
        blockedUsers: updatedUsers.filter((u) => u.isBlocked).length,
        activeUsers: updatedUsers.filter((u) => !u.isBlocked).length,
      });
    } catch (err) {
      console.error("Block error:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = users.filter((u) => u._id !== id);
      setUsers(updatedUsers);
      setStats({
        ...stats,
        totalUsers: updatedUsers.length,
        blockedUsers: updatedUsers.filter((u) => u.isBlocked).length,
        activeUsers: updatedUsers.filter((u) => !u.isBlocked).length,
      });
    } catch (err) {
      console.error("User delete error:", err);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/admin/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedArticles = articles.filter((a) => a._id !== id);
      setArticles(updatedArticles);
      setStats({
        ...stats,
        totalArticles: updatedArticles.length,
      });
    } catch (err) {
      console.error("Article delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Yüklənir...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 p-6 pt-20">
    <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Ümumi İstifadəçi", count: stats.totalUsers, color: "blue" },
            { label: "Aktiv İstifadəçi", count: stats.activeUsers, color: "green" },
            { label: "Bloklu İstifadəçi", count: stats.blockedUsers, color: "red" },
            { label: "Ümumi Məqalə", count: stats.totalArticles, color: "purple" },
          ].map(({ label, count, color }, i) => (
            <div key={i} className="bg-white border p-6 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">İstifadəçilər</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">İstifadəçi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">E-mail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Qeydiyyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {user.isBlocked ? "Bloklu" : "Aktiv"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString("az-AZ")}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => blockUser(user._id)}
                        className={`px-3 py-1 text-xs rounded text-white ${
                          user.isBlocked ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      >
                        {user.isBlocked ? "Blokdan Çıxar" : "Blokla"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Məqalələr</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Başlıq</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Müəllif</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tarix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td className="px-6 py-4">{article.title}</td>
                    <td className="px-6 py-4">{article.author?.username}</td>
                    <td className="px-6 py-4">
                      {new Date(article.createdAt).toLocaleDateString("az-AZ")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteArticle(article._id)}
                        className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
