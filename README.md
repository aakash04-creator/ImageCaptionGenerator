# AI Image Caption Generator

A full-stack web application that allows users to upload images and automatically generate captions using AI-powered image understanding. It demonstrates how AI can be used to understand images, categorize scenes, detect objects, and generate natural language captions in different styles.

## Features

- **Batch Image Upload:** Drag-and-drop or select multiple images to process them at once.
- **AI Image Analysis (Mock Ready):** Identifies objects, classifies the scene (e.g., indoor/outdoor), and determines a category (academic, social, work, outdoor). Currently uses a mock AI engine, but is structured to easily integrate with real Vision APIs (like OpenAI or Gemini).
- **Multiple Caption Styles:** Generates 3 distinct caption styles per image:
  - Descriptive (formal, factual)
  - Creative (engaging, social media ready)
  - Accessibility (clear, simple, screen-reader friendly)
- **Caption Rules Engine:** Intelligently prioritizes the best caption style based on the image's categorized context.
- **Gallery & Search:** View all previously processed images, filter by category or detected tags, and search captions textually.
- **Feedback System:** Rate generated captions using a 1-5 star system.
- **Export Capabilities:** Export all image metadata and captions as CSV or TXT.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, React Dropzone, Lucide React
- **Backend:** Node.js, Express, UUID
- **Storage:** LocalStorage (Prototype implementation, designed to seamlessly transition to Firebase or Supabase)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation & Running Locally

1. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

3. **Install Frontend Dependencies:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```

4. **Start Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`. Vite is configured to proxy API requests to the backend.

## Project Structure

- `/client`: React frontend application.
  - `/src/components`: UI components like `UploadPanel`, `ResultCard`, `GalleryPage`, etc.
  - `/src/pages`: Main view pages (`Home`, `Gallery`).
  - `/src/services`: API calling and local storage management.
  - `/src/hooks`: Custom React hooks (e.g., `useImageProcessor`).
  - `/src/utils`: Utility functions (e.g., exporting).
- `/server`: Node.js Express backend.
  - `/routes`: Express route handlers (`analyze`, `feedback`).
  - `/services`: Core backend logic (`mockAI`, `captionRules`).

## Switching to Real AI

To integrate a real AI model (e.g., OpenAI Vision):
1. Open `/server/services/mockAI.js`.
2. Replace the `analyzeImage` function's internal mock logic with an actual API call to your preferred Vision provider.
3. Ensure the return object format matches the expected structure (`objects`, `scene`, `category`, `captions`, `source`).

## License

This project is licensed under the MIT License.
