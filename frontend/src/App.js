import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import "./App.css";

const WEBSOCKET_URL = "wss://bilibili-sync.azurewebsites.net/";

function App() {
  const [url, setUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "play") {
        setIsPlaying(true);
      } else if (data.type === "pause") {
        setIsPlaying(false);
      } else if (data.type === "seek") {
        playerRef.current.seekTo(data.time);
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
    ws.current.send(JSON.stringify({ type: "play" }));
  };

  const handlePause = () => {
    setIsPlaying(false);
    ws.current.send(JSON.stringify({ type: "pause" }));
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    ws.current.send(JSON.stringify({ type: "seek", time }));
  };

  return (
    <div className="container">
      <h1>Bilibili Sync Player</h1>
      <input
        type="text"
        placeholder="Enter Bilibili video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        width="80%"
        height="450px"
      />
    </div>
  );
}

export default App;
