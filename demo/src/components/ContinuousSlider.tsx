import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

export type SliderProps = Readonly<{
  audio?: any;
}>;

export const ContinuousSlider: React.FC<SliderProps> = ({ audio }) => {
  const [value, setValue] = React.useState<number>(30);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = React.useState<number>(0); // Duration of the audio
  const [volume, setVolume] = React.useState<number>(50); // Default volume level at 50%

  // Update the current time of the audio as it plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setValue(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  // Jump to new time in the audio file
  const handleChange = (event: Event, newValue: number | number[]) => {
    const newTime = ((newValue as number) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setValue(newValue as number);
  };

  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 10, 100); // Ensures volume does not exceed 100%
    setVolume(newVolume);
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

  React.useEffect(() => {
    setValue(0);
    setPlaying(false);
    setDuration(0);
    setVolume(50);
  }, [audio]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Convert percentage to a scale from 0 to 1
    }
  }, [volume]);

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Box
          onClick={handlePlayPause}
          sx={{
            '&:hover': {
              opacity: 0.7, // 70% opacity on hover
              cursor: 'pointer', // Changes the cursor to a pointer
            },
          }}
        >
          {playing ? <StopIcon /> : <PlayArrowIcon />}
        </Box>
        <Slider
          aria-label="Audio Progress"
          value={value}
          onChange={handleChange}
          min={0}
          max={100}
        />
        <Box
          onClick={handleVolumeUp}
          sx={{
            '&:hover': {
              opacity: 0.7, // 70% opacity on hover
              cursor: 'pointer', // Changes the cursor to a pointer
            },
          }}
        >
          <VolumeUpIcon></VolumeUpIcon>
        </Box>
      </Stack>
      <audio
        ref={audioRef}
        src={audio}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
    </Box>
  );
};
