"use client";
import React, { useState, useEffect } from 'react';

const Bar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-gray-800 text-white p-4 transition-all ${
        isScrolled ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <h1>Header</h1>
    </div>
  )
}

export default Bar