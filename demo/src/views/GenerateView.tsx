import React, { useState, useEffect } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import axios from 'axios';
import { Book } from '../types/book';
import SearchBooks from '../components/Search';
import { baseUrl } from '../configs/NetworkConfig';
import BookList from '../components/BookList';
import { useInView } from 'react-intersection-observer';

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
  const [itemsPerPage] = useState<number>(16);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state
  const [hasMore, setHasMore] = useState<boolean>(true); // To indicate if more data can be loaded

  useEffect(() => {
    console.log('inview ', inView, ' is loading', isLoading);
    if (inView && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [inView, isLoading]);

  useEffect(() => {
    const fetchBooks = () => {
      if (!hasMore || isLoading) return;
      setIsLoading(true);

      const url = `${baseUrl}/books-new?page=${currentPage}&limit=${itemsPerPage}`;

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
          console.log('set loading to false');
          setIsLoading(false);
        });
    };

    fetchBooks();
  }, [currentPage, itemsPerPage]);

  return (
    <Stack
      direction="column"
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: '#101010' }}
    >
      <SearchBooks></SearchBooks>
      <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
        My Library
      </Typography>
      <Stack direction="column" spacing={1} sx={{ width: '90vw' }} margin={5}>
        <BookList
          books={books}
          setBook={setBook}
          setSelectedBook={setSelectedBook}
          isPublic={false}
        ></BookList>

        <Box ref={loadMoreRef} sx={{ height: '50px', marginTop: '20px' }}>
          {isLoading && (
            <Typography color="white">Loading more books...</Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default GenerateView;
