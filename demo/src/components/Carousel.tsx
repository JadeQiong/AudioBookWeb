import TouchSweep from 'touchsweep';
import { v4 as uuid } from 'uuid';
import './Carousel.css';

import {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  LegacyRef,
  ReactNode,
  forwardRef,
  useCallback,
  CSSProperties,
  useImperativeHandle,
} from 'react';

export type CarouselItem = Readonly<{
  alt?: string;
  image: string;
  content: ReactNode;
  onClick?: () => void;
  reflectionImage?: string;
}>;

export type DecoratedCarouselItem = CarouselItem & Readonly<{ id: string }>;

export type CarouselProps = Readonly<{
  ref?: LegacyRef<CarouselRef>;
  items: CarouselItem[];
  itemWidth?: number;
  showControls?: boolean;
  slideOnClick?: boolean;
  classNamePrefix?: string;
  nextButtonContent?: string | ReactNode;
  prevButtonContent?: string | ReactNode;
  onIndexChange?: any;
}>;

export type CarouselRef = Readonly<{
  next: () => void;
  prev: () => void;
  getItems: () => DecoratedCarouselItem[];
  getSelectedIndex: () => number;
  setSelectedIndex: (index: number) => void;
}>;

export const Carousel: FC<CarouselProps> = forwardRef(
  (
    {
      items,
      itemWidth = 210,
      showControls = true,
      slideOnClick = false,
      classNamePrefix = 'carousel',
      prevButtonContent = 'Previous',
      nextButtonContent = 'Next',
      onIndexChange,
    }: CarouselProps,
    CarouselRef
  ) => {
    const data: DecoratedCarouselItem[] = useMemo(
      () =>
        items.map((item) => ({
          ...item,
          ...((item as unknown as DecoratedCarouselItem).id
            ? ({} as unknown as DecoratedCarouselItem)
            : { id: uuid() }),
        })),
      [items]
    );

    const len = useMemo(() => data.length, [data.length]);
    const theta = useMemo(() => 360 / len, [len]);

    const radiusFactor = 1.5; 
    const radius = useMemo(
      () => Math.round((itemWidth / 2) / Math.tan(Math.PI / len) * radiusFactor),
      [itemWidth, len]
    );

    const ref = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const getSlideStyle = useCallback(
      (index: number): CSSProperties => {
        const style: CSSProperties = {};

        if (index < len) {
          const cellAngle = theta * index;

          style.opacity = 1;
          style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;

          if (index === selectedIndex - 1 || index === selectedIndex + 1) {
              const additionalRotation = index === selectedIndex - 1 ? 40 : -40;
              style.transform += ` rotateY(${additionalRotation}deg)`;
          }

          if (index === selectedIndex - 2 || index === selectedIndex + 2) {
              const additionalRotation = index === selectedIndex - 2 ? 50 : -50;
              style.transform += ` rotateY(${additionalRotation}deg)`;
          }
        } else {
          style.opacity = 0;
          style.transform = 'none';
        }

        return style;
      },
      [len, radius, theta, selectedIndex]
    );

    const getItemStyle = useCallback((): CSSProperties => {
      const angle = theta * selectedIndex * -1;

      return {
        transform: `translateZ(${-1 * radius}px) rotateY(${angle}deg)`,
      };
    }, [radius, selectedIndex, theta]);

    const getClassName = useCallback(
      (parts: string | string[]) =>
        Array.isArray(parts)
          ? parts.map((part: string) => `${classNamePrefix}${part}`).join(' ')
          : `${classNamePrefix}${parts}`,
      [classNamePrefix]
    );

    const prev = useCallback(
      () => setSelectedIndex(selectedIndex - 1),
      [selectedIndex]
    );

    const next = useCallback(
      () => setSelectedIndex(selectedIndex + 1),
      [selectedIndex]
    );

    useEffect(() => {
      if (onIndexChange) {
        onIndexChange(selectedIndex);
      }
    }, [selectedIndex]);

    useEffect(() => {
      const area = ref?.current;
      const touchsweep = new TouchSweep(area ?? undefined);

      area?.addEventListener('swipeleft', next);
      area?.addEventListener('swiperight', prev);

      return () => {
        touchsweep.unbind();

        area?.removeEventListener('swipeleft', next);
        area?.removeEventListener('swiperight', prev);
      };
    });

    useImperativeHandle(
      CarouselRef,
      (): CarouselRef => ({
        next,
        prev,
        getItems: () => data,
        getSelectedIndex: () => selectedIndex,
        setSelectedIndex: (index: number) => setSelectedIndex(index),
      })
    );

    return (
      <>
        <div className={getClassName('')} ref={ref}>
          <div className={getClassName('__container')} style={getItemStyle()}>
            {data.map((item: DecoratedCarouselItem, index: number) => (
              <div
                key={item.id}
                style={getSlideStyle(index)}
                onClick={() => {
                  if (item.onClick) item.onClick();

                  if (slideOnClick) setSelectedIndex(index);
                }}
                className={getClassName('__slide')}
              >
                <img src={item.image}  style={{width: '20rem', height: '30rem'}} alt={item.alt} />
                <img src={item.image}  style={{width: '20rem', height: '30rem', transform: 'scaleY(-1)', opacity: 0.2}} alt={item.alt} />
                {index === selectedIndex && (
                <div
                className={
                    getClassName(
                	'__slide-overlay'
                    )}
                >
                  {item.content}
                </div>)
                }
              </div>
            ))}
          </div>
        </div>

        {showControls && (
          <div className={getClassName('__controls')}>
            <button
              className={getClassName(['__control', '__control--prev'])}
              onClick={prev}
            >
              {prevButtonContent}
            </button>

            <button
              className={getClassName(['__control', '__control--next'])}
              onClick={next}
            >
              {nextButtonContent}
            </button>
          </div>
        )}
      </>
    );
  }
);

export default Carousel;
