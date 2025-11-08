// SHORT URL DISPLAY COMPONENT

import { useState } from "react";

const ShortUrlDisplay = ({ data }) => {
  const [copied, setCopied] = useState(false);

  // Copy short URL to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Success Message */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">URL Shortened!</h3>
      </div>

      {/* Original URL */}
      <div className="mb-6">
        <label className="block text-gray-600 text-sm font-medium mb-2">
          Original URL
        </label>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm truncate">{data.originalUrl}</p>
        </div>
      </div>

      {/* Shortened URL */}
      <div className="mb-6">
        <label className="block text-gray-600 text-sm font-medium mb-2">
          Short URL
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-600 font-medium">{data.shortUrl}</p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-center text-gray-500 text-sm">
        <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ShortUrlDisplay;