// GENERATE SHORT CODE UTILITY FUNCTION

import { nanoid } from "nanoid";

// Generate a random 6-character alphanumeric short code - nanoid generates URL-friendly random strings
const generateShortCode = () => {
  return nanoid(6); // Returns something like: "V1StGX"
};

export default generateShortCode;