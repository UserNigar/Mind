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
// import "./Chat.css"; // No longer needed

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
  }, [currentUser, selectedUser, dispatch]); // Added dispatch to dependency array

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
      <div className="flex gap-5 p-5 h-screen box-border bg-[#f0f2f5] font-sans">
        <div className="w-72 bg-white rounded-lg shadow-md p-4 flex flex-col">
          <h3 className="m-0 mb-4 font-semibold text-[#333]">İstifadəçilər</h3>
          <input
              placeholder="Axtar..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-2 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ul className="list-none p-0 m-0 overflow-y-auto flex-grow">
            {filteredUsers.map((user) => (
                <li
                    key={user.username}
                    className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors duration-250 ease-in-out text-[#444] select-none
                ${user.username === selectedUser ? "bg-[#1976d2] text-white font-semibold shadow-lg shadow-blue-500/60" : ""}
                hover:bg-[#e0e7ff]`}
                    onClick={() => dispatch(setSelectedUser(user.username))}
                >
                  <img
                      src={`http://localhost:5050/photos/${user.photo}`}
                      alt={`${user.username} profil`}
                      className={`w-9 h-9 rounded-full object-cover border-2 transition-colors duration-300 ease-in-out
                  ${onlineUsers.includes(user.username) ? "border-[#2e7d32]" : "border-transparent"}
                  ${user.username === selectedUser ? "border-white" : ""}`}
                  />
                  <span className={`flex-grow text-base
                ${user.username === selectedUser ? "text-white" : ""}
                ${onlineUsers.includes(user.username) ? "text-[#2e7d32]" : "text-gray-600"}`}>
                {user.username}
              </span>
                  {onlineUsers.includes(user.username) && <span className="text-lg select-none">🟢</span>}
                </li>
            ))}
          </ul>
        </div>

        <div className="flex-grow bg-white rounded-lg shadow-md flex flex-col p-4 h-auto"> {/* Changed height to h-auto or removed fixed height if not needed */}
          <h3 className="m-0 mb-4 font-semibold text-[#333]">{selectedUser ? `${selectedUser} ilə söhbət` : "İstifadəçi seçin"}</h3>
          <div className="flex-grow overflow-y-auto border border-gray-300 rounded-md p-2.5 bg-[#281d1d]">
            {messages.map((m, i) => (
                <div
                    key={i}
                    className={`mb-2.5 max-w-[70%] break-words
                ${m.from === currentUser.username ? "ml-auto text-right" : "mr-auto text-left"}`}
                >
              <span className={`inline-block p-2.5 rounded-xl text-sm leading-tight
                ${m.from === currentUser.username ? "bg-[#d1ffd1] text-black" : "bg-[#e6e6e6] text-black"}`}>
                <b>{m.from}: </b> {m.text}
              </span>
                </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2.5">
            <input
                type="text"
                ref={messageInputRef}
                placeholder="Mesaj yaz..."
                className="flex-grow p-2.5 text-base rounded-md border border-gray-300 outline-none transition-colors duration-300 ease-in-out focus:border-[#1976d2] focus:shadow-md focus:shadow-blue-500/50"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="bg-[#1976d2] border-none px-5 py-2.5 text-white rounded-md cursor-pointer font-semibold transition-colors duration-300 ease-in-out hover:bg-[#125ea4]">
              Göndər
            </button>
          </div>
        </div>
      </div>
  );
};

export default Chat;