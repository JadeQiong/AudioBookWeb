import React from 'react';
import logo from './logo.svg';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from './components/Carousel';
import { CarouselItem } from './components/Carousel';
import { CarouselRef } from './components/Carousel';
import ContinuousSlider from './components/ContinuousSlider';
import './App.css';

const items: CarouselItem[] = Array(5)
	.fill('')
	.map((_: string, index: number) => ({
	alt: 'A random photo',
	image: `https://picsum.photos/${210 + index}`,
	content: (
		<div>
		<strong>Round Carousel</strong>
		<span>Slide number {index + 1}</span>
		</div>
	)
	}));

function App() {
  const carouselRef = React.createRef<CarouselRef>();

  return (
    <div className="App">
      <div className="App-header">
      <Stack direction="row">
        <Button>Library</Button>
        <Button>Upload</Button>
        <Button>About Us</Button>
        <Button>Contact Us</Button>
        <Button>Login</Button>
      </Stack>
    <Stack>
      <Carousel
      ref={carouselRef}
			items={items}
			slideOnClick
      ></Carousel>
      <ContinuousSlider></ContinuousSlider>
      </Stack>
      <Stack direction="column">
      <Typography variant="h4" gutterBottom>
      Engaging, Captivating, Premium
      </Typography>
      <Typography variant="body1" gutterBottom>
      AI-Powered Podcasts on Today's Best Reads
      </Typography>
      <Typography variant="body2" gutterBottom>
      No more dry summaries—AI-Powered BookTalks delivers a vibrant audio experience that brings literature to life, connecting readers with books in a profound and modern way. Experience the future of reading with AI-Powered BookTalks, where every book becomes a captivating conversation.
      </Typography>
      <Button>Join Our Waitlist</Button>
      </Stack>
      </div>
    
    </div>
  );
}

export default App;
