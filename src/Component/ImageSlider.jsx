 import { useState,useEffect } from "react";
 import React from "react";
 const ImageSlider = ({ images, interval = 2000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const autoPlay = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
  
      return () => clearInterval(autoPlay);
    }, [images.length, interval]);
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    const goToNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    return (
      <div className=" container-fluid w-auto bg-dark slider">
        <button className="slider-button prev" onClick={goToPrevious}>❮</button>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="slider-image"
        />
        <button className="slider-button next" onClick={goToNext}>❯</button>
      </div>
    );
  };
  export default  ImageSlider;