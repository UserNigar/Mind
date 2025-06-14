import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../Redux/UserSlice";

const Chat = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.users.currentUser);
  const allUsers = useSelector((state) => state.users.users); // Bütün istifadəçilər

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // socket.io online-lar (istifadəçi adı listi)
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);

  // İlk renderdə backenddən bütün istifadəçiləri yüklə
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // socket.io qoşulması
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io("http://localhost:5050", {
      // auth varsa buraya əlavə et
      // auth: { token: "your-token" }
    });

    setSocket(newSocket);

    newSocket.emit("join", currentUser.username);

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((u) => u !== currentUser.username));
    });

    newSocket.on("privateMessage", ({ message, fromUsername }) => {
      if (fromUsername === selectedUser) {
        setMessages((prev) => [...prev, { from: fromUsername, text: message }]);
      } else {
        alert(`Yeni mesaj ${fromUsername}-dən`);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, selectedUser]);

  // Axtarışa görə filtr et (Redux-dan gələn bütün istifadəçilərdən)
  useEffect(() => {
    if (!allUsers) return;

    // Mövcud istifadəçi çıxılacaq siyahıdan, özü seçilməsin (istəyə görə)
    const usersWithoutCurrent = allUsers
      .map((user) => user.username) // username sahəsinə uyğunlaşdır (serverdən necə gəlirsə)
      .filter((u) => u !== currentUser?.username);

    const filtered = usersWithoutCurrent.filter((u) =>
      u.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchName, allUsers, currentUser]);

  const sendMessage = () => {
    if (!socket) return;
    const msg = messageInputRef.current.value.trim();
    if (!msg || !selectedUser) return;

    socket.emit("privateMessage", {
      toUsername: selectedUser,
      fromUsername: currentUser.username,
      message: msg,
    });

    setMessages((prev) => [...prev, { from: currentUser.username, text: msg }]);
    messageInputRef.current.value = "";
  };

  if (!currentUser) return <p>Zəhmət olmasa daxil olun</p>;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h3>İstifadəçilər</h3>
        <input
          placeholder="İstifadəçi axtar"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user}
              style={{
                cursor: "pointer",
                fontWeight: user === selectedUser ? "bold" : "normal",
              }}
              onClick={() => {
                setSelectedUser(user);
                setMessages([]);
              }}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h3>Söhbət {selectedUser ? `ilə ${selectedUser}` : ""}</h3>
        <div
          style={{
            border: "1px solid #ccc",
            height: "300px",
            padding: "10px",
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.from === currentUser.username ? "right" : "left",
                marginBottom: "5px",
              }}
            >
              <b>{m.from}: </b> {m.text}
            </div>
          ))}
        </div>
        <input type="text" ref={messageInputRef} placeholder="Mesaj yaz..." />
        <button onClick={sendMessage}>Göndər</button>
      </div>
    </div>
  );
};

export default Chat;
