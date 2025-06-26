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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await fetch(`http://localhost:5050/api/users/${id}`);
        if (!userRes.ok) throw new Error("User yüklənə bilmədi");
        const userData = await userRes.json();
        setUser(userData);

        const articleRes = await fetch(`http://localhost:5050/api/users/${id}/articles`);
        if (!articleRes.ok) throw new Error("Məqalələr yüklənə bilmədi");
        const articleData = await articleRes.json();
        setArticles(articleData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();

    // Follow məlumatlarını yüklə
    dispatch(fetchFollowData(id));
  }, [id, dispatch]);

  // İstifadəçi hal-hazırda izləyir?
  const isFollowing = following.some(followedId => followedId === id || followedId === id.toString());

  const handleFollowClick = () => {
    if (!currentUser) return alert("Əvvəlcə daxil olun!");

    if (isFollowing) {
      dispatch(unfollowUser(id));
    } else {
      dispatch(followUser(id));
    }
  };

  return (
    <div className="user-detail">
      <div className="user-header">
        <img
          src={user?.photo ? `http://localhost:5050/photos/${user.photo}` : '/default-avatar.png'}
          alt={`${user?.username} profil şəkli`}
          className="user-photo"
        />
        <h2>{user?.username}</h2>

        {currentUser && currentUser._id !== id && (
          <button onClick={handleFollowClick}>
            {isFollowing ? "Takibi burax" : "Takib et"}
          </button>
        )}

        <p>Takibçilər: {followers.length}</p>
        <p>Takib olunanlar: {following.length}</p>
      </div>

      <div className="user-posts">
        <h3>{user?.username} adlı istifadəçinin məqalələri</h3>
        {articles.length === 0 && <p>Məqalə tapılmadı.</p>}
        {articles.map((a) => (
          <div key={a._id} className="post">
            <h4>{a.title}</h4>
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetail;
