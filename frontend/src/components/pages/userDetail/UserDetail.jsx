import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowData, followUser, unfollowUser } from '../../../Redux/FollowersSlice';
import { setSelectedUser } from '../../../Redux/ChatSlice';

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, [id]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchFollowData(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

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

  const handleMessageClick = () => {
    if (!user) return;
    dispatch(setSelectedUser(user.username));  
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Yüklənir...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* İstifadəçi Profili */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
              <div className="relative">
                <img
                  src={user?.photo ? `http://localhost:5050/photos/${user.photo}` : '/default-profile.png'}
                  alt={`${user?.username} profil şəkli`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              </div>
              <div className="text-center md:text-left space-y-3">
                <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                <div className="flex justify-center md:justify-start space-x-8 text-gray-600">
                  <p>{user?.name}</p>
                </div>
              </div>
            </div>

            {currentUser && currentUser._id !== id && (
              <div className="mt-6 md:mt-0 flex justify-center md:justify-end">
                <button
                  onClick={handleMessageClick}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition"
                >
                  Mesaj yaz
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Məqalələr</h2>
            <p className="text-gray-600">{articles.length} məqalə tapıldı</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-xl">Hələ ki məqalə tapılmadı.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <div key={article._id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{article.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {article.content.length > 200
                      ? `${article.content.substring(0, 200)}...`
                      : article.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>📅 {new Date(article.createdAt).toLocaleDateString('az-AZ')}</span>
                    </div>
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
