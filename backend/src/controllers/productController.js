import { ArticleModel, messageModel, userModel } from "../model/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { updateProfilePhoto } from "../../multer.js";
import mongoose from "mongoose";


export const getUsersService = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerService = async (req, res) => {
  try {
    const { username, password, email, name, surname } = req.body;
    const photoPath = req.file?.filename;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      photo: photoPath,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginService = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // JWT yarat – müddət 20 gün (20d)
    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      "nodejs",
      { expiresIn: "1d" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User tapılmadı" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xətası" });
  }
};  

export const updatePersonalImf = [
  updateProfilePhoto.single("photo"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const updateData = {};

      // Yeni foto varsa əlavə et
      if (req.file) {
        updateData.photo = req.file.filename;
      }

      // İcazə verilən sahələri yoxla və əlavə et
      const allowedFields = ["email", "name", "surname", "username"];
      for (const field of allowedFields) {
        if (req.body[field]) {
          updateData[field] = req.body[field];
        }
      }

      // DB-də yenilə
      const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Data updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  }
]; 
export const saveMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const message = new messageModel({ from, to, text });
    await message.save();
    res.status(201).json({ message: "Mesaj yadda saxlanıldı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xətası" });
  }
};


export const getMessages = async (req, res) => {
  const { from, to } = req.query;

  try {
    const messages = await messageModel.find({
      $or: [
        { from, to },
        { from: to, to: from } 
      ]
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Mesajlar yüklənə bilmədi:", err);
    res.status(500).json({ message: "Mesajları yükləmək mümkün olmadı" });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id; // token-dən gələn user id

    if (!title || !content) {
      return res.status(400).json({ message: "Title və content tələb olunur" });
    }

    const newArticle = new ArticleModel({
      title,
      content,
      author,
    });

    await newArticle.save();

    res.status(201).json({ message: "Məqalə əlavə edildi", article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find()
      .populate("author", "username photo")
      .populate("comments.user", "username photo") // <-- Əlavə etdik
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Məqalələr gətirilə bilmədi" });
  }
};

export const getUserArticles = async (req, res) => {
  try {
    const userId = req.user.id;
    const articles = await ArticleModel.find({ author: userId })
      .populate("author", "username photo")
      .populate("comments.user", "username photo"); // <-- Əlavə etdik

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Sizin məqalələr gətirilə bilmədi" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Məqalə tapılmadı" });
    }

    // Yalnız həmin məqalənin sahibi silə bilsin
    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "İcazə verilmir" });
    }

    await ArticleModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Məqalə silindi" });
  } catch (err) {
    console.error("Silinmə xətası:", err);
    res.status(500).json({ message: "Server xətası" });
  }
};
export const getArticlesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const articles = await ArticleModel.find({ author: userId });
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Məqalələr yüklənə bilmədi" });
  }
};

export const toggleLike = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const article = await ArticleModel.findById(id).populate("likes", "username");

    if (!article) {
      return res.status(404).json({ message: "Məqalə tapılmadı" });
    }

    const index = article.likes.findIndex((user) => user._id.toString() === userId);

    if (index !== -1) {
      article.likes.splice(index, 1);
    } else {
      article.likes.push(userId);
    }

    await article.save();
    res.status(200).json({ likes: article.likes });
  } catch (error) {
    console.error("toggleLike error:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const addCommentToArticle = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Şərh boş ola bilməz" });
  }

  try {
    const article = await ArticleModel.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Məqalə tapılmadı" });
    }

    const newComment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    article.comments.push(newComment);
    await article.save();

    const updatedArticle = await ArticleModel.findById(id)
      .populate("comments.user", "username photo");

    res.status(201).json({
      message: "Şərh əlavə olundu",
      comments: updatedArticle.comments,
    });
  } catch (err) {
    console.error("Şərh əlavə olunarkən xəta:", err);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Auth middleware ilə gəlir
    const { id: targetUserId } = req.params;

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "Özünüzü izləyə bilməzsiniz." });
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Yanlış istifadəçi ID-si." });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Artıq izləyirsiniz." });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: "İzləmə uğurla əlavə olundu." });
  } catch (error) {
    console.error("followUser error:", error);
    return res.status(500).json({ message: "Server xətası." });
  }
};


// İstifadəçini izləmədən çıxarma funksiyası
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id: targetUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Yanlış istifadəçi ID-si." });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    // İzləmə siyahısından çıxar
    currentUser.following = currentUser.following.filter(
      (uid) => uid.toString() !== targetUserId.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (uid) => uid.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: "İzləmə ləğv edildi." });
  } catch (error) {
    console.error("unfollowUser error:", error);
    return res.status(500).json({ message: "Server xətası." });
  }
};

// İstifadəçinin takipçi və takip olunanlarını gətirən funksiya
export const getFollowersAndFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Yanlış istifadəçi ID-si." });
    }

    const user = await userModel.findById(id)
      .select("-password")
      .populate("followers", "username photo")
      .populate("following", "username photo");

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    return res.status(200).json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("getFollowersAndFollowing error:", error);
    return res.status(500).json({ message: "Server xətası." });
  }
};


export const toggleSaveArticle = async (req, res) => {
  const userId = req.user.id;
  const { id: articleId } = req.params;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    const alreadySaved = user.savedArticles.includes(articleId);

    if (alreadySaved) {
      user.savedArticles = user.savedArticles.filter(
        (artId) => artId.toString() !== articleId
      );
    } else {
      user.savedArticles.push(articleId);
    }

    await user.save();

    return res.status(200).json({
      message: alreadySaved ? "Məqalə yaddaşdan çıxarıldı." : "Məqalə yadda saxlanıldı.",
      savedArticles: user.savedArticles,
    });
  } catch (error) {
    console.error("toggleSaveArticle error:", error);
    res.status(500).json({ message: "Server xətası." });
  }
};
export const getSavedArticles = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId)
      .populate({
        path: "savedArticles",
        populate: { path: "author", select: "username photo" } // məqalə müəllifini də göstər
      });

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı." });
    }

    res.status(200).json(user.savedArticles);
  } catch (error) {
    console.error("getSavedArticles error:", error);
    res.status(500).json({ message: "Server xətası." });
  }
};
