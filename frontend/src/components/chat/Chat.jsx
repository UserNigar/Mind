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
import { Search, Send, User, MessageCircle, Settings, Moon, Sun } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Chat = ({ darkMode, setDarkMode }) => {
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

  // Typing indicator  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [callIncoming, setCallIncoming] = useState(null); // { fromSocketId, name, offer }
  const [callActive, setCallActive] = useState(false);

  const messageInputRef = useRef();
  const messageEndRef = useRef();


  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);


  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
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
          theme: isDarkMode ? "dark" : "light",
        });
      }
    });

    newSocket.on("typing", ({ fromUsername }) => {
      if (fromUsername === selectedUser) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });


    newSocket.on("call-made", ({ offer, from: fromSocketId, name }) => {
      setCallIncoming({ fromSocketId, name, offer });
    });

    newSocket.on("answer-made", async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    newSocket.on("ice-candidate", async ({ candidate }) => {
      if (candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("ICE candidate error:", err);
        }
      }
    });

    newSocket.on("call-rejected", () => {
      alert("Zəng rədd edildi");
      endCall();
    });

    return () => {
      newSocket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUser, selectedUser, dispatch, isDarkMode]);


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


  const handleTyping = () => {
    if (!socket || !selectedUser) return;
    socket.emit("typing", { toUsername: selectedUser, fromUsername: currentUser.username });
  };


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

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Media stream error:", err);
      alert("Kamera və mikrofon girişinə icazə verin.");
    }
  };

 
  const startCall = async (toUsername) => {
    await getLocalStream();

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) socket.emit("ice-candidate", { to: toUsername, candidate: event.candidate });
    };

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("call-user", { toUsername, offer, name: currentUser.username });

    setCallActive(true);
  };


  const answerCall = async () => {
    await getLocalStream();

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) socket.emit("ice-candidate", { to: callIncoming.fromSocketId, candidate: event.candidate });
    };

    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(callIncoming.offer));

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socket.emit("make-answer", { to: callIncoming.fromSocketId, answer });

    setCallActive(true);
    setCallIncoming(null);
  };


  const rejectCall = () => {
    if (callIncoming) {
      socket.emit("reject-call", { from: callIncoming.fromSocketId });
      setCallIncoming(null);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallActive(false);
    setCallIncoming(null);
  };


  const callUser = (username) => {
    if (!socket) return;
    startCall(username);
    toast.success(`${username} istifadəçisinə zəng göndərildi!`, {
      position: "bottom-left",
      autoClose: 2000,
      theme: isDarkMode ? "dark" : "light",
    });
  };


  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Söhbətə Başla</h2>
          <p className="text-slate-600 dark:text-slate-300">Zəhmət olmasa daxil olun</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-80 flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-white">Söhbətlər</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{onlineUsers.length} online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                placeholder="İstifadəçi axtar..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {filteredUsers.map((user) => {
                const isSelected = user.username === selectedUser;
                const isOnline = onlineUsers.includes(user.username);
                const unreadCount = unreadCounts[user.username] || 0;

                return (
                  <div
                    key={user.username}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                    }`}
                    onClick={() => dispatch(setSelectedUser(user.username))}
                  >
                    <div className="relative">
                      {user.photo ? (
                        <img
                          src={`http://localhost:5050/photos/${user.photo}`}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-white/20">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}

                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                      )}

                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{user.username}</h3>
                        {unreadCount > 0 && !isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>


                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        callUser(user.username);
                      }}
                      className={`p-2 rounded-full hover:bg-blue-600 transition-colors duration-200 ${
                        isSelected ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                      }`}
                      title={`Zəng et ${user.username}`}
                    >
                      📞
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


<div className="flex flex-col w-full h-full bg-white dark:bg-slate-900">

  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm bg-white dark:bg-slate-900">
    <div className="flex items-center gap-3">
      {selectedUser ? (
        <>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedUser}</h2>
          {onlineUsers.includes(selectedUser) && (
            <span className="text-xs text-green-600">Online</span>
          )}
          {isTyping && (
            <em className="text-xs ml-3 text-gray-600 dark:text-gray-400">Yazır...</em>
          )}
        </>
      ) : (
        <h2 className="text-lg font-semibold text-gray-500">İstifadəçi seçin</h2>
      )}
    </div>

    {selectedUser && (
      <button
        onClick={() => callUser(selectedUser)}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Zəng et
      </button>
    )}
  </div>


  <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50 dark:bg-slate-800 transition-colors">
      {!messages.length && (
        <p className="text-center text-gray-400 dark:text-gray-500 mt-20">
          Söhbət üçün istifadəçi seçin
        </p>
      )}

      {messages.map((msg, idx) => {
        const isMe = msg.from === currentUser.username;
        return (
          <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[400px] px-4 py-2 rounded-2xl text-sm shadow-md break-words whitespace-pre-wrap relative ${
                isMe
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>



  {selectedUser && (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-3">
      <input
        ref={messageInputRef}
        type="text"
        placeholder="Mesaj yazın..."
        className="flex-1 rounded-full border border-slate-300 dark:border-slate-600 px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
          else handleTyping();
        }}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors"
        aria-label="Mesaj göndər"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )}
</div>


{(callIncoming || callActive) && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col items-center gap-6">

      {/* Zəng gəlir ekranı */}
      {!callActive && callIncoming && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {callIncoming.name} sizə zəng edir...
          </h2>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-40 h-28 sm:w-52 sm:h-36 md:w-60 md:h-40 rounded-xl bg-black shadow-lg"
          />

          <div className="flex gap-6 mt-4">
            <button
              onClick={answerCall}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow transition"
            >
              ✅ Cavab ver
            </button>
            <button
              onClick={rejectCall}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition"
            >
              ❌ Rədd et
            </button>
          </div>
        </>
      )}


      {callActive && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center w-full">
            <div className="flex flex-col items-center gap-2">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-48 h-32 sm:w-56 sm:h-40 rounded-xl bg-black shadow-lg"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser}</p>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-64 h-40 sm:w-72 sm:h-48 rounded-xl bg-black shadow-lg"
              />
            </div>
          </div>

          <button
            onClick={endCall}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition"
          >
            🔴 Zəngi bitir
          </button>
        </>
      )}
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Chat;
