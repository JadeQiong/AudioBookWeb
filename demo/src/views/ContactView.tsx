import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Link, Box, Stack } from '@mui/material';
import { TextFieldStyle } from '../styles/commonStyles';
import { IconButton, InputAdornment } from '@mui/material';
import emailUsIcon from '../assets/images/emailUs.svg';
import { AddBox, WidthFull } from '@mui/icons-material';

const ContactView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  console.log('login view is here');
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    } else {
      console.log('Redirecting for Google authentication', data);
    }
  };

  const handleEmailLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error logging in with email:', error.message);
    } else {
      console.log('Successfully logged in', data);
    }
  };

  return (
    <Stack
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      minHeight="85vh"
    >
      <Box sx={{ width: '40%' }}>
        <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
          How can we help you
        </Typography>

        <Typography sx={{ fontSize: 20, color: '#AFAFAF' }} marginTop={2}>
          If you have specific questions regarding your account, email us and we
          will work with you as soon as possible.
        </Typography>
      </Box>

      <Stack width="35%" spacing={2}>
        <Typography sx={{ fontSize: 20, color: '#AFAFAF' }} marginTop={2}>
          Email us at{' '}
          <span style={{ color: 'white' }}>support@booktalks.ai</span>
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
          <img
            src={emailUsIcon}
            width={'327px'}
            // height={47}
            onClick={handleEmailLogin}
            style={{ cursor: 'pointer', alignItems: 'center', margin: 2 }}
          />
        </a>
      </Stack>
    </Stack>
  );
};

export default ContactView;
