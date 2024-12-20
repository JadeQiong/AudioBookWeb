import React, { useRef, useState, useEffect, useCallback } from 'react';
import logo from './assets/images/logo.svg';
import text from './assets/images/text.svg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Carousel from './components/Carousel';
import { CarouselItem } from './components/Carousel';
import { CarouselRef } from './components/Carousel';
import BookInfoPanel from './components/BookInfoPanel';
import Player, { PlayerRef } from './components/Player';
import { Typography, Menu, MenuItem } from '@mui/material';
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
import avatarIcon from './assets/images/avatar.svg';
import LibraryView from './views/LibraryView';
import { Book } from './types/book';
import { supabase } from './utils/supabaseClient';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import ContactView from './views/ContactView';

import TextToSpeech from './components/TextToSpeech';
import GenerateView from './views/GenerateView';

import usePageTracking from './hooks/usePageTracking';
import HomeView from './views/Home';
import ReactGA from 'react-ga';

import { useUser } from './providers/UserProvider';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          height: '0.5px',
          border: 1,
          backgroundImage:
            'linear-gradient(to right, #162b56, white 50%, #162b56)',
        },
      },
    },
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
const GENERATE = 'generate';

export type AppProps = Readonly<{
  isDebug: boolean;
}>;

const App: React.FC<AppProps> = ({ isDebug }) => {
  const navigate = useNavigate();
  const [sliderIsHide, setSliderIsHide] = React.useState(true);
  const [audioIndex, setAudioIndex] = useState(-1);

  const newBook: Book = {
    title: 'The Great Gatsby',
    cover_url: 'https://example.com/gatsby.jpg',
    category: 'Classic Fiction',
    author: 'F. Scott Fitzgerald',
    audio: 'https://example.com/gatsby.mp3',
  };

  const [book, setBook] = useState(newBook);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [sliderIndex, setSliderIndex] = useState(-1);
  const { signOut } = useUser();

  type UserType = {
    id: string;
    email?: string;
    // Add any other properties as per your user model.
  };

  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }
      console.log(data.session?.user);
      setUser(data?.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (audioIndex >= 0) {
      const newBook: Book = {
        title: repeatedContentsArray[audioIndex]?.title,
        // TODO: this fields are not corrent...
        cover_url: 'https://example.com/gatsby.jpg',
        category: 'Classic Fiction',
        author: 'F. Scott Fitzgerald',
        // Optional fields can be omitted or included as needed
        audio: repeatedAudiosArray[audioIndex],
      };
      setBook(newBook);
    }
  }, [audioIndex]);

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

  const handleGenerateClick = () => {
    navigate('/generate');
    setView(GENERATE);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Function to handle the menu opening
  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle the menu closing
  const handleClose = () => {
    setAnchorEl(null);
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

  const handlePlay = (book: Book) => {
    ReactGA.event({
      category: 'Audio',
      action: 'Play',
      label: book.title, // Use the book's title as the label
    });
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

  usePageTracking();

  return (
    <ThemeProvider theme={theme}>
      <Player
        sliderIsHide={sliderIsHide}
        setSliderIsHide={setSliderIsHide}
        playing={playing}
        setPlaying={setPlaying}
        repeatedAudiosArray={repeatedAudiosArray}
        book={book}
        repeatedContentsArray={repeatedContentsArray}
        repeatedImagesArray={repeatedImagesArray}
      ></Player>

      <div className="App">
        <div className="App-header">
          {/* <TextToSpeech /> */}
          <Stack
            direction="row"
            sx={{
              margin: 1,
              alignItems: 'center',
              width: '90%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src={logo}
                width={190}
                height={59}
                onClick={() => {
                  navigate('/');
                  setView(CAROUSEL);
                  handlePlay(book);
                }}
                style={{ cursor: 'pointer', marginLeft: -45 }}
              />
              <Typography
                sx={{
                  marginLeft: -6,
                  color: '#99B8F2',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  navigate('/');
                  setView(CAROUSEL);
                }}
                style={{ cursor: 'pointer' }}
              >
                BookTalks
              </Typography>
            </Stack>
            <Stack direction="row">
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
                  view === GENERATE
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
                onClick={handleGenerateClick}
              >
                Generate
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* {isDebug && (
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
              )} */}
              <img
                src={waitlistButton}
                width={160}
                height={46}
                onClick={() => {
                  navigate('/waitlist');
                }}
                style={{ cursor: 'pointer' }}
              />
              {isDebug && user && (
                <div>
                  <img
                    src={avatarIcon}
                    width={46}
                    height={46}
                    onClick={handleAvatarClick}
                    style={{ cursor: 'pointer', marginBottom: 7 }}
                  />

                  {/* Menu that pops up when the avatar is clicked */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      {user?.email ? user.email : 'No email available'}
                    </MenuItem>
                    <MenuItem onClick={signOut}>Sign out</MenuItem>
                  </Menu>
                </div>
              )}
              {isDebug && !user && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signin')}
                  sx={{ color: 'white' }}
                >
                  Sign In
                </Button>
              )}
              {isDebug && (
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
                  onClick={() => {
                    navigate('/contact');
                  }}
                >
                  Contact Us
                </Button>
              )}
            </Stack>
          </Stack>

          <Routes>
            <Route
              path="/text2speech"
              element={<TextToSpeech></TextToSpeech>}
            ></Route>
            <Route
              path="/generate"
              element={<GenerateView setBook={setBook}></GenerateView>}
            ></Route>
            <Route
              path="/"
              element={
                <Home
                  isDebug={isDebug}
                  items={items}
                  handleIndexChange={handleIndexChange}
                  onWaitlistClicked={() => {
                    navigate('/waitlist');
                    setView(WAITLIST);
                  }}
                  setBook={setBook}
                />
              }
            />
            <Route
              path="/library"
              element={user ? <LibraryView setBook={setBook} /> : <LoginView />}
            />
            <Route path="/signin" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/waitlist" element={<WaitlistPopup />} />
            <Route
              path="*"
              element={
                <Home
                  isDebug={isDebug}
                  items={items}
                  handleIndexChange={handleIndexChange}
                  onWaitlistClicked={() => {
                    navigate('/waitlist');
                    setView(WAITLIST);
                  }}
                  setBook={setBook}
                />
              }
            />
          </Routes>
          <Footer></Footer>
        </div>
      </div>
    </ThemeProvider>
  );

  return (
    <Routes>
      <Route path="/library" element={<LibraryView setBook={setBook} />} />
      {/* ... other routes */}
    </Routes>
  );
};

export default App;
