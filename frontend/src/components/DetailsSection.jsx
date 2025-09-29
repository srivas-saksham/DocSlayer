import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Shield, 
  Code, 
  Brain, 
  GraduationCap, 
  Workflow,
  Upload,
  FileText,
  Wand2,
  Download,
  ChevronRight,
  Play,
  Pause,
  Layers
} from 'lucide-react';

export default function DetailsSection({ pauseAnimation }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  // Intersection Observer for fade-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsPlaying(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Pause animation when prop changes
  useEffect(() => {
    if (pauseAnimation) {
      setIsPlaying(false);
    }
  }, [pauseAnimation]);

  // Auto-play steps
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 2500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const features = [
    {
        icon: Zap,
        title: "Automated Reports",
        description: "Upload code + outputs, select a template, and download a polished Word/PDF report in seconds."
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "No databases, no tracking. Files are purged automatically after each session."
    },
    {
        icon: Code,
        title: "Syntax Highlighting",
        description: "Readable, syntax-highlighted code with professional formatting for multiple languages."
    },
    {
        icon: GraduationCap,
        title: "Student-Friendly",
        description: "Perfect for assignments, lab reports, and university submissions."
    },
    {
        icon: Layers,
        title: "Multiple Templates",
        description: "Choose from a variety of clean, professional templates to match your needs."
    }
    ];

  const steps = [
    {
      id: 1,
      icon: Upload,
      title: "Upload Files",
      description: "Drag & drop your code files or browse from your device",
      details: "Supports 40+ file formats including Python, JavaScript, Java, C++, and more"
    },
    {
      id: 2,
      icon: FileText,
      title: "Select Template",
      description: "Choose from professionally designed templates",
      details: "Professional, Modern, Minimalist, Academic, and Creative styles available"
    },
    {
      id: 3,
      icon: Wand2,
      title: "Generate Documentation",
      description: "Let DocSlayer work its magic",
      details: "Automatic syntax highlighting, formatting, and professional layout generation"
    },
    {
      id: 4,
      icon: Download,
      title: "Download & Use",
      description: "Get your polished Word document instantly",
      details: "Ready-to-submit documentation with proper formatting and structure"
    }
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-accent py-20 relative overflow-hidden"
    >
      {/* Subtle dotted pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 14px"
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-primary text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Why DocSlayer?
          </h2>
          <p 
            className="text-primary/80 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Transform your raw code into professional documentation with zero hassle.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Features */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            <h3 
              className="text-primary text-3xl font-bold mb-8"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Built for developers, students, and researchers
            </h3>
            
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const delay = index * 100;
                
                return (
                  <div
                    key={index}
                    className={`group flex items-start gap-4 p-4 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-all duration-300 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: isVisible ? `${300 + delay}ms` : '0ms'
                    }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon 
                          className="text-accent" 
                          size={24}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 
                        className="text-primary text-lg font-bold mb-2"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {feature.title}
                      </h4>
                      
                      <p 
                        className="text-primary/80 leading-relaxed"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Interactive Steps */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
          >
            <div className="bg-primary rounded-3xl p-8 shadow-xl border border-primary/20 sticky top-8" style={{ minHeight: '680px' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 
                  className="text-accent text-2xl font-bold"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  How It Works
                </h3>
                
                <button
                  onClick={togglePlayback}
                  className="bg-accent text-primary p-3 rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-110 shadow-lg"
                  title={isPlaying ? 'Pause Demo' : 'Play Demo'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isCompleted = currentStep > index;
                  
                  return (
                    <div
                      key={step.id}
                      className={`group cursor-pointer transition-all duration-500 ${
                        isActive ? 'scale-105' : 'hover:scale-102'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-accent text-primary shadow-lg' 
                          : isCompleted
                          ? 'bg-accent/20 text-accent'
                          : 'bg-secondary text-text hover:bg-accent/10'
                      }`}>
                        {/* Step Number & Icon */}
                        <div className="flex-shrink-0 relative">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            isActive 
                              ? 'bg-primary text-accent scale-110' 
                              : isCompleted
                              ? 'bg-accent text-primary'
                              : 'bg-accent/20 text-accent'
                          }`}>
                            <Icon size={20} />
                          </div>
                          
                          {/* Step number badge */}
                          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            isActive 
                              ? 'bg-primary text-accent' 
                              : isCompleted
                              ? 'bg-accent text-primary'
                              : 'bg-accent text-primary'
                          }`}>
                            {step.id}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 
                            className="font-bold text-lg mb-1 transition-colors duration-500"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            {step.title}
                          </h4>
                          
                          <p 
                            className="opacity-80 mb-2 transition-all duration-500"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            {step.description}
                          </p>
                          
                          {/* Fixed height container for details to prevent shifting */}
                          <div 
                            className="overflow-hidden transition-all duration-500"
                            style={{ height: isActive ? '48px' : '0px' }}
                          >
                            <p 
                              className="text-sm opacity-60"
                              style={{ fontFamily: 'Jost, sans-serif' }}
                            >
                              {step.details}
                            </p>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                          <ChevronRight 
                            className={`transition-all duration-500 ${
                              isActive 
                                ? 'opacity-100 translate-x-1' 
                                : 'opacity-40 translate-x-0'
                            }`}
                            size={20}
                          />
                        </div>
                      </div>

                      {/* Connection line */}
                      {index < steps.length - 1 && (
                        <div className="ml-6 mt-2">
                          <div className={`w-0.5 h-6 transition-all duration-500 ${
                            currentStep > index 
                              ? 'bg-accent' 
                              : 'bg-accent/20'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="mt-8 pt-6 border-t border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-accent text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                    Progress: {currentStep + 1}/{steps.length}
                  </span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-20 transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}
        >
          <p 
            className="text-primary/70 text-lg mb-8"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Ready to revolutionize your documentation workflow?
          </p>
          
          <button 
            className="bg-primary hover:bg-primary/95 text-accent px-10 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg group relative overflow-hidden"
            style={{ fontFamily: 'Jost, sans-serif' }}
            onClick={() => {
              window.location.href = `/generate`;
            }}
          >
            <span className="relative z-10">Get Started Free</span>
            
            {/* Button hover effect */}
            <div className="absolute inset-0 bg-accent/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
}