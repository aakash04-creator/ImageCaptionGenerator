/**
 * mockAI.js — Simulates an AI Vision API response.
 * In production, replace analyzeImage() with a real OpenAI / Gemini Vision call.
 */

// Predefined mock data pools
const MOCK_OBJECT_SETS = [
  ["laptop", "books", "desk", "coffee mug", "notebook", "pen"],
  ["people", "chairs", "table", "whiteboard", "projector", "room"],
  ["trees", "sky", "grass", "path", "bench", "sunlight"],
  ["phone", "earbuds", "backpack", "coffee cup", "street", "buildings"],
  ["camera", "tripod", "lights", "backdrop", "studio", "reflector"],
  ["food", "plate", "fork", "knife", "dining table", "glass"],
  ["books", "shelves", "library", "reading lamp", "chair", "carpet"],
  ["gym equipment", "weights", "people", "mirrors", "floor mats", "trainer"],
];

const MOCK_SCENES = ["indoor", "outdoor", "indoor", "outdoor", "indoor", "indoor", "indoor", "indoor"];

const MOCK_CATEGORIES = [
  "academic",
  "social",
  "outdoor",
  "social",
  "work",
  "social",
  "academic",
  "social",
];

/**
 * Caption templates per category and style.
 * Keys: [category][style]
 */
const CAPTION_TEMPLATES = {
  academic: {
    descriptive:
      "This image depicts an academic setting featuring {objects}. The environment appears to be designed for focused study and intellectual activity.",
    creative:
      "📚 Where knowledge meets inspiration! Surrounded by {objects}, this space radiates the energy of curious minds at work. ✨ #StudyVibes #AcademicLife",
    accessibility:
      "An academic workspace with {objects} visible. The area is organized and well-lit, suitable for studying or learning activities.",
  },
  social: {
    descriptive:
      "The image shows a social environment containing {objects}. Multiple individuals appear to be engaged in group interaction or collaborative activity.",
    creative:
      "🎉 Good times and great company! Featuring {objects}, this moment captures the joy of being together. Life is better with people around! 🌟 #GoodVibes #Community",
    accessibility:
      "A social gathering scene showing {objects}. People are visible in what appears to be a friendly, communal setting.",
  },
  work: {
    descriptive:
      "This image captures a professional work environment with {objects} present. The setting indicates a structured, task-oriented space.",
    creative:
      "💼 Hustle mode: ON! With {objects} in frame, this workspace means serious business. Every detail crafted for productivity. 🚀 #WorkLife #Grind",
    accessibility:
      "A professional work setting containing {objects}. The environment appears organized for business or office-related tasks.",
  },
  outdoor: {
    descriptive:
      "This image presents an outdoor scene featuring {objects}. Natural lighting and environmental elements are clearly visible.",
    creative:
      "🌿 Nature is calling and we answered! Featuring {objects}, this scene is pure serenity and wanderlust fuel. Breathe it in. 🌤️ #OutdoorLife #NatureVibes",
    accessibility:
      "An outdoor scene showing {objects}. The image appears to be taken in a natural or open-air environment with good lighting.",
  },
};

/**
 * Randomly pick an item from an array.
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Format objects list into a readable string.
 */
function formatObjects(objects) {
  if (objects.length === 1) return objects[0];
  const last = objects[objects.length - 1];
  const rest = objects.slice(0, -1).join(", ");
  return `${rest}, and ${last}`;
}

/**
 * Main mock analysis function.
 * @param {string} imageBase64 - Base64 image string (used as seed for consistency)
 * @returns {Object} Analysis result with objects, scene, category, and captions
 */
function analyzeImage(imageBase64) {
  // Use image data length as a deterministic seed to get consistent results per image
  const seed = imageBase64 ? imageBase64.length % MOCK_OBJECT_SETS.length : Math.floor(Math.random() * MOCK_OBJECT_SETS.length);

  const objectSet = MOCK_OBJECT_SETS[seed];
  const scene = MOCK_SCENES[seed];
  const category = MOCK_CATEGORIES[seed];

  // Pick a random subset of 3–5 objects
  const numObjects = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...objectSet].sort(() => 0.5 - Math.random());
  const detectedObjects = shuffled.slice(0, numObjects);

  const objectString = formatObjects(detectedObjects);
  const templates = CAPTION_TEMPLATES[category] || CAPTION_TEMPLATES["social"];

  const captions = {
    descriptive: templates.descriptive.replace("{objects}", objectString),
    creative: templates.creative.replace("{objects}", objectString),
    accessibility: templates.accessibility.replace("{objects}", objectString),
  };

  return {
    objects: detectedObjects,
    scene,
    category,
    captions,
    source: "mock", // Indicates this is a mock response, not a real API call
  };
}

module.exports = { analyzeImage };
