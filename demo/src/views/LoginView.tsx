import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Link, Box, Stack } from '@mui/material';
import { TextFieldStyle } from '../styles/commonStyles';
import { IconButton, InputAdornment } from '@mui/material';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleLogo from '../assets/images/google.svg';
import ContinueIcon from '../assets/images/continue_button.svg';

const LoginView = () => {
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
    <Stack sx={{ marginTop: '15%' }} minHeight="85vh">
      <Typography sx={{ fontSize: 36, fontWeight: 'bold' }}>
        Welcome to Booktalks
      </Typography>

      <Typography sx={{ fontSize: 20, color: '#AFAFAF' }} margin={2}>
        Dive into book podcasts made for you.
      </Typography>

      <Box display="flex" flexDirection="column" p={2}>
        <Stack marginTop={2} marginBottom={2}>
          <img
            src={GoogleLogo}
            width={'100%'}
            onClick={handleGoogleSignIn}
            style={{ cursor: 'pointer', alignItems: 'center', margin: 2 }}
          />
        </Stack>

        <Typography variant="body1" gutterBottom>
          or
        </Typography>

        <Typography
          margin={1}
          align="left"
          sx={{ fontWeight: 'bold', fontSize: 19 }}
        >
          Email Address
        </Typography>
        <TextField
          placeholder="@gmail.com"
          variant="outlined"
          fullWidth
          value={email}
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          inputProps={{ style: { color: 'white' } }}
          onChange={(e) => setEmail(e.target.value)}
          sx={TextFieldStyle}
        />
        <Typography
          margin={1}
          marginTop={0}
          align="left"
          sx={{ fontWeight: 'bold', fontSize: 19 }}
        >
          Password
        </Typography>
        <TextField
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={password}
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          onChange={(e) => setPassword(e.target.value)}
          sx={TextFieldStyle}
          InputProps={{
            style: { color: 'white' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <img
          src={ContinueIcon}
          width={'100%'}
          // height={47}
          onClick={handleEmailLogin}
          style={{ cursor: 'pointer', alignItems: 'center', margin: 2 }}
        />
        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#AFAFAF', textAlign: 'left' }}
        >
          No account?{' '}
          <Link href="/signup" underline="hover" color="white">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
};

export default LoginView;
