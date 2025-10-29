# Project: Slides Parser

## 1. Overview

The goal of this project is to create a web application that can parse slide files (like PDFs), extract their content, and convert it into Markdown format. The user should be able to edit and preview the generated Markdown.

## 2. Core Features

### 2.1. File Upload

*   **F.1.1:** The user must be able to upload a file through a web interface.
*   **F.1.2:** The application should initially support `.pdf` files. Support for other formats like `.pptx` can be considered for future development.
*   **F.1.3:** The interface should provide clear feedback on the upload status (e.g., in-progress, success, failure).

### 2.2. Content Extraction and Conversion

*   **F.2.1:** Once a file is uploaded, the application will send its content to a large language model (LLM) like Google's Gemini via an API call.
*   **F.2.2:** The API request will include a prompt instructing the model to parse the slides and format the content as Markdown.
*   **F.2.3:** The prompt will emphasize that the original text content should be preserved, with the focus being on structuring it correctly in Markdown (e.g., headings, lists, bold/italic text).
*   **F.2.4:** The application must be able to handle and display the Markdown content returned by the API.

### 2.3. Markdown Editor and Preview

*   **F.3.1:** The application will display the generated Markdown in a text editor.
*   **F.3.2:** Users must be able to edit the Markdown content directly in the editor.
*   **F.3.3:** A live preview pane will render the Markdown in real-time as the user types.
*   **F.3.4:** The editor and preview should be displayed side-by-side for easy comparison.

### 2.4. User Interface (UI)

*   **F.4.1:** The UI should be clean, intuitive, and easy to use.
*   **F.4.2:** It will consist of three main sections:
    1.  File upload area.
    2.  Markdown editor.
    3.  Markdown preview.

## 3. Technical Requirements

*   **T.1.1:** The application will be a web-based application.
*   **T.1.2:** It will use a modern frontend framework (e.g., Next.js with React/TypeScript).
*   **T.1.3:** An API will be used to communicate with the LLM. All API keys and sensitive information must be stored securely and not exposed on the client-side.
*   **T.1.4:** The application should handle potential errors gracefully (e.g., file upload errors, API errors, invalid file formats).

## 4. Future Enhancements (Optional)

*   **E.1:** Support for additional file formats (e.g., `.pptx`, `.key`).
*   **E.2:** Allow users to copy the Markdown content to their clipboard with a single click.
*   **E.3:** Option to download the content as a `.md` file.
*   **E.4:** User accounts and history of converted files.
