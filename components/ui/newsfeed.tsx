// components/ui/newsfeed.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

type NewsItem = {
  id: number;
  imgSrc: string;
  alt: string;
  text: string;
};

export default function NewsFeed({ newsItems }: { newsItems: NewsItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel Items */}
      <div 
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {newsItems.map((item) => (
          <div key={item.id} className="min-w-full h-full flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <Image
              src={item.imgSrc}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <h2 className="text-4xl font-bold mb-2">{item.text}</h2>
              <p className="text-sm text-gray-200 max-w-xl">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ArrowLeft size={24} />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ArrowRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}