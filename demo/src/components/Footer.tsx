import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import LogoIcon from '../assets/images/logo.png';

const Footer = () => {
  return (
    <Box sx={{ width: '80%', color: 'text.secondary', padding: 2 }}>
      <Divider
        sx={{
          height: '0.5px',
          border: 0,
          backgroundImage:
            'linear-gradient(to right, #162b56, white 50%, #162b56)',
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 2 }}
      >
        <img src={LogoIcon} width={120} height={35} />
        <Typography variant="body2" sx={{ ml: 2, color: 'white' }}>
          © {new Date().getFullYear()} All Rights Reserved
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
