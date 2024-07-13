import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop'; 
import audioFile from '../assets/educated.mp3'; 

export default function ContinuousSlider() {
  const [value, setValue] = React.useState<number>(30);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = React.useState<number>(0); // Duration of the audio

  // Update the current time of the audio as it plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setValue((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  // Jump to new time in the audio file
  const handleChange = (event: Event, newValue: number | number[]) => {
    const newTime = (newValue as number) / 100 * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setValue(newValue as number);
  };

  // Set the duration once the metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Adjust the volume of the audio element
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  }, [value]);

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <Box onClick={handlePlayPause}>
          {playing ? <StopIcon /> : <PlayArrowIcon />}
        </Box>
        <Slider
          aria-label="Audio Progress"
          value={value}
          onChange={handleChange}
          min={0}
          max={100}
        />
        </Stack>
        <audio
        ref={audioRef}
        src={audioFile}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
    </Box>
  );
}