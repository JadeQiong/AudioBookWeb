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
import { tab } from '@testing-library/user-event/dist/tab';

interface Book {
  title: string;
  cover_url: string;
  category: string;
}

const LibraryView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBooks = () => {
      const categoryParam =
        selectedTab === 'All' ? '' : `&category=${selectedTab}`;
      const url = `http://localhost:3000/books-new?page=${currentPage}&limit=${itemsPerPage}${categoryParam}`;

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
    axios
      .get('http://localhost:3000/books-categories')
      .then((response) => {
        // Assuming the API returns an array of categories
        setCategories(['All', ...response.data.categories]);
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
    <Stack direction="column">
      <Stack
        direction="column"
        spacing={1}
        sx={{ width: 1300, height: 900, backgroundColor: 'white' }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
        <Grid container spacing={2}>
          {filteredBooks.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={book.cover_url}
                    alt={book.title}
                    sx={{ position: 'relative' }}
                  />
                  <IconButton
                    sx={{
                      scale: 3,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                    }}
                  >
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IconButton>
                </CardActionArea>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    sx={{
                      height: '3.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {book.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
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
  );
};

export default LibraryView;
