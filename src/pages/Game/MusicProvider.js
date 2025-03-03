import React, { createContext, useContext, useState, useRef } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio("/GameMusic.mp3"));

  // 음악 재생 함수
  const playMusic = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      audio.loop = true;
      audio.play();
      setIsPlaying(true);
    }
  };

  // 음악 정지 함수
  const pauseMusic = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // 음악 상태 초기화
  const resetMusic = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
  };

  return (
    <MusicContext.Provider value={{ playMusic, pauseMusic, resetMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

// 커스텀 훅
export const useMusic = () => useContext(MusicContext);
