import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, FileText } from 'lucide-react';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={() => handleTabClick('Home')}
          >
            <FileText className="h-8 w-8 text-accent mr-2" />
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

          {/* Right - Theme Toggle & Generate Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text hover:text-white hover:bg-accent transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

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
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text hover:text-accent hover:bg-secondary transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

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