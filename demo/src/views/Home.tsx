import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel, { CarouselRef } from '../components/Carousel';
import wailtlistLogo from '../assets/images/waitlist.png';
import dotsIcon from '../assets/images/dots.png';

export type HomeProps = Readonly<{
  items?: any;
  handleIndexChange?: any;
  onWaitlistClicked?: any;
}>;

const Home: React.FC<HomeProps> = ({
  items,
  handleIndexChange,
  onWaitlistClicked,
}) => {
  const carouselRef = React.createRef<CarouselRef>();
  return (
    <Stack>
      <div className="container_background">
        <Stack direction="column" sx={{ width: '100%', marginBottom: '5%' }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontSize: 48,
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(to bottom, #ebebec, #979797)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline',
              marginTop: '10%',
            }}
          >
            Transform Your Books Into AI-Driven Podcasts
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: 24,
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

      <Stack
        spacing={2}
        sx={{ height: 750, width: '100%', overflow: 'hidden' }}
      >
        <Stack
          direction="column"
          sx={{ height: 750, overflow: 'hidden', alignItems: 'center' }}
        >
          <Carousel
            ref={carouselRef}
            items={items}
            slideOnClick
            showControls={false}
            onIndexChange={handleIndexChange}
            autoPlay={true}
          ></Carousel>

          <Box sx={{ height: 150 }}></Box>
        </Stack>
      </Stack>

      <div className="container_background">
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
            <Stack direction="column" sx={{ width: '50%' }}>
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

              <div className="container">
                {/* <div className="border-box"> */}
                <img
                  src={wailtlistLogo}
                  width={273}
                  height={29}
                  onClick={onWaitlistClicked}
                  style={{ cursor: 'pointer' }}
                />
                {/* <div className="content">Join Our Waitlist</div> */}

                {/* </div> */}
              </div>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </Stack>
  );
};
export default Home;
