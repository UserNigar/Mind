import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFollowData,
  followUser,
  unfollowUser,
} from '../../../Redux/FollowersSlice';

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.users.currentUser);
  const { followers, following } = useSelector((state) => state.follow);

  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(0);
  const [localFollowingCount, setLocalFollowingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await fetch(`http://localhost:5050/api/users/${id}`);
        if (!userRes.ok) throw new Error("İstifadəçi tapılmadı");
        const userData = await userRes.json();
        setUser(userData);
        setLocalFollowingCount(userData.following?.length || 0);

        const articlesRes = await fetch(`http://localhost:5050/api/users/${id}/articles`);
        if (!articlesRes.ok) throw new Error("Məqalələr tapılmadı");
        const articlesData = await articlesRes.json();
        setArticles(articlesData);
      } catch (error) {
        console.error("Xəta baş verdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    dispatch(fetchFollowData(id));
  }, [id, dispatch]);

  useEffect(() => {
    setIsFollowing(following.includes(id));
    setLocalFollowersCount(followers.length);
  }, [following, followers, id]);

  const handleFollowClick = () => {
    if (!currentUser) {
      alert("Əvvəlcə daxil olun!");
      return;
    }

    if (isFollowing) {
      dispatch(unfollowUser(id));
      setIsFollowing(false);
      setLocalFollowersCount((prev) => prev - 1);
    } else {
      dispatch(followUser(id));
      setIsFollowing(true);
      setLocalFollowersCount((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user?.photo ? `http://localhost:5050/photos/${user.photo}` : '/default-profile.png'}
                  alt={`${user?.username} profil şəkli`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-gray-900">
                  {user?.username}
                </h1>

                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-900">{localFollowersCount}</span>
                    <span className="text-sm">Takibçi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-900">{localFollowingCount}</span>
                    <span className="text-sm">Takib olunan</span>
                  </div>
                </div>

              </div>
            </div>

            {currentUser && currentUser._id !== id && (
              <div className="flex items-center space-x-3">
                {!isFollowing ? (
                  <button
                    onClick={handleFollowClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                  >
                     Takib et
                  </button>
                ) : (
                  <button
                    onClick={handleFollowClick}
                    className="px-6 py-2 bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200 transition-all duration-200"
                  >
                    Takibdən çıx
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Articles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <p className="text-gray-600">{articles.length} məqalə tapıldı</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Hələ ki məqalə tapılmadı.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <div key={article._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {article.content.length > 200
                      ? `${article.content.substring(0, 200)}...`
                      : article.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>5 dəq oxunma</span>
                      <span>•</span>
                      <span>15 bəyənmə</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Oxu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
