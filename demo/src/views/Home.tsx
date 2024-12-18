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
  const carouselRef = React.createRef<CarouselRef>();
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
              {isDebug ? '[DEBUG]' : ''}
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
        onClick={() => {}}
        style={{ cursor: 'pointer', margin: '2%', marginBottom: '3%' }}
      />
      <div className="container_background">
        <Stack
          spacing={2}
          sx={{
            height: 600,
            width: '80vw',
            overflowY: 'hidden',
          }}
        >
          <CustomCarousel
            items={items}
            onIndexChange={handleIndexChange}
          ></CustomCarousel>
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
      {/* <div className="container_background">
        <Stack direction="column" sx={{ width: '60%', marginTop: '5%' }}>
          <Stack direction="row">
            <Stack direction="column" sx={{ width: '45%' }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'left', fontWeight: 'bolder' }}
              >
                Immersive book talks.
              </Typography>
              <img src={dotsIcon} width={46} height={15} />
            </Stack>
            <Stack sx={{ width: '5%' }}></Stack>
            <Stack direction="column" sx={{ width: '50%' }} spacing={4}>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ textAlign: 'left' }}
              >
                No more dry summaries—AI-Driven BookTalks delivers a vibrant
                audio experience that brings literature to life, connecting
                readers with books in a profound and modern way. Experience the
                future of reading with AI-Driven BookTalks, where every book
                becomes a captivating conversation.
              </Typography>

              <img
                src={wailtlistLogo}
                width={273}
                height={29}
                onClick={onWaitlistClicked}
                style={{ cursor: 'pointer' }}
              />
            </Stack>
          </Stack>
        </Stack>
      </div> */}
      {isDebug && <LibraryView setBook={setBook}></LibraryView>}
    </Stack>
  );
};
export default Home;
