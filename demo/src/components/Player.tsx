import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import './Player.css';
import Forward30Icon from '@mui/icons-material/Forward30';
import Replay30Icon from '@mui/icons-material/Replay30';


export type PlayerRef = {
  handlePlayPause: () => void;
};

export type SliderProps = Readonly<{
  ref?: React.LegacyRef<PlayerRef>;
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

export const Player: React.FC<SliderProps> = React.forwardRef<
  PlayerRef,
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
   

      return (
        <Box sx={{ width: 350, zIndex: 3 }}>
        </Box>
      );

  }
);

export default Player;
