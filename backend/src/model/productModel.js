import mongoose, { model, Schema } from "mongoose";


const userSchema = new Schema({
  username: String,
  name: String,
  surname: String,
  email: String,
  password: String,
  photo: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  weeklyMood: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      mood: {
        type: String,
        enum: ["xoşbəxt", "kədərli", "neytral", "əsəbi", "həyəcanlı", "yorğun", "narahat"],
        required: true
      }
    }
  ]
}, { versionKey: false, timestamps: true });

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }], 
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


const reportSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  reason: {
    type: String,
    enum: [
      "Spam və ya reklam",
      "Nifrət nitqi və zorakılıq",
      "Qeyri-etik məzmun",
      "Müəllif hüququ pozuntusu",
      "Digər"
    ],
    required: true,
  },

  customReason: { 
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resolved: { 
    type: Boolean,
    default: false,
  },
}, { versionKey: false });


export const userModel = model("User", userSchema);
export const messageModel = model("Message", messageSchema);
export const ArticleModel = model("Article", articleSchema);
export const ReportModel = model("Report", reportSchema);
