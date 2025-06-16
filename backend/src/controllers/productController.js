import { ArticleModel, messageModel, userModel } from "../model/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { updateProfilePhoto } from "../../multer.js";

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
};  // <-- burada bağlayıcı əlavə edildi

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
];  // <-- burada da bağlayıcı əlavə edildi
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
      .populate("author", "username photo")  // burada "author" olmalıdır
      .sort({ createdAt: -1 }); // istəyirsənsə, ən son əlavə olunanlar əvvəl görünsün

    res.status(200).json(articles);
  } catch (err) {
    console.error("Məqalələr gətirilərkən xəta:", err);
    res.status(500).json({ message: "Məqalələr gətirilə bilmədi" });
  }
};

export const getUserArticles = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware-də token-dan istifadəçi id-si req.user-a əlavə olunmalıdır

    const articles = await ArticleModel.find({ author: userId }).populate("author", "username photo");

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "İstifadəçinin məqalələri gətirilə bilmədi" });
  }
};