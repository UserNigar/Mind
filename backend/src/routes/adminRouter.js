import express from "express";
import { userModel, ArticleModel, ReportModel } from "../model/productModel.js";
import { authMiddleware } from "../../middleware/auth.js";

const adminRouter = express.Router();


const verifyAdmin = async (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Yalnız admin daxil ola bilər" });
};

adminRouter.get("/users", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "İstifadəçilər yüklənə bilmədi" });
  }
});


adminRouter.delete("/users/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    res.json({ message: "İstifadəçi silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silinmə zamanı xəta baş verdi" });
  }
});


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


adminRouter.get("/articles", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const articles = await ArticleModel.find().populate("author", "username");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Məqalələr yüklənə bilmədi" });
  }
});


adminRouter.delete("/articles/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const deleted = await ArticleModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Məqalə tapılmadı" });
    res.json({ message: "Məqalə silindi" });
  } catch (err) {
    res.status(500).json({ message: "Məqalə silinərkən xəta baş verdi" });
  }
});



adminRouter.get("/article-stats", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const stats = await ArticleModel.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1 = bazar, 2 = bazar ertəsi, ...
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }
      }
    ]);


    const weekDays = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
    const formattedStats = stats.map(item => ({
      day: weekDays[item._id - 1],
      count: item.count,
    }));

    res.json(formattedStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Statistika yüklənmədi" });
  }
});


adminRouter.patch("/reports/:id/resolve", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report tapılmadı" });

    report.resolved = true;
    await report.save();

    res.json({ message: "Report həll olundu" });
  } catch (err) {
    console.error("Report həll edilə bilmədi:", err);
    res.status(500).json({ message: "Server xətası" });
  }
});



adminRouter.patch("/reports/:id/resolve", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report tapılmadı" });

    report.resolved = true;
    await report.save();

    res.json({ message: "Report həll olundu" });
  } catch (err) {
    console.error("Report həll edilə bilmədi:", err);
    res.status(500).json({ message: "Server xətası" });
  }
});

export default adminRouter;
