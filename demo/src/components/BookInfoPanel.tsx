import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Link,
  Stack,
  colors,
} from '@mui/material';

import LaunchIcon from '@mui/icons-material/Launch';

interface BookInfo {
  title: string;
  author: string;
  categories: string[];
  description: string;
  link: string;
}

const BookInfoPanel: React.FC<BookInfo> = ({
  title,
  author,
  categories,
  description,
  link,
}) => {
  return (
    <Box
      sx={{
        color: 'white',
        width: '20rem',
        height: '30rem',
        maxWidth: '100%',

        backgroundSize: 'cover',
        borderRadius: '8px',
        position: 'relative',
      }}
    >
      <Box sx={{ padding: '20px' }}>
        <Typography component="h4" sx={{ fontWeight: 'bold', fontSize: 20 }}>
          {title}
        </Typography>
        <Typography sx={{ marginBottom: '20px', fontSize: 15 }}>
          by {author}
        </Typography>
        <Stack direction="row" spacing={1}>
          {categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              sx={{
                backgroundColor: '#343434',
                fontSize: '12px',
                height: 25,
                color: '#DADADA',
                maxWidth: 85,
              }}
            />
          ))}
        </Stack>
        <Typography sx={{ marginTop: 2, fontSize: 15 }}>
          {description}
        </Typography>

        <Button
          variant="outlined"
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 18,
            height: 20,
            width: 90,
            borderRadius: '10px',
            borderColor: 'white',
            color: 'white',
            textTransform: 'none',
            padding: 1,
            fontSize: 16,
          }}
          component={Link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        ></Button>
        <Typography
          sx={{
            fontSize: 15,
            position: 'absolute',
            bottom: 27,
            right: 50,
            height: 15,
          }}
        >
          Source
        </Typography>
        <LaunchIcon
          sx={{
            height: 16,
            width: 16,
            position: 'absolute',
            bottom: 22,
            right: 30,
          }}
        />
      </Box>
    </Box>
  );
};

export default BookInfoPanel;
