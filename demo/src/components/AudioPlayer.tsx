// src/components/AudioPlayer.tsx

import React, { useRef, useState } from 'react';
import ReactGA from 'react-ga';
import { Book } from '../types/book';

interface AudioPlayerProps {
  book: Book;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ book }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      setPlayCount((prevCount) => prevCount + 1);

      // Track playback event with Google Analytics
      ReactGA.event({
        category: 'Audio',
        action: 'Play',
        label: book.title,
        value: 1,
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src={book.audioSrc} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <p>Play Count: {playCount}</p>
    </div>
  );
};

export default AudioPlayer;
