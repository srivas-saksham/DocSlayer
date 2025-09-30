# DocSlayer

<div align="center">
  
[![Live Site](https://img.shields.io/badge/Live-Demo-44413c?style=for-the-badge&logo=vercel)](https://docslayer.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/srivas-saksham/DocSlayer)
[![License](https://img.shields.io/badge/License-MIT-44413c?style=for-the-badge)](LICENSE)

**Automate your code-to-doc workflow in seconds**

[Live Site](https://docslayer.vercel.app) · [Report Bug](https://github.com/srivas-saksham/DocSlayer/issues) · [Request Feature](https://github.com/srivas-saksham/DocSlayer/issues)

</div>

---

## Overview

DocSlayer is a powerful documentation generator that transforms your source code files into professionally formatted Word documents. Perfect for students, developers, and educators who need to create code documentation quickly and efficiently.

### Key Features

- **40+ Programming Languages** - Support for Python, JavaScript, TypeScript, Java, C++, and many more
- **Professional Templates** - Choose from 5 beautifully designed document templates
- **Syntax Highlighting** - Optional code syntax highlighting for better readability
- **Auto-Generated Index** - Automatically create table of contents with customizable fields
- **Page Numbering** - Add professional page numbers to your documentation
- **Code Output Execution** - Include execution results alongside your code
- **Assignment Credentials** - Add student details, enrollment numbers, and assignment information
- **Real-time Progress** - Track document generation with live progress updates
- **Drag & Drop Upload** - Easy file upload with drag-and-drop support

---

## Getting Started

### Quick Start

1. Visit [docslayer.vercel.app](https://docslayer.vercel.app)
2. Upload your code files (drag & drop or click to browse)
3. Select a template from the available options
4. Configure your preferences (optional)
5. Click "Generate Docs" and download your formatted documentation

### Supported File Formats

#### Programming Languages
- Python (`.py`)
- JavaScript (`.js`), TypeScript (`.ts`)
- React (`.jsx`, `.tsx`)
- Java (`.java`)
- C++ (`.cpp`), C (`.c`), C# (`.cs`)
- Ruby (`.rb`), Go (`.go`), Rust (`.rs`)
- PHP (`.php`), Swift (`.swift`)
- Kotlin (`.kt`, `.kts`), Scala (`.scala`)
- Dart (`.dart`)
- Objective-C (`.m`, `.mm`)

#### Web & Scripting
- HTML (`.html`), CSS (`.css`)
- Sass (`.scss`, `.sass`), Less (`.less`)
- XML (`.xml`), JSON (`.json`)
- YAML (`.yaml`, `.yml`)
- Shell Scripts (`.sh`, `.bash`, `.bat`)

#### Other Formats
- SQL (`.sql`), R (`.r`)
- Perl (`.pl`), Haskell (`.hs`)
- Lua (`.lua`), Erlang (`.erl`)
- Elixir (`.ex`, `.exs`), Julia (`.jl`)

---

## Templates

DocSlayer offers 5 professionally designed templates:

1. **Professional Template** - Clean and professional documentation layout
2. **Modern Template** - Modern design with vibrant colors
3. **Minimalist Template** - Simple and elegant minimalist design
4. **Academic Template** - Formal academic style with structured layout
5. **Creative Template** - Creative design with colorful elements

---

## Configuration Options

### General Options

- **Include Code Outputs** - Execute and include code output results
- **Syntax Highlighting** - Enable colored syntax highlighting
- **Index Auto Generation** - Generate table of contents automatically
- **Page Numbering** - Add page numbers in document footer

### Index Fields (when enabled)

- Serial Number (S.No)
- Topic/Question (Q1-Q2 format)
- Date
- Teacher's Signature

### Assignment Details

Add professional credentials to your documentation:
- Student Name
- Enrollment Number
- Batch/Class
- Teacher Name
- Assignment Date

---

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Lucide React Icons
- docx-preview (for document preview)

### Backend
- FastAPI (Python)
- Document generation engine
- Real-time progress tracking

---

## Technical Details

### API Architecture

DocSlayer uses a RESTful API architecture with the following endpoints:

#### Document Generation API

**POST** `/documents/generate`

Initiates background document generation job.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`

**Form Data Parameters:**
```
files: File[] (multiple code files)
template: string (template1-template5)
syntax_highlight: boolean
index_auto_generation: boolean
page_numbering: boolean
enable_ai_execution: boolean
include_credentials: boolean
index_fields: JSON (optional)
studentName: string (optional)
enrollmentNumber: string (optional)
batchClass: string (optional)
teacherName: string (optional)
assignmentDate: string (optional)
```

**Response:**
```json
{
  "jobId": "unique-job-identifier",
  "status": "processing"
}
```

---

#### Progress Tracking API

**GET** `/documents/progress/{jobId}`

Retrieves real-time progress for a document generation job.

**Request:**
- Method: `GET`
- Parameters: `jobId` (path parameter)

**Response:**
```json
{
  "jobId": "unique-job-identifier",
  "status": "processing|done|error",
  "progress": 0-100,
  "message": "Current operation description",
  "output_path": "/path/to/generated/document.docx",
  "error": "Error message if status is error"
}
```

**Status Values:**
- `processing` - Job is currently being processed
- `done` - Job completed successfully
- `error` - Job failed with error

---

#### Document Download

**GET** `/documents/download/{filename}`

Downloads the generated document.

**Request:**
- Method: `GET`
- Parameters: `filename` (path parameter)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- File download stream

---

### Frontend Architecture

#### Component Structure

```
src/
├── pages/
│   ├── DocSlayerHero.jsx      # Landing page
│   └── DocGeneratorPage.jsx   # Main generation interface
├── components/
│   ├── RotatingText.jsx       # Animated text component
│   └── DetailsSection.jsx     # Feature details section
└── App.jsx                     # Main application component
```

#### Key Features Implementation

**File Upload System**
- Drag-and-drop support
- Multi-file selection
- Client-side file validation
- Supported format filtering

**Progress Polling**
- 500ms polling interval
- Real-time progress updates
- Status message updates
- Automatic cleanup on completion

**Document Preview**
- DOCX rendering using docx-preview library
- In-browser preview before download
- Page-by-page rendering with styling preservation

**State Management**
- React hooks (useState, useEffect, useRef)
- No external state management library
- Component-level state management

---

### Workflow

1. **File Upload**
   - User uploads code files via drag-and-drop or file selector
   - Files validated against supported formats
   - Files stored in component state

2. **Template Selection**
   - User selects from 5 pre-designed templates
   - Template preview available via modal
   - Template ID sent to backend

3. **Configuration**
   - User configures document options
   - Options stored in component state
   - All options sent to backend in generation request

4. **Document Generation**
   - POST request initiated to `/documents/generate`
   - Backend returns jobId
   - Frontend starts polling progress endpoint

5. **Progress Tracking**
   - Frontend polls `/documents/progress/{jobId}` every 500ms
   - Progress bar and messages updated in real-time
   - Polling stops when status is 'done' or 'error'

6. **Document Download**
   - Download URL provided in final progress response
   - User can preview document before downloading
   - Direct download via generated URL

---

### Security Considerations

- **File Validation**: Client-side and server-side file type validation
- **Temporary Storage**: Generated documents stored temporarily and cleaned up
- **No Authentication**: Currently no authentication required (consider adding for production)
- **Rate Limiting**: Consider implementing rate limiting for API endpoints
- **File Size Limits**: Implement file size restrictions to prevent abuse

---

### Performance Optimizations

- **Background Jobs**: Document generation runs asynchronously
- **Progress Polling**: Efficient 500ms polling with automatic cleanup
- **Code Splitting**: React components lazy-loaded where applicable
- **Caching**: Template assets cached for faster loading

---

## Usage Examples

### Basic Usage

1. Upload multiple code files at once
2. Select your preferred template
3. Generate documentation with default settings

### Advanced Usage

1. Enable syntax highlighting for colorful code blocks
2. Add index generation with custom fields
3. Include assignment credentials for academic submissions
4. Enable page numbering for multi-page documents
5. Preview before downloading

---

## Privacy & Security

- All file processing happens securely
- Generated documents are temporarily stored and deleted after download
- No permanent storage of your code files
- Warning system to prevent accidental data loss

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Known Issues & Tips

- **First Request Delay** - The server may take a minute to boot up on the first request
- **Preview Differences** - Document preview might slightly differ from the final downloaded file
- **Page Numbers in Preview** - Page numbers may not be visible in preview (they will appear in the downloaded file)
- **Error Detection** - Search for "error" keyword in your final document to quickly locate any issues

---

## Support

If you encounter any errors or bugs, please email us at:

**boxx.gray@gmail.com**

Or open an issue on our [GitHub repository](https://github.com/srivas-saksham/DocSlayer/issues).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Show Your Support

If DocSlayer helped you, please consider:

- Starring the repository
- Reporting bugs
- Suggesting new features
- Sharing with others

---

<div align="center">

**Made with care by the DocSlayer Team**

[Website](https://docslayer.vercel.app) · [GitHub](https://github.com/srivas-saksham/DocSlayer)

</div>