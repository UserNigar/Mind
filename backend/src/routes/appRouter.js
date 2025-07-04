import express from "express";
import {
  addCommentToArticle,
  createArticle,
  deleteArticle,
  followUser,
  getAllArticles,
  getArticlesByUserId,
  getFollowersAndFollowing,
  getLikedArticles,
  getMessages,
  getSavedArticles,
  getUserArticles,
  getUserId,
  getUsersService,
  getWeeklyMood,
  loginService,
  registerService,
  reportArticle,
  saveMessage,
  toggleLike,
  toggleSaveArticle,
  unfollowUser,
  updateMood,
  updatePersonalImf,
} from "../controllers/productController.js";

import { customizedMulter } from "../../multer.js";
import { authMiddleware } from "../../middleware/auth.js";

const appRouter = express.Router();


appRouter.post("/", customizedMulter.single("photo"), registerService);
appRouter.post("/login", loginService);


appRouter.get("/", getUsersService);
appRouter.get("/messages", authMiddleware, getMessages);
appRouter.post("/messages", authMiddleware, saveMessage);
appRouter.patch("/:id", authMiddleware, updatePersonalImf);


appRouter.post("/articles", authMiddleware, createArticle);
appRouter.get("/articles", getAllArticles);
appRouter.get("/my-articles", authMiddleware, getUserArticles);
appRouter.delete("/articles/:id", authMiddleware, deleteArticle);
appRouter.patch("/articles/:id/like", authMiddleware, toggleLike);
appRouter.post("/articles/:id/comment", authMiddleware, addCommentToArticle);
appRouter.patch("/articles/:id/save", authMiddleware, toggleSaveArticle);
appRouter.get("/saved-articles", authMiddleware, getSavedArticles);
appRouter.post("/articles/:articleId/report", authMiddleware, reportArticle);


appRouter.patch("/follow/:targetUserId", authMiddleware, followUser);
appRouter.patch("/unfollow/:targetUserId", authMiddleware, unfollowUser);
appRouter.get("/:id/follow-data", getFollowersAndFollowing);


appRouter.patch("/mood/:id", authMiddleware, updateMood);
appRouter.get("/mood/:id", authMiddleware, getWeeklyMood);


appRouter.get("/liked-articles", authMiddleware, getLikedArticles);

appRouter.get("/:id/articles", getArticlesByUserId);
appRouter.get("/:id", getUserId);

export default appRouter;
