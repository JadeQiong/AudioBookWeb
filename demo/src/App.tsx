import React, { useRef, useState, useEffect, useCallback } from 'react';
import logo from './assets/images/logo.png';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from './components/Carousel';
import { CarouselItem } from './components/Carousel';
import { CarouselRef } from './components/Carousel';
import BookInfoPanel from './components/BookInfoPanel';
import Player, { PlayerRef } from './components/Player';

import './App.css';

import educatedImage from './assets/images/educated.png';
import elonMuskImage from './assets/images/elon_musk.png';
import hackersPaintersImage from './assets/images/hackers_painters.png';
import zeroToOneImage from './assets/images/zero_to_one.png';
import chipWarImage from './assets/images/chip_war.png';
import nightImage from './assets/images/night.png';
import weShouldBeFeministsImage from './assets/images/we_should_be_feminists.png';
import sapiensImage from './assets/images/sapiens.png';
import gumsImage from './assets/images/gums.png';

import IconButton from '@mui/material';
import educatedAudio from './assets/audios/educated.mp3';
import elonMuskAudio from './assets/audios/elon_musk.mp3';
import chipWarAudio from './assets/audios/chip_war.mp3';
import zeroToOneAudio from './assets/audios/zero_to_one.mp3';
import hackersPaintersAudio from './assets/audios/hacker_painter.mp3';
import nightAudio from './assets/audios/elon_musk.mp3';
import weShouldBeFeministsAudio from './assets/audios/chip_war.mp3';
import sapienAudio from './assets/audios/zero_to_one.mp3';
import gumsAudio from './assets/audios/hacker_painter.mp3';

import { elonMaskContent } from './types/hardcoded';
import { chipWarContent } from './types/hardcoded';
import { hackersPaintersContent } from './types/hardcoded';
import { zeroToOneContet } from './types/hardcoded';
import { EducatedContent } from './types/hardcoded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './components/Footer';
import Home from './views/Home';
import WaitlistPopup from './components/WaitlistPopup';

import LibraryView from './components/LibraryView';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

const audiosMap = [
  chipWarAudio,
  elonMuskAudio,
  zeroToOneAudio,
  hackersPaintersAudio,
  gumsAudio,
  nightAudio,
  sapienAudio,
  weShouldBeFeministsAudio,
  educatedAudio,
];

const picturesMap = [
  chipWarImage,
  elonMuskImage,
  zeroToOneImage,
  hackersPaintersImage,
  gumsImage,
  nightImage,
  sapiensImage,
  weShouldBeFeministsImage,
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

const CAROUSEL = 'carousel';
const LIBRARY = 'library';
const WAITLIST = 'waitlist';

function App() {
  const [sliderIsHide, setSliderIsHide] = React.useState(true);
  const [audioIndex, setAudioIndex] = useState(-1);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const handleIndexChange = (index: number) => {
    setSliderIndex(index);
  };

  useEffect(() => {
    if (sliderIndex != -1) {
      setPlaying(true);
    }
  }, [sliderIndex]);

  const [view, setView] = useState<string>(CAROUSEL);

  const handleLibraryClick = () => {
    setView(LIBRARY);
  };
  const handleHomeClick = () => {
    setView(CAROUSEL);
  };

  const handlePlayBook = (book: Book) => {
    console.log('Play book:', book.title);
  };

  const playerRef = useRef<PlayerRef>(null);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const handleAudioChange = () => {
    setSliderIsHide(false);
    // setHoversliderIsHide(false);
    setAudioIndex(sliderIndex);
  };

  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
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
          handleTriggerPlayPause={togglePlayPause}
          // handleTriggerPlayPause={() => {
          //   if (playing) {
          //     setSliderIsHide(false);
          //   }
          // }}
          playing={playing}
          isCurrent={audioIndex === sliderIndex}
        />
      ),
    }));

  return (
    <ThemeProvider theme={theme}>
      <Player
        sliderIsHide={sliderIsHide}
        setSliderIsHide={setSliderIsHide}
        playing={playing}
        setPlaying={setPlaying}
        repeatedAudiosArray={repeatedAudiosArray}
        audioIndex={audioIndex}
        repeatedContentsArray={repeatedContentsArray}
        repeatedImagesArray={repeatedImagesArray}
      ></Player>

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
              <img src={logo} width={195} height={59} />
              <Button
                variant="contained"
                size="large"
                sx={
                  view === CAROUSEL
                    ? {
                        color: '#292929',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        borderColor: 'lightgray',
                      }
                    : {
                        color: 'white',
                        borderRadius: '12px',
                        borderColor: 'lightgray',
                      }
                }
                onClick={handleHomeClick}
              >
                Home
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={
                  view === CAROUSEL
                    ? {
                        color: 'white',
                        borderRadius: '12px',
                        borderColor: 'lightgray',
                      }
                    : {
                        color: '#292929',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        borderColor: 'lightgray',
                      }
                }
                onClick={handleLibraryClick}
              >
                library
              </Button>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />{' '}
            <Stack
              direction="row"
              spacing={2}
              marginRight={5}
              alignItems="center"
            >
              <Button
                size="large"
                onClick={() => {
                  setView(WAITLIST);
                }}
                sx={{
                  color: 'white',
                  borderRadius: '12px',
                  borderColor: 'lightgray',
                }}
              >
                Join Waitlist
              </Button>
            </Stack>
          </Stack>
          {view === LIBRARY && (
            <div className="container_background">
              <LibraryView />
            </div>
          )}

          {view === CAROUSEL && (
            <Home
              items={items}
              handleIndexChange={handleIndexChange}
              onWaitlistClicked={() => {
                setView(WAITLIST);
              }}
            />
          )}

          {view === WAITLIST && <WaitlistPopup></WaitlistPopup>}

          <Footer></Footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
