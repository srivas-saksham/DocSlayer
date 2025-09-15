import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DocSlayerHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-start justify-center">
      {/* Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #44413c 2px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0"
        }}
      ></div>
      
      {/* Content Container */}
      <div className="max-w-full text-center relative z-10">
        
        {/* Main Title */}
        <h1 
          className="w-full text-accent text-[20vw] font-bold leading-none"
          style={{ fontFamily: 'Jost, sans-serif'}}
        >
          DocSlayer
        </h1>
        
        {/* Tagline */}
        <h2 
          className="text-text text-[3vw] font-bold mt-4 tracking-wide"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Slaying Code Documenting
        </h2>
        
        {/* Description */}
        <p 
          className="text-text text-[1.2vw] mt-6 max-w-4xl mx-auto leading-relaxed"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Automate your code-to-doc workflow in seconds.
        </p>
        
        {/* CTA Button with Arrow */}
        <button 
          className="mt-10 bg-accent hover:bg-accent/95 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-3 mx-auto group relative overflow-hidden"
          style={{ fontFamily: 'Jost, sans-serif' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <span className={`transition-transform duration-300 ${isClicked ? 'translate-x-2' : ''}`}>
            Generate Now
          </span>
          <ArrowRight 
            className={`transition-transform duration-700 ease-out ${
              isHovered && !isClicked
                ? 'translate-x-4' 
                : 'translate-x-0'
            } ${
              isClicked 
                ? 'ease-in translate-x-96' 
                : ''
            }`}
            size={20}
          />
        </button>
        
      </div>
    </div>
  );
}