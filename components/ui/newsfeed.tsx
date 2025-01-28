'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

function newsfeed({ newsItems }: { newsItems: { id: number; imgSrc: string; alt: string, text: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[500px]">
      {/* Image container with horizontal scroll */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Scrollable Image wrapper with transition */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Scrolling effect
        >
          {newsItems.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <div className="w-full h-full relative">
                {/* Displaying image correctly */}
                <Image
                  src={item.imgSrc}
                  alt={item.alt}
                  width={1920}
                  height={500}
                  objectFit="cover"
                />
                {/* Text overlay on the image */}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl p-4 bg-black bg-opacity-50">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &#8592;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &#8594;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default newsfeed;
