# Slides Parser

A web application that converts PDF slides into well-formatted Markdown using AI. Built with Next.js, TypeScript, and Google's Gemini API.

## Features

- 📄 Upload PDF files (up to 10MB)
- 🤖 AI-powered conversion to Markdown using Google Gemini
- ✏️ Live Markdown editor with real-time preview
- 📋 Copy to clipboard functionality
- 💾 Download as .md file
- 🎨 Beautiful UI with dark mode support
- 🔄 Drag-and-drop file upload

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd slidesparser
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a PDF**: Click the upload area or drag and drop a PDF file (max 10MB)
2. **Wait for Processing**: The app will extract text and convert it to Markdown using AI
3. **Edit**: Make any changes you want in the Markdown editor
4. **Preview**: See the rendered Markdown in real-time on the right panel
5. **Export**: Copy to clipboard or download as a .md file

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI**: Google Gemini via Vercel AI SDK
- **PDF Processing**: pdf-parse
- **Markdown Rendering**: react-markdown with syntax highlighting

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── parse/
│   │       └── route.ts          # API endpoint for PDF processing
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles and prose classes
├── components/
│   ├── file-upload.tsx           # File upload component with drag-and-drop
│   ├── markdown-editor.tsx       # Markdown editor component
│   ├── markdown-preview.tsx      # Markdown preview with syntax highlighting
│   └── ui/                       # shadcn/ui components
└── lib/
    └── utils.ts                  # Utility functions
```

## Environment Variables

| Variable                       | Description                | Required |
| ------------------------------ | -------------------------- | -------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google Gemini API key | Yes      |

## Error Handling

The application includes comprehensive error handling for:

- Invalid file types (only PDFs are supported)
- File size limits (max 10MB)
- PDF parsing errors
- API errors (network issues, invalid API key, etc.)
- Empty or corrupted PDFs

All errors are displayed to the user via toast notifications.

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Future Enhancements

- [ ] Support for additional file formats (.pptx, .key)
- [ ] User accounts and conversion history
- [ ] Batch processing of multiple files
- [ ] Custom AI prompts for different conversion styles
- [ ] Export to other formats (HTML, PDF)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.