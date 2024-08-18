import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import HoverSlider, { HoverSliderRef } from './HoverSlider';
import ContinuousSlider from './ContinuousSlider';
import { hover } from '@testing-library/user-event/dist/hover';

export type PlayerRef = {
  handlePlayPause: () => void;
};

export type SliderProps = Readonly<{
  sliderIsHide: boolean;
  setSliderIsHide?: any;
  playing: boolean;
  setPlaying?: any;
  handlePlayPause?: any;
  repeatedAudiosArray?: any;
  audioIndex: number;
  repeatedContentsArray?: any;
  repeatedImagesArray?: any;
}>;

export const Player: React.FC<SliderProps> = React.forwardRef<
  PlayerRef,
  SliderProps
>(
  (
    {
      sliderIsHide,
      setSliderIsHide,
      playing,
      setPlaying,
      repeatedAudiosArray,
      audioIndex,
      repeatedContentsArray,
      repeatedImagesArray,
    },
    ref
  ) => {
    const hoverSliderRef = useRef<HoverSliderRef>(null);
    const [hoverIsHide, setHoverIsHide] = useState(true);
    const [value, setValue] = React.useState<number>(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleTimeUpdate = useCallback((time: number) => {
      setCurrentTime(time);
    }, []);

    const handleDurationChange = useCallback((newDuration: number) => {
      setDuration(newDuration);
    }, []);

    const handlePlayPause = () => {
      setPlaying(!playing);
    };

    useEffect(() => {
      console.log('current playing ', playing);
      if (playing) {
        setHoverIsHide(false);
      } else {
        if (hoverSliderRef.current) {
          hoverSliderRef.current.handlePlayPause();
        }
      }
    }, [playing]);

    // Expose handlePlayPause to parent components using the ref
    useImperativeHandle(ref, () => ({
      handlePlayPause,
    }));
    return (
      <>
        <HoverSlider
          //   ref={hoverSliderRef}
          audio={repeatedAudiosArray[audioIndex]}
          title={repeatedContentsArray[audioIndex]?.title}
          isHide={hoverIsHide}
          setIsHide={setHoverIsHide}
          playing={playing}
          setPlaying={setPlaying}
          //   handlePlayPause={handlePlayPause}
          //   coverImage={repeatedImagesArray[audioIndex]}
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          value={value}
          onValueUpdated={setValue}
        ></HoverSlider>

        <ContinuousSlider
          title={repeatedContentsArray[audioIndex]?.title}
          isHide={sliderIsHide}
          setIsHide={setSliderIsHide}
          playing={playing}
          setPlaying={setPlaying}
          handlePlayPause={handlePlayPause}
          coverImage={repeatedImagesArray[audioIndex]}
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          value={value}
          onValueUpdated={setValue}
        ></ContinuousSlider>
      </>
    );
  }
);

export default Player;
