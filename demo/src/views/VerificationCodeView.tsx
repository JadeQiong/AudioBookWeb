import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { TextFieldStyle } from '../styles/commonStyles';
import ContinueIcon from '../assets/images/continue_button.svg';

const VerificationCodeView = () => {
  const [verificationCode, setVerificationCode] = useState(Array(5).fill('')); // Initialize with 5 empty strings

  const handleInputChange = (value: string, index: number) => {
    if (/\d/.test(value) || value === '') {
      setVerificationCode((prev) => {
        const updated = [...prev]; // Clone the array
        updated[index] = value; // Update the specific index
        return updated;
      });
      // Move to the next input if a digit is entered
      if (value !== '' && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const [resendTimer, setResendTimer] = useState(30); // Countdown timer for resend
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for the inputs

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [isResendDisabled, resendTimer]);

  const handleResendCode = () => {
    // Logic to resend the verification code
    console.log('Resend verification code');
    setResendTimer(30); // Reset the timer
    setIsResendDisabled(true); // Disable the button
    setVerificationCode(Array(5).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = () => {
    // Logic to verify the entered code
    console.log('Verification Code:', verificationCode);
  };
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (
      e.key === 'Backspace' &&
      !verificationCode[index] &&
      inputRefs.current[index - 1]
    ) {
      // Move to the previous input if Backspace is pressed on an empty field
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Stack minHeight="85vh">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
        p={2}
      >
        <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
          Welcome to BookTalks
        </Typography>

        <Typography sx={{ fontSize: 20, color: '#AFAFAF' }} marginTop={2}>
          Dive into book podcasts made for you.
        </Typography>
        <Typography
          sx={{ fontSize: 20, marginTop: 2, color: 'white' }}
          gutterBottom
        >
          Verification Code
        </Typography>
        <Typography sx={{ fontSize: 16, color: '#cccccc', marginBottom: 2 }}>
          Enter the verification code sent to your email address
        </Typography>

        {/* Verification Code Input */}
        <Box display="flex" gap={1} justifyContent="center" marginBottom={2}>
          {[...Array(5)].map((_, index) => (
            <TextField
              key={index}
              variant="outlined"
              inputRef={(ref) => (inputRefs.current[index] = ref)} // Assign refs
              value={verificationCode[index] || ''}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onChange={(e) => handleInputChange(e.target.value, index)} // Update only the specific index
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: 20,
                  color: 'white', // Set font color to white
                  width: '3rem',
                  height: '3rem',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Rounded corners
                  border: '1px solid white', // Add white border
                  color: 'white', // Font color
                  '& fieldset': {
                    borderColor: 'white', // Ensure border color is white
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', // Keep border white on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white', // Keep border white when focused
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white', // Font color inside the input
                },
              }}
            />
          ))}
        </Box>

        {/* Verify Button */}
        <img
          src={ContinueIcon}
          width={'100%'}
          // height={47}
          onClick={handleVerify}
          style={{ cursor: 'pointer', alignItems: 'center', margin: 3 }}
        />

        <Box sx={{ width: '100%' }}>
          {/* Helper Text */}
          <Typography
            variant="body2"
            color="#cccccc"
            gutterBottom
            sx={{ textAlign: 'left', marginTop: 2 }}
          >
            Didn’t receive a code?{' '}
            <Button
              onClick={handleResendCode}
              // disabled={isResendDisabled}
              sx={{
                color: isResendDisabled ? '#888888' : 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '18px',

                padding: 0,
              }}
            >
              Resend ({resendTimer})
            </Button>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#cccccc', marginTop: 1, textAlign: 'left' }}
          >
            <Link
              href="/signin"
              underline="hover"
              sx={{
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Use another method
            </Link>
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default VerificationCodeView;
