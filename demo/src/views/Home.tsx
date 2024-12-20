import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel, { CarouselRef } from '../components/Carousel';
import wailtlistLogo from '../assets/images/waitlist.png';
import dotsIcon from '../assets/images/dots.png';
import { ThemeProvider, createMuiTheme } from '@mui/material';
import LibraryView from './LibraryView';
import CustomCarousel from '../components/CustomCarousel';
import GenerateNowIcon from '../assets/images/generateNow.svg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';

const THEME = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: {
      fontWeight: 1000,
    },
  },
});

export type HomeProps = Readonly<{
  isDebug: boolean;
  items?: any;
  handleIndexChange?: any;
  onWaitlistClicked?: any;
  setBook: any;
}>;

const Home: React.FC<HomeProps> = ({
  isDebug,
  items,
  handleIndexChange,
  onWaitlistClicked,
  setBook,
}) => {
  const navigate = useNavigate();
  const carouselRef = React.createRef<CarouselRef>();
  const { user } = useUser();

  return (
    <Stack sx={{ display: 'flex', alignItems: 'center' }}>
      <div className="container_background">
        <Stack direction="column">
          <ThemeProvider theme={THEME}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontSize: 54,
                background: 'linear-gradient(to bottom, #ebebec, #979797)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline',
                marginTop: '8%',
              }}
            >
              Transform Your Books Into AI-Driven Podcasts{' '}
              {/* {isDebug ? '[DEBUG]' : ''} */}
            </Typography>
          </ThemeProvider>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: 28,
              background: '#c1c1c1',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline',
            }}
          >
            Engaging, Captivating, Premium
          </Typography>
        </Stack>
      </div>
      <img
        src={GenerateNowIcon}
        width={231}
        height={46}
        onClick={() => {
          if (!user) {
            navigate('/signin');
          } else {
            navigate('/generate');
          }
        }}
        style={{ cursor: 'pointer', margin: '2%', marginBottom: '3%' }}
      />
      <div className="container_background">
        <Stack
          spacing={2}
          sx={{
            height: 500,
            width: '80vw',
            overflowY: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CustomCarousel
              items={items}
              onIndexChange={handleIndexChange}
            ></CustomCarousel>
          </div>
          {/* <Stack
          direction="column"
          sx={{ height: 750, overflow: 'hidden', alignItems: 'center' }}
        > */}

          {/* <Carousel
            ref={carouselRef}
            items={items}
            slideOnClick
            showControls={false}
            onIndexChange={handleIndexChange}
            autoPlay={true}
          ></Carousel> */}

          {/* <Box sx={{ height: 150 }}></Box> */}
          {/* </Stack> */}
        </Stack>
      </div>
      <LibraryView setBook={setBook}></LibraryView>
    </Stack>
  );
};
export default Home;
