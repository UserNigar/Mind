// components/CreateArticle.jsx
import React, { useState } from "react";
import axios from "axios";

const Share = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitArticle = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5050/api/users/articles", {
        title,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Məqalə uğurla əlavə edildi");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Xəta:", err);
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
