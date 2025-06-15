import express from "express";
import {
    createArticle,
  getAllArticles,
  getMessages,
  getUserId,
  getUsersService,
  loginService,
  registerService,
  saveMessage,
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
appRouter.get("/:id", getUserId);
appRouter.patch("/:id", authMiddleware, updatePersonalImf);

// Məqalə paylaşma
appRouter.post("/articles", authMiddleware, createArticle); // Məqalə paylaşmaq
appRouter.get("/articles", getAllArticles); // Bütün məqalələri gətirmək

export default appRouter;
