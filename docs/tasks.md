# Project Tasks: Slides Parser

This document breaks down the development work for the Slides Parser project into actionable tasks, based on the requirements outlined in `docs/requirements.md`.

To implement this tasks list, follow the Dev Guidlines in `.gemini/GEMINI.md`

## Phase 1: Project Setup and Basic UI

*   **T.1.1:** Review the existing Next.js project setup, including TypeScript, Tailwind CSS, and other dependencies to ensure they meet the project needs.
*   **T.1.2:** Create the main application page (`/`) with a three-panel layout for uploading, editing, and previewing.
*   **T.1.3:** Develop a file upload component with a button and drop zone, using the existing `button.tsx` component.
*   **T.1.4:** Implement a basic text area that will serve as the initial Markdown editor.
*   **T.1.5:** Create a preview component that will render Markdown content.
*   **T.1.6:** Style the layout and components using Tailwind CSS, ensuring consistency with the existing theme.

## Phase 2: File Processing and API Integration

*   **T.2.1:** Implement the client-side logic to handle file selection and prepare it for upload.
*   **T.2.2:** Create a Next.js API route (`/api/parse`) to receive the uploaded file.
*   **T.2.3:** On the server, process the uploaded file. For PDFs, this will involve extracting the text content.
*   **T.2.4:** Integrate the Google Gemini API SDK or use `fetch` to call the model.
*   **T.2.5:** Construct the prompt for the LLM, instructing it to format the extracted text as Markdown.
*   **T.2.6:** Securely manage the Gemini API key using environment variables (`.env.local`).
*   **T.2.7:** Implement the logic to send the extracted text to the Gemini API and receive the response.
*   **T.2.8:** Connect the API response to the frontend, populating the Markdown editor with the generated content.

## Phase 3: Enhancing the Editor and Preview

*   **T.3.1:** Replace the basic text area with a more advanced code editor component (e.g., CodeMirror or Monaco Editor) for a better editing experience with syntax highlighting.
*   **T.3.2:** Implement a Markdown rendering library (e.g., `react-markdown`) in the preview component.
*   **T.3.3:** Connect the state of the editor to the preview component so that it updates in real-time as the user types.
*   **T.3.4:** Ensure the editor and preview components are synchronized and scroll together if possible.

## Phase 4: Polishing and Error Handling

*   **T.4.1:** Implement robust error handling for the file upload process (e.g., invalid file type, file size limits).
*   **T.4.2:** Add error handling for the API call to the LLM (e.g., network errors, API errors).
*   **T.4.3:** Display clear and user-friendly feedback for all states: loading, success, and error.
*   **T.4.4:** Refine the overall UI/UX, ensuring the application is responsive and easy to use.
*   **T.4.5:** Add a "Copy to Clipboard" button for the final Markdown output.
*   **T.4.6:** (Optional) Add a "Download as .md" button.

## 5. Testing

*   **T.5.1:** Write unit tests for utility functions.
*   **T.5.2:** Write integration tests for the API route.
*   **T.5.3:** Write end-to-end tests to simulate the user flow: uploading a file, seeing the Markdown, editing it, and seeing the preview update.
