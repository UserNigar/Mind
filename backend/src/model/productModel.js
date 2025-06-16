import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    username:String,
    name:String,
    surname:String,
    email:String,
    password:String,
    photo:String
},{versionKey:false})


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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // bu "userModel.js"-dəki modelin adıyla uyğun olmalıdır
    required: true,
  },
}, { timestamps: true });

export const ArticleModel = mongoose.model("Article", articleSchema);

export const messageModel = mongoose.model("messages", messageSchema);
export const userModel = model('users',userSchema)
