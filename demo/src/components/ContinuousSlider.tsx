import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Forward30Icon from '@mui/icons-material/Forward30';
import Replay30Icon from '@mui/icons-material/Replay30';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || !seconds) {
    seconds = 0;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    : `${m}:${s < 10 ? '0' : ''}${s}`;
};

export type ContinuousSliderRef = {
  handlePlayPause: () => void;
};

export type SliderProps = Readonly<{
  ref?: React.LegacyRef<ContinuousSliderRef>;
  audio?: any;
  title?: string;
  isHide: boolean;
  setIsHide?: any;
  playing: boolean;
  setPlaying?: any;
}>;

export const ContinuousSlider: React.FC<SliderProps> = React.forwardRef<
  ContinuousSliderRef,
  SliderProps
>(({ audio, title, isHide, setIsHide, playing, setPlaying }, ref) => {
  const [value, setValue] = React.useState<number>(0);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = React.useState<number>(0); // Duration of the audio
  const [volume, setVolume] = React.useState<number>(50); // Default volume level at 50%

  // Update the current time of the audio as it plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (
        audioRef.current.duration &&
        !isNaN(audioRef.current.currentTime / audioRef.current.duration)
      ) {
        setValue(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      }
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
    } else {
      setPlaying(false);
    }
  };

  const hanldeClose = () => {
    handleStop();
    setIsHide(true);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setValue(0);
  };

  const handleForward30 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 30,
        duration
      );
    }
  };

  const handleBack30 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 30,
        0
      );
    }
  };

  React.useEffect(() => {
    setValue(0);
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
    setDuration(0);
    setVolume(50);
  }, [audio]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Convert percentage to a scale from 0 to 1
    }
  }, [volume]);

  // Expose handlePlayPause to the parent component
  React.useImperativeHandle(ref, () => ({
    handlePlayPause,
  }));

  if (!isHide) {
    return (
      <Box sx={{ width: 350 }}>
        <Box
          display="flex"
          sx={{
            height: 20,
            fontSize: 12,
            fontWeight: 'bold',
            paddingLeft: 5,
            paddingRight: 5,
          }}
          alignItems="center"
          justifyContent="center"
        >
          {title}

          <IconButton
            onClick={hanldeClose}
            sx={{
              height: 10,
              width: 10,
              position: 'absolute',
              top: 1000,
              right: 420,
            }}
          >
            <CloseIcon sx={{ color: 'white', height: 15, width: 15 }} />
          </IconButton>
        </Box>

        <Stack
          direction="row"
          sx={{ zIndex: 2 }}
          padding={0}
          alignItems="center"
        >
          <IconButton
            onClick={handleBack30}
            sx={{ height: 10, width: 10, margin: 0.5 }}
          >
            <Replay30Icon sx={{ color: 'white' }} />
          </IconButton>

          <IconButton
            onClick={handlePlayPause}
            sx={{ height: 10, width: 10, margin: 0.5 }}
            disabled={!audio}
          >
            {playing ? (
              <StopIcon sx={{ color: 'white' }} />
            ) : (
              <PlayArrowIcon sx={{ color: 'white' }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleForward30}
            sx={{ height: 10, width: 10, margin: 0.5 }}
          >
            <Forward30Icon sx={{ color: 'white' }} />
          </IconButton>

          <Typography sx={{ fontSize: 12, margin: 2 }}>
            {formatTime(value)}
          </Typography>

          <Slider
            aria-label="Audio Progress"
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
          />

          <Typography sx={{ fontSize: 12, margin: 1 }}>
            {formatTime(duration)}
          </Typography>
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
  }
  return <></>;
});

export default ContinuousSlider;
