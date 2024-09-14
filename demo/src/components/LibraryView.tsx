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

interface Book {
  title: string;
  cover_url: string;
  category: string;
  author: string; // Add author field
}

const LibraryView: React.FC = () => {
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

  // TODO
  //   const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const baseUrl = 'http://localhost:3001';
  console.log('base ', baseUrl);

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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setCurrentPage(1);
    setSelectedTab(newValue);
  };

  const filteredBooks =
    selectedTab === 'All'
      ? books
      : books.filter((book) => book.category === selectedTab);

  return (
    <Stack
      direction="column"
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: '#101010' }}
    >
      <Stack
        direction="column"
        spacing={1}
        sx={{ width: 1600, height: 'auto', padding: '40px' }}
      >
        <DailyBook book={dailyBook}></DailyBook>
      </Stack>
      <Stack
        direction="column"
        spacing={1}
        sx={{ width: '90vw', height: '65vh' }}
      >
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
        <Grid container spacing={3} sx={{ height: '62vh' }}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
              <Card
                sx={{
                  backgroundColor: '#101010',
                  width: '8vw', // 20% of the viewport width
                  height: '25vh', // 30% of the viewport height
                }}
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
                </CardActionArea>
                <Typography
                  gutterBottom
                  component="div"
                  sx={{
                    padding: 1,
                    // Define an explicit height or max-height to ensure the box can contain exactly two lines
                    maxHeight: '5.5vh', // Adjust this value based on your font size and line height
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '1.5vh',
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

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          color="primary"
          sx={{
            marginTop: 2,
            alignSelf: 'center',
            '& .MuiPaginationItem-root': { color: 'white' },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default LibraryView;
