import React from 'react';
import { Box, Typography, Chip, Button, Link, Stack, colors } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import backgroundImage from '../assets/images/background.png';

interface BookInfo {
  title: string;
  author: string;
  categories: string[];
  description: string;
  link: string;
}

const BookInfoPanel: React.FC<BookInfo> = ({ title, author, categories, description, link }) => {
  return (
    <Box sx={{
      color: 'white',
      padding: '15px',
      height: '17rem',
      maxWidth: '100%',
      backgroundImage: {backgroundImage},
      backgroundSize: 'cover',
      borderRadius: '8px',
      position: 'relative',
    }}>
      <Typography component="h4" sx={{ fontWeight: 'bold', fontSize: 13}}>
        {title}
      </Typography>
      <Typography sx={{ marginBottom: '20px', fontSize: 10 }}>
        by {author}
      </Typography>
      <Stack direction="row" spacing={1}>
        {categories.map((category, index) => (
          <Chip key={index} label={category} sx={{ backgroundColor: '#343434', fontSize: '7px', height: 15, color: '#DADADA', maxWidth: 45, overflow: 'auto'}} />
        ))}
      </Stack>
      <Typography sx={{marginTop: 2, fontSize: 9}}>
        {description}
      </Typography>

        <Button
          variant="outlined"
        
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 8,
            width: 40,
            borderRadius: '10px',
            borderColor: 'white',
            color: 'white',
            textTransform: 'none',
            padding: 1,
            fontSize: 16
          }}

          component={Link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
           <Typography sx={{
            fontSize: 10,
            position: 'absolute',
            bottom: 8,
            right: 22,
            height: 8,
           }}>
          Source
          </Typography>
         < LaunchIcon sx={{height: 10, width: 10,
                    position: 'absolute',
                    bottom: 4,
                    right: 8,
                    }}/>
        </Button>
  
    </Box>
  );
};

export default BookInfoPanel;
