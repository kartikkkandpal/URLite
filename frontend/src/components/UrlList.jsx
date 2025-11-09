// URL LIST COMPONENT

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UrlList = ({ urls, onDelete, onUpdate }) => {
  const [deleting, setDeleting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();
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

  // Navigate to analytics page
  const viewAnalytics = (urlId) => {
    navigate(`/analytics/${urlId}`);
  };

  // Start editing title
  const startEdit = (url) => {
    setEditingId(url.id);
    setEditTitle(url.title || "");
  };

  // Save edited title
  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/urls/${id}`, {
        title: editTitle.trim(),
      });

      // Update parent component
      if (onUpdate) {
        onUpdate(response.data.data);
      }

      setEditingId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Error updating title:", err);
      alert("Failed to update title");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
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

  // Filter and sort URLs
  const filteredUrls = urls
    .filter((url) => {
      const search = searchTerm.toLowerCase();
      return (
        url.originalUrl.toLowerCase().includes(search) ||
        url.shortCode.toLowerCase().includes(search) ||
        (url.title && url.title.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "clicks") {
        return b.clicks - a.clicks;
      }
      return 0;
    });

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
    <div>
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by URL, code, or title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="clicks">Most Clicks</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredUrls.length} of {urls.length} links
        </div>
      </div>

      {/* URL List */}
      <div className="space-y-4">
        {filteredUrls.map((url) => (
          <div
            key={url.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* URL Info */}
              <div className="flex-1 min-w-0">
                {/* Title (Editable) */}
                {editingId === url.id ? (
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter title..."
                        className="flex-1 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(url.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  url.title && (
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {url.title}
                        </h4>
                        <button
                          onClick={() => startEdit(url)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Edit title"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Add title button if no title exists */}
                {!url.title && editingId !== url.id && (
                  <button
                    onClick={() => startEdit(url)}
                    className="text-sm text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1"
                  >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add title
                  </button>
                )}

                {/* Custom Alias Badge */}
                {url.isCustom && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      Custom Alias
                    </span>
                  </div>
                )}

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
                {/* View Analytics Button */}
                <button
                  onClick={() => viewAnalytics(url.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                >
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Analytics
                </button>

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

      {/* No results message */}
      {filteredUrls.length === 0 && urls.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No URLs match your search.</p>
        </div>
      )}
    </div>
  );
};

export default UrlList;