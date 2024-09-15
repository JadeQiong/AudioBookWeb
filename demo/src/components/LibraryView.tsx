import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import DailyBook from './DailyBook';
import { Book } from '../types/book';
import { Alert, AlertTitle, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LibraryViewProps {
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}

const LibraryView: React.FC<LibraryViewProps> = ({ setBook }) => {
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

  // TODO
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const baseUrl = 'http://localhost:3001';

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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setCurrentPage(1);
    setSelectedTab(newValue);
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

      <Stack
        direction="column"
        spacing={1}
        sx={{ width: 1600, padding: '40px' }}
      >
        <DailyBook book={dailyBook} startListening={fetchBookAudio}></DailyBook>
      </Stack>
      <Stack direction="column" spacing={1} sx={{ width: '90vw' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              sx={{ color: 'white' }}
              key={category}
              label={category}
              value={category}
            />
          ))}
        </Tabs>
        <Grid container spacing={3}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
              <Card
                sx={{
                  backgroundColor: '#101010',
                  width: '8vw', // 20% of the viewport width
                  height: '26vh', // 30% of the viewport height
                }}
                onClick={() => fetchBookAudio(book?._id)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    sx={{
                      height: '20vh', // Set only height or width, not both
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
                    />{' '}
                    {/* Adjust icon size and color */}
                  </HoverOverlay>
                </CardActionArea>
                <Typography
                  gutterBottom
                  component="div"
                  sx={{
                    padding: 1,
                    paddingLeft: 0,
                    // Define an explicit height or max-height to ensure the box can contain exactly two lines
                    maxHeight: '5.5vh', // Adjust this value based on your font size and line height
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '1。4vh',
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

export default LibraryView;
