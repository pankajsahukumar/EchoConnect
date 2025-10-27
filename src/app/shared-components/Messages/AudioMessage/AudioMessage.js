import React, { useRef, useState, useEffect } from "react";
import "./AudioMessage.css"; // 👈 CSS below
import MessageTimeStamp from "app/shared-components/common/MessageTimeStamp";
import MessageContainer from "app/shared-components/common/MessageContainer";

const AudioMessage = ({ message, isMine }) => {

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioUrl = message?.fileUrl || message?.fileUrl;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <MessageContainer isMine={isMine}>
      <div className={`audio-bubble ${isMine ? "mine" : "theirs"}`}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {/* Play Button */}
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="audio-progress">
          <div
            className="audio-progress-filled"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Duration + Timestamp */}
        <div className="audio-info">
          <span className="audio-time">{formatTime(currentTime)}</span>
          <span className="audio-clock">{message?.time || "22:02"}</span>
        </div>
      </div>

      <MessageTimeStamp isRead={isMine} message={message} />
    </MessageContainer>
  );
};

export default AudioMessage;
