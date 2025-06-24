import express from "express";
import {
  addCommentToArticle,
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticlesByUserId,
  getMessages,
  getUserArticles,
  getUserId,
  getUsersService,
  loginService,
  registerService,
  saveMessage,
  toggleLike,
  updatePersonalImf,
} from "../controllers/productController.js";
import { customizedMulter } from "../../multer.js";
import { authMiddleware } from "../../middleware/auth.js";

const appRouter = express.Router();

// İstifadəçi qeydiyyatı və daxilolma
appRouter.post("/", customizedMulter.single("photo"), registerService);
appRouter.post("/login", loginService);

// İstifadəçilərlə bağlı əməliyyatlar
appRouter.get("/", getUsersService);
appRouter.get("/messages", authMiddleware, getMessages);
appRouter.post("/messages", saveMessage);
appRouter.patch("/:id", authMiddleware, updatePersonalImf);

// Məqalə paylaşma və göstərmə
appRouter.post("/articles", authMiddleware, createArticle);
appRouter.get("/articles", getAllArticles);

// istifadəçinin öz məqalələri üçün
appRouter.get("/my-articles", authMiddleware, getUserArticles);
appRouter.delete("/articles/:id", authMiddleware, deleteArticle);
appRouter.get("/:id/articles", getArticlesByUserId);

appRouter.patch("/articles/:id/like", authMiddleware, toggleLike);


appRouter.post("/articles/:id/comment", authMiddleware, addCommentToArticle);

appRouter.get("/:id", getUserId);

export default appRouter;
