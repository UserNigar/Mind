import express from "express";
import { getUsersService, loginService, registerService } from "../controllers/productController.js";
import { customizedMulter } from "../../multer.js";
import { authMiddleware } from "../../middleware/auth.js";

const appRouter = express.Router();

appRouter.post("/", customizedMulter.single("photo"),  registerService);
appRouter.get("/",authMiddleware, getUsersService);
appRouter.post("/login", loginService)

export default appRouter;
