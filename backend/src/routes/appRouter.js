import express from "express";
import { getUserId, getUsersService, loginService, registerService, updatePersonalImf } from "../controllers/productController.js";
import { customizedMulter } from "../../multer.js";
import { authMiddleware } from "../../middleware/auth.js";

const appRouter = express.Router();

appRouter.post("/", customizedMulter.single("photo"),  registerService);
appRouter.get("/", getUsersService);
appRouter.get("/:id", authMiddleware, getUserId);
appRouter.post("/login", loginService)
appRouter.patch("/:id", authMiddleware, updatePersonalImf);


export default appRouter;
