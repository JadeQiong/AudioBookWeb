import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import LogoIcon from '../assets/images/logo.svg';

const Footer = () => {
  return (
    <Box sx={{ width: '80%', color: 'white', padding: 2, margin: 2 }}>
      <Stack direction="column">
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 2 }}
        >
          <Stack direction="row">
            <img src={LogoIcon} width={120} height={35} />
            <Typography
              sx={{
                color: '#99B8F2',
                fontSize: 19,
                fontWeight: 'bold',
                marginLeft: -3,
              }}
            >
              BookTalks
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ ml: 2, color: 'white' }}>
            © {new Date().getFullYear()} All Rights Reserved
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
