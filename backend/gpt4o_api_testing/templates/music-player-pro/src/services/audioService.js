// src/services/audioService.js

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// preload an audio URL (returns Audio object)
const preload = (url) => {
  try {
    const a = new Audio();
    a.src = url;
    // don't autoplay; just load metadata
    a.preload = "metadata";
    // start loading
    a.load();
    return a;
  } catch (e) {
    console.warn("Audio preload failed", e);
    return null;
  }
};

const audioService = {
  formatTime,
  preload
};

export default audioService;
