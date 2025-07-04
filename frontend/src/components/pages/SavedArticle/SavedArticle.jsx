import React, { useEffect, useState } from "react";
import {
  Calendar,
  User as UserIcon,
  BookOpen,
  Heart,
  MessageCircle,
  Bookmark,
  Search,
  Grid,
  List,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedArticles } from "../../../Redux/favoriteSlice";

const SavedArticles = () => {
  const dispatch = useDispatch();
  const { savedArticles, loading, error } = useSelector((state) => state.favorite);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchSavedArticles());
    }
  }, [dispatch, currentUser]);

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getAuthorInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : "??";
  };

  const getGradientColor = (index) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ];
    return gradients[index % gradients.length];
  };

  const filteredArticles = savedArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "likes":
        return b.likes.length - a.likes.length;
      case "comments":
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-[85px] pl-[260px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Giriş Tələb Olunur</h2>
          <p className="text-gray-600 dark:text-gray-400">Yadda saxlanılan məqalələri görmək üçün zəhmət olmasa daxil olun.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-[85px] pl-[260px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Yüklənir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[85px] pl-[260px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Xəta Baş Verdi</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[85px] pl-[60px] px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Yadda Saxlanılan Məqalələr</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Məqalələrdə axtarış..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Ən yeni</option>
              <option value="oldest">Ən köhnə</option>
              <option value="likes">Bəyənmə sayı</option>
              <option value="comments">Şərh sayı</option>
            </select>

            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-l-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-r-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>{sortedArticles.length} məqalə tapıldı</span>
          <span>•</span>
        </div>
      </div>


      {sortedArticles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? "Axtarış nəticəsi tapılmadı" : "Hələ heç bir məqalə yadda saxlanılmayıb"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? "Başqa açar sözlər ilə cəhd edin" : "Bəyəndiyiniz məqalələri yadda saxlayın"}
          </p>
        </div>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
              : "space-y-4"
          }`}
        >
          {sortedArticles.map((article, index) => (
            <div
              key={article._id}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 ${
                viewMode === "list" ? "flex gap-6 p-6" : "p-6"
              }`}
            >
              <div className={`${viewMode === "list" ? "flex-shrink-0" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradientColor(
                      index
                    )} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {getAuthorInitials(article.author?.username)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {article.author?.username}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {article.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{article.likes?.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comments?.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {article.readTime}
                    </span>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bookmark className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedArticles;
