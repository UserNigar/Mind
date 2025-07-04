import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startCall,
  receiveCall,
  acceptCall,
  rejectCall,
  endCall,
} from "../../Redux/VideoSlice";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050"); // server URL-ni burada dəyişə bilərsən

const VideoCall = ({ user, targetUser }) => {
  const dispatch = useDispatch();
  const {
    isCalling,
    isReceiving,
    callAccepted,
    inCall,
    offer,
    fromCaller,
  } = useSelector((state) => state.video);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  // Kameranı və mikrafonu işə sal
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      })
      .catch((err) => {
        console.error("Kamera və mikrofon açılmadı:", err);
      });
  }, []);

  // socket event-lərini qulaq as
  useEffect(() => {
    socket.on("call-made", async ({ offer, from, name }) => {
      dispatch(receiveCall({ from, offer, name }));
    });

    socket.on("answer-made", async ({ answer, from }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        dispatch(acceptCall());
      }
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      if (peerRef.current && candidate) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("ICE candidate əlavə etmək alınmadı", err);
        }
      }
    });

    socket.on("call-rejected", () => {
      dispatch(rejectCall());
      endVideoCall();
      alert("Zəng rədd edildi");
    });

    socket.on("call-ended", () => {
      endVideoCall();
      alert("Zəng bitdi");
    });

    return () => {
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [dispatch]);

  // RTCPeerConnection yaratmaq
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: targetUser.username === user.username ? fromCaller : targetUser.username,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return peer;
  };

  // Zəng et
  const handleCall = async () => {
    if (!targetUser) {
      alert("Zəng üçün istifadəçi seçin");
      return;
    }
    const peer = createPeer();
    peerRef.current = peer;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("call-user", {
      toUsername: targetUser.username,
      offer,
      name: user.username,
    });

    dispatch(startCall());
  };

  // Zəngi qəbul et
  const handleAccept = async () => {
    const peer = createPeer();
    peerRef.current = peer;

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("make-answer", {
      to: fromCaller,
      answer,
    });

    dispatch(acceptCall());
  };

  // Zəngi rədd et
  const handleReject = () => {
    socket.emit("reject-call", { from: fromCaller });
    dispatch(rejectCall());
  };

  // Zəngi bitir
  const endVideoCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    dispatch(endCall());

    socket.emit("call-ended", { to: targetUser.username });
  };

  // Video toggle
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Audio toggle
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📹 Video Zəng
          </h1>
          {targetUser && (
            <p className="text-xl text-gray-300">
              {targetUser.username} ilə əlaqə
            </p>
          )}
        </div>

        {/* Video Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-black bg-opacity-30 rounded-3xl p-8 backdrop-blur-sm border border-white border-opacity-20">
            
            {/* Call Status */}
            {inCall && (
              <div className="absolute top-4 left-4 bg-green-500 bg-opacity-90 rounded-full px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}

            {isCalling && (
              <div className="absolute top-4 left-4 bg-blue-500 bg-opacity-90 rounded-full px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Zəng edilir...</span>
              </div>
            )}

            {isReceiving && (
              <div className="absolute top-4 left-4 bg-orange-500 bg-opacity-90 rounded-full px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Gələn zəng...</span>
              </div>
            )}

            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Local Video */}
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 lg:h-96 rounded-2xl bg-gray-800 object-cover shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {user?.username || "Siz"}
                  </span>
                </div>
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👤</div>
                      <p className="text-white">Kamera bağlıdır</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Remote Video */}
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 lg:h-96 rounded-2xl bg-gray-800 object-cover shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {targetUser?.username || fromCaller || "Qarşı tərəf"}
                  </span>
                </div>
                {!inCall && (
                  <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-white">Zəng gözləyir...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-6">
              {/* Call Controls */}
              {!inCall && !isReceiving && (
                <button
                  onClick={handleCall}
                  className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="text-2xl">📞</span>
                  <span>Zəng et</span>
                </button>
              )}

              {/* Incoming Call Controls */}
              {isReceiving && !callAccepted && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleAccept}
                    className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-3"
                  >
                    <span className="text-2xl">✅</span>
                    <span>Qəbul et</span>
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-3"
                  >
                    <span className="text-2xl">❌</span>
                    <span>Rədd et</span>
                  </button>
                </div>
              )}

              {/* In Call Controls */}
              {inCall && (
                <div className="flex space-x-4">
                  <button
                    onClick={toggleVideo}
                    className={`${isVideoOn ? 'bg-gray-600' : 'bg-red-600'} text-white px-6 py-4 rounded-full font-semibold shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-2`}
                  >
                    <span className="text-xl">{isVideoOn ? '📹' : '🚫'}</span>
                  </button>
                  
                  <button
                    onClick={toggleAudio}
                    className={`${!isMuted ? 'bg-gray-600' : 'bg-red-600'} text-white px-6 py-4 rounded-full font-semibold shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-2`}
                  >
                    <span className="text-xl">{!isMuted ? '🎤' : '🔇'}</span>
                  </button>
                  
                  <button
                    onClick={endVideoCall}
                    className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transform active:scale-95 transition-all duration-200 flex items-center space-x-3"
                  >
                    <span className="text-2xl">📵</span>
                    <span>Zəngi Bitir</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl mb-2">👤</div>
                <p className="text-white font-semibold">
                  {user?.username || "İstifadəçi"}
                </p>
                <p className="text-gray-300 text-sm">Siz</p>
              </div>
              
              <div className="text-4xl">↔️</div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-white font-semibold">
                  {targetUser?.username || fromCaller || "Seçilməyib"}
                </p>
                <p className="text-gray-300 text-sm">Hədəf</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;