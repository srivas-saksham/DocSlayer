import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Upload, 
  FileText, 
  Wand2, 
  Download,
  ArrowRight,
  User,
  Code2,
  Palette,
  BookOpen,
  Lightbulb,
  Cog,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';

// Grid Background Component
const GridBackground = ({ className = '', gridSize = 40, opacity = 0.1 }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateGridDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cols = Math.ceil(rect.width / gridSize);
        const rows = Math.ceil(rect.height / gridSize);
        setGridDimensions({ rows, cols });
      }
    };

    updateGridDimensions();
    window.addEventListener('resize', updateGridDimensions);
    
    return () => window.removeEventListener('resize', updateGridDimensions);
  }, [gridSize]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
      
      if (col >= 0 && col < gridDimensions.cols && row >= 0 && row < gridDimensions.rows) {
        setHoveredCell({ row, col });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const renderGridCells = () => {
    const cells = [];
    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.cols; col++) {
        const isHovered = hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`absolute border ${
              isHovered 
                ? 'bg-accent border-accent' 
                : 'bg-transparent border-accent'
            }`}
            style={{
              left: `${col * gridSize}px`,
              top: `${row * gridSize}px`,
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              borderWidth: '1px',
              opacity: isHovered ? 1
               : opacity,
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: 'auto' }}
    >
      {renderGridCells()}
      
      {/* Gradient overlay for smoother edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/20 pointer-events-none" />
    </div>
  );
};

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
};

// Custom hook for counter animation
const useCounter = (end, duration = 2000, startWhen = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startWhen) return;
    
    let start = 0;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, startWhen]);

  return count;
};

// Hero Section Component
const AboutHero = () => {
  const [ref, isInView] = useInView(0.3);

  return (
    <section ref={ref} className="min-h-screen bg-primary flex items-center justify-center relative overflow-hidden">
      <GridBackground gridSize={30} opacity={0.08} />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`transition-all duration-1000 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 
            className="text-4xl md:text-5xl font-light text-accent mb-4 tracking-tight"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            About DocSlayer
          </h1>
          
          <p 
            className="text-lg text-accent/70 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            We built DocSlayer to eliminate the tedious process of manual documentation formatting. 
            Our team believes developers should focus on code, not Word documents.
          </p>
        </div>
      </div>
    </section>
  );
};

// Team Section Component
const TeamSection = () => {
  const [ref, isInView] = useInView(0.2);

  const teamMembers = [
    {
      id: 1,
      name: "Saksham Srivastava",
      role: "Lead Developer",
      icon: Code2,
      skills: "React, TypeScript, UI/UX"
    },
    {
      id: 2,
      name: "Rajan",
      role: "Backend Developer", 
      icon: Cog,
      skills: "Node.js, Python, APIs"
    },
    {
      id: 3,
      name: "Gagan Jha",
      role: "Frontend Developer",
      icon: Palette,
      skills: "Design Systems, Figma"
    },
    {
      id: 4,
      name: "Darshil Khandelwal",
      role: "Technical Writer",
      icon: BookOpen,
      skills: "Documentation, Content Strategy"
    }
  ];

  return (
    <section ref={ref} className="bg-accent py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`mb-12 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-2xl font-light text-primary mb-3"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Team
          </h2>
          <p 
            className="text-primary/70 max-w-2xl"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Four students who got tired of formatting documentation manually
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={member.id}
                className={`bg-primary rounded-lg p-6 transition-all duration-1000 hover:shadow-lg relative z-10 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 
                      className="text-accent font-medium text-sm"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {member.name}
                    </h3>
                    <p 
                      className="text-accent/60 text-xs"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
                
                <p 
                  className="text-accent/70 text-xs"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {member.skills}
                </p>
                
                <div className="flex gap-2 mt-4">
                  <button className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center hover:bg-accent/20 transition-colors">
                    <Github size={14} className="text-accent/70" />
                  </button>
                  <button className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center hover:bg-accent/20 transition-colors">
                    <Linkedin size={14} className="text-accent/70" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Timeline Section Component
const TimelineSection = () => {
  const [ref, isInView] = useInView(0.1);

  const milestones = [
    {
      id: 1,
      title: "Problem Identification",
      date: "",
      description: "Recognized the inefficiency in manual documentation processes across development teams."
    },
    {
      id: 2,
      title: "Prototype Development",
      date: "", 
      description: "Built initial proof-of-concept focusing on Python file parsing and basic Word generation."
    },
    {
      id: 3,
      title: "Core Engine",
      date: "",
      description: "Developed robust file processing system supporting 40+ programming languages."
    },
    {
      id: 4,
      title: "User Interface",
      date: "",
      description: "Designed clean, intuitive interface with drag-and-drop functionality."
    },
    {
      id: 5,
      title: "Production Ready",
      date: "",
      description: "Implemented security features, template system, and performance optimizations."
    }
  ];

  return (
    <section ref={ref} className="bg-primary py-16 relative overflow-hidden">
      <GridBackground gridSize={35} opacity={0.07} />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className={`mb-12 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-2xl font-light text-accent mb-3"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Development Timeline
          </h2>
          <p 
            className="text-accent/70"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            From concept to production
          </p>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`flex items-start gap-4 transition-all duration-1000 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 
                    className="text-accent font-medium text-sm"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {milestone.title}
                  </h3>
                  <span 
                    className="text-accent/50 text-xs"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {milestone.date}
                  </span>
                </div>
                
                <p 
                  className="text-accent/70 text-sm leading-relaxed"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const [ref, isInView] = useInView(0.3);
  
  const timeCounter = useCounter(75, 2000, isInView);
  const templateCounter = useCounter(5, 1500, isInView);
  const privacyCounter = useCounter(100, 1800, isInView);

  const stats = [
    { 
      number: timeCounter, 
      suffix: "%", 
      label: "Time Reduction",
      description: "Faster documentation workflow",
      icon: Clock
    },
    { 
      number: templateCounter, 
      suffix: "+", 
      label: "Template Options",
      description: "Professional layouts available", 
      icon: FileText
    },
    { 
      number: privacyCounter, 
      suffix: "%", 
      label: "Privacy Focused",
      description: "No permanent data storage",
      icon: Shield
    }
  ];

  return (
    <section ref={ref} className="bg-accent py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`mb-12 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-2xl font-light text-primary mb-3"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Impact Metrics
          </h2>
          <p 
            className="text-primary/70"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Measurable improvements in documentation workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-primary rounded-lg p-8 relative z-10">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-accent" />
                  </div>
                  
                  <div className="text-3xl font-light text-accent mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {stat.number}{stat.suffix}
                  </div>
                  
                  <h3 
                    className="text-accent font-medium text-sm mb-2"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {stat.label}
                  </h3>
                  
                  <p 
                    className="text-accent/70 text-xs"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Technical Specifications Section Component
const TechnicalSection = () => {
  const [ref, isInView] = useInView(0.2);
  const [activeTab, setActiveTab] = useState('architecture');

  const specs = {
    architecture: {
      title: "System Architecture",
      items: [
        {
          component: "Frontend",
          tech: "React + TailwindCSS",
          description: "Modern SPA with drag-and-drop file handling, real-time progress tracking, and responsive template previews"
        },
        {
          component: "Backend API", 
          tech: "FastAPI (Python)",
          description: "RESTful API service handling file processing, template rendering, and document generation at /documents/generate endpoint"
        },
        {
          component: "File Processing",
          tech: "Multi-format Parser",
          description: "Supports 40+ programming languages with automatic syntax detection and code structure analysis"
        },
        {
          component: "Document Engine",
          tech: "python-docx + Custom Templates",
          description: "Generates professional Word documents with syntax highlighting, formatting, and layout automation"
        }
      ]
    },
    processing: {
      title: "File Processing Pipeline",
      items: [
        {
          component: "Upload Validation",
          tech: "Client + Server Side",
          description: "File extension validation, size limits, and duplicate detection before processing begins"
        },
        {
          component: "Code Analysis",
          tech: "AST Parsing",
          description: "Abstract Syntax Tree parsing to understand code structure, functions, classes, and comments"
        },
        {
          component: "Syntax Highlighting",
          tech: "Pygments Library",
          description: "Professional code highlighting with language-specific color schemes and formatting"
        },
        {
          component: "Document Assembly",
          tech: "Template Engine",
          description: "Combines parsed code with selected template layout, applying styles and generating final DOCX"
        }
      ]
    },
    features: {
      title: "Technical Features",
      items: [
        {
          component: "Privacy Architecture",
          tech: "Session-Only Storage",
          description: "No permanent file storage - all uploads processed in memory and automatically purged after generation"
        },
        {
          component: "Template System",
          tech: "Modular Design",
          description: "5 professional templates with customizable layouts, headers, footers, and styling options"
        },
        {
          component: "Options Engine",
          tech: "Dynamic Configuration",
          description: "Real-time options like index generation, page numbering, credentials, and syntax highlighting toggles"
        },
        {
          component: "Progress Tracking",
          tech: "WebSocket Alternative",
          description: "Real-time progress updates during document generation with estimated completion times"
        }
      ]
    }
  };

  const tabs = [
    { id: 'architecture', label: 'Architecture', icon: Cog },
    { id: 'processing', label: 'Processing', icon: Sparkles },
    { id: 'features', label: 'Features', icon: Shield }
  ];

  return (
    <section ref={ref} className="bg-accent py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-2xl font-light text-primary mb-3"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Technical Specifications
          </h2>
          <p 
            className="text-primary/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Understanding the technology stack and processing pipeline behind DocSlayer
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-primary rounded-xl p-1 flex gap-1 relative z-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent text-primary shadow-lg'
                      : 'text-accent hover:bg-accent/10'
                  }`}
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="bg-primary rounded-xl p-8 relative z-10">
            <h3 
              className="text-xl font-medium text-accent mb-6 text-center"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {specs[activeTab].title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specs[activeTab].items.map((item, index) => (
                <div
                  key={index}
                  className="bg-accent/5 rounded-lg p-4 border border-accent/10 hover:border-accent/20 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 
                      className="text-accent font-medium text-sm group-hover:text-accent/90 transition-colors"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {item.component}
                    </h4>
                    <span 
                      className="bg-accent/10 text-accent px-2 py-1 rounded-md text-xs font-medium"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      {item.tech}
                    </span>
                  </div>
                  
                  <p 
                    className="text-accent/70 text-xs leading-relaxed"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Endpoint Information */}
        <div className={`mt-8 bg-primary rounded-xl p-6 border border-accent/20 transition-all duration-1000 relative z-10 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          <h4 
            className="text-accent font-medium text-sm mb-4 flex items-center gap-2"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Code2 size={16} />
            API Integration Details
          </h4>
          
          <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-accent font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Endpoint:
                </span>
                <p className="text-accent/70 mt-1 font-mono bg-accent/10 px-2 py-1 rounded">
                  POST /documents/generate
                </p>
              </div>
              
              <div>
                <span className="text-accent font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Input Format:
                </span>
                <p className="text-accent/70 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                  multipart/form-data with files and configuration options
                </p>
              </div>
              
              <div>
                <span className="text-accent font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                  Output:
                </span>
                <p className="text-accent/70 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                  application/vnd.openxmlformats (DOCX blob)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main About Page Component
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary">
      <AboutHero />
      <TeamSection />
      <TimelineSection />
      <StatsSection />
      <TechnicalSection />
    </div>
  );
}