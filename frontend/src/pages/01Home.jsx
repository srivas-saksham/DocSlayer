import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import RotatingText from '../components/RotatingText.jsx';
import DetailsSection from '../components/DetailsSection.jsx';

export default function DocSlayerHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsSection, setShowDetailsSection] = useState(false);

  const detailsSectionRef = useRef(null);
  const fullText = "DocSlayer";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, ['/']);

  // Intersection Observer for DetailsSection visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowDetailsSection(true);
          // Stop observing once it's visible
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px' // No margin adjustment
      }
    );

    if (detailsSectionRef.current) {
      observer.observe(detailsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 150); // Adjust speed here (lower = faster)

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Backspace modal handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2700); // Start exit animation 300ms before removal
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    window.location.href = `/generate`;
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
      <div className="max-w-full text-center relative z-10 select-none">
        
        {/* Main Title with Typewriter Effect */}
        <h1 
          className="w-full text-accent text-[20vw] font-bold leading-none"
          style={{ fontFamily: 'Jost, sans-serif'}}
        >
          {displayText}
          <span 
            className={`inline-block w-1 bg-accent ml-1 transition-opacity duration-100 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ height: '0.8em', verticalAlign: 'baseline' }}
          />
        </h1>
        
        {/* Tagline */}
        <h2 
          className="text-text text-[3vw] font-bold mt-8 tracking-wide"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Slaying{" "}
          <RotatingText
            texts={['Code Documenting', 'Assignments', 'Workflows']}
            mainClassName="text-primary text-[3vw] font-bold tracking-wide bg-accent px-2 rounded-lg inline-flex"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
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
        
        {/* DetailsSection with intersection observer */}
        <div 
          ref={detailsSectionRef}
          className={`mt-20 transition-all duration-1000 ease-out ${
            showDetailsSection 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <DetailsSection />
        </div>

      </div>

      {/* Simple Backspace Toast */}
      {showModal && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up-down">
          <div className="bg-accent text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">
              Haha, backspace? That won't Work! lol
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUpDown {
          0% { 
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          10%, 90% { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% { 
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }
        .animate-slide-up-down {
          animation: slideUpDown 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}