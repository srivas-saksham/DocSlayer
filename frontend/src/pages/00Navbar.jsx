import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Star } from 'lucide-react';

// Mock Link component for navigation
const Link = ({ to, children, className, onClick }) => (
  <button
    className={className}
    onClick={(e) => {
      e.preventDefault();
      window.history.pushState({}, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (onClick) onClick();
    }}
  >
    {children}
  </button>
);

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationTabs = [
    { name: 'Home', path: '/' },
    { name: 'Generate', path: '/generate' },
    { name: 'Templates', path: '/templates' },
    { name: 'About', path: '/about' }
  ];

  // Update active tab based on current path
  useEffect(() => {
    const updateActiveTab = () => {
      const currentPath = window.location.pathname;
      const currentTab = navigationTabs.find(tab => tab.path === currentPath);
      if (currentTab) {
        setActiveTab(currentTab.name);
      }
    };

    updateActiveTab();
    window.addEventListener('popstate', updateActiveTab);
    return () => window.removeEventListener('popstate', updateActiveTab);
  }, []);

  // Handle Stay on page UI from Generate.jsx
  useEffect(() => {
    const handleResetActiveTab = (event) => {
      if (event.detail && event.detail.tabName) {
        setActiveTab(event.detail.tabName);
      }
    };

    window.addEventListener('resetActiveTab', handleResetActiveTab);
    return () => window.removeEventListener('resetActiveTab', handleResetActiveTab);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tabName) => {
    // Check if we're trying to navigate away from generate page with generated content
    const isOnGeneratePage = window.location.pathname === '/generate';
    const hasGeneratedContent = window.DocSlayerGeneratedContent === true; // This flag will be set by DocGeneratorPage
    
    if (isOnGeneratePage && hasGeneratedContent && tabName !== 'Generate') {
      // Don't immediately change the active tab - let the warning modal handle it
      return;
    }
    
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  const handleGenerateClick = () => {
    window.history.pushState({}, '', '/generate');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleGitHubStar = () => {
    window.open('https://github.com/srivas-saksham/DocSlayer', '_blank');
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md border-b border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={() => handleTabClick('Home')}
          >
            <img src="/docslayer_logo_trans.png" 
              alt="docslayer logo" 
              className="h-8 mr-2 w-auto" 
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}/>
            <span className="font-jost font-bold text-2xl text-accent">
              DocSlayer
            </span>
          </Link>

          {/* Center - Navigation Tabs (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                onClick={() => handleTabClick(tab.name)}
                className={`relative px-6 py-2 text-sm font-medium transition-all duration-300 rounded-lg overflow-hidden group border ${
                    activeTab === tab.name
                    ? 'text-white bg-accent border-accent'
                    : 'text-text border-accent hover:text-white'
                }`}
              >
                {/* Background layer (always rendered) */}
                <div
                    className={`absolute inset-0 rounded-lg transition-transform duration-300 ease-out -z-10
                    ${activeTab === tab.name 
                        ? 'bg-accent translate-y-0' 
                        : 'bg-accent translate-y-full group-hover:translate-y-0'
                    }`}
                />
                <span className="relative z-10">{tab.name}</span>
              </Link>
            ))}
          </div>

          {/* Right - GitHub Star & Generate Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* GitHub Star Button */}
            <div className="relative group">
              <button
                onClick={handleGitHubStar}
                className="p-2 rounded-full text-text hover:text-yellow-400 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                aria-label="Star DocSlayer on GitHub"
              >
                <Star className="h-5 w-5 fill-transparent hover:fill-yellow-400 transition-all duration-300" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-accent text-primary text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
                Star DocSlayer on GitHub
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerateClick}
              className="bg-accent hover:bg-accent/95 text-white font-bold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              Generate
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* GitHub Star Mobile */}
            <div className="relative group">
              <button
                onClick={handleGitHubStar}
                className="p-2 rounded-full text-text hover:text-yellow-400 transition-all duration-300 transform hover:scale-110"
                aria-label="Star DocSlayer on GitHub"
              >
                <Star className="h-5 w-5 fill-transparent hover:fill-yellow-400 transition-all duration-300" />
              </button>
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-text hover:text-accent hover:bg-secondary transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-primary">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => handleTabClick(tab.name)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    activeTab === tab.name
                      ? 'text-accent bg-secondary'
                      : 'text-text hover:text-accent hover:bg-secondary'
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
              
              {/* Mobile Generate Button */}
              <div className="pt-4 pb-2">
                <button 
                  onClick={handleGenerateClick}
                  className="w-full bg-accent hover:bg-accent/95 text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;