import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
  Pagination,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import axios from 'axios';
import DailyBook from '../components/DailyBook';
import { Book } from '../types/book';
import { Alert, AlertTitle, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchBooks from '../components/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

// Wrap your application's render in a ThemeProvider with the dark theme

interface GenerateViewProps {
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}

const GenerateView: React.FC<GenerateViewProps> = ({ setBook }) => {
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [books, setBooks] = useState<Book[]>([]);
  const [dailyBook, setDailyBook] = useState({
    title: '',
    author: '',
    category: '',
    cover_url: '',
  });
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(16);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showAlert, setShowAlert] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // TODO
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const baseUrl = 'http://localhost:3001';

  useEffect(() => {
    const fetchDailyBook = async () => {
      const dailyBookUrl = `${baseUrl}/book-of-the-day`;

      try {
        const dailyBookResponse = await axios.get(dailyBookUrl);
        setDailyBook(dailyBookResponse.data);
      } catch (error) {
        console.error('Error fetching the daily book:', error);
      }
    };

    fetchDailyBook();
  }, []);

  useEffect(() => {
    const fetchBooks = () => {
      const categoryParam =
        selectedTab === 'All' ? '' : `&category=${selectedTab}`;
      const url = `${baseUrl}/books-new?page=${currentPage}&limit=${itemsPerPage}${categoryParam}`;

      axios
        .get(url)
        .then((response) => {
          setBooks(response.data.books);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error('Error fetching books:', error));
    };

    fetchBooks();
  }, [currentPage, itemsPerPage, selectedTab]);

  useEffect(() => {
    const apiUrl = `${baseUrl}/books-categories`;
    axios
      .get(apiUrl)
      .then((response) => {
        // Assuming the API returns an array of categories
        if (response.data) {
          setCategories(['All', ...response.data.categories]);
        }
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleDelete = () => {
    console.log('Deleting book:', selectedBook?.title);
    setOpenDialog(false);
    handleClose();
    // Add your delete logic here
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleClose();
  };

  const filteredBooks =
    selectedTab === 'All'
      ? books
      : books.filter((book) => book.category === selectedTab);

  const HoverOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black backdrop
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 1,
    },
  }));

  function getKeyPath(title: string, category: string) {
    // opus_files/Psychology_0916_audio/Blink_final.opus
    // Step 1: Remove quotes if present at the beginning and end
    title = title.replace(/"/g, '');
    //Surely_You're_Joking,_Mr._Feynman_final.opus

    title = title.replace(/!/g, '');
    title = title.split(':')[0].trim();
    const newTitle = title.split(' ').join('_');
    return 'opus_files/' + category + '_0916_audio/' + newTitle + '_final.opus';
  }

  async function playOpusFile(audioKey: string, curBook: Book) {
    try {
      console.log(`${baseUrl}/audio/${audioKey}`);
      console.log(audioKey);
      const response = await fetch(`${baseUrl}/audio/${audioKey}`);
      console.log('response = ', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // const audio = new Audio(audioUrl);
      // audio.play();

      curBook.audio = audioUrl; // Assume audio is a direct link or binary data
      console.log('I set book here');
      setBook(curBook); // Assuming setBook updates state for selected book
      setShowAlert(false);
    } catch (error) {
      console.error('Error playing audio file:', error);
    }
  }

  const fetchBookAudio = async (bookId?: string) => {
    if (bookId == undefined || bookId == null) return;

    try {
      const response = await axios.get(`${baseUrl}/get-book-audio`, {
        params: { bookId },
      });
      if (response.data) {
        const base64Audio = response.data;
        const audioBlob = b64toBlob(base64Audio, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);

        let updatedBook = books.find((book) => book._id === bookId);
        if (updatedBook) {
          updatedBook.audio = audioUrl; // Assume audio is a direct link or binary data
          console.log('I set book here');
          setBook(updatedBook); // Assuming setBook updates state for selected book
          setShowAlert(false);
        } else {
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error('Error fetching audio:', error);
      setShowAlert(true);
    }
  };

  return (
    <Stack
      direction="column"
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: '#101010' }}
    >
      {showAlert && (
        <Alert severity="warning">
          Sorry, this book's audio is not available.
        </Alert>
      )}
      <SearchBooks></SearchBooks>
      <Stack direction="column" spacing={1} sx={{ width: '90vw' }} margin={5}>
        <Grid container spacing={2}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
              <Card
                sx={{
                  backgroundColor: '#101010',
                  width: '120px', // 20% of the viewport width
                  height: '230px', // 30% of the viewport height
                }}

                // onContextMenu={(event) => handleRightClick(event, book)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    sx={{
                      height: '177px', // Set only height or width, not both
                      width: 'auto', // Let the width be automatic
                      maxWidth: '100%', // Ensure it doesn't overflow its container
                      objectFit: 'contain', // This prevents cropping by fitting the image within the dimensions
                      position: 'relative',
                    }}
                    image={book.cover_url}
                    alt={book.title}
                  />
                  <HoverOverlay>
                    <PlayCircleOutlineIcon
                      style={{ fontSize: '3rem', color: 'white' }}
                      onClick={() => {
                        playOpusFile(
                          getKeyPath(book.title, book.category),
                          book
                        );
                      }}
                    />{' '}
                    <MoreHorizIcon
                      style={{
                        fontSize: '1.5rem', // Make it smaller
                        color: 'white',
                        position: 'absolute', // Position it relative to HoverOverlay
                        bottom: '10px', // Adjust bottom spacing as needed
                        right: '10px', // Adjust right spacing as needed
                        cursor: 'pointer', // Change cursor on hover
                      }}
                      onClick={(event: React.MouseEvent<SVGElement>) => {
                        event.preventDefault();
                        setMenuPosition({
                          top: event.clientY,
                          left: event.clientX,
                        }); // Set menu position
                        setSelectedBook(book);
                      }}
                    />
                  </HoverOverlay>
                </CardActionArea>
                <Typography
                  gutterBottom
                  component="div"
                  sx={{
                    // padding: 1,
                    paddingLeft: 0,
                    paddingTop: '1vh',
                    // Define an explicit height or max-height to ensure the box can contain exactly two lines
                    maxHeight: '5.5vh', // Adjust this value based on your font size and line height
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '1。3vh',
                    color: 'white',
                    textAlign: 'left',
                    lineHeight: '2.5vh', // Adjust line height to fit the container's height
                    textOverflow: 'ellipsis', // This should already be handled by WebkitLineClamp, but it's good to specify
                  }}
                >
                  {book.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ThemeProvider theme={theme}>
          <Menu
            open={Boolean(menuPosition)}
            anchorReference="anchorPosition" // Use manual positioning
            anchorPosition={
              menuPosition !== null
                ? { top: menuPosition.top, left: menuPosition.left }
                : undefined
            }
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'right-click-menu',
            }}
          >
            <MenuItem onClick={handleOpenDialog}>Delete</MenuItem>
          </Menu>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              Are you sure you want to delete this podcast?
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
        <Stack>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            sx={{
              marginTop: '2vh',
              alignSelf: 'center',
              '& .MuiPaginationItem-root': { color: 'white' },
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GenerateView;
