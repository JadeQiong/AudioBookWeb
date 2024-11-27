import React, { useState, useEffect } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import axios from 'axios';
import { Book } from '../types/book';
import SearchBooks from '../components/Search';
import { baseUrl } from '../configs/NetworkConfig';
import BookList from '../components/BookList';
import { useInView } from 'react-intersection-observer';
import { useUser } from '../providers/UserProvider';

interface GenerateViewProps {
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}

const GenerateView: React.FC<GenerateViewProps> = ({ setBook }) => {
  const { ref: loadMoreRef, inView } = useInView({
    triggerOnce: false, // Trigger multiple times as needed
    threshold: 1.0, // Trigger when fully in view
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 16;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state
  const [error, setError] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState<boolean>(true); // To indicate if more data can be loaded
  const { user } = useUser();

  useEffect(() => {
    console.log(
      'inview ',
      inView,
      ' is loading',
      isLoading,
      ' has more',
      hasMore
    );
    if (!isLoading && hasMore && user?.id) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    console.log(currentPage);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const fetchBooks = () => {
      if (!user?.id) return;
      if (!hasMore || isLoading) {
        return; // Avoid fetching if already loading or no more data
      }

      setIsLoading(true);
      const url = `${baseUrl}/api/users/${user?.id}/library?page=${currentPage}&limit=${itemsPerPage}`;

      axios
        .get(url)
        .then((response) => {
          const { books: newBooks, totalBooks } = response.data;
          console.log(response.data);
          if (newBooks) {
            setBooks((prevBooks) => [...prevBooks, ...newBooks]);
            console.log('new books', newBooks);
            const totalPages = Math.ceil(totalBooks / itemsPerPage); // Ensure totalPages is a whole number
            setTotalPages(totalPages);
            setHasMore(currentPage < totalPages);
          } else {
            console.log('failed!');
            setBooks([]); // Clear books if no data is returned
            setTotalPages(0);
            setHasMore(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching books:', error);
          console.log('failed!');
          setBooks([]); // Clear books if no data is returned
          setTotalPages(0);
          setHasMore(false);
        })

        .finally(() => {
          setIsLoading(false); // Ensure loading state is reset
        });
    };

    fetchBooks();
    // Prevent including `currentPage` or `itemsPerPage` in the dependency array unless necessary
  }, [currentPage, user?.id]); // Include only necessary dependencies

  return (
    <Stack
      direction="column"
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: '#101010', minHeight: '85vh', width: '60%' }}
    >
      <SearchBooks></SearchBooks>
      <Stack sx={{ position: 'absolute', marginTop: '300px' }}>
        <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
          My Library
        </Typography>
        <Stack direction="column" spacing={1} sx={{ width: '90vw' }} margin={5}>
          <BookList
            books={books}
            setBooks={setBooks}
            setBook={setBook}
            setSelectedBook={setSelectedBook}
            isPublic={false}
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
    </Stack>
  );
};

export default GenerateView;
