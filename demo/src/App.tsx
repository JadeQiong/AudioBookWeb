import React, { useRef, useState, useEffect, useCallback } from 'react';
import logo from './assets/images/logo.png';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

import { useNavigate } from 'react-router-dom';
import educatedAudio from './assets/audios/educated.mp3';
import elonMuskAudio from './assets/audios/elon_musk.mp3';
import chipWarAudio from './assets/audios/chip_war.mp3';
import zeroToOneAudio from './assets/audios/zero_to_one.mp3';
import hackersPaintersAudio from './assets/audios/hacker_painter.mp3';
import nightAudio from './assets/audios/night.mp3';
import weShouldBeFeministsAudio from './assets/audios//we_should_all_be_feminists.mp3';
import sapienAudio from './assets/audios/sapiens.mp3';
import gumsAudio from './assets/audios/guns.mp3';

import { elonMaskContent } from './types/hardcoded';
import { chipWarContent } from './types/hardcoded';
import { hackersPaintersContent } from './types/hardcoded';
import { zeroToOneContet } from './types/hardcoded';
import { EducatedContent } from './types/hardcoded';
import { gumsContent } from './types/hardcoded';
import { nightContent } from './types/hardcoded';
import { weShouldBeFeministsContent } from './types/hardcoded';
import { sapienContent } from './types/hardcoded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './components/Footer';
import Home from './views/Home';
import WaitlistPopup from './components/WaitlistPopup';
import waitlistButton from './assets/images/home_join_waitlist.png';
import LibraryView from './components/LibraryView';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

const audiosMap = [
  elonMuskAudio,
  zeroToOneAudio,
  hackersPaintersAudio,
  gumsAudio,
  nightAudio,
  sapienAudio,
  weShouldBeFeministsAudio,
  educatedAudio,
  chipWarAudio,
];

const picturesMap = [
  elonMuskImage,
  zeroToOneImage,
  hackersPaintersImage,
  gumsImage,
  nightImage,
  sapiensImage,
  weShouldBeFeministsImage,
  educatedImage,
  chipWarImage,
];

const contentsMap = [
  elonMaskContent,
  zeroToOneContet,
  hackersPaintersContent,
  gumsContent,
  nightContent,
  sapienContent,
  weShouldBeFeministsContent,
  EducatedContent,
  chipWarContent,
];

let repeatedImagesArray: any[] = [];
for (let i = 0; i < 2; i++) {
  repeatedImagesArray = [...repeatedImagesArray, ...picturesMap];
}

let repeatedAudiosArray: any[] = [];
for (let i = 0; i < 2; i++) {
  repeatedAudiosArray = [...repeatedAudiosArray, ...audiosMap];
}

let repeatedContentsArray: any[] = [];
for (let i = 0; i < 2; i++) {
  repeatedContentsArray = [...repeatedContentsArray, ...contentsMap];
}

const CAROUSEL = 'carousel';
const LIBRARY = 'library';
const WAITLIST = 'waitlist';

function App() {
  const navigate = useNavigate();
  const [sliderIsHide, setSliderIsHide] = React.useState(true);
  const [audioIndex, setAudioIndex] = useState(-1);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [sliderIndex, setSliderIndex] = useState(-1);

  const handleIndexChange = (index: number) => {
    setSliderIndex(index);
  };

  const [view, setView] = useState<string>(CAROUSEL);

  const handleLibraryClick = () => {
    navigate('/library');
    setView(LIBRARY);
  };

  const handleHomeClick = () => {
    navigate('/');
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
    setPlaying(true);
    setAudioIndex(sliderIndex);
  };

  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const items: CarouselItem[] = Array(18)
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
            sx={{
              margin: 2,
              alignItems: 'center',
              width: '90%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Stack
              display="flex"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src={logo}
                width={190}
                height={59}
                onClick={() => {
                  navigate('/');
                  setView(CAROUSEL);
                }}
                style={{ cursor: 'pointer' }}
              />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                size="large"
                sx={
                  view === CAROUSEL
                    ? {
                        fontWeight: 'bold',
                        backgroundColor: 'transparent', // Ensures the background is transparent
                        borderColor: 'transparent', // Ensures no border color
                        borderWidth: 0, // Ensures no border width
                        boxShadow: 'none', // Removes any shadow
                        color: 'white',
                      }
                    : {
                        backgroundColor: 'transparent', // Ensures the background is transparent
                        borderColor: 'transparent', // Ensures no border color
                        borderWidth: 0, // Ensures no border width
                        boxShadow: 'none', // Removes any shadow
                        color: 'white',
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
                        backgroundColor: 'transparent', // Ensures the background is transparent
                        borderColor: 'transparent', // Ensures no border color
                        borderWidth: 0, // Ensures no border width
                        boxShadow: 'none', // Removes any shadow
                        color: 'white',
                      }
                    : {
                        fontWeight: 'bold',
                        backgroundColor: 'transparent', // Ensures the background is transparent
                        borderColor: 'transparent', // Ensures no border color
                        borderWidth: 0, // Ensures no border width
                        boxShadow: 'none', // Removes any shadow
                        color: 'white',
                      }
                }
                onClick={handleLibraryClick}
              >
                library
              </Button>
              <img
                src={waitlistButton}
                width={160}
                height={46}
                onClick={() => {
                  navigate('/waitlist');
                  setView(WAITLIST);
                }}
                style={{ cursor: 'pointer' }}
              />
            </Stack>
          </Stack>

          <div className="App">
            {/* <header className="App-header">
            <nav>
              <Stack direction="row" spacing={2}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined">Home</Button>
                </Link>
                <Link to="/library" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined">Library</Button>
                </Link>
                <Link to="/waitlist" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined">Waitlist</Button>
                </Link>
              </Stack>
            </nav>
          </header> */}

            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    items={items}
                    handleIndexChange={handleIndexChange}
                    onWaitlistClicked={() => {
                      navigate('/waitlist');
                      setView(WAITLIST);
                    }}
                  />
                }
              />
              <Route path="/library" element={<LibraryView />} />
              <Route path="/waitlist" element={<WaitlistPopup />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>

          <Footer></Footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
