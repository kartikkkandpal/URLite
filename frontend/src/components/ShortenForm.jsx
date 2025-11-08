// SHORTEN FORM COMPONENT

import { useState } from "react";
import axios from "axios";

const ShortenForm = ({ setShortUrlData }) => {
  const [url, setUrl] = useState("");
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
      // Send POST request to shorten URL
      const response = await axios.post(`${API_URL}/shorten`, {
        originalUrl: url,
      });

      // Set the shortened URL data in parent component
      setShortUrlData(response.data.data);

      // Clear input field
      setUrl("");
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