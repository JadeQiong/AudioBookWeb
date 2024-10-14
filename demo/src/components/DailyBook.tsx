import React from 'react';
import { Stack, Typography, Button, Box } from '@mui/material';
import '../App.css';
import startButton from '../assets/images/start_listening.svg';
import { ThemeProvider, createMuiTheme } from '@mui/material';
import { Book } from '../types/book';

const THEME = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

type DailyBookProps = {
  book: Book;
  startListening: any;
};

function DailyBook({ book, startListening }: DailyBookProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US');

  const handleStartListening = () => {
    startListening(book?._id);
  };

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
        paddingLeft="18%"
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
          style={{ cursor: 'pointer', marginTop: '10%' }}
        />
      </Box>

      {/* Right panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: 5,
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
