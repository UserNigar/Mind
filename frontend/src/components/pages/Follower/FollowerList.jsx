import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import images from "../../../assets/Illustration@2x.png";
import { deleteArticle, fetchMyArticles } from "../../../Redux/ArticleSlice";
import { followUser, unfollowUser, fetchFollowData } from "../../../Redux/FollowersSlice";

const FollowerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myArticles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);
  const { followers, following, loading: followLoading } = useSelector((state) => state.follow);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyArticles());
      dispatch(fetchFollowData(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const handleDelete = (id) => {
    if (window.confirm("Bu məqaləni silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteArticle(id));
    }
  };

  const handleFollow = (userId) => {
    if (followLoading) return;
    dispatch(followUser(userId))
      .unwrap()
      .then(() => toast.success("İzləmə uğurla əlavə edildi"))
      .catch(() => toast.error("İzləmə zamanı xəta baş verdi"));
  };

  const handleUnfollow = (userId) => {
    if (followLoading) return;
    dispatch(unfollowUser(userId))
      .unwrap()
      .then(() => toast.success("İzləmədən çıxarıldı"))
      .catch(() => toast.error("İzləmədən çıxarılma zamanı xəta baş verdi"));
  };

  if (!currentUser) {
    return (
      <section id="userControl">
        <div className="userControl">
          <div className="imageinlogin">
            <img src={images} alt="" className="img" />
          </div>
          <div className="usercontrol-text">
            <p>
              Platformamızın yeniliklərindən xəbərdar olmaq və icmaya qoşulmaq üçün daxil olun və ya qeydiyyatdan keçin!
            </p>
            <div className="us-button">
              <button onClick={() => navigate("/login")}>Daxil ol</button>
              <button onClick={() => navigate("/register")}>Qeydiyyat</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="container">
      <div className="profile">
        <div className="user-info">

          <div className="nameandfollower">
          <div className="follow-section">
            <h3 onClick={()=>navigate("/followers")}>İzləyicilər ({followers.length})</h3>
           <div className="follower-list">
             <ul>
              {followers.map((f) => (
                <li key={f._id}>
                  {f.username}{" "}
                  {following.some((u) => u._id === f._id) ? (
                    <button onClick={() => handleUnfollow(f._id)}>İzləmədən çıx</button>
                  ) : (
                    <button onClick={() => handleFollow(f._id)}>İzləyin</button>
                  )}
                </li>
              ))}
            </ul>
           </div>

            <h3>İzlədiklərim ({following.length})</h3>
            <div className="myfollower-list">
              <ul>
              {following.map((f) => (
                <li key={f._id}>
                  {f.username}{" "}
                  <button onClick={() => handleUnfollow(f._id)}>İzləmədən çıx</button>
                </li>
              ))}
            </ul>
            </div>
          </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FollowerList;
