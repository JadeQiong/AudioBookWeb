import React from 'react';
import { Stack, Typography, Button, Box } from '@mui/material';
import '../App.css';

interface Book {
  title: string;
  cover_url: string;
  category: string;
  author?: string;
}

type DailyBookProps = {
  book: Book;
};

function DailyBook({ book }: DailyBookProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US');

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
        <Typography sx={{ fontWeight: 'bold', fontSize: 44 }}>
          {book.title}
        </Typography>
        <Typography sx={{ color: '#A7A7A7', fontSize: 32 }}>
          {book.category}
        </Typography>
        <Button
          variant="outlined"
          sx={{ color: 'white', fontSize: 24, margin: 2 }}
          onClick={() => console.log('Start Listening')}
        >
          Start Listening
        </Button>
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
