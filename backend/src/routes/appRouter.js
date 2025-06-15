import express from "express";
import { getMessages, getUserId, getUsersService, loginService, registerService, saveMessage, updatePersonalImf } from "../controllers/productController.js";
import { customizedMulter } from "../../multer.js";
import { authMiddleware } from "../../middleware/auth.js";

const appRouter = express.Router();

appRouter.post("/", customizedMulter.single("photo"),  registerService);
appRouter.get("/", getUsersService);
// Öncə statik routeları yaz!
appRouter.get("/messages", getMessages); // <- bu ÜSTDƏ olmalıdır

// Sonra dinamik id routeları
appRouter.get("/:id", getUserId); // <- bu ALTDA olmalıdır
appRouter.post("/login", loginService)
appRouter.patch("/:id", authMiddleware, updatePersonalImf);

appRouter.post("/messages",authMiddleware, saveMessage);



export default appRouter;
