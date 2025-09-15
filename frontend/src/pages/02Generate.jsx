import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, Trash2, Download, Check, Loader, ChevronDown, ChevronUp, X, Eye, RefreshCcw  } from 'lucide-react';

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

  const templates = [
    {
      id: 'template1',
      name: 'Professional Template',
      thumbnail: '/templates/template1.pdf',
      description: 'Clean and professional documentation layout'
    },
    {
      id: 'template2', 
      name: 'Modern Template',
      thumbnail: '/templates/template2.pdf',
      description: 'Modern design with vibrant colors'
    },
    {
      id: 'template3',
      name: 'Minimalist Template', 
      thumbnail: '/templates/template3.pdf',
      description: 'Simple and elegant minimalist design'
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
    setSelectedTemplateId(null);
    setIsComplete(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCredentialChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
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

    setIsGenerating(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("template", selectedTemplateId);
    formData.append("syntax_highlight", syntaxHighlighting ? "true" : "false");
    
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
      console.log("Sending files to backend...");
      const response = await fetch("http://localhost:8000/documents/generate", {
        method: "POST",
        body: formData,
      });
      console.log("Received response:", response);

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      // Get blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Save in state for download button
      setGeneratedFileUrl(url);

      setIsGenerating(false);
      setIsComplete(true);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Error generating document");
      setIsGenerating(false);
    }
  };

  const downloadDocs = () => {
    if (!generatedFileUrl) {
      alert("No document generated yet.");
      return;
    }

    const a = document.createElement("a");
    a.href = generatedFileUrl;
    a.download = "generated.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        
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
                Drag & drop your files here, or click to browse
              </p>
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
              {showSupportedFiles && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-accent/20 text-left max-h-64 overflow-y-auto animate-in fade-in duration-300 ease-out transform scale-100 origin-top">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-accent font-jost">All Supported File Types</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSupportedFiles(false);
                      }}
                      className="text-text hover:text-accent transition-all duration-200 p-1 rounded-full hover:bg-accent/10 transform hover:scale-110"
                    >
                      ✕
                    </button>
                  </div>
                  {Object.entries(supportedFormats).map(([category, formats]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="font-semibold text-accent mb-2 font-jost text-sm">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {formats.map((format) => (
                          <div key={format.ext} className="text-xs text-text font-jost">
                            <span className="font-mono bg-accent/10 px-2 py-1 rounded mr-2">
                              {format.ext}
                            </span>
                            {format.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
        {uploadedFiles.length > 0 && !isComplete && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-secondary rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                    selectedTemplateId === template.id
                      ? 'border-accent shadow-lg scale-105'
                      : 'border-accent/20 hover:border-accent/50'
                  }`}
                >
                  {/* Template Thumbnail */}
                  <div className="bg-white rounded-lg mb-4 h-32 flex items-center justify-center border border-accent/10">
                    <div className="text-accent/50 font-jost text-sm">
                      PDF Preview
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-accent font-jost text-lg mb-2">
                    {template.name}
                  </h3>
                  <p className="text-text font-jost text-sm mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewTemplate(template.id)}
                      className="flex-1 bg-transparent border border-accent text-accent hover:bg-accent/10 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-jost flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 font-jost ${
                        selectedTemplateId === template.id
                          ? 'bg-accent text-white'
                          : 'bg-accent hover:bg-accent/90 text-white'
                      }`}
                    >
                      {selectedTemplateId === template.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column - General Options */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-accent font-jost mb-4">
                    General Options
                  </h3>
                  
                  <ToggleSwitch
                    enabled={syntaxHighlighting}
                    onChange={setSyntaxHighlighting}
                    label="Enable Syntax Highlighting"
                  />
                  
                  <ToggleSwitch
                    enabled={includeCredentials}
                    onChange={setIncludeCredentials}
                    label="Include Assignment Credentials"
                  />
                </div>

                {/* Right Column - Credential Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-accent font-jost mb-4">
                    Assignment Details
                  </h3>
                  
                  {includeCredentials && (
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
                  )}
                  
                  {!includeCredentials && (
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

        {/* Progress Section */}
        {isGenerating && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader className="w-6 h-6 text-accent animate-spin" />
                <span className="text-xl font-semibold text-accent font-jost">
                  Generating your documentation...
                </span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-text font-jost">
                {Math.round(progress)}% complete
              </span>
            </div>
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
              <button
                onClick={downloadDocs}
                className="bg-accent hover:bg-accent/95 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto font-jost"
              >
                <Download size={20} />
                Download Documentation
              </button>
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

      </div>
    </div>
  );
}