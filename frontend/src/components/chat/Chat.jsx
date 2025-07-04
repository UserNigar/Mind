import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedUser,
  getMessagesFromDB,
  sendMessageToDB,
  addMessage,
  incrementUnread,
  resetUnread,
  markMessagesAsRead,
} from "../../Redux/ChatSlice";
import { getUsers } from "../../Redux/UserSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chat = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const allUsers = useSelector((state) => state.users.users);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const messages = useSelector((state) => state.chat.messages);
  const unreadCounts = useSelector((state) => state.chat.unreadCounts);
  const [searchName, setSearchName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messageInputRef = useRef();
  const messageEndRef = useRef();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
      const toUsername = currentUser.username;
      if (fromUsername === selectedUser) {
        dispatch(addMessage({ from: fromUsername, to: toUsername, text: message }));
      } else {
        dispatch(incrementUnread(fromUsername));
        toast.info(`Yeni mesaj: ${fromUsername}`, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    });
    return () => newSocket.disconnect();
  }, [currentUser, selectedUser, dispatch]);

  useEffect(() => {
    if (!allUsers) return;
    const result = allUsers.filter(
      (u) =>
        u.username !== currentUser?.username &&
        u.username.toLowerCase().includes(searchName.toLowerCase())
    );
    const sorted = result.sort((a, b) => {
      const ai = recentUsers.indexOf(a.username);
      const bi = recentUsers.indexOf(b.username);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    setFilteredUsers(sorted);
  }, [searchName, allUsers, currentUser, recentUsers]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const token = localStorage.getItem("token");
    dispatch(getMessagesFromDB({ from: currentUser.username, to: selectedUser, token }));
    dispatch(resetUnread(selectedUser));
    dispatch(markMessagesAsRead(selectedUser));
  }, [selectedUser, currentUser, dispatch]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!socket || !selectedUser) return;
    const text = messageInputRef.current.value.trim();
    if (!text) return;

    const from = currentUser.username;
    const to = selectedUser;
    const token = localStorage.getItem("token");

    socket.emit("privateMessage", { fromUsername: from, toUsername: to, message: text });
    dispatch(sendMessageToDB({ from, to, text, token }));
    messageInputRef.current.value = "";
    setRecentUsers((prev) => [to, ...prev.filter((u) => u !== to)]);
  };

  if (!currentUser)
    return <p className="text-center text-gray-600 mt-8 dark:text-gray-300">Zəhmət olmasa daxil olun</p>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-[100px] text-gray-800 dark:text-white">

      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Söhbətlər</h2>
          <div className="relative">
            <input
              placeholder="İstifadəçi axtar..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.username}
              className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors duration-200 ${
                user.username === selectedUser ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              }`}
              onClick={() => dispatch(setSelectedUser(user.username))}
            >
              <div className="relative">
                <img
                  src={`http://localhost:5050/photos/${user.photo}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                {onlineUsers.includes(user.username) && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {unreadCounts[user.username] > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCounts[user.username]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {onlineUsers.includes(user.username) ? "Onlayn" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            {selectedUser ? (
              <>
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedUser.charAt(0).toUpperCase()}
                  </div>
                  {onlineUsers.includes(selectedUser) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {onlineUsers.includes(selectedUser) ? "Onlayn" : "Offline"}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="font-semibold">Söhbət üçün istifadəçi seçin</h3>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === currentUser.username ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                  m.from === currentUser.username
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-none"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{m.from}</span>
                  </div>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              ref={messageInputRef}
              placeholder="Mesaj yaz..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 active:bg-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Chat;
