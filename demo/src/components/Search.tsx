import React, { useState } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  thumbnail: string;
}

const SearchBooks: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'AIzaSyDo7BB8UuGnGuL6Kvzcirit3AKaBQs2sd4'; // Replace with your Google Books API Key

  const searchBooks = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&key=${API_KEY}&maxResults=10`
      );
      const items = response.data.items || [];
      const booksData: Book[] = items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title || 'No title available',
        authors: item.volumeInfo.authors || ['Unknown author'],
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
    } else {
      setBooks([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for books..."
        style={{ padding: '8px', width: '100%', marginBottom: '16px' }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {books.map((book) => (
          <li key={book.id} style={{ marginBottom: '16px' }}>
            <img
              src={book.thumbnail}
              alt={book.title}
              style={{ width: '100px', height: '150px', marginRight: '16px' }}
            />
            <div>
              <h3>{book.title}</h3>
              <p>Author(s): {book.authors.join(', ')}</p>
              <p>Published: {book.publishedDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBooks;
