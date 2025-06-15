import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../Redux/UserSlice";
import axios from "axios";

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

    const usersWithoutCurrent = allUsers
      .map((user) => user.username)
      .filter((u) => u !== currentUser?.username);

    const filtered = usersWithoutCurrent.filter((u) =>
      u.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchName, allUsers, currentUser]);

  // Seçilmiş istifadəçi ilə olan mesajları DB-dən çək
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;

      const token = localStorage.getItem("token");  // Tokeni localStorage-dan götürürük
      
      try {
        const res = await axios.get(
          `http://localhost:5050/api/users/messages?from=${currentUser.username}&to=${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Tokeni header-a əlavə edirik
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
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ width: "250px" }}>
        <h3>İstifadəçilər</h3>
        <input
          placeholder="Axtar..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
        />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredUsers.map((user) => (
            <li
              key={user}
              style={{
                cursor: "pointer",
                fontWeight: user === selectedUser ? "bold" : "normal",
                color: onlineUsers.includes(user) ? "green" : "gray",
                marginBottom: "5px",
              }}
              onClick={() => {
                setSelectedUser(user);
                setMessages([]);
              }}
            >
              {user} {onlineUsers.includes(user) && "🟢"}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h3>{selectedUser ? `${selectedUser} ilə söhbət` : "İstifadəçi seçin"}</h3>
        <div
          style={{
            border: "1px solid #ccc",
            height: "300px",
            padding: "10px",
            overflowY: "auto",
            marginBottom: "10px",
            background: "#f9f9f9",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.from === currentUser.username ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  background: m.from === currentUser.username ? "#d1ffd1" : "#e6e6e6",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                <b>{m.from}: </b> {m.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            ref={messageInputRef}
            placeholder="Mesaj yaz..."
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
