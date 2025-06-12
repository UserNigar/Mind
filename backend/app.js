import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import "./src/db/Connection.js";
import appRouter from "./src/routes/appRouter.js";

const app = express();

// Fayl yollarını düzgün əldə etmək üçün
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware-lər
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

// Statik fayllar üçün public qovluğu
app.use(express.static(path.join(__dirname, "public")));

// 🔥 Şəkil fayllarını ayrıca xidmət et
app.use("/photos", express.static(path.join(__dirname, "public/photos")));

app.use(express.urlencoded({ extended: true }));

// Routing
app.use("/api/users", appRouter);

// Serveri işə sal
app.listen(5050, () => {
  console.log(`server is running`);
});
