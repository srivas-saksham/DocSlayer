import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, Trash2, Download, Check, Loader, ChevronDown, ChevronUp, X, Eye, RefreshCcw, FileWarning, ChevronLeft, ChevronRight, Copy, TriangleAlert, Github } from 'lucide-react';
import { renderAsync } from 'docx-preview';
import { useEffect } from 'react';

export default function DocGeneratorPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSupportedFiles, setShowSupportedFiles] = useState(false);
  const [generatedFileUrl, setGeneratedFileUrl] = useState(null);
  const [previewGeneratedDoc, setPreviewGeneratedDoc] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isConvertingPreview, setIsConvertingPreview] = useState(false);
  const [previewContainer, setPreviewContainer] = useState(null);
  
  // Index and Page Numbering Options
  const [indexAutoGeneration, setIndexAutoGeneration] = useState(false);
  const [indexFields, setIndexFields] = useState({
    sno: true,
    topic: true,
    date: true,
    teacherSignature: true
  });
  const [pageNumbering, setPageNumbering] = useState(false);
  const [aiExplanations, setAiExplanations] = useState(false);
  const [includeCodeOutputs, setIncludeCodeOutputs] = useState(true);

  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null); 

  const [currentQuote, setCurrentQuote] = useState('');
  const [currentPollInterval, setCurrentPollInterval] = useState(null);

  // Add a flag to track download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  // Additional Options State
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(false);
  const [includeCredentials, setIncludeCredentials] = useState(false);
  const [credentials, setCredentials] = useState({
    studentName: '',
    enrollmentNumber: '',
    batchClass: '',
    teacherName: '',
    assignmentDate: ''
  });

  useEffect(() => {
      document.title = "DocSlayer - Generate";
  }, []);

  // Scroll to top on component mount
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, ['/generate']);

  // Check if user has disabled warnings on component mount
  useEffect(() => {
  const warningDisabled = localStorage.getItem('docslayer-disable-leave-warning');

  // Handle navigation within the app (using popstate for route changes)
  const handlePopState = (e) => {
    if (isComplete && generatedFileUrl && warningDisabled !== 'true' && !isDownloading) {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      setShowLeaveWarning(true);
      setPendingNavigation(() => () => window.history.back());
    }
  };

  // Handle navigation using History API
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function(state, title, url) {
    if (isComplete && generatedFileUrl && warningDisabled !== 'true' && !isDownloading) {
      setShowLeaveWarning(true);
      setPendingNavigation(() => () => originalPushState.call(window.history, state, title, url));
      return;
    }
    return originalPushState.call(window.history, state, title, url);
  };

  window.history.replaceState = function(state, title, url) {
    if (isComplete && generatedFileUrl && warningDisabled !== 'true' && !isDownloading) {
      setShowLeaveWarning(true);
      setPendingNavigation(() => () => originalReplaceState.call(window.history, state, title, url));
      return;
    }
    return originalReplaceState.call(window.history, state, title, url);
  };

  // Handle link clicks
  const handleLinkClick = (e) => {
    if (isComplete && generatedFileUrl && warningDisabled !== 'true' && !isDownloading) {
      const target = e.target.closest('a');
      if (target && target.href && !target.href.includes('#') && !target.download) {
        e.preventDefault();
        setShowLeaveWarning(true);
        setPendingNavigation(() => () => window.location.href = target.href);
      }
    }
  };

  window.addEventListener('popstate', handlePopState);
  document.addEventListener('click', handleLinkClick);

  return () => {
    window.removeEventListener('popstate', handlePopState);
    document.removeEventListener('click', handleLinkClick);
    
    // Restore original methods
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
  };
}, [isComplete, generatedFileUrl, isDownloading]); // Add isDownloading to dependencies

  // Cleanup polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (currentPollInterval) {
        clearInterval(currentPollInterval);
      }
    };
  }, [currentPollInterval]);

  // Parse URL parameters and auto-select template
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    
    if (templateParam) {
      // Check if template exists in our templates array
      const templateExists = templates.find(t => t.id === templateParam);
      if (templateExists) {
        setSelectedTemplateId(templateParam);
        
        // Optional: Clean up URL after setting template
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // In your component, add this useEffect to monitor progress changes
  useEffect(() => {
    console.log(`[PROGRESS UPDATE] Progress changed to: ${progress}%`);
  }, [progress]);

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

  const supportedFormats = {
    'Programming Languages': [
      { ext: '.py', name: 'Python' },
      { ext: '.js', name: 'JavaScript' },
      { ext: '.ts', name: 'TypeScript' },
      { ext: '.jsx', name: 'JSX' },
      { ext: '.tsx', name: 'TSX' },
      { ext: '.java', name: 'Java' },
      { ext: '.cpp', name: 'C++' },
      { ext: '.c', name: 'C' },
      { ext: '.cs', name: 'C#' },
      { ext: '.rb', name: 'Ruby' },
      { ext: '.go', name: 'Go' },
      { ext: '.rs', name: 'Rust' },
      { ext: '.php', name: 'PHP' },
      { ext: '.swift', name: 'Swift' },
      { ext: '.kt', name: 'Kotlin' },
      { ext: '.kts', name: 'Kotlin Script' },
      { ext: '.scala', name: 'Scala' },
      { ext: '.dart', name: 'Dart' },
      { ext: '.m', name: 'Objective-C' },
      { ext: '.mm', name: 'Objective-C++' }
    ],
    'Web & Scripting': [
      { ext: '.html', name: 'HTML' },
      { ext: '.css', name: 'CSS' },
      { ext: '.scss', name: 'Sass' },
      { ext: '.sass', name: 'Sass' },
      { ext: '.less', name: 'Less' },
      { ext: '.xml', name: 'XML' },
      { ext: '.json', name: 'JSON' },
      { ext: '.yaml', name: 'YAML' },
      { ext: '.yml', name: 'YAML' },
      { ext: '.sh', name: 'Shell Script' },
      { ext: '.bash', name: 'Bash Script' },
      { ext: '.bat', name: 'Batch Script' }
    ],
    'Other Code/Text Formats': [
      { ext: '.sql', name: 'SQL' },
      { ext: '.r', name: 'R' },
      { ext: '.pl', name: 'Perl' },
      { ext: '.hs', name: 'Haskell' },
      { ext: '.lua', name: 'Lua' },
      { ext: '.erl', name: 'Erlang' },
      { ext: '.ex', name: 'Elixir' },
      { ext: '.exs', name: 'Elixir Script' },
      { ext: '.jl', name: 'Julia' }
    ]
  };
  
  const getAllExtensions = () => {
    return Object.values(supportedFormats).flat().map(format => format.ext);
  };

// Real-time job progress polling function
const pollJobProgress = async (jobId) => {
  console.log(`[POLLING] Starting progress polling for job: ${jobId}`);
  
  let interval = null;
  let hasCompleted = false;
  
  const fetchProgress = async () => {
    if (hasCompleted) {
      console.log(`[POLLING] Skipping - Job ${jobId} already completed`);
      return;
    }
    
    try {
      const response = await fetch(`${window.API_BASE_URL}/documents/progress/${jobId}`);
      
      if (!response.ok) {
        console.error(`[POLLING ERROR] HTTP ${response.status}: ${response.statusText}`);
        return;
      }
      
      const jobData = await response.json();
      console.log(`[POLLING] Job ${jobId} progress: ${jobData.progress}%, status: ${jobData.status}`);
      
      // Update progress and message
      setProgress(jobData.progress || 0);
      if (jobData.message) {
        setCurrentQuote(jobData.message);
      }
      
      // Handle completion
      if (!hasCompleted && (jobData.status === 'done' || (jobData.progress && jobData.progress >= 100))) {
        console.log(`[POLLING] Job ${jobId} completed successfully`);
        
        hasCompleted = true;
        
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        
        setCurrentPollInterval(null);
        setProgress(100);
        
        // Simply store the download URL - don't fetch the file yet
        if (jobData.output_path) {
          const downloadUrl = `${window.API_BASE_URL}${jobData.output_path}`;
          console.log(`[POLLING] Setting download URL: ${downloadUrl}`);
          setGeneratedFileUrl(downloadUrl);
        }
        
        setIsGenerating(false);
        setIsComplete(true);
        setCurrentQuote('Document generation completed successfully!');
        
        return;
      }
      
      // Handle errors
      if (!hasCompleted && jobData.status === 'error') {
        console.error(`[POLLING] Job ${jobId} failed:`, jobData.error || jobData.message);
        hasCompleted = true;
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        setCurrentPollInterval(null);
        setIsGenerating(false);
        setCurrentQuote(`Error: ${jobData.message || jobData.error}`);
        alert(`Generation failed: ${jobData.message || jobData.error}`);
        setProgress(0);
      }
      
    } catch (error) {
      console.error(`[POLLING ERROR] Job ${jobId}:`, error);
      if (error.message && error.message.includes('Failed to fetch')) {
        hasCompleted = true;
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        setCurrentPollInterval(null);
      }
    }
  };

  interval = setInterval(fetchProgress, 500);
  setCurrentPollInterval(interval);
  
  return interval;
};

const prepareDocumentPreview = async () => {
  if (!generatedFileUrl) return;
  
  try {
    setIsConvertingPreview(true);
    const downloadResponse = await fetch(generatedFileUrl);
    if (downloadResponse.ok) {
      const blob = await downloadResponse.blob();
      const container = await previewDocx(blob);
      setPreviewContainer(container);
    }
  } catch (previewError) {
    console.error('Error creating preview:', previewError);
    setPreviewContainer(null);
  } finally {
    setIsConvertingPreview(false);
  }
};

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const supportedTypes = getAllExtensions();
    const newFiles = [];
    
    Array.from(files).forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (supportedTypes.includes(fileExtension)) {
        // Check if file already exists
        const exists = uploadedFiles.some(uploaded => uploaded.name === file.name);
        if (!exists) {
          newFiles.push({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            file: file,
            id: Date.now() + Math.random()
          });
        }
      }
    });
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } else {
      alert('Please upload supported code files or files already exist. Click "& 35+ more" to see all supported formats.');
    }
  };

  const handleIndexFieldChange = (field, value) => {
    setIndexFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (uploadedFiles.length === 1) {
      setSelectedTemplateId(null);
      setIsComplete(false);
      setProgress(0);
    }
  };

  const removeAllFiles = () => {
    setUploadedFiles([]);
    setIsComplete(false);
    setProgress(0);
    
    // Clean up URLs
    if (generatedFileUrl) {
      URL.revokeObjectURL(generatedFileUrl);
      setGeneratedFileUrl(null);
    }
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
    
    // Reset preview container - ADD THIS LINE
    setPreviewContainer(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset warning state
    setPendingNavigation(null);
  };

  const handleCredentialChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaveConfirm = () => {
    const dontShowCheckbox = document.querySelector('#dont-show-warning');
    if (dontShowCheckbox && dontShowCheckbox.checked) {
      localStorage.setItem('docslayer-disable-leave-warning', 'true');
    }
    
    setShowLeaveWarning(false);
    
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleLeaveCancel = () => {
    setShowLeaveWarning(false);
    setPendingNavigation(null);
    
    // Reset navbar active tab to Generate
    window.dispatchEvent(new CustomEvent('resetActiveTab', { 
      detail: { tabName: 'Generate' } 
    }));
  };

  // Handle mail copy icon 
  const handleCopy = () => {
    navigator.clipboard.writeText('boxx.gray@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewDocx = async (docxBlob) => {
    try {
      setIsConvertingPreview(true);
      
      const arrayBuffer = await docxBlob.arrayBuffer();
      
      // Create a simple container for the DOCX preview
      const previewContainer = document.createElement('div');
      previewContainer.className = 'docx-preview-container';
      previewContainer.style.cssText = `
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        padding: 20px;
        overflow-y: auto;
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #000000;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
      
      // Render DOCX directly
      await renderAsync(arrayBuffer, previewContainer, null, {
        className: "docx-preview-pages",
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        useMathMLPolyfill: false,
        showChanges: false,
        debug: false
      });
      
      /// Add gaps between pages by overriding docx-preview default style
      const pages = previewContainer.querySelectorAll('section');
      pages.forEach((page, index) => {
        page.style.background = "white";
        page.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
        page.style.padding = "40px";
        page.style.margin = "0";
        page.style.width = "100%";
        page.style.maxWidth = "800px";
        page.style.boxSizing = "border-box";

        // 👇 This increases the natural gap instead of thin line
        if (index > 0) {
          page.style.marginTop = "30px";  // Increase from 1–2px to e.g. 30px
          page.style.borderTop = "none";  // Remove thin border line
        }
      });
      
      // Ensure tables and cells keep their borders
      const tables = previewContainer.querySelectorAll("table, table td, table th");
      tables.forEach(cell => {
        cell.style.border = "1px solid #000";      // restore black borders
        cell.style.borderCollapse = "collapse";   // prevent double borders
      });

      setIsConvertingPreview(false);
      return previewContainer;
      
    } catch (error) {
      console.error('Error previewing DOCX:', error);
      setIsConvertingPreview(false);
      return null;
    }
  };

  const generateDocs = async () => {
    if (!selectedTemplateId) {
      alert('Please select a template first.');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file.');
      return;
    }

    // Clear any existing polling interval
    if (currentPollInterval) {
      console.log("[GENERATE] Clearing existing poll interval");
      clearInterval(currentPollInterval);
      setCurrentPollInterval(null);
    }

    // Set initial state BEFORE starting job
    setIsGenerating(true);
    setProgress(0); 
    setIsComplete(false);
    setCurrentQuote('Initializing document generation...');

    setPreviewContainer(null);

    const formData = new FormData();
    formData.append("template", selectedTemplateId);
    formData.append("syntax_highlight", syntaxHighlighting ? "true" : "false");
    formData.append("index_auto_generation", indexAutoGeneration ? "true" : "false");
    formData.append("page_numbering", pageNumbering ? "true" : "false");
    formData.append("enable_ai_execution", includeCodeOutputs ? "true" : "false");

    // Index fields
    if (indexAutoGeneration) {
      formData.append("index_fields", JSON.stringify(indexFields));
    }

    if (includeCredentials) {
      formData.append("include_credentials", "true");
      Object.entries(credentials).forEach(([key, value]) => {
        formData.append(key, value);
      });
    } else {
      formData.append("include_credentials", "false");
    }
    
    uploadedFiles.forEach((fileObj) => {
      formData.append("files", fileObj.file);
    });

    try {
      console.log("[GENERATE] Starting background job...");
      
      // Step 1: Start polling BEFORE making the request
      const result = await fetch(`${window.API_BASE_URL}/documents/generate`, {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        const errorText = await result.text();
        console.error("[GENERATE ERROR]", errorText);
        throw new Error(`Failed to start document generation: ${result.status}`);
      }

      const jobData = await result.json();
      console.log("[GENERATE] Job started:", jobData);

      // Step 2: Start polling immediately after getting jobId
      if (jobData.jobId) {
        console.log(`[GENERATE] Starting polling for job: ${jobData.jobId}`);
        // Small delay to ensure backend job is properly initialized
        setTimeout(() => {
          pollJobProgress(jobData.jobId);
        }, 100); // 100ms delay
      } else {
        throw new Error("No job ID returned from server");
      }
      
    } catch (err) {
      console.error("[GENERATE ERROR]", err);
      alert("Error generating document: " + err.message);
      setIsGenerating(false);
      setProgress(0);
      setCurrentQuote('');
    }
  };

  const downloadDocs = () => {
    if (!generatedFileUrl) {
      alert("No document generated yet.");
      return;
    }

    setIsDownloading(true);
    
    const a = document.createElement("a");
    a.href = generatedFileUrl;
    a.download = "DocSlayer CodeDoc File.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Reset download flag after a short delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);

    // Show star modal after 3 seconds
    setTimeout(() => {
      setShowStarModal(true);
    }, 3000);
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-text font-jost font-medium">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20 ${
          enabled ? 'bg-accent' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative">
      {/* Dotted Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #44413c 2px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0"
        }}
      ></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-accent mb-4 font-jost">
            Generate Documentation
          </h1>
          <p className="text-xl text-text font-jost">
            Upload your code files and let DocSlayer handle the rest.
          </p>
        </div>

        {/* Upload Section */}
        {uploadedFiles.length === 0 && (
          <div className="mb-8">
            {/* Show selected template info if template is pre-selected */}
            {selectedTemplateId && (
              <div className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent font-jost">
                      <b>{templates.find(t => t.id === selectedTemplateId)?.name}</b> Selected
                    </h3>
                    <p className="text-sm text-text font-jost">
                      {templates.find(t => t.id === selectedTemplateId)?.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTemplateId(null)}
                    className="ml-auto text-text hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                dragActive 
                  ? 'border-accent bg-accent/10 scale-105' 
                  : 'border-accent bg-secondary hover:bg-accent/10'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 text-accent mx-auto mb-4" />
              <p className="text-xl font-semibold text-accent mb-2 font-jost">
                {selectedTemplateId 
                  ? 'Upload your files to generate with selected template'
                  : 'Drag & drop your files here, or click to browse'
                }
              </p>
              {/* Rest of the upload section remains the same... */}
              <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
                <span className="text-sm text-text font-jost">Supported: .py, .js, .ts, .java, .cpp</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSupportedFiles(!showSupportedFiles);
                  }}
                  className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-jost font-semibold ml-1"
                >
                  & 35+ more
                  {showSupportedFiles ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {/* Supported files section remains the same... */}
              {showSupportedFiles && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-accent/20 text-left max-h-64 overflow-y-auto animate-in fade-in duration-300 ease-out transform scale-100 origin-top">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(supportedFormats).map(([category, formats]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-semibold text-accent text-sm font-jost border-b border-accent/20 pb-1">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {formats.map((format) => (
                          <div key={format.ext} className="flex items-center gap-2 text-xs">
                            <span className="bg-accent/10 text-accent px-2 py-1 rounded font-mono font-medium">
                              {format.ext}
                            </span>
                            <span className="text-text font-jost">
                              {format.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-accent/20">
                  <p className="text-xs text-text/70 font-jost text-center">
                    Total: {getAllExtensions().length} supported file formats
                  </p>
                </div>
              </div>
            )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
                accept=".py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.cs,.rb,.go,.rs,.php,.swift,.kt,.kts,.scala,.dart,.m,.mm,.html,.css,.scss,.sass,.less,.xml,.json,.yaml,.yml,.sh,.bash,.bat,.sql,.r,.pl,.hs,.lua,.erl,.ex,.exs,.jl"
              />
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        {!isGenerating && uploadedFiles.length > 0 && !isComplete && (
          <div className="mb-8">
            <div className="bg-secondary rounded-xl p-6 border border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-accent font-jost text-lg">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <button 
                  onClick={removeAllFiles}
                  className="text-danger hover:text-danger hover:bg-danger/10 rounded-md p-2 transition-colors text-sm font-jost"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto px-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-primary rounded-lg p-3">
                    <div>
                      <p className="font-medium text-accent font-jost text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-text font-jost">
                        {file.size}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="text-text hover:text-danger transition-colors p-2 rounded-lg hover:bg-accent/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add More Files Button */}
              <div className="mt-4 pt-4 border-t border-accent/20">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-accent hover:text-accent/80 transition-colors font-jost text-sm flex items-center gap-2"
                >
                  <Upload size={16} />
                  Add More Files
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Template Selection Section */}
        {uploadedFiles.length > 0 && !isGenerating && !isComplete && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-accent mb-6 text-center font-jost">
              Choose a Template
            </h2>
            
            {/* Template Carousel Container */}
            <div className="relative">
              {/* Left Arrow Button */}
              <button
                onClick={() => {
                  const container = document.getElementById('template-container');
                  container.scrollBy({ left: -264, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-secondary/90 hover:bg-accent border border-accent/20 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 group"
              >
                <ChevronLeft className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={() => {
                  const container = document.getElementById('template-container');
                  container.scrollBy({ left: 264, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-secondary/90 hover:bg-accent border border-accent/20 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 group"
              >
                <ChevronRight className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
              </button>

              {/* Fade Gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-primary to-transparent z-[5] pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary to-transparent z-[5] pointer-events-none"></div>

              {/* Scrollable Template Container */}
              <div
                id="template-container"
                className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-4 scroll-smooth cursor-grab active:cursor-grabbing"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
                onMouseDown={(e) => {
                  const container = e.currentTarget;
                  const startX = e.pageX - container.offsetLeft;
                  const scrollLeft = container.scrollLeft;
                  let isScrolling = false;
                  
                  const handleMouseMove = (e) => {
                    isScrolling = true;
                    const x = e.pageX - container.offsetLeft;
                    const walk = (x - startX);
                    container.scrollLeft = scrollLeft - walk;
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    container.style.cursor = 'grab';
                    
                    // Prevent click events if we were scrolling
                    if (isScrolling) {
                      setTimeout(() => { isScrolling = false; }, 50);
                    }
                  };
                  
                  container.style.cursor = 'grabbing';
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
              >
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`flex-none w-60 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer select-none group ${
                      selectedTemplateId === template.id
                        ? 'border-accent shadow-lg scale-105 bg-accent'
                        : 'border-accent/20 hover:border-accent/50 bg-secondary hover:bg-accent'
                    }`}
                  >
                   {/* Template Thumbnail */}
                    <div className="bg-white rounded-lg mb-4 h-32 flex items-center justify-center border border-accent/10 overflow-hidden">
                      <img
                        src={template.image}
                        alt={`${template.name} preview`}
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-95 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="text-accent/50 font-jost text-sm hidden items-center justify-center w-full h-full">
                        PDF Preview
                      </div>
                    </div>
                    
                    <h3 className={`font-semibold font-jost text-lg mb-2 transition-colors duration-300 ${
                      selectedTemplateId === template.id
                        ? 'text-primary'
                        : 'text-accent group-hover:text-primary'
                    }`}>
                      {template.name}
                    </h3>
                    <p className={`font-jost text-sm mb-4 transition-colors duration-300 ${
                      selectedTemplateId === template.id
                        ? 'text-primary/80'
                        : 'text-text group-hover:text-primary/80'
                    }`}>
                      {template.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template.id)}
                        className={`flex-1 border px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-jost flex items-center justify-center gap-2 ${
                          selectedTemplateId === template.id
                            ? 'bg-transparent border-primary text-primary hover:bg-primary/10'
                            : 'bg-transparent border-accent text-accent hover:bg-accent/10 group-hover:border-primary group-hover:text-primary'
                        }`}
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-jost ${
                          selectedTemplateId === template.id
                            ? 'bg-primary text-accent hover:bg-primary/90'
                            : 'bg-accent hover:bg-accent/90 text-white group-hover:bg-primary group-hover:text-accent'
                        }`}
                      >
                        {selectedTemplateId === template.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Options Section */}
        {uploadedFiles.length > 0 && !isGenerating && !isComplete && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-accent mb-6 text-center font-jost">
              Additional Options
            </h2>
            <div className="bg-secondary rounded-xl p-6 border border-accent/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column - General & Advanced Options */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-accent font-jost mb-4">
                    General Options
                  </h3>
                  
                  <ToggleSwitch
                    enabled={includeCodeOutputs}
                    onChange={setIncludeCodeOutputs}
                    label="Include Code Outputs"
                  />

                  <ToggleSwitch
                    enabled={syntaxHighlighting}
                    onChange={setSyntaxHighlighting}
                    label="Enable Syntax Highlighting"
                  />
                  
                  <ToggleSwitch
                    enabled={indexAutoGeneration}
                    onChange={setIndexAutoGeneration}
                    label="Index Auto Generation"
                  />
                  
                  {indexAutoGeneration && (
                    <div className="ml-4 pl-4 border-l-2 border-accent/20 space-y-3 animate-in fade-in duration-300">
                      <p className="text-sm text-text font-jost mb-3">Select index fields to include:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indexFields.sno}
                            onChange={(e) => handleIndexFieldChange('sno', e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-accent/40 bg-primary focus:ring-2 focus:ring-accent/20 checked:bg-accent checked:border-accent"
                            style={{
                              accentColor: '#44413c'
                            }}
                          />
                          <span className="text-sm text-text font-jost">S.No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indexFields.topic}
                            onChange={(e) => handleIndexFieldChange('topic', e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-accent/40 bg-primary focus:ring-2 focus:ring-accent/20 checked:bg-accent checked:border-accent"
                            style={{
                              accentColor: '#44413c'
                            }}
                          />
                          <span className="text-sm text-text font-jost">Topic (Q1-Q2)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indexFields.date}
                            onChange={(e) => handleIndexFieldChange('date', e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-accent/40 bg-primary focus:ring-2 focus:ring-accent/20 checked:bg-accent checked:border-accent"
                            style={{
                              accentColor: '#44413c'
                            }}
                          />
                          <span className="text-sm text-text font-jost">Date</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={indexFields.teacherSignature}
                            onChange={(e) => handleIndexFieldChange('teacherSignature', e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-accent/40 bg-primary focus:ring-2 focus:ring-accent/20 checked:bg-accent checked:border-accent"
                            style={{
                              accentColor: '#44413c'
                            }}
                          />
                          <span className="text-sm text-text font-jost">Teacher's Signature</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <ToggleSwitch
                    enabled={pageNumbering}
                    onChange={setPageNumbering}
                    label="Page Numbering (Footer)"
                  />
                  
                  <ToggleSwitch
                    enabled={includeCredentials}
                    onChange={setIncludeCredentials}
                    label="Include Assignment Credentials"
                  />
                  
                  {/* Advanced Options */}
                  <div className="pt-4 border-t border-accent/20">
                    <h4 className="text-lg font-semibold text-accent font-jost mb-4">
                      Advanced Options
                    </h4>
                    
                    {/* Coming Soon Section */}
                    <div className="space-y-4">
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center justify-between opacity-60">
                          <span className="text-text font-jost font-medium">AI Explanations/Summaries</span>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                          </div>
                        </div>
                        <p className="text-xs text-accent font-jost mt-2 font-medium">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Assignment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-accent font-jost mb-4">
                    Assignment Details
                  </h3>
                  
                  {includeCredentials ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-sm font-medium text-text font-jost mb-2">
                          Student Name
                        </label>
                        <input
                          type="text"
                          value={credentials.studentName}
                          onChange={(e) => handleCredentialChange('studentName', e.target.value)}
                          className="w-full px-3 py-2 bg-primary border border-accent/30 rounded-lg text-text font-jost focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          placeholder="Enter student name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text font-jost mb-2">
                          Enrollment Number
                        </label>
                        <input
                          type="text"
                          value={credentials.enrollmentNumber}
                          onChange={(e) => handleCredentialChange('enrollmentNumber', e.target.value)}
                          className="w-full px-3 py-2 bg-primary border border-accent/30 rounded-lg text-text font-jost focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          placeholder="Enter enrollment number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text font-jost mb-2">
                          Batch/Class
                        </label>
                        <input
                          type="text"
                          value={credentials.batchClass}
                          onChange={(e) => handleCredentialChange('batchClass', e.target.value)}
                          className="w-full px-3 py-2 bg-primary border border-accent/30 rounded-lg text-text font-jost focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          placeholder="Enter batch or class"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text font-jost mb-2">
                          Teacher Name
                        </label>
                        <input
                          type="text"
                          value={credentials.teacherName}
                          onChange={(e) => handleCredentialChange('teacherName', e.target.value)}
                          className="w-full px-3 py-2 bg-primary border border-accent/30 rounded-lg text-text font-jost focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                          placeholder="Enter teacher name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text font-jost mb-2">
                          Assignment Date
                        </label>
                        <input
                          type="date"
                          value={credentials.assignmentDate}
                          onChange={(e) => handleCredentialChange('assignmentDate', e.target.value)}
                          className="w-full px-3 py-2 bg-primary border border-accent/30 rounded-lg text-text font-jost focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-text/60 font-jost text-sm">
                        Enable assignment credentials to add student details to your documentation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {uploadedFiles.length > 0 && !isGenerating && !isComplete && (
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={generateDocs}
              className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 font-jost ${
                selectedTemplateId
                  ? 'bg-accent hover:bg-accent/95 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedTemplateId}
            >
              Generate Docs
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Enhanced Progress Section */}
        {isGenerating && (
          <div className="mb-8">
            <div className="bg-secondary rounded-2xl p-8 border border-accent/20 relative overflow-hidden">
              {/* background particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-32 h-32 bg-accent/5 rounded-full -top-16 -left-16"></div>
                <div className="absolute w-24 h-24 bg-accent/10 rounded-full top-1/2 right-8"></div>
                <div className="absolute w-16 h-16 bg-accent/5 rounded-full bottom-4 left-1/3"></div>
              </div>
              
              <div className="relative z-10">
                {/* Header with spinner */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="relative">
                      <Loader className="w-8 h-8 text-accent animate-spin" />
                      <div className="absolute inset-0 w-8 h-8 border-2 border-accent/20 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-accent font-jost mb-1">
                        Crafting Your Documentation
                      </h3>
                      <div className="mt-2 flex items-center gap-2 rounded-md bg-yellow-100 px-2 py-1">
                        <TriangleAlert className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm font-jost text-yellow-700">
                          The Server might take a minute to boot up on first request.
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fun Quote Section */}
                  <div className="bg-accent/5 rounded-xl p-4 border border-accent/10 mb-6 min-h-[60px] flex items-center justify-center">
                    <p className="text-accent font-jost text-lg font-medium text-center leading-relaxed animate-in fade-in duration-500">
                      {currentQuote}
                    </p>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full bg-primary rounded-full h-4 overflow-hidden border border-accent/20 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out rounded-full relative overflow-hidden"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    
                    {/* Progress percentage with animation */}
                    <div className="absolute right-0 -top-8">
                      <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full font-jost animate-bounce">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress details */}
                  <div className="flex justify-between items-center text-sm text-text font-jost">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      Processing {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-accent/90">
                      {progress < 30 && "Analyzing code structure..."}
                      {progress >= 30 && progress < 60 && "Generating documentation..."}
                      {progress >= 60 && progress < 90 && "Applying template styling..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className='text-text font-jost mb-6 text-center'>
              If the generation hangs or fails, please reload and try again.
            </p>
          </div>
        )}

        {/* Result Section */}
        {isComplete && (
          <div className="text-center">
            <div className="bg-secondary rounded-xl p-8 border border-accent/20 mb-6">
              <Check className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-accent mb-2 font-jost">
                Documentation Generated!
              </h3>
              <p className="text-text font-jost mb-6">
                Your documentation has been successfully created and is ready for download.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setPreviewGeneratedDoc(true);
                    // Always prepare fresh preview, don't check if previewContainer exists
                    prepareDocumentPreview();
                  }}
                  className="bg-transparent border border-accent text-accent hover:bg-accent/10 px-6 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 font-jost"
                >
                  <Eye size={20} />
                  Preview Document
                </button>
                <button
                  onClick={() => {
                    setIsDownloading(true);
                    downloadDocs();
                    setTimeout(() => setIsDownloading(false), 1000);
                  }}
                  className="bg-accent hover:bg-accent/95 text-white px-6 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 font-jost"
                  title="Download DOCX"
                >
                  <Download size={16} />
                  Download Documentation
                </button>
              </div>
              <p className="text-gray-700 font-jost mt-6 text-center">
                If you encounter any errors or bugs, please email us at{' '}
                <a 
                  href="mailto:boxx.gray@gmail.com" 
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline"
                >
                  boxx.gray@gmail.com
                </a>
                <button
                  onClick={handleCopy}
                  className={`ml-2 inline-flex items-center transition-colors duration-200 ${
                    copied ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title={copied ? "Copied!" : "Copy email address"}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </p>

              <p className="text-gray-700 font-jost mt-6 text-center">
                <strong>Pro Tip:</strong> Search for "error" keyword in your final document to quickly locate any issues.
                {includeCodeOutputs && (
                  <p className="font-jost text-center text-yellow-700">
                    Make sure to review the AI Generated outputs yourself, might contain bugs.
                  </p>
                )}
                
              </p>
            </div>
            <button
              onClick={removeAllFiles}
              className="text-text hover:text-primary rounded-full bg-secondary hover:bg-accent px-5 py-2 transition-colors font-jost"
            >
              <RefreshCcw size={16} className="inline mr-2" />
              Generate Another Document
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {previewTemplate && (
          <div
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-end"
            style={{ 
              top: '55px', // Start below navbar (adjust this value based on your navbar height)
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={() => setPreviewTemplate(null)}
          >
            <div
              className="bg-white h-full w-[45%] shadow-lg transform transition-transform duration-300 ease-out relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white relative z-10">
                <h3 className="text-lg font-semibold text-accent font-jost">
                  {templates.find((t) => t.id === previewTemplate)?.name || "Template Preview"}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-text hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-text font-jost mt-1 ml-4">
                <strong>Note:</strong> The preview might slightly be different from the actual template.  
              </p>

              {/* Body */}
              <div className="p-4 h-[calc(100%-80px)] bg-gray-100">
                <iframe
                  src={templates.find((t) => t.id === previewTemplate)?.thumbnail}
                  className="w-full h-full border-0 rounded-lg bg-white"
                  title={templates.find((t) => t.id === previewTemplate)?.name || "Template Preview"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Generated Document Preview Modal */}
        {previewGeneratedDoc && (
          <div
            className="fixed bg-black/70 z-[9999] flex items-center justify-end"
            style={{ 
              top: '55px', // Start below navbar (adjust this value based on your navbar height)
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={() => setPreviewGeneratedDoc(false)}
          >
            <div
              className="bg-secondary h-full w-[50%] shadow-2xl transform transition-transform duration-300 ease-out relative border-l border-accent/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-6 border-b border-accent/20 bg-secondary">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-accent font-jost">
                      Documentation Preview
                    </h3>
                    <p className="text-sm text-text font-jost mt-1">
                      Generated from {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-text font-jost mt-1">
                      <strong>Note:</strong> The preview might slightly be different from the actual file.  
                    </p>
                    {pageNumbering && (
                      <div className="mt-2 flex items-center gap-2 rounded-md bg-yellow-100 px-2 py-1">
                        <FileWarning className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm font-jost text-yellow-700">
                          Page numbers might not be visible (only for preview)
                        </span>
                      </div>
                    )}

                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={downloadDocs}
                    className="bg-accent hover:bg-accent/95 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 font-jost hover:scale-105 shadow-lg"
                    title="Download DOCX"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewGeneratedDoc(false)}
                    className="text-text hover:text-accent transition-all duration-300 p-2 rounded-lg hover:bg-accent/10 hover:scale-110"
                    title="Close Preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Enhanced Body */}
              <div className="p-4 h-[calc(100%-120px)] bg-primary/30">
                {isConvertingPreview ? (
                  <div className="w-full h-full border-0 rounded-xl bg-white flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <div className="bg-accent/10 rounded-full p-6 mb-4 mx-auto w-fit">
                        <Loader className="w-12 h-12 text-accent animate-spin" />
                      </div>
                      <h4 className="text-lg font-semibold text-accent font-jost mb-2">
                        Preparing Document Preview
                      </h4>
                      <p className="text-text font-jost">
                        Rendering your documentation...
                      </p>
                    </div>
                  </div>
                ) : previewContainer ? (
                  <div 
                    className="w-full h-full border-0 rounded-xl overflow-auto shadow-inner custom-scrollbar"
                    style={{
                      backgroundColor: '#e5e5e5',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#44413c #f1f1f1'
                    }}
                    ref={(el) => {
                      if (el && previewContainer) {
                        el.innerHTML = '';
                        el.appendChild(previewContainer);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full border-0 rounded-xl bg-white flex items-center justify-center shadow-inner">
                    <div className="text-center max-w-md">
                      <div className="bg-red-50 rounded-full p-6 mb-4 mx-auto w-fit border border-red-100">
                        <X className="w-12 h-12 text-red-500" />
                      </div>
                      <h4 className="text-xl font-bold text-red-500 font-jost mb-3">
                        Preview Unavailable
                      </h4>
                      <p className="text-text font-jost mb-6 leading-relaxed">
                        We couldn't generate a preview of your document, but your documentation was created successfully.
                      </p>
                      <button
                        onClick={downloadDocs}
                        className="bg-accent hover:bg-accent/95 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto font-jost hover:scale-105 shadow-lg"
                      >
                        <Download size={18} />
                        Download DOCX
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leave Warning Modal */}
        {showLeaveWarning && (
          <div
            className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleLeaveCancel()}
          >
            <div
              className="bg-secondary rounded-2xl p-8 max-w-md w-full shadow-2xl border border-accent/20 transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="bg-yellow-100 rounded-full p-3 mx-auto mb-4 w-fit">
                  <FileWarning className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-accent font-jost mb-2">
                  File Will Be Lost
                </h3>
                <p className="text-text font-jost leading-relaxed">
                  Your generated document is temporarily stored. If you leave this page, the file will be permanently deleted and you'll need to regenerate it.
                </p>
              </div>

              {/* Don't Show Again Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="dont-show-warning"
                    className="w-4 h-4 rounded border-2 border-accent/40 bg-primary focus:ring-2 focus:ring-accent/20 checked:bg-accent checked:border-accent transition-all duration-200"
                    style={{
                      accentColor: '#44413c'
                    }}
                  />
                  <span className="text-sm text-text font-jost group-hover:text-accent transition-colors">
                    Don't show this warning again
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleLeaveCancel}
                  className="flex-1 bg-accent hover:bg-accent/95 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 font-jost hover:scale-105 shadow-lg"
                >
                  Stay on Page
                </button>
                <button
                  onClick={handleLeaveConfirm}
                  className="flex-1 bg-transparent border border-accent/30 text-text hover:text-accent hover:bg-accent/10 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 font-jost hover:scale-105"
                >
                  Leave Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Star Repository Modal */}
        {showStarModal && (
          <div
            className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4"
            onClick={() => setShowStarModal(false)}
          >
            <div
              className="bg-secondary rounded-2xl p-8 max-w-md w-full shadow-2xl border border-accent/20 transform transition-all duration-300 scale-100 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStarModal(false)}
                className="absolute top-4 right-4 text-text hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
              >
                <X size={20} />
              </button>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="bg-accent/10 rounded-full p-3 mx-auto mb-4 w-fit">
                  <Github className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-accent font-jost mb-1">
                  Glad that worked for you!
                </h3>
                {includeCodeOutputs && (
                  <p className="font-jost text-center text-yellow-700">
                    *Make sure to review the AI Generated outputs.
                  </p>
                )}
                <p className="text-text mt-4 font-jost leading-relaxed">
                  Mind Starring the DocSlayer repository on GitHub?
                </p>
              
                <p className="text-accent font-jost font-semibold mt-4">
                  Thank you!
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/srivas-saksham/DocSlayer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-accent hover:bg-accent/95 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 font-jost hover:scale-105 shadow-lg text-center"
                  onClick={() => setShowStarModal(false)}
                >
                  Star on GitHub
                </a>
                <button
                  onClick={() => setShowStarModal(false)}
                  className="flex-1 bg-transparent border border-accent/30 text-text hover:text-accent hover:bg-accent/10 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 font-jost hover:scale-105"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}