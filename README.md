# Slides Parser

<p align="center">
  <a href="https://nextjs.org" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://ui.shadcn.com" target="_blank"><img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn-ui&logoColor=white" alt="shadcn/ui"></a>
  <a href="https://deepmind.google/technologies/gemini" target="_blank"><img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini"></a>
  <a href="https.vercel.com" target="_blank"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"></a>
  <a href="https://redis.io" target="_blank"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"></a>
  <a href="https://upstash.com" target="_blank"><img src="https://img.shields.io/badge/Upstash-000000?style=for-the-badge&logo=upstash&logoColor=white" alt="Upstash"></a>
  <a href="https://prettier.io" target="_blank"><img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier"></a>
  <a href="https://eslint.org" target="_blank"><img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"></a>
  <a href="https://jestjs.io" target="_blank"><img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"></a>
</p>

A web application that converts PDF slides into well-formatted Markdown using AI. Built with Next.js, TypeScript, and Google's Gemini API.

## Features

- 📄 Upload PDF files
- 🤖 AI-powered conversion to Markdown using Google Gemini
- ✏️ Live Markdown editor with real-time preview
- 📋 Copy to clipboard functionality
- 💾 Download as .md file
- 🎨 Beautiful UI with dark mode support
- 🔄 Drag-and-drop file upload
- 📈 Rate limiting (3 requests per user every day)

## Live Demo

Try the app live at: [https://slides-parser.vercel.app](https://slides-parser.vercel.app).  
The vercel has a limit on file size uploads (4.5MB). For larger files, run locally.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)
- An Upstash Redis database for request tracking (only in prod. To use the app locally you can skip this step)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd slides-parser
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
cp .env.local.example .env.local
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

1. **Upload a PDF**: Click the upload area or drag and drop a PDF file (max 15MB)

- update the max file size via `NEXT_PUBLIC_MAX_FILE_SIZE_MB` environment variable

2. **Wait for Processing**: The app will extract text and convert it to Markdown using AI
3. **Edit**: Make any changes you want in the Markdown editor
4. **Preview**: See the rendered Markdown in real-time on the right panel
5. **Export**: Copy to clipboard or download as a .md file

## API Endpoints

- **POST /api/parse**: Handles PDF file uploads, extracts text, and uses the Gemini API to convert it into Markdown. It is rate-limited.
- **POST /api/track-request**: Tracks each PDF processing request for rate-limiting purposes.
- **GET /api/get-request-count**: Retrieves the current request count for the user, which is displayed on the frontend.

## Error Handling

The application includes comprehensive error handling for:

- Invalid file types (only PDFs are supported)
- File size limits
- PDF parsing errors
- API errors (network issues, invalid API key, etc.)
- Empty or corrupted PDFs

All errors are displayed to the user via toast notifications.

## Rate Limiting and Request Tracking (Production Only)

To prevent abuse and ensure fair usage, the application implements a hybrid rate-limiting mechanism.

- **Request Limit**: Each user is allowed a maximum of 3 PDF processing requests per day.
- **Identification**: Users are identified by a combination of their IP address and a unique client-side generated UUID stored in `localStorage`. This allows for a fairer distribution of requests, especially for users behind the same NAT.
- **Tracking**: The system tracks the number of requests made by each user using Redis.
- **User Feedback**: A progress bar and a counter are displayed on the UI to inform the user of their remaining requests.

This functionality is managed by a Redis database and a set of dedicated API endpoints.

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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
