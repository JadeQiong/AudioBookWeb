import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import './ContinuousSlider.css';
import Forward30Icon from '@mui/icons-material/Forward30';
import Replay30Icon from '@mui/icons-material/Replay30';

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
  value?: number;
  onValueUpdated?: any;
}>;

export const ContinuousSlider: React.FC<SliderProps> = React.forwardRef<
  ContinuousSliderRef,
  SliderProps
>(
  (
    {
      title,
      isHide,
      setIsHide,
      playing,
      setPlaying,
      handlePlayPause,
      currentTime,
      coverImage,
      duration,
      onTimeUpdate,
      onDurationChange,
      value,
      onValueUpdated,
    },
    ref
  ) => {
    const [lastUpdateTime, setLastUpdateTime] = React.useState<number | null>(
      null
    );

    const handleForward30 = () => {
      // if (audioRef.current) {
      //   audioRef.current.currentTime = Math.min(
      //     audioRef.current.currentTime + 30,
      //     duration
      //   );
      //   updateRotationDegree();
      // }
    };

    const handleBack30 = () => {
      // if (audioRef.current) {
      //   audioRef.current.currentTime = Math.max(
      //     audioRef.current.currentTime - 30,
      //     0
      //   );
      //   updateRotationDegree();
      // }
    };

    const updateRotationDegree = () => {
      const now = Date.now();
      if (lastUpdateTime) {
        const elapsedTime = now - lastUpdateTime;
        setRotationDegree((prev) => prev + elapsedTime * 0.18);
      }
      setLastUpdateTime(now);
    };
    const [rotationDegree, setRotationDegree] = React.useState<number>(0);

    const handleChange = (event: Event, newValue: number | number[]) => {
      const newTime = ((newValue as number) / 100) * duration;
      onTimeUpdate(newTime);
      onValueUpdated((newTime / duration) * 100);
    };

    // const handleClose = () => {
    //   setIsHide(true);
    //   handlePlayPause();
    // }

    React.useEffect(() => {
      let interval: number | undefined;
      if (playing) {
        interval = window.setInterval(() => {}, 1000);
      }
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [playing, lastUpdateTime]);

    if (!isHide) {
      return (
        <Box
          sx={{
            width: 350,
            zIndex: 3,
            color: 'white',
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translateX(-50%)',
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
            {/* <IconButton
              // onClick={handleClose}
              sx={{
                height: 10,
                width: 10,
                marginRight: -5,
              }}
            >
              <CloseIcon sx={{ color: 'white', scale: '0.8' }} />
            </IconButton> */}
          </Box>

          <Stack
            direction="row"
            sx={{ zIndex: 2 }}
            padding={0}
            alignItems="center"
          >
            {coverImage && (
              <Box
                component="div"
                sx={{
                  maxHeight: 40,
                  maxWidth: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: `rotate(${rotationDegree}deg)`,
                  border: '4px solid rgba(128, 128, 128, 0.5)', // Add transparent gray border
                }}
                className={playing ? 'spinning' : 'paused'}
              >
                <img
                  src={coverImage}
                  alt="Cover"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
            )}
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

            <IconButton
              onClick={handleBack30}
              sx={{ height: 10, width: 10, margin: 0.5, scale: '1.2' }}
            >
              <Replay30Icon sx={{ color: 'white' }} />
            </IconButton>

            <IconButton
              onClick={handlePlayPause}
              sx={{ height: 10, width: 10, margin: 0.5, scale: '1.2' }}
            >
              {playing ? (
                <StopIcon sx={{ color: 'white' }} />
              ) : (
                <PlayArrowIcon sx={{ color: 'white' }} />
              )}
            </IconButton>

            <IconButton
              onClick={handleForward30}
              sx={{ height: 10, width: 10, margin: 0.5, scale: '1.2' }}
            >
              <Forward30Icon sx={{ color: 'white' }} />
            </IconButton>
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

export default ContinuousSlider;
