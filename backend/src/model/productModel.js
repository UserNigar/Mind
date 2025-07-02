import mongoose, { model, Schema } from "mongoose";

// USER SCHEMA
const userSchema = new Schema({
  username: String,
  name: String,
  surname: String,
  email: String,
  password: String,
  photo: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }] // <-- Əlavə etdik
}, { versionKey: false });


// MESSAGE SCHEMA
const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// ARTICLE SCHEMA
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ref uyğun olmalıdır
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
 comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// MODELLƏRİN QEYDİYYATI
export const userModel = model("User", userSchema);         // ref: "User"
export const messageModel = model("Message", messageSchema);
export const ArticleModel = model("Article", articleSchema);
