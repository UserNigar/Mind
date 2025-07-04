import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import {
  fetchAllArticles,
  likeArticle,
  addCommentToArticle,
} from "../../../Redux/ArticleSlice";

import {
  toggleSaveArticle,
  fetchSavedArticles,
} from "../../../Redux/favoriteSlice";

import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

import {
  User as UserIcon,
  Calendar,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreVertical,
} from "lucide-react";

import { Menu, Transition } from "@headlessui/react";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

const SidebarWithArticles = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myArticles: articles, loading } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);
  const { savedArticles } = useSelector((state) => state.favorite);

  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reportReasons = [
    "Spam və ya reklam",
    "Nifrət nitqi və zorakılıq",
    "Qeyri-etik məzmun",
    "Müəllif huququ pozuntusu",
    "Digər",
  ];

  useEffect(() => {
    dispatch(fetchAllArticles());
    if (currentUser) dispatch(fetchSavedArticles());
  }, [dispatch, currentUser]);

  const handleReportSubmit = async () => {
    if (!reportReason) return toast.warning("Zəhmət olmasa səbəb seçin!");

    try {
      await axios.post(
        `http://localhost:5050/api/users/articles/${selectedArticleId}/report`,
        {
          articleId: selectedArticleId,
          reason: reportReason,
          customReason,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      toast.success("Şikayət göndərildi!");
      setSelectedArticleId(null);
      setReportReason("");
      setCustomReason("");
    } catch (error) {
      toast.error("Şikayət göndərilmədi!");
    }
  };

  const handleLike = (id) => {
    if (!currentUser) return toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
    dispatch(likeArticle(id));
  };

  const handleSave = (id) => {
    if (!currentUser) return toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
    dispatch(toggleSaveArticle(id))
      .unwrap()
      .then(() => {

        const isNowSaved = savedArticles.includes(id) ? false : true;
        toast.success(isNowSaved ? "Məqalə Sevimlilərə əlavə edildi" : "Məqalə Sevimlilərdən çıxarıldı");
      })
      .catch(() => {
        toast.error("Məqalə kaydedilə bilmədi.");
      });
  };

  const handleComment = (id) => {
    if (!currentUser) return toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
    const text = commentInputs[id]?.trim();
    if (!text) return;
    dispatch(addCommentToArticle({ articleId: id, text }))
      .unwrap()
      .then(() => {
        toast.success("Şərh əlavə olundu!", { autoClose: 2000 });
        setCommentInputs((prev) => ({ ...prev, [id]: "" }));
      })
      .catch(() => toast.error("Şərh əlavə olunarkən xəta baş verdi", { autoClose: 2000 }));
  };

    const topLikedArticles = [...articles]
    .sort((a, b) => b.likes?.length - a.likes?.length)
    .slice(0, 3);


  const articleCountByUser = articles.reduce((acc, article) => {
    const authorId = article.author?._id;
    if (!authorId) return acc;
    acc[authorId] = (acc[authorId] || 0) + 1;
    return acc;
  }, {});

  const uniqueAuthors = Object.entries(articleCountByUser)
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .slice(0, 3)
    .map(([id]) => {
      return articles.find((a) => a.author?._id === id)?.author;
    });
  const formatDate = (str) =>
    new Date(str).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const sidebarItems = [
    { icon: HomeIcon, label: "Istifadeci Axtar", path: "/mood", color: "text-blue-600" },
    { icon: ShareIcon, label: "Yeni post", path: "/share", color: "text-emerald-600" },
    { icon: ChatIcon, label: "Mesajlar", path: "/chat", color: "text-violet-600" },
    { icon: AccountCircleIcon, label: "Profil", path: "/profile", color: "text-amber-600" },
    { icon: ManageAccountsIcon, label: "Ayarlar", path: "/editpage", color: "text-slate-600" },
    { icon: BookmarksIcon, label: "Sevimlilər", path: "/favorite", color: "text-rose-600" },
  ];

  return (
    <div className="flex min-h-screen">

      <div
        className={`fixed top-0 left-0 h-full w-[280px] p-6 z-50 transition-all duration-500
        ${
          darkMode
            ? "bg-slate-900/95 text-slate-100 border-r border-slate-800/50"
            : "bg-white/95 text-slate-900 border-r border-slate-200/50"
        }
        backdrop-blur-xl shadow-2xl`}
      >

        <nav className="flex flex-col gap-2 mt-[75px] mb-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
              ${
                darkMode
                  ? "hover:bg-slate-800/60 text-slate-200 hover:text-white"
                  : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${item.color} transition-transform duration-300 group-hover:scale-110`}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>


      <div
        className={`flex-1 ml-[280px] transition-all duration-500
          ${
            darkMode
              ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
              : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
          }`}
      >
        <div className="p-8">
          <div className="mb-8">
            <h2
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Son Məqalələr
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl">
              {articles.map((a) => {
                const isSaved = savedArticles.includes(a._id);
                const isLiked = a.likes?.includes(currentUser?._id);

                return (
                  <article
                    key={a._id}
                    className={`rounded-2xl p-8 transition-all duration-300
                    ${
                      darkMode
                        ? "bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800/80"
                        : "bg-white/70 border border-slate-200/50 hover:bg-white/90"
                    }
                    backdrop-blur-sm shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        {a.author?.avatar ? (
                          <img
                            src={a.author.avatar}
                            alt="User"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center ring-2 ring-white/20">
                            <UserIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div
                            onClick={() => navigate(`/user/${a.author?._id}`)}
                            className={`font-semibold cursor-pointer transition-colors duration-200
                              ${
                                darkMode
                                  ? "text-white hover:text-blue-400"
                                  : "text-slate-900 hover:text-blue-600"
                              }`}
                          >
                            {a.author?.username}
                          </div>
                          <div
                            className={`text-sm flex items-center gap-2 mt-1 ${
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            {formatDate(a.createdAt)}
                          </div>
                        </div>
                      </div>


                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button
                          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition`}
                          title="Seçimlər"
                          onClick={() => setSelectedArticleId(a._id)}
                        >
                          <MoreVertical
                            className={`w-6 h-6 ${
                              darkMode ? "text-white" : "text-gray-700"
                            }`}
                          />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                          >
                            <div className="py-1">
                              {reportReasons.map((reason, idx) => (
                                <Menu.Item key={idx}>
                                  {({ active }) => (
                                    <button
                                      onClick={() => setReportReason(reason)}
                                      className={`${
                                        active
                                          ? "bg-blue-600 text-white"
                                          : "text-gray-700 dark:text-gray-300"
                                      } group flex w-full items-center px-4 py-2 text-sm`}
                                    >
                                      {reason}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                              {reportReason === "Digər" && (
                                <div className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Öz səbəbinizi yazın"
                                    className="w-full rounded border border-gray-300 px-3 py-1 text-sm dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                  />
                                </div>
                              )}
                              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                <button
                                  onClick={handleReportSubmit}
                                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                                >
                                  Şikayəti göndər
                                </button>
                              </div>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>

                    <div className="mb-6">
                      <h3
                        className={`text-xl font-bold mb-3 leading-tight ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {a.title}
                      </h3>
                      <p
                        className={`text-base leading-relaxed ${
                          darkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {a.content}
                      </p>
                    </div>

                    <div
                      className={`flex items-center justify-between pt-6 border-t ${
                        darkMode ? "border-slate-700/50" : "border-slate-200/50"
                      }`}
                    >
                      <div className="flex items-center gap-8">
                        <button
                          onClick={() => handleLike(a._id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                          ${
                            isLiked
                              ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                              : darkMode
                              ? "text-slate-400 hover:text-red-400 hover:bg-slate-700/50"
                              : "text-slate-500 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                          <span className="text-sm font-medium">{a.likes?.length || 0}</span>
                        </button>

                        <button
                          onClick={() =>
                            setOpenComments(openComments === a._id ? null : a._id)
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                          ${
                            openComments === a._id
                              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : darkMode
                              ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
                              : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{a.comments?.length || 0}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleSave(a._id)}
                        className={`p-2 rounded-lg transition-all duration-200
                        ${
                          isSaved
                            ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : darkMode
                            ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700/50"
                            : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>


                    {openComments === a._id && (
                      <div
                        className={`mt-6 pt-6 border-t space-y-4 ${
                          darkMode ? "border-slate-700/50" : "border-slate-200/50"
                        }`}
                      >
                        {a.comments?.map((c, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl ${
                              darkMode ? "bg-slate-700/30" : "bg-slate-50/70"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                {c.user?.username?.[0]?.toUpperCase()}
                              </div>
                              <span
                                className={`font-medium text-sm ${
                                  darkMode ? "text-slate-200" : "text-slate-800"
                                }`}
                              >
                                {c.user?.username}
                              </span>
                            </div>
                            <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              {c.text}
                            </p>
                          </div>
                        ))}


                        <div className="flex gap-3 mt-4">
                          <textarea
                            rows="3"
                            className={`flex-1 rounded-xl border p-4 text-sm resize-none transition-all duration-200
                            ${
                              darkMode
                                ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                : "bg-white/70 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            }
                            focus:outline-none`}
                            placeholder="Şərh yazın..."
                            value={commentInputs[a._id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [a._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleComment(a._id)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Göndər <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
       <div
        className={`fixed top-[80px] right-0 w-[300px] p-5 overflow-y-auto h-[calc(100vh-80px)] z-40
        ${darkMode ? "bg-slate-900 text-white border-l border-slate-700" : "bg-white text-slate-900 border-l border-slate-200"}
        shadow-lg`}
      >

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">🔥 Ən çox bəyənilən paylaşımlar</h3>
          <ul className="space-y-4">
            {topLikedArticles.map((a) => (
              <li
                key={a._id}
                className="cursor-pointer p-2 rounded-lg hover:bg-slate-800/30 transition"
                onClick={() => navigate(`/article/${a._id}`)}
              >
                <div className="font-semibold truncate">{a.title}</div>
                <div className="text-xs text-slate-400">
                  ❤️ {a.likes?.length || 0} bəyəni | 💬 {a.comments?.length || 0} şərh
                </div>
              </li>
            ))}
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-bold mb-4">🏆 Ən aktiv 3 istifadəçi</h3>
          <ul className="space-y-4">
            {uniqueAuthors.map((user) => (
              <li
                key={user?._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition cursor-pointer"
                onClick={() => navigate(`/user/${user?._id}`)}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{user?.username}</div>
                  <div className="text-xs text-slate-400">
                    {articleCountByUser[user._id] || 0} paylaşım
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default SidebarWithArticles;
