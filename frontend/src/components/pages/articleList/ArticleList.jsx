import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  FaRegCommentDots,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const ArticleList = ({ darkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myArticles: articles, loading, error } = useSelector(
    (state) => state.articles
  );
  const currentUser = useSelector((state) => state.users.currentUser);
  const { savedArticles } = useSelector((state) => state.favorite);

  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    dispatch(fetchAllArticles());
    if (currentUser) {
      dispatch(fetchSavedArticles());
    }
  }, [dispatch, currentUser]);

  const handleLike = (articleId) => {
    if (!currentUser) {
      toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
      return;
    }
    dispatch(likeArticle(articleId));
  };

  const handleSave = (articleId) => {
    if (!currentUser) {
      toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
      return;
    }
    dispatch(toggleSaveArticle(articleId));
    toast.success("Əlavə edildi", { autoClose: 2000 });
  };

  const handleToggleComments = (articleId) => {
    if (!currentUser) {
      toast.info("Əvvəlcə daxil olun!", { autoClose: 2000 });
      return;
    }
    setOpenComments((prev) => (prev === articleId ? null : articleId));
  };

  const handleCommentChange = (articleId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [articleId]: value,
    }));
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
      .catch(() =>
        toast.error("Şərh əlavə olunarkən xəta baş verdi", { autoClose: 2000 })
      );
  };

  return (
    <div className={`w-full md:w-2/3 px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <ToastContainer />
      {loading && <p>Yüklənir...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {articles.map((article) => (
        <div
          key={article._id}
          className={`border rounded-2xl shadow-md mb-6 p-4 transition hover:shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {/* Author */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/user/${article.author?._id}`)}
          >
            {article.author?.photo ? (
              <img
                src={`http://localhost:5050/photos/${article.author.photo}`}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                <FiUser />
              </div>
            )}
            <div>
              <p className="font-semibold">{article.author?.username || "Naməlum"}</p>
              <p className="text-sm text-gray-400">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Title & Content */}
          <div className="mt-4">
            <h2 className="text-lg font-bold">{article.title}</h2>
            <p className="text-sm mt-1">{article.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <button onClick={() => handleLike(article._id)} className="flex items-center gap-1">
                <FaHeart
                  className={`text-xl ${
                    currentUser && article.likes?.includes(currentUser._id)
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <span>{article.likes?.length || 0}</span>
              </button>

              <button onClick={() => handleToggleComments(article._id)} className="flex items-center gap-1">
                <FaRegCommentDots className="text-xl text-gray-500" />
              </button>
            </div>

            <button onClick={() => handleSave(article._id)}>
              <FaBookmark
                className={`text-xl ${
                  currentUser && savedArticles?.some((a) => a._id === article._id)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              />
            </button>
          </div>

          {/* Comments Section */}
          {openComments === article._id && (
            <div className="mt-4 space-y-2">
              {article.comments?.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <img
                    src={
                      c.user?.photo
                        ? `http://localhost:5050/photos/${c.user.photo}`
                        : "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="text-sm">
                    <strong>{c.user?.username || "Anonim"}:</strong> {c.text}
                  </p>
                </div>
              ))}

              {/* Comment Input */}
              <div className="mt-2">
                <textarea
                  rows="2"
                  placeholder="Şərhinizi yazın..."
                  value={commentInputs[article._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(article._id, e.target.value)
                  }
                  className={`w-full rounded-md p-2 text-sm border focus:outline-none focus:ring ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
                <button
                  onClick={() => submitComment(article._id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Göndər
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
