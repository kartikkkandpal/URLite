// URL LIST COMPONENT

import { useState } from "react";
import axios from "axios";

const UrlList = ({ urls, onDelete }) => {
  const [deleting, setDeleting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const API_URL = "http://localhost:5000/api";

  // Copy URL to clipboard
  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopiedId(url.id);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      setDeleting(id);
      await axios.delete(`${API_URL}/urls/${id}`);

      // Call parent callback to update list
      onDelete(id);
    } catch (err) {
      console.error("Error deleting URL:", err);
      alert("Failed to delete URL");
    } finally {
      setDeleting(null);
    }
  };

  // If no URLs
  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No URLs yet</h3>
        <p className="text-gray-600">Create your first shortened URL above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <div
          key={url.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            {/* URL Info */}
            <div className="flex-1 min-w-0">
              {/* Short URL */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Short URL</p>
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium text-lg truncate block"
                >
                  {url.shortUrl}
                </a>
              </div>

              {/* Original URL */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Original URL</p>
                <p className="text-gray-700 text-sm truncate">
                  {url.originalUrl}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  {url.clicks} clicks
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(url)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  copiedId === url.id
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {copiedId === url.id ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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
                  "Copy"
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(url.id)}
                disabled={deleting === url.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                {deleting === url.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UrlList;