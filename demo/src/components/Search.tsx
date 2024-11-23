import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Stack, Button, Typography, ClickAwayListener } from '@mui/material';
import generateButton from '../assets/images/generate.svg';
import helloButton from '../assets/images/hello.svg';
import stars from '../assets/images/stars.svg';

interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  thumbnail: string;
  description: string;
}

// Extend the global window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const SearchBooks: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const API_KEY = 'AIzaSyDo7BB8UuGnGuL6Kvzcirit3AKaBQs2sd4';
  // Replace with your Google Books API Key

  const handleGenerate = () => {
    console.log('>>');
    const data = runWorkflow('Chip war', 'A');
    console.log(data);
  };

  const searchBooks = async (query: string) => {
    if (query.trim()) {
      if (window.gtag) {
        window.gtag('event', 'search', {
          search_term: query,
        });
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&key=${API_KEY}&maxResults=10&projection=lite&`
      );
      const items = response.data.items || [];
      const booksData: Book[] = items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || 'No title available',
        authors: item.volumeInfo.authors || ['Unknown author'],
        description: item.volumeInfo.description || 'No description available',
        publishedDate: item.volumeInfo.publishedDate || 'Unknown date',
        thumbnail:
          item.volumeInfo.imageLinks?.thumbnail || 'No cover available',
      }));
      setBooks(booksData);
    } catch (error) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Fetch books if the query is not empty
    if (value.trim()) {
      searchBooks(value);
      setShowResults(true);
    } else {
      setBooks([]);
      setShowResults(false);
    }
  };

  const handleFocus = () => {
    if (query.trim()) {
      setShowResults(true);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (inputRef.current && inputRef.current.contains(event.target as Node)) {
      // If the click is inside the input, do nothing
      return;
    }

    setShowResults(false);
  };

  const runWorkflow = async (title: string, author: string) => {
    try {
      // Load the API key from the environment variables
      // const apiKey = process.env.API_KEY;
      const apiKey = 'app-19n0GLm9rf6UJEg9xT6u5pWW';
      if (!apiKey) {
        throw new Error('API_KEY is not defined in the environment variables');
      }

      const url = 'http://51.143.10.56/v1/workflows/run';

      // Request payload
      const data = {
        inputs: { title, author },
        response_mode: 'blocking',
        user: 'booktalks_backend',
      };

      // Headers for the request
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      // Make the POST request
      const response = await axios.post(url, data, { headers });
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error running workflow:', error);
      throw error; // Rethrow the error for further handling
    }
  };

  return (
    <Stack
      sx={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${stars})`, // Apply background image
        backgroundSize: '70%', // Scale the background image (120% of its original size)
        backgroundPosition: '100% center', // Center the image and shift it to the right (adjust percentage as needed)
        backgroundRepeat: 'no-repeat', // Prevent repetition
      }}
    >
      <Stack sx={{ width: '60%' }} tabIndex={0}>
        <Stack
          sx={{ textAlign: 'left' }}
          margin={3}
          marginLeft={0}
          marginRight={0}
        >
          <img src={helloButton} width="214px" height="78px" />
          <Typography fontSize={24} sx={{ opacity: 0.6 }}>
            {' '}
            Please tell me a book you are interested.
          </Typography>
        </Stack>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={handleFocus}
          onChange={handleInputChange}
          placeholder="Search for books..."
          style={{
            fontSize: 20,
            height: '70px',
            paddingLeft: 20,
            border: '2px solid transparent', // Set transparent border
            borderRadius: '9px',
            backgroundImage:
              'linear-gradient(#101010, #101010), linear-gradient(90deg, #0162F3 8%, #FFFFFF 50%, #5494F7 90%)', // Gradient border
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box', // Clips background to the border
            color: 'white',
          }}
        />

        <Stack margin={2} marginLeft={0}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Typography fontSize={16} sx={{ opacity: 0.6, textAlign: 'left' }}>
            {loading && books.length > 0
              ? 'Loading...'
              : books.length + ' results'}
          </Typography>
        </Stack>

        <ClickAwayListener onClickAway={handleClickAway}>
          {showResults ? (
            <Stack
              sx={{
                overflow: 'auto',
                height: '508px',
                width: '100%',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                border: '1px solid #36454F', // Border thickness and color
                borderRadius: '8px', // Rounded corners
              }}
              tabIndex={0} // Make the Stack focusable
              onKeyDown={(e) => {
                if (books.length === 0) return;

                e.preventDefault(); // Prevent default browser behavior for arrow keys
                if (e.key === 'ArrowDown') {
                  setHoveredIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % books.length
                  );
                } else if (e.key === 'ArrowUp') {
                  setHoveredIndex((prev) =>
                    prev === null
                      ? books.length - 1
                      : (prev - 1 + books.length) % books.length
                  );
                } else if (e.key === 'Enter' && hoveredIndex !== null) {
                  setSelectedIndex(hoveredIndex);
                }
              }}
            >
              {books.map((book, index) => {
                // console.log(book);
                return (
                  <Stack
                    key={book.id}
                    marginLeft={0}
                    marginRight={0}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        backgroundColor:
                          selectedIndex === index
                            ? '#383838'
                            : hoveredIndex === index
                              ? '#242424'
                              : '#101010',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 3,
                          width: '70%',
                        }}
                      >
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          style={{
                            width: '42px',
                            height: '62px',
                            marginRight: '16px',
                          }}
                        />

                        <Stack direction="column" sx={{ textAlign: 'left' }}>
                          <Typography
                            fontSize={20}
                            sx={{
                              color:
                                selectedIndex === index
                                  ? 'white'
                                  : hoveredIndex === index
                                    ? 'white'
                                    : 'grey',
                            }}
                          >
                            {book.title}
                          </Typography>
                          <Typography fontSize={14} sx={{ opacity: 0.6 }}>
                            {' '}
                            {book.authors.join(', ')} {book.publishedDate}
                          </Typography>
                        </Stack>
                      </Stack>
                      {selectedIndex === index && (
                        <Stack
                          direction="row"
                          spacing={3}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ opacity: 0.6, marginLeft: '20%' }}>
                            Selected
                          </Typography>
                          <img
                            src={generateButton}
                            width={142}
                            height={46}
                            onClick={handleGenerate}
                            style={{ cursor: 'pointer', marginRight: 20 }}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <></>
          )}
        </ClickAwayListener>
      </Stack>
    </Stack>
  );
};

export default SearchBooks;
