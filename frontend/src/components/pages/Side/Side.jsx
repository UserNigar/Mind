import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { FaRegCommentDots, FaHeart, FaBookmark } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

import CustomizedSwitch from "../../sidebarcomp/Nightbtn/Night";
import {
  fetchAllArticles,
  likeArticle,
  addCommentToArticle,
} from "../../../Redux/ArticleSlice";
import {
  toggleSaveArticle,
  fetchSavedArticles,
} from "../../../Redux/favoriteSlice";

import "react-toastify/dist/ReactToastify.css";
import ArticleList from "../articleList/ArticleList";

const SidebarWithArticles = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myArticles: articles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);
  const { savedArticles } = useSelector((state) => state.favorite);

  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [localLikes, setLocalLikes] = useState({});
  const [localSaves, setLocalSaves] = useState({});

  useEffect(() => {
    dispatch(fetchAllArticles());
    if (currentUser) {
      dispatch(fetchSavedArticles());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    const likesMap = {};
    const savesMap = {};
    articles.forEach((a) => {
      likesMap[a._id] = a.likes?.includes(currentUser?._id);
      savesMap[a._id] = savedArticles?.some((s) => s._id === a._id);
    });
    setLocalLikes(likesMap);
    setLocalSaves(savesMap);
  }, [articles, currentUser, savedArticles]);

  const handleLike = (articleId) => {
    if (!currentUser) return toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
    setLocalLikes((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
    dispatch(likeArticle(articleId));
  };

  const handleSave = (articleId) => {
    if (!currentUser) return toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
    setLocalSaves((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
    dispatch(toggleSaveArticle(articleId));
    toast.success("Əlavə edildi", { autoClose: 2000 });
  };

  const handleToggleComments = (articleId) => {
    if (!currentUser) return toast.info("Əvvəlcə daxil olun!", { autoClose: 2000 });
    setOpenComments((prev) => (prev === articleId ? null : articleId));
  };

  const handleCommentChange = (articleId, value) => {
    setCommentInputs((prev) => ({ ...prev, [articleId]: value }));
  };

  const submitComment = (articleId) => {
    const text = commentInputs[articleId]?.trim();
    if (!text) return;

    dispatch(addCommentToArticle({ articleId, text }))
      .unwrap()
      .then(() => {
        toast.success("Şərh əlavə olundu!", { autoClose: 2000 });
        setCommentInputs((prev) => ({ ...prev, [articleId]: "" }));
      })
      .catch(() => toast.error("Şərh əlavə olunarkən xəta baş verdi", { autoClose: 2000 }));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] p-6 z-50 transition-all duration-300
          ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
          backdrop-blur-md shadow-xl border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Article Hub
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Məqalə platforması</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <HomeIcon className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Əsas səhifə</span>
          </Link>

          <Link to="/share" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <ShareIcon className="text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Yeni post</span>
          </Link>

          <Link to="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <ChatIcon className="text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Mesajlar</span>
          </Link>

          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <AccountCircleIcon className="text-yellow-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Profil</span>
          </Link>

          <Link to="/editpage" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <ManageAccountsIcon className="text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Ayarlar</span>
          </Link>

          <Link to="/favorite" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group">
            <BookmarksIcon className="text-pink-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Sevimlilər</span>
          </Link>
        </nav>

        {/* <div className="mt-auto pt-10">
          <CustomizedSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
        </div> */}
      </div>

      {/* Article List */}
     <ArticleList/>
    </div>
  );
};

export default SidebarWithArticles;
