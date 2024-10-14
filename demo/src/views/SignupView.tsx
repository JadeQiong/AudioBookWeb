import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Link, Box } from '@mui/material';
import { TextFieldStyle } from '../styles/commonStyles';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignupView = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword(!showConfirmedPassword);

  const handleMouseDownConfirmedPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateEmail = (email: string) => {
    // Simple regex for validating an email address
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const [error, setError] = useState('');

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

  const handleSignup = async () => {
    setError('');

    // Basic validation
    if (username.trim() === '') {
      setError('Username is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmedPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Proceed with signup using supabase, including the username in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // Storing username in user_metadata
        },
      },
    });

    if (error) {
      console.error('Error sign up in with email:', error.message);
      setError('Sign-up failed. Please try again.');
    } else {
      console.log('Successfully sign up ', data);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="85vh"
      p={2}
    >
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>

      <Typography variant="body1" gutterBottom>
        Dive into book podcasts made for you.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleSignIn}
        fullWidth
        sx={{ mb: 2 }}
      >
        Sign in with Google
      </Button>

      <Typography variant="body1" gutterBottom>
        or
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Typography margin={1} align="left">
        Username
      </Typography>
      <TextField
        placeholder="Cloud"
        variant="outlined"
        fullWidth
        value={username}
        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
        inputProps={{ style: { color: 'white' } }}
        onChange={(e) => setUserName(e.target.value)}
        sx={TextFieldStyle}
      />
      <Typography margin={1} align="left">
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
      <Typography margin={1} align="left">
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
      <Typography margin={1} align="left">
        Confirm Password
      </Typography>
      <TextField
        type={showConfirmedPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        value={confirmedPassword}
        InputLabelProps={{ shrink: true, style: { color: 'white' } }}
        onChange={(e) => setConfirmedPassword(e.target.value)}
        sx={TextFieldStyle}
        InputProps={{
          style: { color: 'white' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{ color: 'white' }}
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmedPassword}
                onMouseDown={handleMouseDownConfirmedPassword}
                edge="end"
              >
                {showConfirmedPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSignup}
      >
        Continue
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Have an account?{' '}
        <Link href="/signin" underline="hover">
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default SignupView;
