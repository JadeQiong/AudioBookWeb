import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface WaitlistPopupProps {
  open: boolean;
  handleClose: () => void;
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({ open, handleClose }) => {
  const [fullName, setFullName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    console.log('Submit', { fullName, userName, email });
    handleClose(); // Close modal after submit
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="join-waitlist-modal"
      aria-describedby="join-waitlist-signup"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: 800,
          height: 400,
          bgcolor: '#2D2E2F',
          p: 4,
          display: 'flex',
        }}
      >
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* TODO */}
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 2, color: '#3350D2' }}
          >
            Welcome to the Beta family
          </Typography>
          <Box sx={{ color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: 'white', mr: 1 }} />
              <Typography>Request a Demo</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: 'white', mr: 1 }} />
              <Typography>Get Updated to the newest progress</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: 'white', mr: 1 }} />
              <Typography>Invited to discord channel</Typography>
            </Box>

            <Box sx={{ height: 50 }}></Box>
            <Typography sx={{ mb: 1 }}>Have additional questions?</Typography>
            <Typography>email us directly</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Full Name"
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

          <TextField
            fullWidth
            label="What do you find challenging about reading"
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

          <TextField
            fullWidth
            label="Email"
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

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: 'primary.main' }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WaitlistPopup;
