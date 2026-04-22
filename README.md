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

