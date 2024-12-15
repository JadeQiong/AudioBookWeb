import React, {
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Backdrop, Box, Button, Typography, colors } from '@mui/material';
import './Carousel.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export type CarouselItem = Readonly<{
  alt?: string;
  image: string;
  content: ReactNode;
  onClick?: () => void;
  reflectionImage?: string;
}>;

export type CustomCarouselProps = {
  items: CarouselItem[]; // Array of carousel items
  autoPlay?: boolean; // Enable/disable autoplay
  autoPlaySpeed?: number; // Autoplay speed in ms
  swipeable?: boolean; // Enable/disable swipe
  draggable?: boolean; // Enable/disable dragging
  showDots?: boolean; // Show/hide dots
  infinite?: boolean; // Enable/disable infinite looping
  transitionDuration?: number; // Transition duration in ms
  customTransition?: string; // CSS transition
  containerClass?: string; // CSS class for the container
  dotListClass?: string; // CSS class for dots
  itemClass?: string; // CSS class for items
  deviceType?: string; // Current device type (e.g., "mobile")
  onIndexChange: any;
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1, // Number of slides to move at once
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  items,
  autoPlay = false,
  autoPlaySpeed = 5000,
  swipeable = true,
  draggable = true,
  showDots = false,
  infinite = true,
  transitionDuration = 500,
  customTransition = 'all .5',
  containerClass = 'carousel-container',
  dotListClass = 'custom-dot-list-style',
  itemClass = 'carousel-item-padding-40-px',
  deviceType,
  onIndexChange,
}) => {
  const carouselRef = useRef<any>(null);
  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    // Number of items visible on the current screen (adjust based on responsive config)
    const visibleItems = 5; // For example, if desktop shows 5 items
    //  const centerIndex = Math.max(0, index - Math.floor(visibleItems / 2)); // Calculate centered index

    //  if (carouselRef.current) {
    //    carouselRef.current.goToSlide(centerIndex); // Center the selected slide
    //  }
  };

  const classNamePrefix = '';
  const getClassName = useCallback(
    (parts: string | string[]) =>
      Array.isArray(parts)
        ? parts.map((part: string) => `${classNamePrefix}${part}`).join(' ')
        : `${classNamePrefix}${parts}`,
    [classNamePrefix]
  );
  const [selectedIndex, setSelectedIndex] = useState(2);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(selectedIndex);
    }
  }, [selectedIndex]);

  const imageHeight = '24rem';
  const imageWidth = '16rem';
  const highlightHeight = '30rem';
  const highlightWidth = '20rem';

  // if(carouselRef.current)
  // console.log(carouselRef.current.state.currentSlide, items)
  const handleAfterChange = (previousIndex: number) => {
    const currentSlide = carouselRef.current.state.currentSlide; // Access the current slide
    if (currentSlide > previousIndex) {
      console.log(
        'User clicked next!',
        currentSlide,
        ', selected index ',
        selectedIndex
      );
      setSelectedIndex((currentSlide - items.length + 2) % items.length);
    } else if (currentSlide < previousIndex) {
      console.log('User clicked previous!', currentSlide - items.length + 2);
      // setSelectedIndex(selectedIndex-1);
      setSelectedIndex((currentSlide + 2) % items.length);
    }
  };

  // Move to the next slide
  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Move to the previous slide
  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const CustomLeftArrow = ({ ...rest }) => {
    return (
      <Box
        onClick={goToPrevious}
        sx={{
          position: 'absolute',
          transform: 'translateY(-50%)',
          height: imageHeight, // Rectangle height
          width: imageWidth, // Rectangle width
          cursor: 'pointer', // Pointer for the rectangle
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <Button
          sx={{
            height: '60px', // Circular button diameter
            width: '50px',
            borderRadius: '50%', // Ensures the button is circular
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass effect
            backdropFilter: 'blur(8px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
            color: 'white',
            flexShrink: 0, // Prevent shrinking of the button
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)', // Slightly brighter hover effect
            },
            pointerEvents: 'none', // Ensures the button itself doesn't block clicks on the rectangle
          }}
        >
          <NavigateBeforeIcon sx={{ fontSize: '40px' }} />
        </Button>
      </Box>
    );
  };

  // Handle keydown for left and right arrows
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      // Move to the previous slide
      if (carouselRef.current) {
        carouselRef.current.previous();
      }
    } else if (event.key === 'ArrowRight') {
      // Move to the next slide
      if (carouselRef.current) {
        carouselRef.current.next();
      }
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array to ensure the listener is only attached once

  const CustomRightArrow = ({ ...rest }) => {
    return (
      <Box
        onClick={goToNext}
        sx={{
          position: 'absolute',
          transform: 'translateY(-50%)',
          height: imageHeight, // Rectangle height
          width: imageWidth, // Rectangle width
          cursor: 'pointer', // Pointer for the rectangle
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent', // No background for the rectangle
        }}
      >
        <Button
          sx={{
            height: '60px', // Circular button diameter
            width: '50px',
            borderRadius: '50%', // Ensures the button is circular
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glass effect
            backdropFilter: 'blur(8px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
            color: 'white',
            flexShrink: 0, // Prevent shrinking of the button
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)', // Slightly brighter hover effect
            },
            pointerEvents: 'none', // Ensures the button itself doesn't block clicks on the rectangle
          }}
        >
          <NavigateNextIcon sx={{ fontSize: '40px' }} />
        </Button>
      </Box>
    );
  };

  type ArrowWrapperProps = {
    leftArrow: ReactNode;
    rightArrow: ReactNode;
    spacing?: number;
  };

  const ArrowWrapper = ({
    leftArrow,
    rightArrow,
    spacing = 50,
  }: ArrowWrapperProps) => {
    return (
      <>
        {/* Left Arrow */}
        <div
          style={{
            position: 'absolute',
            // left: `${spacing}px`,
            top: '50%',
            left: '22%',
            transform: 'translateY(-50%)',
          }}
        >
          {leftArrow}
        </div>
        {/* Right Arrow */}
        <div
          style={{
            position: 'absolute',
            right: `38%`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {rightArrow}
        </div>
      </>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      swipeable={swipeable}
      draggable={draggable}
      showDots={showDots}
      responsive={responsive}
      ssr={false} // Server-side rendering
      infinite={infinite}
      autoPlay={autoPlay}
      autoPlaySpeed={autoPlaySpeed}
      keyBoardControl={false}
      // customTransition={customTransition}
      // transitionDuration={transitionDuration}
      containerClass={containerClass}
      removeArrowOnDeviceType={['tablet', 'mobile']}
      deviceType={deviceType}
      dotListClass={dotListClass}
      itemClass={itemClass}
      customLeftArrow={<></>}
      customTransition="transform 0.5s ease-in-out" // Smooth slide animation
      transitionDuration={500} // Animation duration in milliseconds
      customRightArrow={
        <ArrowWrapper
          leftArrow={<CustomLeftArrow />}
          rightArrow={<CustomRightArrow />}
          spacing={50} // Adjust this value to control the distance
        />
      }
      rewindWithAnimation={true}
      afterChange={(previousIndex) => handleAfterChange(previousIndex)} // Event for slide chang
    >
      {items.map((item, index) => {
        const height = index === selectedIndex ? highlightHeight : imageHeight;
        const width = index === selectedIndex ? highlightWidth : imageWidth;
        return (
          <div
            className={getClassName('new_carousel__slide')}
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {' '}
            <div
              key={index}
              style={{
                display: 'flex', // Use flexbox for vertical alignment
                flexDirection: 'column', // Stack items vertically
                alignItems: 'center', // Center items horizontally
              }}
              // onClick={() => {
              //   if (item.onClick) item.onClick();
              //   handleItemClick(index);
              // }}
            >
              <div
                style={{
                  position: 'relative', // Establish a positioning context for child elements
                  width: width, // Match the width of the components
                  height: height, // Ensure the height matches the image
                  overflow: 'hidden', // Prevent any overflow
                  justifyContent: 'center',
                  borderRadius: '15px',
                }}
              >
                {/* Image */}
                <img
                  src={item.image}
                  style={{
                    position: 'absolute', // Position relative to the parent container
                    top: 0,
                    left: 0,
                    width: '100%', // Fill the container width
                    height: '100%', // Fill the container height
                    // cursor: 'pointer',
                    borderRadius: '15px', // Apply rounded corners
                  }}
                  alt={item.alt}
                />

                {/* Backdrop */}
                {index !== selectedIndex && (
                  <Backdrop
                    open={true}
                    className="blurredGlass"
                    style={{
                      position: 'absolute', // Position relative to the parent container
                      top: 0,
                      left: 0,
                      width: '100%', // Fill the container width
                      height: '100%', // Fill the container height
                      borderRadius: '15px', // Apply rounded corners
                      pointerEvents: 'none',
                    }}
                  ></Backdrop>
                )}
                {index === selectedIndex && (
                  <div
                    style={{}}
                    className={getClassName('new_carousel__slide-overlay')}
                  >
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export default CustomCarousel;
