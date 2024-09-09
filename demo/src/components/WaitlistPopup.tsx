import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import waitlistButton from '../assets/images/waitlist_button.png';
import axios from 'axios';
import arrowIcon from '../assets/images/arrow.png';
import { Padding } from '@mui/icons-material';

interface WaitlistPopupProps {
  //   open: boolean;
  //   handleClose: () => void;
}

function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
const baseUrl = `${window.location.protocol}//${window.location.host}`;
const WaitlistPopup: React.FC<WaitlistPopupProps> = ({}) => {
  const [fullName, setFullName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = useState<string>('');

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleSubmit = async () => {
    if (isValidEmail(email)) {
      setOpen(true);
      console.log('Submit', { fullName, userName, email });
      try {
        const response = await axios.post(`${baseUrl}/add-to-waitlist`, {
          name: fullName,
          email: email,
          question: content,
        });
        console.log(response.data);
        setOpen(true);
        setMsg('Thank you for joining our waitlist!');
      } catch (error) {
        setOpen(true);
        setMsg('Something went wrong, please try again.');
        console.log(error);
      }
    } else {
      setEmailError('Please enter a valid email address.');
    }
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
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleClose}
        message={msg}
        action={action}
      />

      <Box
        padding={5}
        sx={{
          width: 1461,
          height: 554,
          borderRadius: 10,
          borderColor: '#2D2E2F',
          borderWidth: 2,
          borderStyle: 'solid',
          p: 4,
          display: 'flex',
          backgroundColor: '#131313',
        }}
      >
        <Box
          sx={{
            flex: 1,
            mr: 2,
            padding: '50px',
            paddingTop: 3,
            paddingRight: 0,
          }}
        >
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
              fontSize: 37,
              fontWeight: 'bold',
              margin: '30px',
            }}
          >
            Discover the Joy of Books
          </Typography>

          <Box sx={{ color: 'white', marginTop: '60px' }}>
            <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
              BookTalks transforms your favorite books into AI-driven podcasts,
              sparking your curiosity and inviting you to explore them yourself.
            </Typography>
            <Box sx={{ height: 30 }}></Box>

            <Typography variant="body1" sx={{ mb: 1, textAlign: 'left' }}>
              This is just the beginning. We’re building a great product that
              will help you fall in love with reading, making every book an
              experience to savor.
            </Typography>
            <Box sx={{ height: 30 }}></Box>
            <Typography sx={{ mb: 1, textAlign: 'left' }}>
              Have additional questions?
            </Typography>
            <a
              href="mailto:info.booktalks.ai@gmail.com"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Typography
                sx={{
                  textAlign: 'left',
                  color: '#AEAEAE',
                  displa: 'flex',
                  justifyContent: 'center',
                }}
              >
                email us directly
                <img
                  src={arrowIcon}
                  width={65}
                  height={5}
                  style={{ padding: 2, margin: 2, cursor: 'pointer' }}
                />
              </Typography>
            </a>
          </Box>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          color="grey"
          sx={{ marginLeft: '60px', marginRight: '70px' }}
        />
        <Box
          sx={{
            flex: 1,
            padding: '50px',
            color: '#5E626D',
          }}
        >
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
                  borderColor: '#2C2E33', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
                backgroundColor: '#1C1C1C',
              },
              '& label.Mui-focused': {
                color: 'white',
              },
            }}
          />

          <Typography margin={1} align="left">
            Email*
          </Typography>
          <TextField
            fullWidth
            placeholder="@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={!!emailError} // Apply the error state conditionally
            helperText={emailError} // Show error message
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#2C2E33', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
                backgroundColor: '#1C1C1C',
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
            multiline={true}
            rows={4}
            onChange={(e) => setContent(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            inputProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#2C2E33', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when the component is focused
                },
                backgroundColor: '#1C1C1C',
              },
            }}
          />
          <Stack
            sx={{
              marginTop: '20px',
            }}
          >
            <img
              src={waitlistButton}
              width={231}
              height={46}
              onClick={handleSubmit}
              style={{ cursor: 'pointer', marginLeft: '400px' }}
            />
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default WaitlistPopup;
