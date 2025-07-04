import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllArticles,
  likeArticle,
  addCommentToArticle,
} from "../../../Redux/ArticleSlice";
import {
  Heart,
  MessageCircle,
  Bookmark,
  User as UserIcon,
  Calendar,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleSaveArticle } from "../../../Redux/favoriteSlice";

const ArticleList = ({ darkMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myArticles: articles, loading } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  const handleLike = (id) => {
    if (!currentUser) return alert("Daxil olun!");
    dispatch(likeArticle(id));
  };

  const handleSave = (id) => {
    if (!currentUser) return alert("Daxil olun!");
    dispatch(toggleSaveArticle(id));
  };

  const handleComment = (id) => {
    if (!currentUser) return alert("Daxil olun!");
    const text = commentInputs[id]?.trim();
    if (!text) return;
    dispatch(addCommentToArticle({ articleId: id, text }));
    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const theme = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen ${theme} pt-[85px] pl-[260px]`}>
      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">Yüklənir...</div>
        ) : (
          <div className="space-y-6 w-[800px]">
            {articles.map((a) => {
              const isSaved = a.savedBy?.includes(currentUser?._id);
              return (
                <div
                  key={a._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Yazar və tarix */}
                  <div className="flex items-center gap-3 mb-4">
                    {a.author?.avatar ? (
                      <img
                        src={a.author.avatar}
                        alt="User"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div
                        onClick={() => navigate(`/user/${a.author?._id}`)}
                        className="font-medium cursor-pointer hover:underline"
                      >
                        {a.author?.username}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(a.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Məqalə */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 dark:text-white">{a.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {a.content}
                    </p>
                  </div>

                  {/* Əməliyyat düymələri */}
                  <div className="flex items-center justify-between border-t dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(a._id)}
                        className="flex items-center gap-1"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-150 ${
                            a.likes?.includes(currentUser?._id)
                              ? "text-red-500 fill-current"
                              : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm">{a.likes?.length}</span>
                      </button>

                      <button
                        onClick={() =>
                          setOpenComments(openComments === a._id ? null : a._id)
                        }
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">{a.comments?.length}</span>
                      </button>
                    </div>

                    <button onClick={() => handleSave(a._id)}>
                      <Bookmark
                        className={`w-5 h-5 transition-all duration-150 ${
                          isSaved ? "text-blue-600 fill-current" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Şərhlər */}
                  {openComments === a._id && (
                    <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-3">
                      {a.comments?.map((c, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <strong>{c.user?.username}:</strong> {c.text}
                        </div>
                      ))}

                      <div className="flex items-start gap-2 mt-2">
                        <textarea
                          rows="2"
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm dark:bg-gray-700 dark:text-white"
                          placeholder="Şərh yaz..."
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
                          className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4" /> Göndər
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
