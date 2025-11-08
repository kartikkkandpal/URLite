// UTILS TO GENERATE JWT TOKEN

import jwt from 'jsonwebtoken';

// Generate JWT token for authenticated user - Token contains user ID and expires in 30 days
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload - user ID
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: '30d' } // Token valid for 30 days
  );
};

export default generateToken;