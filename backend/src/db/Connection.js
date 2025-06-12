import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connect mongodb"))
  .catch(()=>console.log("disconnect mongodb"));
