'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import DynamicComponent from './DynamicComponent';

interface SliderProps {
  items: any[];
  orientation?: 'horizontal' | 'vertical';
}

const Slider: React.FC<SliderProps> = ({
  items,
  orientation = 'horizontal',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [moveDistance, setMoveDistance] = useState(0);
  const [isMoveByItem, setIsMoveByItem] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWrapperWidth = () => {
      if (wrapperRef.current) {
        const newWidth = wrapperRef.current.offsetWidth;
        if (newWidth !== wrapperWidth) {
          setWrapperWidth(newWidth);
        }
      }
    };
    updateWrapperWidth();
    window.addEventListener('resize', updateWrapperWidth);
    return () => {
      window.removeEventListener('resize', updateWrapperWidth);
    };
  }, [wrapperWidth]);

  useEffect(() => {
    const itemWidth = 256;
    const sliderWidth = items.length * itemWidth;
    const maxOffset = Math.max(sliderWidth - wrapperWidth, 0);
    const offset = currentIndex * itemWidth;
    const rest = maxOffset - offset;

    if (rest > 0 || direction === 'prev') {
      setIsMoveByItem(true);
      setMoveDistance(currentIndex * itemWidth);
    } else {
      setIsMoveByItem(false);
      setMoveDistance(maxOffset);
    }

    console.log('currentIndex:', currentIndex);
    console.log('rest:', rest);
    console.log('isMoveByItem:', isMoveByItem);
  }, [currentIndex, items.length, wrapperWidth, moveDistance]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setDirection('prev');
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1 && isMoveByItem) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setDirection('next');
    }
  }, [currentIndex, items.length, isMoveByItem]);

  return (
    <div
      id="wrapper"
      ref={wrapperRef}
      className={`relative overflow-hidden  h-full border-2 border-blue-300 ${
        orientation === 'horizontal' ? 'flex-row w-full' : 'flex-col'
      }`}
    >
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className={`absolute  transform  opacity-30 cursor-pointer z-10 w-0 h-0  border-transparent border-r-black hover:opacity-50 ${
            orientation === 'horizontal'
              ? 'top-1/2 -translate-y-1/2 left-1 border-y-[80px] border-r-[40px]'
              : 'top-1 border-x-[40px] border-t-[20px]'
          }`}
        ></button>
      )}
      <div
        id="slider"
        className={`border-2 border-orange-300 flex transition-transform duration-300 ease-in-out ${
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        }`}
        style={{
          transform: `translate${
            orientation === 'horizontal' ? 'X' : 'Y'
          }(-${moveDistance}px)`,
        }}
      >
        {items.map((item, index) => (
          <div key={item.id ?? index + 1} className="w-64 h-96">
            <DynamicComponent props={item} />
          </div>
        ))}
      </div>
      {currentIndex < items.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 transform -translate-y-1/2 opacity-30 cursor-pointer right-1 z-10 w-0 h-0 border-y-[80px] border-l-[40px] border-transparent border-l-black hover:opacity-50"
        ></button>
      )}
    </div>
  );
};

export default Slider;
