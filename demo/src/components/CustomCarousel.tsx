import React, {
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Backdrop, Box, Typography, colors } from '@mui/material';
import './Carousel.css';

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
  autoPlay = true,
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

  const imageHeight = '27rem';
  const imageWidth = '18rem';
  const highlightHeight = '30rem';
  const highlightWidth = '20rem';

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
      customTransition={customTransition}
      transitionDuration={transitionDuration}
      containerClass={containerClass}
      removeArrowOnDeviceType={['tablet', 'mobile']}
      deviceType={deviceType}
      dotListClass={dotListClass}
      itemClass={itemClass}
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
              onClick={() => {
                if (item.onClick) item.onClick();
                handleItemClick(index);
              }}
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
                    cursor: 'pointer',
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
