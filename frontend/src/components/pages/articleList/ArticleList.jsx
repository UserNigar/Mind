import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchAllArticles,
  likeArticle,
  addCommentToArticle,
} from "../../../Redux/ArticleSlice";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { red } from "@mui/material/colors";
import "./ArticleList.scss";

const ArticleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myArticles: articles, loading, error } = useSelector((state) => state.articles);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [openComments, setOpenComments] = useState(null); // Açıq olan şərhlər bölməsi
  const [commentInputs, setCommentInputs] = useState({}); // Hər məqaləyə görə yazılan şərhlər

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  const handleLike = (articleId) => {
    if (!currentUser) {
      toast.warning("Əvvəlcə daxil olun!", { autoClose: 2000 });
      return;
    }
    dispatch(likeArticle(articleId));
  };

  const handleToggleComments = (articleId) => {
    if (!currentUser) {
      toast.info("Əvvəlcə daxil olun!", { autoClose: 2000 });
      return;
    }

    setOpenComments(prev => (prev === articleId ? null : articleId));
  };

  const handleCommentChange = (articleId, value) => {
    setCommentInputs(prev => ({
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
        setCommentInputs(prev => ({ ...prev, [articleId]: "" }));
      })
      .catch(() =>
        toast.error("Şərh əlavə olunarkən xəta baş verdi", { autoClose: 2000 })
      );
  };

  return (
    <div style={{ padding: 20 }}>
      <ToastContainer />
      {loading && <p>Yüklənir...</p>}
      {error && <Typography color="error">{error}</Typography>}

      {articles.map((article) => (
        <Card key={article._id} sx={{ maxWidth: 600, mb: 4 }}>
          <CardHeader
            avatar={
              article.author?.photo ? (
                <Avatar src={`http://localhost:5050/photos/${article.author.photo}`} />
              ) : (
                <Avatar sx={{ bgcolor: red[500] }}>
                  {article.author?.username?.charAt(0) || "U"}
                </Avatar>
              )
            }
            title={article.author?.username || "Naməlum"}
            subheader={new Date(article.createdAt).toLocaleDateString()}
            onClick={() => navigate(`/user/${article.author?._id}`)}
            sx={{ cursor: "pointer" }}
          />
          <CardContent>
            <Typography variant="h6">{article.title}</Typography>
            <Typography variant="body2">{article.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => handleLike(article._id)}>
              <FavoriteIcon
                color={
                  currentUser &&
                  Array.isArray(article.likes) &&
                  article.likes.includes(currentUser._id)
                    ? "error"
                    : "inherit"
                }
              />
            </IconButton>
            <Typography>{article.likes?.length || 0}</Typography>
            <IconButton onClick={() => handleToggleComments(article._id)}>
              <CommentIcon />
            </IconButton>
          </CardActions>

          {openComments === article._id && (
            <CardContent className="comments-section">
              {article.comments?.map((c, i) => (
                <div key={i} className="comment-item">
                  <Avatar
                    alt={c.user?.username}
                    src={c.user?.photo ? `http://localhost:5050/photos/${c.user.photo}` : undefined}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography variant="body2">
                    <strong>{c.user?.username || "Anonim"}:</strong> {c.text}
                  </Typography>
                </div>
              ))}
              <div className="comment-form">
                <textarea
                  rows="2"
                  placeholder="Şərhinizi yazın..."
                  value={commentInputs[article._id] || ""}
                  onChange={(e) => handleCommentChange(article._id, e.target.value)}
                />
                <button onClick={() => submitComment(article._id)}>Göndər</button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
