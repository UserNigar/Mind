import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Share = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser || "ok")

  const submitArticle = async () => {
    if (!currentUser) {
      toast.error("Məqalə paylaşmaq üçün əvvəlcə daxil olun.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5050/api/users/articles",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Məqalə uğurla əlavə edildi");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Xəta:", err);
      alert("Məqalə əlavə edilərkən xəta baş verdi.");
    }
  };

  return (
    <div>
      <h2>Məqalə yarat</h2>
      <input
        type="text"
        placeholder="Başlıq"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br />
      <textarea
        placeholder="Məqalə mətni"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      /><br />
      <button onClick={submitArticle}>Paylaş</button>
    </div>
  );
};

export default Share;
