// routes/admin.js
import express from "express";
import { userModel, ArticleModel } from "../model/productModel.js";
import { authMiddleware } from "../../middleware/auth.js";

const adminRouter = express.Router();

// Middleware: yalnız admin olan istifadəçiləri icazə ver
const verifyAdmin = async (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Yalnız admin daxil ola bilər" });
};

// Bütün istifadəçiləri gətir
adminRouter.get("/users", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "İstifadəçilər yüklənə bilmədi" });
  }
});

// İstifadəçini sil
adminRouter.delete("/users/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    res.json({ message: "İstifadəçi silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silinmə zamanı xəta baş verdi" });
  }
});

// İstifadəçini bloklamaq / blokdan çıxarmaq
adminRouter.patch("/users/:id/block", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: user.isBlocked ? "İstifadəçi bloklandı" : "İstifadəçi blokdan çıxarıldı" });
  } catch (err) {
    res.status(500).json({ message: "Bloklama zamanı xəta baş verdi" });
  }
});

// Bütün məqalələri gətir
adminRouter.get("/articles", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const articles = await ArticleModel.find().populate("author", "username");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Məqalələr yüklənə bilmədi" });
  }
});

// Məqaləni silmək
adminRouter.delete("/articles/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const deleted = await ArticleModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Məqalə tapılmadı" });
    res.json({ message: "Məqalə silindi" });
  } catch (err) {
    res.status(500).json({ message: "Məqalə silinərkən xəta baş verdi" });
  }
});

export default adminRouter;
