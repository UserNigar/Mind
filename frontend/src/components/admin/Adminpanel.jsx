import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleStatsChart from "../AdminStats/ArticleStatsChart";
import { Users, FileText, Shield, Activity, Trash2, Ban, CheckCircle, Calendar, Mail, User, Edit3 } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin animate-reverse"></div>
            <div className="absolute top-4 left-4 w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            <p className="text-2xl font-bold mb-2">Yüklənir...</p>
            <p className="text-sm opacity-80">Məlumatlar hazırlanır</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Admin Dashboard
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: "Ümumi İstifadəçi", 
              count: stats.totalUsers, 
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/20",
              borderGradient: "from-blue-500/50 to-cyan-500/50"
            },
            { 
              label: "Aktiv İstifadəçi", 
              count: stats.activeUsers, 
              icon: Activity,
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-500/10 to-emerald-500/20",
              borderGradient: "from-green-500/50 to-emerald-500/50"
            },
            { 
              label: "Bloklu İstifadəçi", 
              count: stats.blockedUsers, 
              icon: Shield,
              gradient: "from-red-500 to-rose-500",
              bgGradient: "from-red-500/10 to-rose-500/20",
              borderGradient: "from-red-500/50 to-rose-500/50"
            },
            { 
              label: "Ümumi Məqalə", 
              count: stats.totalArticles, 
              icon: FileText,
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/10 to-pink-500/20",
              borderGradient: "from-purple-500/50 to-pink-500/50"
            },
          ].map(({ label, count, icon: Icon, gradient, bgGradient, borderGradient }, i) => (
            <div key={i} className={`group relative overflow-hidden bg-gradient-to-br ${bgGradient} backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${borderGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-300 font-medium">{label}</p>
                  <p className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {count}
                  </p>
                </div>
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-8 h-8 text-white" />
                  <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500`}></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl mb-12 overflow-hidden">
          <div className="p-8 border-b border-gray-700/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              İstifadəçilər
              <span className="ml-4 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {users.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/30">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">İstifadəçi</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">E-mail</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Qeydiyyat</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-700/20 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.username?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{user.username}</p>
                          <p className="text-gray-400 text-sm">ID: {user._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        user.isBlocked 
                          ? "bg-red-500/20 text-red-300 border border-red-500/50" 
                          : "bg-green-500/20 text-green-300 border border-green-500/50"
                      }`}>
                        {user.isBlocked ? (
                          <Ban className="w-4 h-4 mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        {user.isBlocked ? "Bloklu" : "Aktiv"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">
                          {new Date(user.createdAt).toLocaleDateString("az-AZ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => blockUser(user._id)}
                          className={`group px-4 py-2 text-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                            user.isBlocked 
                              ? "bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30 hover:scale-105" 
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 hover:bg-yellow-500/30 hover:scale-105"
                          }`}
                        >
                          {user.isBlocked ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          <span>{user.isBlocked ? "Blokdan Çıxar" : "Blokla"}</span>
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="group px-4 py-2 text-sm rounded-xl font-semibold bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl mb-12 overflow-hidden">
          <div className="p-8 border-b border-gray-700/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              Məqalələr
              <span className="ml-4 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                {articles.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/30">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Başlıq</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Müəllif</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Tarix</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {articles.map((article, index) => (
                  <tr key={article._id} className="hover:bg-gray-700/20 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                          <Edit3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg line-clamp-2">{article.title}</p>
                          <p className="text-gray-400 text-sm">ID: {article._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                          {article.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium">{article.author?.username || 'Naməlum'}</p>
                          <p className="text-gray-400 text-sm">Müəllif</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300 font-medium">
                          {new Date(article.createdAt).toLocaleDateString("az-AZ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => deleteArticle(article._id)}
                        className="group px-4 py-2 text-sm rounded-xl font-semibold bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Sil</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8">
          <ArticleStatsChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;