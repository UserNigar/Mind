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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ArticleModel = mongoose.model("articles", articleSchema);



export const messageModel = mongoose.model("messages", messageSchema);
export const userModel = model('users',userSchema)
