// SHORTEN FORM COMPONENT

import { useState } from "react";
import axios from "axios";

const ShortenForm = ({ setShortUrlData, authenticated = false }) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API base URL - Backend URL
  const API_URL = "http://localhost:5000/api";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Prepare request data
      const requestData = {
        originalUrl: url,
      };

      // Add optional fields if provided
      if (title.trim()) {
        requestData.title = title.trim();
      }

      if (customAlias.trim()) {
        requestData.customAlias = customAlias.trim();
      }

      // Send POST request to shorten URL
      const response = await axios.post(`${API_URL}/shorten`, requestData);

      // Set the shortened URL data in parent component
      setShortUrlData(response.data.data);

      // Clear input fields
      setUrl("");
      setTitle("");
      setCustomAlias("");
      setShowAdvanced(false);
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.error || "Failed to shorten URL";
      setError(errorMessage);
      console.error("Error shortening URL:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      {authenticated && (
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Create New Short URL
        </h3>
      )}

      <form onSubmit={handleSubmit}>
        {/* URL Input */}
        <div className="mb-4">
          <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/here"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Advanced Options Toggle (Only for authenticated users) */}
        {authenticated && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </button>
          </div>
        )}

        {/* Advanced Options */}
        {authenticated && showAdvanced && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Important Link"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-gray-500 text-xs mt-1">
                Add a description to help you remember this link
              </p>
            </div>

            {/* Custom Alias Input */}
            <div>
              <label
                htmlFor="customAlias"
                className="block text-gray-700 font-medium mb-2"
              >
                Custom Alias (Optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  {import.meta.env.BASE_URL || "http://localhost:5000"}/
                </span>
                <input
                  type="text"
                  id="customAlias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.toLowerCase())}
                  placeholder="my-custom-link"
                  pattern="[a-zA-Z0-9_-]{3,30}"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                3-30 characters: letters, numbers, hyphens, and underscores only
              </p>
            </div>
          </div>
        )}

        {/* Info message for anonymous users */}
        {!authenticated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Sign up</strong> to use custom aliases and add titles
              to your links!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
};

export default ShortenForm;