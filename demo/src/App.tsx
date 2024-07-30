import React, { useRef, useState } from 'react';
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

import educatedAudio from './assets/audios/educated.mp3';
import elonMuskAudio from './assets/audios/elon_musk.mp3';
import toKillAMockingBirdAudio from './assets/audios/to_kill_a_mocking_bird.mp3';
import classMakerAudio from './assets/audios/the_class_maker.mp3';
import chipWarAudio from './assets/audios/chip_war.mp3';
import zeroToOneAudio from './assets/audios/zero_to_one.mp3';
import hackersPaintersAudio from './assets/audios/hacker_painter.mp3';

import { elonMaskContent } from './types/hardcoded';
import { chipWarContent } from './types/hardcoded';
import { hackersPaintersContent } from './types/hardcoded';
import { zeroToOneContet } from './types/hardcoded';
import { EducatedContent } from './types/hardcoded';
import { selectClasses } from '@mui/material';
import { log } from 'console';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto',
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
            spacing={2}
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            <img src={logo} width={35} height={35} />

            <Button
              variant="contained"
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
              sx={{
                color: 'white',
                borderRadius: '12px',
                borderColor: 'lightgray',
              }}
            >
              Upload
            </Button>
            <Box sx={{ width: 400 }} />
            <Button
              sx={{
                color: 'white',
                borderRadius: '12px',
                borderColor: 'lightgray',
              }}
            >
              About Us
            </Button>
            <Button
              sx={{
                color: 'white',
              }}
            >
              Contact Us
            </Button>
            <Button
              sx={{
                color: 'white',
              }}
            >
              Login
            </Button>
          </Stack>

          <div className="container_background">
            <Stack direction="column" sx={{ width: '100%' }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
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
                  fontWeight: 'bold',
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
              ></Carousel>
              <Stack sx={{ height: 40 }}></Stack>
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
            <Stack direction="column" sx={{ width: '60%' }}>
              <Typography variant="body1" gutterBottom>
                No more dry summaries—AI-Powered BookTalks delivers a vibrant
                audio experience that brings literature to life, connecting
                readers with books in a profound and modern way. Experience the
                future of reading with AI-Powered BookTalks, where every book
                becomes a captivating conversation.
              </Typography>
              <div className="container">
                <div className="border-box">
                  <div className="content">Join Our Waitlist</div>
                </div>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;