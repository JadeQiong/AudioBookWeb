import React from 'react';
import { Stack, Typography, Button, Box } from '@mui/material';
import '../App.css';
import startButton from '../assets/images/start_listening.png';
import { ThemeProvider, createMuiTheme } from '@mui/material';

const THEME = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    // "lineHeight": 1.5,
    // "letterSpacing": 0.32,
    // useNextVariants: true,
    // suppressDeprecationWarnings: true,
    h6: {
      fontWeight: 600,
    },
  },
});

interface Book {
  title: string;
  cover_url: string;
  category: string;
  author: string;
}

type DailyBookProps = {
  book: Book;
};

function DailyBook({ book }: DailyBookProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US');

  const handleStartListening = () => {};

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {/* Left panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
        }}
        padding={5}
        paddingLeft="10%"
      >
        <Typography sx={{ color: '#01DF6B', fontSize: 24 }}>
          {' '}
          Daily Fresh {formattedDate}
        </Typography>
        <ThemeProvider theme={THEME}>
          <Typography
            variant="h6"
            sx={
              book.title.length < 30
                ? { fontSize: 50 }
                : {
                    fontSize: 35,
                  }
            }
          >
            {book.title}
          </Typography>
        </ThemeProvider>
        <Typography
          sx={
            book.title.length < 30
              ? { color: '#A7A7A7', fontSize: 32 }
              : {
                  color: '#A7A7A7',
                  fontSize: 18,
                }
          }
        >
          By {book.author}
        </Typography>
        <img
          src={startButton}
          width={231}
          height={46}
          onClick={handleStartListening}
          style={{ cursor: 'pointer', marginTop: '3%' }}
        />
      </Box>

      {/* Right panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={book.cover_url}
          alt="Book Cover"
          style={{ width: '279px', height: '420px', objectFit: 'cover' }}
        />
      </Box>
    </Stack>
  );
}

export default DailyBook;
