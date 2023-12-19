import axios from "axios";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
const VideoChat = () => {
  const [peerId, setPeer] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentVideRef = useRef(null);
  const peerInstance = useRef(null);
  useEffect(() => {
    const peer = new Peer();
    peer.on("open", function (id) {
      console.log("My Id" + id);
      setPeer(id);
    });

    peer.on("call", (call) => {
      var getUserMedia = navigator.getUserMedia;
      getUserMedia({ video: true, audio: true }, function (mediaStream) {
        call.answer(mediaStream);
      });
    });
    peerInstance.current = peer;
  }, []);

  const call = (remoteId) => {
    axios
      .post("http://notify.quiz2play.com/api/v1/vidchat/getRandomUser", {
        currentUserChatId: remoteId,
      })
      .then((re) => {
        setRemotePeerId(re.data.remoteUseChatId);
        console.log(re.data.remoteUseChatId);
      })
      .catch((err) => {
        console.log(err);
      });
    var getUserMedia = navigator.getUserMedia;
    getUserMedia({ video: true, audio: true }, function (mediaStream) {
      currentVideRef.current.srcObject = mediaStream;
      currentVideRef.current.play();
      const call = peerInstance.current.call(remoteId, mediaStream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <>
      <div className="container">
        <div className="video-container">
          <div className="full-screen-video">
            {peerId}
            <video ref={remoteVideoRef} className="remote-video" />
          </div>

          <div className="popup-video">
            {/* {peerId} */}
            <video ref={currentVideRef} className="local-video" muted />
          </div>
        </div>
        <div className="btn-container">
          <button onClick={() => call(remotePeerId)} className="call-button">
            <MdOutlineCallEnd size={20} color="white" />
          </button>
          {/* <button onClick={() => call(remotePeerId)} className="call-button">
            Next
          </button> */}
        </div>
      </div>
    </>
  );
};
export default VideoChat;
