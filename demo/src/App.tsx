import React, { useRef, useState, useEffect } from 'react';
import logo from './assets/images/logo.png';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from './components/Carousel';
import { CarouselItem } from './components/Carousel';
import { CarouselRef } from './components/Carousel';
import BookInfoPanel from './components/BookInfoPanel';

import ContinuousSlider, {
  ContinuousSliderRef,
} from './components/ContinuousSlider';
import './App.css';

import educatedImage from './assets/images/educated.png';
import elonMuskImage from './assets/images/elon_musk.png';
import hackersPaintersImage from './assets/images/hackers_painters.png';
import zeroToOneImage from './assets/images/zero_to_one.png';
import chipWarImage from './assets/images/chip_war.png';
import IconButton from '@mui/material';
import educatedAudio from './assets/audios/educated.mp3';
import elonMuskAudio from './assets/audios/elon_musk.mp3';
import chipWarAudio from './assets/audios/chip_war.mp3';
import zeroToOneAudio from './assets/audios/zero_to_one.mp3';
import hackersPaintersAudio from './assets/audios/hacker_painter.mp3';

import { elonMaskContent } from './types/hardcoded';
import { chipWarContent } from './types/hardcoded';
import { hackersPaintersContent } from './types/hardcoded';
import { zeroToOneContet } from './types/hardcoded';
import { EducatedContent } from './types/hardcoded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './components/Footer';
import dotsIcon from './assets/images/dots.png';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

const audiosMap = [
  elonMuskAudio,
  chipWarAudio,
  hackersPaintersAudio,
  zeroToOneAudio,
  educatedAudio,
];

const picturesMap = [
  elonMuskImage,
  chipWarImage,
  hackersPaintersImage,
  zeroToOneImage,
  educatedImage,
];

const contentsMap = [
  elonMaskContent,
  chipWarContent,
  hackersPaintersContent,
  zeroToOneContet,
  EducatedContent,
];
let repeatedImagesArray: any[] = [];
for (let i = 0; i < 4; i++) {
  repeatedImagesArray = [...repeatedImagesArray, ...picturesMap];
}

let repeatedAudiosArray: any[] = [];
for (let i = 0; i < 4; i++) {
  repeatedAudiosArray = [...repeatedAudiosArray, ...audiosMap];
}

let repeatedContentsArray: any[] = [];
for (let i = 0; i < 4; i++) {
  repeatedContentsArray = [...repeatedContentsArray, ...contentsMap];
}

function App() {
  const [isHide, setIsHide] = React.useState(true);
  const carouselRef = React.createRef<CarouselRef>();
  const sliderRef = React.useRef<ContinuousSliderRef>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [audioIndex, setAudioIndex] = useState(-1);

  const handleTriggerPlayPause = () => {
    if (sliderRef.current) {
      sliderRef.current.handlePlayPause();
    }
  };

  const handleAudioChange = () => {
    setIsHide(false);
    setAudioIndex(sliderIndex);
  };

  const handleIndexChange = (index: number) => {
    setSliderIndex(index);
  };

  const items: CarouselItem[] = Array(20)
    .fill('')
    .map((_: string, index: number) => ({
      alt: 'A random photo',
      image: repeatedImagesArray[index],
      content: (
        <BookInfoPanel
          title={repeatedContentsArray[index].title}
          author={repeatedContentsArray[index].author}
          categories={repeatedContentsArray[index].categories}
          description={repeatedContentsArray[index].description}
          link={repeatedContentsArray[index].link}
          handleAudioChange={handleAudioChange}
          handleTriggerPlayPause={handleTriggerPlayPause}
          playing={playing}
          isCurrent={audioIndex === sliderIndex}
        />
      ),
    }));

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="App-header">
          <Stack
            direction="row"
            sx={{ margin: 2, alignItems: 'center', width: '90%' }}
          >
            <Stack
              direction="row"
              marginLeft={5}
              spacing={2}
              alignItems="center"
            >
              <img src={logo} width={35} height={35} />
              <Button
                variant="contained"
                size="large"
                sx={{
                  color: '#292929',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  borderColor: 'lightgray',
                }}
              >
                Library
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderRadius: '12px',
                  borderColor: 'lightgray',
                }}
              >
                Upload
              </Button>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />{' '}
            {/* This Box will take up remaining space */}
            <Stack
              direction="row"
              spacing={2}
              marginRight={5}
              alignItems="center"
            >
              <Button
                size="large"
                sx={{
                  color: 'white',
                  borderRadius: '12px',
                  borderColor: 'lightgray',
                }}
              >
                About Us
              </Button>
              <Button
                size="large"
                sx={{
                  color: 'white',
                }}
              >
                Contact Us
              </Button>
              <Button
                size="large"
                sx={{
                  color: 'white',
                }}
              >
                Login
              </Button>
            </Stack>
          </Stack>

          <div className="container_background">
            <Stack direction="column" sx={{ width: '100%' }}>
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
                }}
              >
                Engaging, Captivating, Premium
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
                AI-Powered Podcasts on Today's Best Reads
              </Typography>
            </Stack>
          </div>

          <Stack
            spacing={2}
            sx={{ height: 640, width: '100%', overflow: 'hidden' }}
          >
            <Stack
              direction="column"
              sx={{ height: 640, overflow: 'hidden', alignItems: 'center' }}
            >
              <Carousel
                ref={carouselRef}
                items={items}
                slideOnClick
                showControls={false}
                onIndexChange={handleIndexChange}
                autoPlay={true}
              ></Carousel>

              <Box sx={{ height: 50 }}></Box>
              <ContinuousSlider
                ref={sliderRef}
                audio={repeatedAudiosArray[audioIndex]}
                title={repeatedContentsArray[audioIndex]?.title}
                isHide={isHide}
                setIsHide={setIsHide}
                playing={playing}
                setPlaying={setPlaying}
                coverImage={repeatedImagesArray[audioIndex]}
              ></ContinuousSlider>
            </Stack>
          </Stack>

          <div className="container_background">
            <Stack direction="column" sx={{ width: '60%', marginTop: '6rem' }}>
              <Stack direction="row">
                <Stack direction="column" sx={{ width: '50%' }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: 'left', fontWeight: 'bolder' }}
                  >
                    Immersive book talks.
                  </Typography>
                  <img src={dotsIcon} width={46} height={15} />
                </Stack>

                <Stack direction="column" sx={{ width: '50%' }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ textAlign: 'left' }}
                  >
                    No more dry summaries—AI-Powered BookTalks delivers a
                    vibrant audio experience that brings literature to life,
                    connecting readers with books in a profound and modern way.
                    Experience the future of reading with AI-Powered BookTalks,
                    where every book becomes a captivating conversation.
                  </Typography>

                  <div className="container">
                    <div className="border-box">
                      <div className="content">Join Our Waitlist</div>
                    </div>
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </div>

          <div>
            <Footer></Footer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
