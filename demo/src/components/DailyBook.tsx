import React from 'react';
import { Stack, Typography, Button, Box } from '@mui/material';
import '../App.css';
import startButton from '../assets/images/start_listening.png';

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
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        padding={2}
      >
        <Typography sx={{ color: '#01DF6B', fontSize: 24 }}>
          {' '}
          Daily Fresh {formattedDate}
        </Typography>

        <Typography
          sx={
            book.title.length < 30
              ? { fontWeight: 'bold', fontSize: 44, maxHeight: '100px' }
              : {
                  fontWeight: 'bold',
                  fontSize: 28,
                  maxHeight: '100px',
                }
          }
        >
          {book.title}
        </Typography>

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
        <Stack
          margin={3}
          display="flex"
          sx={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={startButton}
            width={231}
            height={46}
            onClick={handleStartListening}
            style={{ cursor: 'pointer' }}
          />
        </Stack>
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
          style={{ width: '200px', height: '320px', objectFit: 'cover' }}
        />
      </Box>
    </Stack>
  );
}

export default DailyBook;
