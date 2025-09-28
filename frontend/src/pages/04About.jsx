import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  FileText,
  Code2,
  Palette,
  BookOpen,
  Cog,
  Sparkles,
  Shield,
  Clock,
  Zap,
  Settings,
  CheckCircle,
  Database
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
      <div className="max-w-2xl mx-auto px-6 relative z-10">
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
  const [ref, isInView] = useInView(0.1);
  const [activeTab, setActiveTab] = useState('architecture');

  const specs = {
    architecture: {
      title: "System Architecture & Tech Stack",
      items: [
        {
          component: "Frontend Layer",
          tech: "React 18 + TailwindCSS + Lucide Icons",
          description: "Modern SPA built with functional components, hooks (useState, useRef, useEffect), drag-and-drop file handling using HTML5 File API, real-time progress tracking via polling, and responsive template preview modals",
          details: [
            "File upload via drag-and-drop and click handlers",
            "Real-time progress polling every 500ms during generation",
            "Template carousel with horizontal scrolling",
            "DOCX preview using docx-preview library with custom styling",
            "Navigation guards to prevent data loss on page leave"
          ]
        },
        {
          component: "Backend API Service", 
          tech: "FastAPI (Python) + Uvicorn ASGI Server",
          description: "High-performance async REST API with CORS middleware, multipart file handling, background job processing, and comprehensive error handling across all endpoints",
          details: [
            "POST /documents/generate - Main document generation endpoint",
            "GET /documents/progress/{job_id} - Job status polling",
            "GET /documents/download/{filename} - Secure file serving",
            "Background task processing using asyncio.create_task",
            "In-memory job management with automatic cleanup"
          ]
        },
        {
          component: "File Processing Engine",
          tech: "Multi-format Parser + Pygments",
          description: "Supports 40+ programming languages (.py, .js, .java, .cpp, .c#, .go, .rs, .php, .kt, .swift, .scala, .html, .css, .sql, .r, .m, etc.) with automatic syntax detection and lexical analysis",
          details: [
            "Extension-based language detection with fallback to Python",
            "UTF-8 and Latin-1 encoding support for international files",
            "File validation with size limits and duplicate detection",
            "Automatic lexer selection using get_lexer_for_filename",
            "Error handling for corrupted or unreadable files"
          ]
        },
        {
          component: "Document Generation Engine",
          tech: "python-docx + Custom Template System",
          description: "Professional Word document generation with syntax highlighting, custom formatting, table layouts, borders, shading, and advanced typography using OxmlElement for precise control",
          details: [
            "5 distinct template layouts with unique styling approaches",
            "Custom DocxFormatter class for syntax highlighting integration",
            "Dynamic table generation with cell borders and shading",
            "Page numbering with NUMPAGES field integration",
            "Credential integration and index page auto-generation"
          ]
        }
      ]
    },
    workflow: {
      title: "Complete Processing Workflow",
      items: [
        {
          component: "File Upload & Validation",
          tech: "FormData + File API",
          description: "Secure file upload with client-side validation, drag-and-drop support, duplicate detection, and size limit enforcement before server processing",
          details: [
            "Client validates file extensions against supported formats array",
            "Duplicate file detection by name comparison",
            "File size display in KB with real-time feedback",
            "FormData construction with template and option parameters",
            "Error handling for unsupported file types"
          ]
        },
        {
          component: "Background Job Processing",
          tech: "Asyncio + Job Manager",
          description: "Asynchronous document generation using background tasks with real-time progress tracking, job state management, and automatic resource cleanup",
          details: [
            "Job creation with unique UUID-based identifiers",
            "Progress updates at 10%, 20-60% (AI processing), 70%, 80%, 100%",
            "In-memory job storage with status, progress, and message fields",
            "Background task execution using asyncio.create_task",
            "Automatic file cleanup on job completion or error"
          ]
        },
        {
          component: "AI Code Execution (Optional)",
          tech: "Multi-provider AI Integration",
          description: "Optional AI-powered code execution simulation supporting Google Gemini, Hugging Face, and OpenRouter APIs with intelligent input handling and output generation",
          details: [
            "Environment variable configuration for API providers",
            "Language-specific prompt engineering for realistic outputs",
            "Automatic input simulation with reasonable sample values",
            "Error handling and fallback mechanisms for API failures",
            "Sequential processing with rate limiting between requests"
          ]
        },
        {
          component: "Document Assembly & Rendering",
          tech: "Template Engine + Syntax Highlighting",
          description: "Dynamic document assembly combining parsed code with selected templates, applying syntax highlighting, formatting options, and generating final DOCX with proper styling",
          details: [
            "Template-specific rendering functions (apply_template1-5)",
            "Pygments integration for 20+ syntax highlighting color schemes",
            "Dynamic table creation with borders and cell formatting",
            "Conditional content inclusion based on user options",
            "Page margin control and typography standardization"
          ]
        }
      ]
    },
    features: {
      title: "Advanced Features & Security",
      items: [
        {
          component: "Privacy-First Architecture",
          tech: "Session-Only + Auto-Cleanup",
          description: "Zero permanent storage policy with automatic file deletion, session-based processing, and no user data persistence beyond generation lifecycle",
          details: [
            "Temporary file storage in /temp directory only",
            "Automatic file cleanup on job completion or error",
            "No database or persistent user data storage",
            "Session-based state management in React components",
            "Navigation warnings to prevent accidental data loss"
          ]
        },
        {
          component: "Dynamic Template System",
          tech: "Modular Design + Custom Styling",
          description: "5 professional templates with distinct layouts: Professional (tables), Modern (character shading), Minimalist (clean), Academic (formal structure), Creative (colorful design)",
          details: [
            "Template carousel with horizontal scrolling and preview",
            "PDF thumbnail previews with iframe integration",
            "Template-specific styling functions with unique approaches",
            "Dynamic content sections (Source Code, Output, Credentials)",
            "Responsive template selection with visual feedback"
          ]
        },
        {
          component: "Advanced Configuration Engine",
          tech: "Real-time Options + State Management",
          description: "Comprehensive options system with syntax highlighting toggle, index auto-generation, page numbering, credential integration, and AI execution controls",
          details: [
            "Toggle switches for all major features with React state",
            "Dynamic form rendering for credential information",
            "Index field selection with checkbox controls",
            "Real-time option validation and UI feedback",
            "Configuration persistence during session lifecycle"
          ]
        },
        {
          component: "Progress Tracking & UX",
          tech: "Polling + Real-time Updates",
          description: "Real-time progress monitoring with motivational messages, progress bars, background task status, and completion notifications with preview capabilities",
          details: [
            "500ms polling interval for smooth progress updates",
            "Dynamic progress messages with contextual quotes",
            "Shimmer effects and animations for visual feedback",
            "Error handling with user-friendly error messages",
            "Document preview with DOCX rendering and download options"
          ]
        }
      ]
    },
    technical: {
      title: "Implementation Details & APIs",
      items: [
        {
          component: "API Architecture",
          tech: "RESTful + Async Processing",
          description: "Well-structured API design with proper HTTP status codes, error handling, CORS configuration, and comprehensive endpoint documentation",
          details: [
            "CORS middleware allowing frontend communication",
            "Multipart form data handling for file uploads",
            "JSON responses with standardized error formats",
            "Background task management with job lifecycle",
            "Secure file serving with proper MIME types"
          ]
        },
        {
          component: "Error Handling & Resilience",
          tech: "Comprehensive Exception Management",
          description: "Multi-layer error handling with graceful degradation, user-friendly error messages, and automatic recovery mechanisms",
          details: [
            "File read errors with encoding fallback (UTF-8 → Latin-1)",
            "API timeout handling with user notifications",
            "Background job error capture and reporting",
            "Frontend error boundaries with reload suggestions",
            "Graceful handling of unsupported file types"
          ]
        },
        {
          component: "Performance Optimizations",
          tech: "Async Processing + Resource Management",
          description: "Optimized performance through asynchronous processing, efficient memory usage, background task execution, and resource cleanup",
          details: [
            "Non-blocking file processing using asyncio",
            "Memory-efficient file handling without permanent storage",
            "Progress polling optimization to prevent UI freezing",
            "Efficient React re-rendering with proper dependency arrays",
            "Automatic resource cleanup and memory management"
          ]
        },
        {
          component: "Security Implementations",
          tech: "Input Validation + Path Security",
          description: "Security-focused design with input validation, path traversal protection, file type restrictions, and secure file serving",
          details: [
            "File extension whitelist validation",
            "Path traversal protection in download endpoint",
            "Temporary file isolation in dedicated directories",
            "No code execution - only static analysis and rendering",
            "Automatic cleanup preventing data persistence"
          ]
        }
      ]
    }
  };

  const tabs = [
    { id: 'architecture', label: 'Architecture', icon: Cog },
    { id: 'workflow', label: 'Workflow', icon: Zap },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'technical', label: 'Technical', icon: Code2 }
  ];

  return (
    <section ref={ref} className="bg-accent py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
            className="text-primary/70 max-w-3xl mx-auto"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Deep dive into DocSlayer's complete architecture, processing pipeline, and implementation details
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="bg-primary rounded-xl p-1 flex gap-1 relative z-10 flex-wrap justify-center">
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
            
            <div className="space-y-6">
              {specs[activeTab].items.map((item, index) => (
                <div
                  key={index}
                  className="bg-accent/5 rounded-lg p-6 border border-accent/10 hover:border-accent/20 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 
                        className="text-accent font-medium text-base group-hover:text-accent/90 transition-colors mb-2"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {item.component}
                      </h4>
                      <span 
                        className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {item.tech}
                      </span>
                    </div>
                  </div>
                  
                  <p 
                    className="text-accent/70 text-sm leading-relaxed mb-4"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {item.description}
                  </p>

                  {item.details && (
                    <div className="bg-accent/5 rounded-md p-4 border-l-2 border-accent/20">
                      <h5 
                        className="text-accent font-medium text-xs mb-2 flex items-center gap-1"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        <Settings size={12} />
                        Implementation Details
                      </h5>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li 
                            key={idx}
                            className="text-accent/60 text-xs flex items-start gap-2"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            <CheckCircle size={10} className="text-accent/40 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Endpoints Documentation */}
        <div className={`mt-8 bg-primary rounded-xl p-6 border border-accent/20 transition-all duration-1000 relative z-10 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '600ms' }}>
          <h4 
            className="text-accent font-medium text-base mb-6 flex items-center gap-2"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            <Database size={18} />
            Complete API Documentation
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Endpoints */}
            <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
              <h5 className="text-accent font-medium text-sm mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                Core Endpoints
              </h5>
              <div className="space-y-3">
                <div className="bg-primary rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono">POST</span>
                    <code className="text-xs text-accent/70">/documents/generate</code>
                  </div>
                  <p className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Main document generation with background job processing
                  </p>
                </div>
                
                <div className="bg-primary rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">GET</span>
                    <code className="text-xs text-accent/70">/documents/progress/{"{'job_id'}"}</code>
                  </div>
                  <p className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Real-time job progress and status monitoring
                  </p>
                </div>

                <div className="bg-primary rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">GET</span>
                    <code className="text-xs text-accent/70">/documents/download/{"{'filename'}"}</code>
                  </div>
                  <p className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Secure DOCX file serving with proper MIME types
                  </p>
                </div>
              </div>
            </div>

            {/* Request/Response Format */}
            <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
              <h5 className="text-accent font-medium text-sm mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                Data Flow Specifications
              </h5>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-accent font-medium block mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Input Format:
                  </span>
                  <p className="text-accent/70 bg-primary rounded px-2 py-1 font-mono">
                    multipart/form-data
                  </p>
                  <p className="text-accent/60 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Files + template selection + feature flags + credentials
                  </p>
                </div>
                
                <div>
                  <span className="text-accent font-medium block mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Output Format:
                  </span>
                  <p className="text-accent/70 bg-primary rounded px-2 py-1 font-mono">
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document
                  </p>
                  <p className="text-accent/60 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Generated DOCX with proper headers and download attributes
                  </p>
                </div>

                <div>
                  <span className="text-accent font-medium block mb-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Progress Response:
                  </span>
                  <p className="text-accent/70 bg-primary rounded px-2 py-1 font-mono">
                    {'{ "progress": 85, "status": "running", "message": "..." }'}
                  </p>
                  <p className="text-accent/60 mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Real-time job status with contextual progress messages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Stats */}
        <div className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-primary rounded-lg p-4 text-center relative z-10">
            <Code2 className="w-6 h-6 text-accent/70 mx-auto mb-2" />
            <div className="text-lg font-light text-accent" style={{ fontFamily: 'Jost, sans-serif' }}>40+</div>
            <div className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>Supported Languages</div>
          </div>
          
          <div className="bg-primary rounded-lg p-4 text-center relative z-10">
            <FileText className="w-6 h-6 text-accent/70 mx-auto mb-2" />
            <div className="text-lg font-light text-accent" style={{ fontFamily: 'Jost, sans-serif' }}>5</div>
            <div className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>Template Designs</div>
          </div>

          <div className="bg-primary rounded-lg p-4 text-center relative z-10">
            <Clock className="w-6 h-6 text-accent/70 mx-auto mb-2" />
            <div className="text-lg font-light text-accent" style={{ fontFamily: 'Jost, sans-serif' }}>500ms</div>
            <div className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>Progress Poll Rate</div>
          </div>

          <div className="bg-primary rounded-lg p-4 text-center relative z-10">
            <Shield className="w-6 h-6 text-accent/70 mx-auto mb-2" />
            <div className="text-lg font-light text-accent" style={{ fontFamily: 'Jost, sans-serif' }}>0</div>
            <div className="text-xs text-accent/60" style={{ fontFamily: 'Jost, sans-serif' }}>Data Persistence</div>
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