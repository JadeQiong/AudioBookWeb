import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Forward30Icon from '@mui/icons-material/Forward30';
import Replay30Icon from '@mui/icons-material/Replay30';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import './HoverSlider.css';

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

export type HoverSliderRef = {
  handlePlayPause: () => void;
};

export type SliderProps = Readonly<{
  ref?: React.LegacyRef<HoverSliderRef>;
  audio?: any;
  title?: string;
  isHide: boolean;
  setIsHide?: any;
  playing: boolean;
  setPlaying?: any;
  handlePlayPause?: any;
  coverImage?: any;
  currentTime: number;
  duration: number;
  onTimeUpdate?: any;
  onDurationChange?: any;
  value?: any;
  onValueUpdated?: any;
}>;

export const HoverSlider: React.FC<SliderProps> = React.forwardRef<
  HoverSliderRef,
  SliderProps
>(
  (
    {
      audio,
      title,
      isHide,
      setIsHide,
      playing,
      setPlaying,
      handlePlayPause,
      coverImage,
      currentTime,
      duration,
      onTimeUpdate,
      onDurationChange,
      value,
      onValueUpdated,
    },
    ref
  ) => {
    const [rotationDegree, setRotationDegree] = React.useState<number>(0);
    const [lastUpdateTime, setLastUpdateTime] = React.useState<number | null>(
      null
    );

    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = React.useState<number>(50); // Default volume level at 50%

    const handleAudioEnded = () => {
      setPlaying(false);
      onValueUpdated(0);
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        if (
          audioRef.current.duration &&
          !isNaN(audioRef.current.currentTime / audioRef.current.duration)
        ) {
          onValueUpdated(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          );
        }
      }
    };

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

    useEffect(() => {
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          onDurationChange(audioRef.current.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          onTimeUpdate(audioRef.current.currentTime);
        }
      };

      const audioElem = audioRef.current;
      audioElem?.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElem?.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audioElem?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElem?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }, [onTimeUpdate, onDurationChange]);

    const handleChange = (event: Event, newValue: number | number[]) => {
      const newTime = ((newValue as number) / 100) * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        onValueUpdated((audioRef.current.currentTime / duration) * 100);
      }
    };

    const handleVolumeUp = () => {
      const newVolume = Math.min(volume + 10, 100); // Ensures volume does not exceed 100%
      setVolume(newVolume);
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        onDurationChange(audioRef.current.duration);
      }
    };

    React.useEffect(() => {
      // Listen for changes in the playing prop
      if (playing && audioRef.current && audioRef.current.paused) {
        audioRef.current.play();
      } else if (!playing && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }, [playing]);

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
      onValueUpdated(0);
      setRotationDegree(0);
    };

    const handleForward30 = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + 30,
          duration
        );
        updateRotationDegree();
      }
    };

    const handleBack30 = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(
          audioRef.current.currentTime - 30,
          0
        );
        updateRotationDegree();
      }
    };

    const updateRotationDegree = () => {
      const now = Date.now();
      if (lastUpdateTime) {
        const elapsedTime = now - lastUpdateTime;
        setRotationDegree((prev) => prev + elapsedTime * 0.18);
      }
      setLastUpdateTime(now);
    };

    React.useEffect(() => {
      onValueUpdated(0);
      if (audioRef.current) {
        onDurationChange(audioRef.current.duration);
        audioRef.current.play();
        setPlaying(true);
        setLastUpdateTime(Date.now());
        audioRef.current.addEventListener('ended', handleAudioEnded);
        return () => {
          if (audioRef.current)
            audioRef.current.removeEventListener('ended', handleAudioEnded);
        };
      }
      onDurationChange(0);
      setVolume(50);
    }, [audio]);

    React.useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume / 100; // Convert percentage to a scale from 0 to 1
      }
    }, [volume]);

    React.useEffect(() => {
      let interval: number | undefined;
      if (playing) {
        interval = window.setInterval(() => {
          updateRotationDegree();
        }, 1000);
      }
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [playing, lastUpdateTime]);

    const handleClose = () => {
      setIsHide(true);
      handlePlayPause();
    };

    if (!isHide) {
      return (
        <Box
          sx={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '400px',
            height: '72px',
            backgroundColor: '#333333',
            padding: 2,
            zIndex: 10,
            color: 'white',
          }}
        >
          <Box
            display="flex"
            sx={{
              height: 20,
              fontSize: 12,
              fontWeight: 'bold',
              paddingLeft: 5,
              paddingRight: 5,
            }}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box
              sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
            >
              {title}
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                height: 10,
                width: 10,
                marginRight: -5,
              }}
            >
              <CloseIcon sx={{ color: 'white', scale: '0.8' }} />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            sx={{ zIndex: 2 }}
            padding={0}
            alignItems="center"
          >
            <IconButton
              onClick={handlePlayPause}
              sx={{ height: 10, width: 10, margin: 0.5, scale: '1.5' }}
            >
              {playing ? (
                <StopIcon sx={{ color: 'white' }} />
              ) : (
                <PlayArrowIcon sx={{ color: 'white' }} />
              )}
            </IconButton>

            <audio
              ref={audioRef}
              src={audio}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              preload="metadata"
            />

            <Slider
              aria-label="Audio Progress"
              value={value}
              onChange={handleChange}
              min={0}
              max={100}
              sx={{
                width: '100%',
                marginLeft: 2,
                marginRight: 2,
                '& .MuiSlider-thumb': {
                  height: 12, // Control button height
                  width: 12, // Control button width
                  borderRadius: '40%', // Control button shape
                  backgroundColor: 'transparent',
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  marginLeft: 0.5,
                  marginRight: 0.5,
                  height: 3, // Track height
                  borderRadius: 4, // Track border radius
                  background: 'linear-gradient(to right, #00008b, #fff)', // Gradient color
                },
                '& .MuiSlider-rail': {
                  height: 12, // Rail height
                  borderRadius: 4, // Rail border radius
                  backgroundColor: '#b3b3b3', // Rail color
                },
              }}
            />
          </Stack>

          <Stack
            direction="row"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: -2,
            }}
          >
            <Typography sx={{ fontSize: 15, margin: 1 }}>
              {formatTime(Math.min(duration, currentTime))} /{' '}
              {formatTime(duration)}
            </Typography>
          </Stack>
        </Box>
      );
    }
    return <></>;
  }
);

export default HoverSlider;
