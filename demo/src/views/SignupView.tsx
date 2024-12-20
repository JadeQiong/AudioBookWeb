import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Link, Box, Stack } from '@mui/material';
import { TextFieldStyle } from '../styles/commonStyles';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleLogo from '../assets/images/google.svg';
import ContinueIcon from '../assets/images/continue_button.svg';
import axios from 'axios';
import { baseUrl } from '../configs/NetworkConfig';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, AlertColor } from '@mui/material';

const SignupView = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success'); // Snackbar type

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

  const [signUpError, setSignUpError] = useState('');

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
    setErrorMsg('');

    // Basic validation
    if (username.trim() === '') {
      setErrorMsg('Username is required.');
      setUsernameError(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setEmailError(true);
      return;
    }
    if (password !== confirmedPassword) {
      setErrorMsg('Passwords do not match.');
      setPasswordError(true);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setPasswordError(true);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/register`, {
        username: username,
        password: password,
        email: email,
      });

      if (response.status === 200) {
        setSnackbarMessage('Registration successful!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/signin');
      } else {
        setSnackbarMessage(
          'Unexpected error during registration. Please try again.'
        );
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setSnackbarMessage('Registration failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    // // Proceed with signup using supabase, including the username in user_metadata
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     data: {
    //       username, // Storing username in user_metadata
    //     },
    //   },
    // });

    // if (error) {
    //   console.error('Error sign up in with email:', error.message);
    //   setSignUpError('Sign-up failed. Please try again.');
    // } else {
    //   console.log('Successfully sign up ', data);
    // }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Stack minHeight="85vh">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="85vh"
        p={2}
      >
        <Typography sx={{ fontSize: 36, fontWeight: 'bold' }} gutterBottom>
          Create an Account
        </Typography>

        <img
          src={GoogleLogo}
          width={'100%'}
          onClick={handleGoogleSignIn}
          style={{ cursor: 'pointer', alignItems: 'center', margin: 2 }}
        />

        <Typography gutterBottom marginTop={2}>
          or
        </Typography>

        <Typography
          margin={1}
          align="left"
          sx={{ fontWeight: 'bold', fontSize: 19 }}
        >
          Username
        </Typography>
        <TextField
          placeholder="Cloud"
          variant="outlined"
          fullWidth
          value={username}
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          inputProps={{ style: { color: 'white' } }}
          onChange={(e) => {
            setUserName(e.target.value);
            setUsernameError(false);
          }}
          helperText={usernameError ? errorMsg : ''}
          error={usernameError}
          sx={TextFieldStyle}
        />
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
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          sx={TextFieldStyle}
          error={emailError}
          helperText={emailError ? errorMsg : ''}
        />
        <Typography
          margin={1}
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
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          sx={TextFieldStyle}
          error={passwordError}
          helperText={passwordError ? errorMsg : ''}
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
        <Typography
          margin={1}
          align="left"
          sx={{ fontWeight: 'bold', fontSize: 19 }}
        >
          Confirm Password
        </Typography>
        <TextField
          type={showConfirmedPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={confirmedPassword}
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          onChange={(e) => {
            setConfirmedPassword(e.target.value);
            setPasswordError(false);
          }}
          sx={TextFieldStyle}
          error={passwordError}
          helperText={passwordError ? errorMsg : ''}
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

        <img
          src={ContinueIcon}
          width={'100%'}
          // height={47}
          onClick={handleSignup}
          style={{ cursor: 'pointer', alignItems: 'center', margin: 2 }}
        />
        {signUpError && (
          <Typography variant="body2" color="error" gutterBottom>
            {signUpError}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#AFAFAF', textAlign: 'left' }}
        >
          Have an account?{' '}
          <Link href="/signin" underline="hover">
            Sign in
          </Link>
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#AFAFAF', textAlign: 'left' }}
        >
          <Link href="/contact" underline="hover">
            Get help
          </Link>
        </Typography>
        {/* Error Message */}
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignupView;
