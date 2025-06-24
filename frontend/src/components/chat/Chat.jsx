import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedUser,
  getMessagesFromDB,
  sendMessageToDB,
  addMessage,
} from "../../Redux/ChatSlice.js";
import { getUsers } from "../../Redux/UserSlice";
import "./Chat.css";

const Chat = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const allUsers = useSelector((state) => state.users.users);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const messages = useSelector((state) => state.chat.messages);
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messageInputRef = useRef();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);
    newSocket.emit("join", currentUser.username);
    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((u) => u !== currentUser.username));
    });
    newSocket.on("privateMessage", ({ message, fromUsername }) => {
      dispatch(addMessage({ from: fromUsername, to: currentUser.username, text: message }));
      if (fromUsername !== selectedUser) {
        alert(`Yeni mesaj: ${fromUsername} → ${message}`);
      }
    });
    return () => newSocket.disconnect();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (!allUsers) return;
    const result = allUsers.filter(
      (u) =>
        u.username !== currentUser?.username &&
        u.username.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchName, allUsers, currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const token = localStorage.getItem("token");
    dispatch(getMessagesFromDB({ from: currentUser.username, to: selectedUser, token }));
  }, [selectedUser, currentUser, dispatch]);

  const handleSendMessage = () => {
    if (!socket || !selectedUser) return;
    const text = messageInputRef.current.value.trim();
    if (!text) return;

    const from = currentUser.username;
    const to = selectedUser;
    const token = localStorage.getItem("token");

    // socket göndər
    socket.emit("privateMessage", { fromUsername: from, toUsername: to, message: text });

    // redux + backend
    dispatch(sendMessageToDB({ from, to, text, token }));
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
              className={`user-item ${user.username === selectedUser ? "selected" : ""} ${
                onlineUsers.includes(user.username) ? "online" : "offline"
              }`}
              onClick={() => dispatch(setSelectedUser(user.username))}
            >
              <img
                src={`http://localhost:5050/photos/${user.photo}`}
                alt={`${user.username} profil`}
                className="profile-pic"
              />
              <span className="username">{user.username}</span>
              {onlineUsers.includes(user.username) && <span className="online-indicator">🟢</span>}
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
              className={`message ${m.from === currentUser.username ? "sent" : "received"}`}
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
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
