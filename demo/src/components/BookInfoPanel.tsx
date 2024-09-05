import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Link,
  Stack,
  IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import LaunchIcon from '@mui/icons-material/Launch';

interface BookInfo {
  title: string;
  author: string;
  categories: string[];
  description: string;
  link: string;
  handleAudioChange: any;
  handleTriggerPlayPause: any;
  playing: boolean;
  isCurrent: boolean;
}

const BookInfoPanel: React.FC<BookInfo> = ({
  title,
  author,
  categories,
  description,
  link,
  handleAudioChange,
  handleTriggerPlayPause,
  playing,
  isCurrent,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        color: 'white',
        width: '26rem',
        height: '39rem',
        maxWidth: '100%',
        backgroundSize: 'cover',
        borderRadius: '8px',
      }}
    >
      <Box sx={{ padding: '20px' }}>
        <Typography
          component="h4"
          sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'left' }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ marginBottom: '10px', fontSize: 15, textAlign: 'left' }}
        >
          by {author}
        </Typography>

        <Stack
          direction="row"
          marginBottom={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outlined"
            sx={{
              height: 20,
              width: 100,
              borderRadius: '10px',
              borderColor: 'white',
              color: 'white',
              textTransform: 'none',
              fontSize: 16,
              alignItems: 'left',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            component={Link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={
              <LaunchIcon
                sx={{
                  height: 14,
                  width: 14,
                  marginTop: 1,
                  marginRight: 8,
                }}
              />
            }
          >
            <Typography
              sx={{
                fontSize: 15,
                height: 15,
                marginBottom: 1,
              }}
            >
              Source
            </Typography>
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} marginTop={2} marginBottom={2}>
          {categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              sx={{
                backgroundColor: '#343434',
                fontSize: '12px',
                height: 25,
                color: '#DADADA',
                maxWidth: 85,
              }}
            />
          ))}
        </Stack>

        <Typography sx={{ fontSize: 15, textAlign: 'left' }}>
          {description}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={() => {
            if (isCurrent) {
              handleTriggerPlayPause();
            } else {
              handleAudioChange();
            }
          }}
          sx={{
            scale: '1.5',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {playing && isCurrent ? (
            <StopIcon sx={{ color: 'white' }} />
          ) : (
            <PlayArrowIcon sx={{ color: 'white' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default BookInfoPanel;
