import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyArticles, deleteArticle } from "../../../Redux/ArticleSlice";
import {
  BookOpen,
  Trash2,
  User as UserIcon,
  MoreVertical,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Edit3,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLikedArticles, logoutUser } from "../../../Redux/UserSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser);
  const { myArticles, loading, error } = useSelector((state) => state.articles);

  const [openMenus, setOpenMenus] = useState({});
  const [activeTab, setActiveTab] = useState("posts");
const { likedArticles } = useSelector((state) => state.users);


useEffect(() => {
  if (currentUser) {
    dispatch(fetchMyArticles());
    dispatch(getLikedArticles()); 
  }
}, [dispatch, currentUser]);

    const handleLogout = () => {
      dispatch(logoutUser());
      navigate("/login");
    };
  const handleDelete = (id) => {
    if (window.confirm("Bu məqaləni silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteArticle(id));
    }
  };

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const totalLikes = myArticles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);
  const totalComments = myArticles.reduce((sum, a) => sum + (a.comments?.length || 0), 0);
  const totalPosts = myArticles.length;

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 text-center rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto  mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Xoş gəlmisiniz!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Daxil ol
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Qeydiyyat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {currentUser.photo ? (
              <img
                src={`http://localhost:5050/photos/${currentUser.photo}`}
                alt={currentUser.username}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-blue-100 dark:border-blue-900"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">@{currentUser.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Settings className="w-5 h-5" onClick={()=>navigate("/editpage")}/>
            </button>
            <button className="p-3 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
              <LogOut className="w-5 h-5" onClick={()=>handleLogout()} />
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard value={totalPosts} label="Toplam Paylaşım" color="blue" />
        <StatCard value={totalLikes} label="Toplam Bəyənmə" color="green" />
        <StatCard value={totalComments} label="Toplam Şərh" color="purple" />
      </div>


      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex">
          <TabButton title="Paylaşımlar" icon={<BookOpen />} isActive={activeTab === "posts"} onClick={() => setActiveTab("posts")} />
          <TabButton title="Bəyəndiklərim" icon={<Heart />} isActive={activeTab === "liked"} onClick={() => setActiveTab("liked")} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 min-h-[600px] p-6">
          {activeTab === "posts" && (
            loading ? (
              <div className="text-center text-lg text-gray-500 dark:text-gray-300">Yüklənir...</div>
            ) : (
              myArticles.length === 0 ? (
                <EmptyState icon={<BookOpen />} text="Heç bir məqaləniz yoxdur." />
              ) : (
                <div className="space-y-6">
                  {myArticles.map((article) => (
                    <div
                      key={article._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <UserIcon className="w-6 h-6 text-white bg-blue-500 rounded-md p-1" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {article.author?.username || "İstifadəçi"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(article.createdAt).toLocaleDateString("az-AZ")}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(article._id)}
                            className="p-2 rounded-xl bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenus[article._id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-600 rounded-xl shadow-lg border border-gray-100 dark:border-gray-500 z-10">
                              <button
                                onClick={() => handleDelete(article._id)}
                                className="flex items-center space-x-3 text-red-600 dark:text-red-400 px-4 py-3 text-sm w-full rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Sil</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">{article.content}</p>

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm">
                        <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {article.likes?.length || 0}</div>
                        <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {article.comments?.length || 0}</div>
                        </div>
                    </div>
                  ))}
                </div>
              )
            )
          )}

          {activeTab === "drafts" && (
            <EmptyState icon={<Edit3 />} text="Heç bir qaralama yoxdur." />
          )}

{activeTab === "liked" && (
  likedArticles.length === 0 ? (
    <EmptyState icon={<Heart />} text="Heç nə bəyənməmisiniz." />
  ) : (
    <div className="space-y-6">
      {likedArticles.map((article) => (
        <div
          key={article._id}
          className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-100 dark:border-gray-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="w-6 h-6 text-white bg-blue-500 rounded-md p-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {article.author?.username || "İstifadəçi"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString("az-AZ")}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">
            {article.content}
          </p>

          <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {article.likes?.length || 0}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> {article.comments?.length || 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
)}

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700">
    <div className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mb-2`}>{value}</div>
    <div className="text-gray-600 dark:text-gray-300 font-medium">{label}</div>
  </div>
);

const TabButton = ({ title, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-4 px-6 text-center font-semibold ${isActive ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 bg-transparent"}`}
  >
    {icon && <span className="inline-block mr-2">{icon}</span>}
    {title}
  </button>
);

const EmptyState = ({ icon, text }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-lg">{text}</p>
  </div>
);

export default UserProfile;
