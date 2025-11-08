// USER MODEL

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema - defines structure for user accounts
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },

  // User's email (used for login)
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },

  // Hashed password
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;