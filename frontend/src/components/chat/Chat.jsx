import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../Redux/UserSlice";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const allUsers = useSelector((state) => state.users.users);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);

  // Bütün istifadəçiləri yüklə
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // socket.io qoşulması
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);

    newSocket.emit("join", currentUser.username);

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((u) => u !== currentUser.username));
    });

    newSocket.on("privateMessage", ({ message, fromUsername }) => {
      if (fromUsername === selectedUser) {
        setMessages((prev) => [...prev, { from: fromUsername, text: message }]);
      } else {
        alert(`Yeni mesaj: ${fromUsername} → ${message}`);
      }
    });

    return () => newSocket.disconnect();
  }, [currentUser, selectedUser]);

  // Axtarış və filtrasiya
  useEffect(() => {
    if (!allUsers) return;

    const usersWithoutCurrent = allUsers.filter(
      (user) => user.username !== currentUser?.username
    );

    const filtered = usersWithoutCurrent.filter((user) =>
      user.username.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchName, allUsers, currentUser]);

  // Seçilmiş istifadəçi ilə olan mesajları DB-dən çək
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;

      const token = localStorage.getItem("token"); // Tokeni localStorage-dan götürürük
  console.log("Token:", token); // buraya bax!
      try {
        const res = await axios.get(
          `http://localhost:5050/api/users/messages?from=${currentUser.username}&to=${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Tokeni header-a əlavə edirik
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Mesajlar yüklənə bilmədi:", err);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  const sendMessage = async () => {
    if (!socket || !selectedUser) return;
    const msg = messageInputRef.current.value.trim();
    if (!msg) return;

    const messageData = {
      from: currentUser.username,
      to: selectedUser,
      text: msg,
    };

    // Socket.io ilə göndər
    socket.emit("privateMessage", {
      fromUsername: messageData.from,
      toUsername: messageData.to,
      message: messageData.text,
    });

    // DB-yə göndər
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5050/api/users/messages", messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Mesaj saxlanmadı:", err);
    }

    setMessages((prev) => [...prev, messageData]);
    messageInputRef.current.value = "";
  };

  if (!currentUser) return <p>Zəhmət olmasa daxil olun</p>;

  return (
    <div className="chat-container">
      <div className="user-list-container">
        <h3>İstifadəçilər</h3>
        <input
          placeholder="Axtar..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="search-input"
        />
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li
              key={user.username}
              className={`user-item ${
                user.username === selectedUser ? "selected" : ""
              } ${onlineUsers.includes(user.username) ? "online" : "offline"}`}
              onClick={() => {
                setSelectedUser(user.username);
                setMessages([]);
              }}
            >
              <img
                src={`http://localhost:5050/photos/${user.photo}`}
                alt={`${user.username} profil`}
                className="profile-pic"
              />
              <span className="username">{user.username}</span>
              {onlineUsers.includes(user.username) && (
                <span className="online-indicator">🟢</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-section">
        <h3>{selectedUser ? `${selectedUser} ilə söhbət` : "İstifadəçi seçin"}</h3>
        <div className="messages-box">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${
                m.from === currentUser.username ? "sent" : "received"
              }`}
            >
              <span className="message-content">
                <b>{m.from}: </b> {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="message-input-section">
          <input
            type="text"
            ref={messageInputRef}
            placeholder="Mesaj yaz..."
            className="message-input"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="send-button">
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
