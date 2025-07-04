import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyArticles,
  deleteArticle,
} from "../../../Redux/ArticleSlice";
import {
  BookOpen,
  Trash2,
  User as UserIcon,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser);
  const { myArticles, loading, error } = useSelector((state) => state.articles);
  const [openMenus, setOpenMenus] = useState({});

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

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-[85px] px-4">
        <div className="bg-white dark:bg-gray-800 text-center rounded-xl shadow-md p-8 max-w-md w-full">
          <UserIcon className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4">Xoş gəlmisiniz!</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Daxil ol
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Qeydiyyat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[85px] px-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Profil bölməsi */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            {currentUser.photo ? (
              <img
                src={`http://localhost:5050/photos/${currentUser.photo}`}
                alt={currentUser.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                <UserIcon className="w-12 h-12 text-blue-600" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Username</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {currentUser.username}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ad</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {currentUser.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Məqalələr */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Öz Paylaşımlarım
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Yüklənir...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : myArticles.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Heç bir məqaləniz yoxdur.</p>
          ) : (
            <div className="space-y-4">
              {myArticles.map((article) => (
                <div
                  key={article._id}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  {/* 3 nöqtə düyməsi */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleMenu(article._id)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-800"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenus[article._id] && (
                      <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-700 rounded shadow z-10">
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 px-4 py-2 text-sm w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content və author məlumatı */}
                
                  <div className="flex items-center gap-2 border-t pt-3 border-gray-100 dark:border-gray-700">
                    {article.author?.photo ? (
                      <img
                        src={`http://localhost:5050/photos/${article.author.photo}`}
                        alt={article.author.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                      </div>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {article.author?.username || "İstifadəçi"}
                    </span>
                  </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{article.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
