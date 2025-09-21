import React, { useState, useEffect } from 'react';
import { X, Eye, ArrowRight, Grid3X3, List } from 'lucide-react';

const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [layoutView, setLayoutView] = useState('block'); // 'block' or 'concise'
  const [redirectingTemplateId, setRedirectingTemplateId] = useState(null);

  // Template data
  const templates = [
    {
      id: 'template1',
      name: 'Professional Template',
      thumbnail: '/templates/template1.pdf',
      image: '/templates/template1.png',
      description: 'Clean and professional documentation layout'
    },
    {
      id: 'template2', 
      name: 'Modern Template',
      thumbnail: '/templates/template2.pdf',
      image: '/templates/template2.png',
      description: 'Modern design with vibrant colors'
    },
    {
      id: 'template3',
      name: 'Minimalist Template', 
      thumbnail: '/templates/template3.pdf',
      image: '/templates/template3.png',
      description: 'Simple and elegant minimalist design'
    },
    {
      id: 'template4',
      name: 'Academic Template', 
      thumbnail: '/templates/template4.pdf',
      image: '/templates/template4.png',
      description: 'Formal academic style with structured layout'
    },
    {
      id: 'template5',
      name: 'Creative Template', 
      thumbnail: '/templates/template5.pdf',
      image: '/templates/template5.png',
      description: 'Creative design with colorful elements'
    }
  ];

  // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, ['/template']);

  const openPreview = (template) => {
    setSelectedTemplate(template);
    // Small delay to ensure the template is set before starting animation
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 500); // Wait for animation to complete
  };

  const handleUseTemplate = (templateId) => {
    if (!redirectingTemplateId) {
      setRedirectingTemplateId(templateId);
      setTimeout(() => {
        window.location.href = `/generate?template=${templateId}`;
      }, 3000);
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-white font-jost relative">
        {/* Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #44413c 2px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0"
        }}
      ></div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-8xl font-bold text-stone-600">Templates</h1>
            
            {/* Layout Filter */}
            <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setLayoutView('block')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  layoutView === 'block'
                    ? 'bg-white text-stone-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Grid3X3 size={16} />
                Block
              </button>
              <button
                onClick={() => setLayoutView('concise')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  layoutView === 'concise'
                    ? 'bg-white text-stone-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <List size={16} />
                Concise
              </button>
            </div>
          </div>
          <p className="ml-4 text-stone-500">Choose from our collection of professionally designed templates</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
        {layoutView === 'block' ? (
          // Block Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => openPreview(template)}
                className="bg-white border-2 border-stone-700/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer select-none group hover:border-stone-700/50 hover:bg-stone-700"
              >
                {/* Template Image */}
                <div className="aspect-[1/1.2] scale-90 bg-stone-50 overflow-hidden rounded-[50px]">
                  <img
                    src={template.image}
                    alt={template.name}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover group-hover:scale-95 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="text-stone-500 font-jost text-sm hidden items-center justify-center w-full h-full">
                    Template Preview
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 text-stone-600 group-hover:text-white transition-colors duration-300">
                      {template.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-stone-500 group-hover:text-white/80 transition-colors duration-300">
                      {template.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(template);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm border rounded-md transition-all duration-300 font-medium flex-1 bg-transparent border-stone-700 text-stone-700 hover:bg-stone-200 group-hover:border-white group-hover:text-white group-hover:hover:bg-white group-hover:hover:text-stone-700"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template.id);
                      }}
                      disabled={redirectingTemplateId !== null}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm border rounded-md transition-all duration-300 font-medium flex-1 bg-accent border-stone-700 text-primary hover:bg-primary hover:text-stone-700 group-hover:border-accent group-hover:text-accent group-hover:bg-primary group-hover:hover:bg-stone-300"
                    >
                      {redirectingTemplateId === template.id ? (
                        <>
                          Redirecting
                          <span className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </span>
                        </>
                      ) : (
                        'Use Template'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Concise Layout
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => openPreview(template)}
                className="bg-white border-2 border-stone-700/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer select-none group hover:border-stone-700/50 hover:bg-stone-700"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Small Template Image */}
                  <div className="w-16 h-20 bg-stone-50 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="text-stone-400 text-xs hidden items-center justify-center w-full h-full">
                      Preview
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-stone-600 group-hover:text-white transition-colors duration-300 truncate">
                      {template.name}
                    </h3>
                    <p className="text-sm text-stone-500 group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(template);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md transition-all duration-300 font-medium bg-transparent border-stone-700 text-stone-700 hover:bg-stone-200 group-hover:border-white group-hover:text-white group-hover:hover:bg-white group-hover:hover:text-stone-700"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template.id);
                      }}
                      disabled={redirectingTemplateId !== null}
                      className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md transition-all duration-300 font-medium bg-accent border-stone-700 text-primary hover:bg-primary hover:text-stone-700 group-hover:border-accent group-hover:text-accent group-hover:bg-primary group-hover:hover:bg-stone-300"
                    >
                      {redirectingTemplateId === template.id ? (
                        <>
                          Redirecting
                          <span className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </span>
                        </>
                      ) : (
                        'Use Template'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coming Soon Message */}
        <div className="mt-12 text-center">
          <p className="text-stone-400 text-lg font-medium italic">
            And many more exciting templates to come...
          </p>
        </div>
      </div>

      {/* Preview Modal - Always mounted */}
      <div className={`fixed inset-0 z-50 ${selectedTemplate ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-500 ${
            isModalOpen ? 'bg-opacity-30 opacity-100' : 'bg-opacity-0 opacity-0'
          }`}
          onClick={closeModal}
        />

        {/* Modal */}
        <div
          className={`absolute right-0 top-0 h-full w-[45%] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
            isModalOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ minWidth: '400px' }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-stone-50">
            <div>
              <h2 className="text-xl font-bold text-stone-600">{selectedTemplate?.name}</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-stone-200 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-stone-600" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 p-6" style={{ height: 'calc(100vh - 88px)' }}>
            <div className="w-full h-full bg-stone-50 rounded-lg overflow-hidden border border-stone-200">
              {selectedTemplate && (
                <iframe
                  src={selectedTemplate.thumbnail}
                  className="w-full h-full"
                  title={`Preview of ${selectedTemplate.name}`}
                  frameBorder="0"
                />
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate.id)}
              disabled={redirectingTemplateId !== null}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-700 text-white rounded-md hover:bg-stone-800 transition-colors duration-200 font-medium"
            >
              {redirectingTemplateId === selectedTemplate?.id ? (
                <>
                  Redirecting
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </>
              ) : (
                <>
                  Use This Template
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;