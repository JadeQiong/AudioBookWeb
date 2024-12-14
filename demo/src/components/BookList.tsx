// src/components/BookList.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Book } from '../types/book';
import {
  Grid,
  Card,
  Box,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';
import {
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { baseUrl } from '../configs/NetworkConfig';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Alert } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useUser } from '../providers/UserProvider';
import GeneratingIcon from '../assets/images/generating.svg';

interface BookListProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  setBook: React.Dispatch<React.SetStateAction<Book>>;
  setSelectedBook?: React.Dispatch<React.SetStateAction<Book | null>>;
  isPublic: boolean;
}

const theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
        },
      },
    },
  },
});

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

const BookList: React.FC<BookListProps> = ({
  books,
  setBooks,
  setBook,
  setSelectedBook,
  isPublic,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { user } = useUser();
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const handleDelete = async () => {
    console.log(bookToDelete);
    setOpenDialog(false);
    handleClose();
    const id = bookToDelete?._id;
    try {
      const response = await axios.delete(
        `${baseUrl}/api/users/${user?.id}/book/${id}`
      );
      console.log(response.data);
      // Update state to remove the deleted book
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (err: any) {
      console.error('Error deleting book:', err);
    } finally {
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  useEffect(() => {}, [books]);

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

      curBook.audio = audioUrl; // Assume audio is a direct link or binary data
      console.log('I set book here');
      setBook(curBook); // Assuming setBook updates state for selected book
      setShowAlert(false);
    } catch (error) {
      console.error('Error playing audio file:', error);
    }
  }
  return (
    <>
      {showAlert && (
        <Alert severity="warning">
          Sorry, this book's audio is not available.
        </Alert>
      )}
      <Grid container spacing={2}>
        {books.map((book, index) => (
          <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
            <Card
              sx={{
                backgroundColor: '#101010',
                width: '120px', // 20% of the viewport width
                height: '230px', // 30% of the viewport height
              }}
            >
              {book.status === 'running' && (
                <>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      sx={{
                        maxWidth: '100%', // Ensure it doesn't overflow its container
                        objectFit: 'contain', // This prevents cropping by fitting the image within the dimensions
                        position: 'relative',
                      }}
                      image={GeneratingIcon}
                      alt={book.title}
                    />
                    <HoverOverlay>
                      {!isPublic && (
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
                            setBookToDelete(book);
                            event.preventDefault();
                            setMenuPosition({
                              top: event.clientY,
                              left: event.clientX,
                            }); // Set menu position
                            if (setSelectedBook) setSelectedBook(book);
                          }}
                        />
                      )}
                    </HoverOverlay>
                  </CardActionArea>
                </>
              )}
              {book.status !== 'running' && (
                <>
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
                            book?.file_path
                              ? book.file_path
                              : getKeyPath(book.title, book.category),
                            book
                          );
                        }}
                      />{' '}
                      {!isPublic && (
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
                            setBookToDelete(book);
                            event.preventDefault();
                            setMenuPosition({
                              top: event.clientY,
                              left: event.clientX,
                            }); // Set menu position
                            if (setSelectedBook) setSelectedBook(book);
                          }}
                        />
                      )}
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
                </>
              )}
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
          {!isPublic && (
            <MenuItem
              onClick={() => {
                handleOpenDialog();
              }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>

        <Dialog
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 5,
              padding: 1,
            },
          }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Are you sure you want to delete <br /> this podcast?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setBookToDelete(null);
              }}
              sx={{ color: 'white', borderRadius: 5, width: 100, height: 40 }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await handleDelete();
                } catch (error) {
                  console.error('Error generating book:', error);
                }
              }}
              variant="contained"
              sx={{ borderRadius: 5, width: 100, height: 40 }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default BookList;
