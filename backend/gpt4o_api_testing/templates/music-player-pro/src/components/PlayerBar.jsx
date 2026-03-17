import React, { useEffect, useRef } from "react";
import { useMusicStore } from "../store/useMusicStore";

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seek,
    playNext
  } = useMusicStore();

  const audioRef = useRef(null);

  // Sync audio with store state:
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    audio.src = currentSong.audioUrl;

    if (isPlaying) audio.play();
    else audio.pause();
  }, [currentSong, isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    seek(audio.currentTime);
  };

  const handleEnded = () => {
    playNext();
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex items-center gap-4">

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <img 
        src={currentSong.image}
        className="w-14 h-14 rounded object-cover"
      />

      <div className="flex-1">
        <h4 className="font-semibold">{currentSong.title}</h4>
        <p className="text-sm text-gray-500">{currentSong.artistName}</p>

        {/* Seekbar */}
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={(e) => audioRef.current.currentTime = e.target.value}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <button onClick={togglePlay} className="px-4 py-2 bg-blue-600 text-white rounded">
        {isPlaying ? "Pause" : "Play"}
      </button>

    </div>
  );
};

export default PlayerBar;
