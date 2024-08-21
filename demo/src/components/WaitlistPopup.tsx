import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

interface WaitlistPopupProps {
  //   open: boolean;
  //   handleClose: () => void;
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({}) => {
  const [fullName, setFullName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    console.log('Submit', { fullName, userName, email });
  };

  return (
    <Stack
      direction="column"
      sx={{
        width: 1300,
        height: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        padding={5}
        sx={{
          width: 1261,
          height: 554,
          borderRadius: 10,
          bgcolor: '#2D2E2F',
          p: 4,
          display: 'flex',
        }}
      >
        <Box sx={{ flex: 1, mr: 2, padding: '50px', paddingTop: 0 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              background:
                'linear-gradient(90deg, #01C55C 0%, #01B499 63%, #8E9FEB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline',
              fontSize: 42,
              fontWeight: 'bold',
              margin: '30px',
            }}
          >
            Discover the Joy of Books
          </Typography>

          <Box sx={{ color: 'white', marginTop: '20px' }}>
            <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
              BookTalks transforms your favorite books into AI-driven podcasts,
              sparking your curiosity and inviting you to explore them yourself.
            </Typography>
            <Box sx={{ height: 50 }}></Box>

            <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
              This is just the beginning. We’re building a great product that
              will help you fall in love with reading, making every book an
              experience to savor.
            </Typography>
            <Box sx={{ height: 50 }}></Box>
            <Typography sx={{ mb: 1, textAlign: 'left' }}>
              Have additional questions?
            </Typography>
            <Typography sx={{ textAlign: 'left' }}>
              email us directly
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem color="grey" />

        <Box sx={{ flex: 1, padding: '100px', paddingTop: '50px' }}>
          <Typography margin={1} align="left">
            Full Name
          </Typography>

          <TextField
            fullWidth
            placeholder="Jorge Luis Borges"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
              },
            }}
          />

          <Typography margin={1} align="left">
            Email
          </Typography>
          <TextField
            fullWidth
            placeholder="@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
              },
            }}
          />
          <Typography margin={1} align="left">
            What do you find challenging about reading
          </Typography>
          <TextField
            fullWidth
            placeholder="Lack of focus"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
              },
            }}
          />
          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'right', // This will align the button to the right
              alignItems: 'center', // Adjusts vertical alignment
              marginTop: '20px',
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: 'primary.main',
                width: '50%', // Button takes half of the Stack's width
                marginLeft: '50%',
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default WaitlistPopup;
