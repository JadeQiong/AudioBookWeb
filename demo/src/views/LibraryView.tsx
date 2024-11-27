import React, { useState, useEffect } from 'react';
import { Typography, Tab, Stack } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Book } from '../types/book';
import { Box } from '@mui/material';
import { baseUrl } from '../configs/NetworkConfig';
import BookList from '../components/BookList';

interface LibraryViewProps {
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}

const LibraryView: React.FC<LibraryViewProps> = ({ setBook }) => {
  const { ref: loadMoreRef, inView } = useInView({
    triggerOnce: false, // Trigger multiple times as needed
    threshold: 1.0, // Trigger when fully in view
  });

  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state
  const [hasMore, setHasMore] = useState<boolean>(true); // To indicate if more data can be loaded
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (inView && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [inView, isLoading]);

  useEffect(() => {
    const fetchBooks = () => {
      if (!hasMore || isLoading) return;
      setIsLoading(true);

      const categoryParam =
        selectedTab === 'All' ? '' : `&category=${selectedTab}`;
      const url = `${baseUrl}/books-new?page=${currentPage}&limit=${itemsPerPage}${categoryParam}`;

      axios
        .get(url)
        .then((response) => {
          const { books: newBooks, totalBooks } = response.data;
          setBooks((prevBooks) => [...prevBooks, ...newBooks]);
          const totalPages = totalBooks / itemsPerPage;
          setTotalPages(totalPages);
          setHasMore(currentPage < totalPages);
        })
        .catch((error) => console.error('Error fetching books:', error))
        .finally(() => {
          setIsLoading(false);
        });
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
      <Stack direction="column" spacing={1} sx={{ width: '90vw' }} margin={5}>
        <Box sx={{}}>
          {categories.slice(0, 6).map((category) => (
            <Tab
              sx={
                category === selectedTab
                  ? { flex: 1, fontWeight: 'bold' }
                  : { color: 'white', flex: 1 }
              }
              key={category}
              label={category}
              value={category}
              onClick={() => setSelectedTab(category)}
            />
          ))}
        </Box>
        <Box sx={{}}>
          {categories.slice(6).map((category) => (
            <Tab
              sx={
                category === selectedTab
                  ? { flex: 1, fontWeight: 'bold' }
                  : { color: 'white', flex: 1 }
              }
              key={category}
              label={category}
              value={category}
              onClick={() => setSelectedTab(category)}
            />
          ))}
        </Box>
        <BookList
          setBook={setBook}
          setBooks={setBooks}
          books={filteredBooks}
          isPublic={true}
        ></BookList>

        <Box ref={loadMoreRef} sx={{ height: '50px', marginTop: '20px' }}>
          {isLoading && (
            <Typography color="white">Loading more books...</Typography>
          )}
          {!isLoading && books.length === 0 && (
            <Typography color="white">Book list is empty.</Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default LibraryView;
