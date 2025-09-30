import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, ChevronDown, Mail, Code, Sparkles, Heart } from 'lucide-react';

const DocSlayerFooter = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);

  const teamMembers = [
    { 
      name: 'Saksham Srivastava', 
      role: 'Lead Developer', 
      linkedin: 'https://www.linkedin.com/in/srivas-saksham/', 
      github: 'https://github.com/srivas-saksham' 
    },
    { 
      name: 'Rajan', 
      role: 'Backend Developer', 
      linkedin: 'https://www.linkedin.com/in/rajan-sita-110b97347/', 
      github: 'https://github.com/RajanSita'
    },
    { 
      name: 'Gagan Jha', 
      role: 'Frontend Developer', 
      linkedin: 'https://www.linkedin.com/in/gaganjha18/',
      github: 'https://github.com/jhaGagan0'
    },
    { 
      name: 'Darshil Khandelwal', 
      role: 'Technical Writer', 
      linkedin: 'https://www.linkedin.com/in/darshil-khandelwal-59962b335/' 
    }
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Generate', href: '/generate' },
    { label: 'Templates', href: '/templates' },
    { label: 'About', href: '/about' }
  ];

  // Handle dropdown toggle with animation
  const toggleTeamDropdown = () => {
    if (isTeamOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsTeamOpen(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setIsTeamOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isTeamOpen) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsTeamOpen(false);
            setIsAnimating(false);
          }, 200);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTeamOpen]);

  return (
    <footer className="bg-accent relative z-10 border-t  border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Column 1: Branding & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <img src="/docslayer_logo_trans.png" 
                    alt="docslayer logo" 
                    className="h-9 w-auto" 
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}/>
                </div>
                <h3 className="text-3xl font-bold text-primary">
                  DocSlayer
                </h3>
              </div>
              
              <p className="text-sm text-[#44413c]/70 dark:text-[#f5f5f0]/70 leading-relaxed max-w-xs">
                Transform your code into professionally formatted documentation with AI-powered execution simulation.
              </p>

              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20">
                <span className="text-sm font-medium text-[#44413c] dark:text-[#f5f5f0]">
                  35+ Languages Supported
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links & Contact */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-[#44413c] dark:text-[#f5f5f0] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  Quick Links
                </h4>
                <nav className="space-y-3" aria-label="Footer navigation">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-[#44413c]/70 dark:text-[#f5f5f0]/70 hover:text-primary dark:hover:text-primary hover:translate-x-1 transition-all duration-300"
                      aria-label={`Navigate to ${link.label}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-[#44413c] dark:text-[#f5f5f0] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  Contact
                </h4>
                <a 
                  href="mailto:boxx.gray@gmail.com"
                  className="group flex items-center gap-3 text-sm text-[#44413c]/70 dark:text-[#f5f5f0]/70 hover:text-primary dark:hover:text-primary transition-all duration-300"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary transition-all duration-300">
                    <Mail className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    boxx.gray@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Column 3: Team Dropdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#44413c] dark:text-[#f5f5f0] uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                Development Team
              </h4>
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleTeamDropdown}
                  className="w-full flex items-center justify-between p-4 bg-[#2d2a27] rounded-2xl shadow-md hover:shadow-lg border border-[#44413c]/10 dark:border-[#f5f5f0]/10 transition-all duration-300 hover:scale-[1.02] group"
                  aria-label="Toggle team members menu"
                  aria-expanded={isTeamOpen}
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#44413c] dark:text-[#f5f5f0] mb-1">
                      DocSlayer Team
                    </div>
                    <div className="text-xs text-[#44413c]/60 dark:text-[#f5f5f0]/60">
                      4 Members • Full Stack Development
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isTeamOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-primary" />
                  </div>
                </button>

                {/* Dropdown Menu (opens upward) */}
                <div 
                  className={`absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#2a2826] rounded-2xl shadow-2xl border border-[#44413c]/10 dark:border-[#f5f5f0]/10 overflow-hidden transition-all duration-200 ${
                    isTeamOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : isAnimating 
                        ? 'opacity-0 scale-95 translate-y-2' 
                        : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                  }`}
                  style={{
                    maxHeight: isTeamOpen ? '500px' : '0px',
                    transitionProperty: 'opacity, transform, max-height'
                  }}
                >
                  <div className="p-3 border-b border-[#44413c]/10 dark:border-[#f5f5f0]/10">
                    <div className="text-xs font-bold text-[#44413c] dark:text-[#f5f5f0] uppercase tracking-wider">
                      Meet the Team
                    </div>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.name}
                        className={`p-3 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 dark:hover:from-primary/10 dark:hover:to-primary/20 transition-all duration-300 hover:scale-[1.02] group ${
                          isTeamOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}
                        style={{
                          transitionDelay: isTeamOpen ? `${index * 50}ms` : '0ms'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-[#44413c] dark:text-[#f5f5f0] mb-0.5">
                              {member.name}
                            </h3>
                            <p className="text-xs text-[#44413c]/60 dark:text-[#f5f5f0]/60">
                              {member.role}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 ml-3">
                            {member.github && (
                              <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/icon relative p-2 rounded-lg bg-[#44413c]/5 dark:bg-[#f5f5f0]/5 hover:bg-primary transition-all duration-300 hover:scale-110"
                                aria-label={`${member.name}'s GitHub profile`}
                              >
                                <Github className="w-4 h-4 text-[#44413c] dark:text-[#f5f5f0] group-hover/icon:text-accent transition-colors" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#44413c] dark:bg-[#f5f5f0] text-white dark:text-[#44413c] text-xs rounded-lg opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                                  GitHub Profile
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#44413c] dark:border-t-[#f5f5f0]"></div>
                                </span>
                              </a>
                            )}
                            
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/icon relative p-2 rounded-lg bg-[#44413c]/5 dark:bg-[#f5f5f0]/5 hover:bg-primary transition-all duration-300 hover:scale-110"
                                aria-label={`${member.name}'s LinkedIn profile`}
                              >
                                <Linkedin className="w-4 h-4 text-[#44413c] dark:text-[#f5f5f0] group-hover/icon:text-accent transition-colors" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#44413c] dark:bg-[#f5f5f0] text-white dark:text-[#44413c] text-xs rounded-lg opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                                  LinkedIn
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#44413c] dark:border-t-[#f5f5f0]"></div>
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="py-6 border-t border-[#44413c]/10 dark:border-[#f5f5f0]/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-4 text-xs text-[#44413c]/60 dark:text-[#f5f5f0]/60">
              <span>© 2025 DocSlayer. All rights reserved.</span>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-[#44413c]/30 dark:bg-[#f5f5f0]/30"></div>
              <span className="hidden sm:inline">Code-to-DOCX Platform</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-[#44413c]/60 dark:text-[#f5f5f0]/60">
                <span>Built with</span>
                <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" fill="currentColor" />
                <span>by the DocSlayer Team</span>
              </div>
              
              {/* Version Badge */}
              <div className="px-3 pb-1 bg-[#2d2a27] rounded-full border border-primary/20">
                <span className="text-xs font-medium text-primary">v1.2.7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DocSlayerFooter;