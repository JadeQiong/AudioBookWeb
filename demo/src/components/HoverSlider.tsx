import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
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
  cover_url?: string;
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
      currentTime,
      duration,
      onTimeUpdate,
      onDurationChange,
      value,
      onValueUpdated,
      cover_url,
    },
    ref
  ) => {
    useEffect(() => {
      let isMounted = true; // Flag to track whether component is mounted
      console.log('mounted ', audioRef, audio);
      return () => {
        isMounted = false; // Set flag to false when the component unmounts
      };
    }, []);

    const [rotationDegree, setRotationDegree] = React.useState<number>(0);
    const [lastUpdateTime, setLastUpdateTime] = React.useState<number | null>(
      null
    );
    const [error, setError] = React.useState('');
    const audioRef = React.useRef<HTMLAudioElement>(null);
    React.useEffect(() => {
      // Reset error state whenever the source changes
      setError('');

      const handleAudioError = () => {
        setError('The audio file could not be played.');
      };

      if (audioRef.current) {
        audioRef.current.addEventListener('error', handleAudioError);
      }

      return () => {
        // Clean up the event listener when the component unmounts or the source changes
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleAudioError);
        }
      };
    }, [audio]);

    useEffect(() => {
      console.log('Audio Ref on Mount:', audioRef.current); // Check ref assignment
    }, []);

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
          const time = audioRef.current.currentTime;
          onValueUpdated((time / audioRef.current.duration) * 100);
        }
      }
    };

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

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
      if (playing && audioRef.current && audioRef.current.paused) {
        if (!error) {
          audioRef.current.play().catch((e) => {
            console.error('Error playing the audio:', e);
            setError('Failed to play audio.');
          });
        }
      } else if (!playing && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }, [playing, error]);

    // React.useEffect(() => {
    //   // Listen for changes in the playing prop
    //   if (playing && audioRef.current && audioRef.current.paused) {
    //     audioRef.current.play();
    //   } else if (!playing && audioRef.current && !audioRef.current.paused) {
    //     audioRef.current.pause();
    //   }
    // }, [playing]);

    React.useLayoutEffect(() => {
      console.log(audioRef, audioRef.current);
      if (audioRef.current) {
        onValueUpdated(0);

        const handleCanPlay = () => {
          if (audioRef.current) onDurationChange(audioRef.current.duration);
          setVolume(50);
          if (audioRef.current) audioRef.current.play();
          setPlaying(true);
          setLastUpdateTime(Date.now());
        };

        audioRef.current.addEventListener('canplay', handleCanPlay);
        onDurationChange(0);
        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('canplay', handleCanPlay);
          }
        };
      }
    }, [audio]);

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
      setPlaying(false);
    };

    return (
      <Box
        sx={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '400px',
          height: 'auto',
          zIndex: 10,
          color: 'white',
          visibility: isHide ? 'hidden' : 'visible',
        }}
      >
        {/* Top-Right Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: '-145px',
            right: '5px',
            height: '34px',
            width: '34px',
            backgroundColor: '#555555',
            color: 'white',
            '&:hover': {
              backgroundColor: '#666666',
            },
            zIndex: 11,
          }}
        >
          <CloseIcon sx={{ scale: '0.8' }} />
        </IconButton>
        <Box
          sx={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            width: '400px',
            height: 'auto',
            backgroundColor: 'rgba(42, 42, 42, 0.7)', // 30% transparency
            backdropFilter: 'blur(8px)', // Background blur effect
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.6)', // Drop shadow
            padding: 2,
            zIndex: 10,
            color: 'white',
            visibility: isHide ? 'hidden' : 'visible',
            borderRadius: '8px',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ height: '100%' }}
          >
            {/* Cover Image */}
            <img
              src={cover_url}
              alt="Cover"
              style={{
                width: '60px', // Slightly larger cover image
                height: '80px', // Make height equal to width
                objectFit: 'cover',
                borderRadius: '8px', // Rounded corners
                overflow: 'hidden',
              }}
            />

            {/* Middle Content */}
            <Stack direction="column" sx={{ flex: 1, maxWidth: '70%' }}>
              {/* Title */}
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Typography>
              <audio
                ref={audioRef}
                src={audio}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                preload="metadata"
                style={{ display: isHide ? 'none' : 'block' }}
              />

              {/* Slider */}
              <Slider
                aria-label="Audio Progress"
                value={value}
                onChange={handleChange}
                min={0}
                max={100}
                sx={{
                  width: '100%',
                  marginTop: 1,
                  '& .MuiSlider-thumb': {
                    height: 12, // Control button height
                    width: 12, // Control button width
                    borderRadius: '40%', // Control button shape
                    backgroundColor: 'transparent',
                  },
                  '& .MuiSlider-track': {
                    border: 'none',
                    height: 3, // Track height
                    borderRadius: 4, // Track border radius
                    background: 'linear-gradient(to right, #00008b, #fff)', // Gradient color
                  },
                  '& .MuiSlider-rail': {
                    height: 3, // Rail height
                    borderRadius: 4, // Rail border radius
                    backgroundColor: '#b3b3b3', // Rail color
                  },
                }}
              />

              {/* Time */}
              <Typography
                sx={{
                  fontSize: 12,
                  marginTop: 0.5,
                  color: '#cccccc',
                }}
              >
                {formatTime(Math.min(duration, (value / 100.0) * duration))} /{' '}
                {formatTime(duration)}
              </Typography>
            </Stack>

            {/* Play/Stop Button */}
            <IconButton
              onClick={() => {
                setPlaying(!playing);
              }}
              sx={{
                height: 40,
                width: 40,
                backgroundColor: '#444444',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: '#555555',
                },
              }}
            >
              {playing ? (
                <StopIcon sx={{ color: 'white', fontSize: 28 }} />
              ) : (
                <PlayArrowIcon sx={{ color: 'white', fontSize: 28 }} />
              )}
            </IconButton>
          </Stack>
        </Box>
      </Box>
    );
  }
);

export default HoverSlider;
