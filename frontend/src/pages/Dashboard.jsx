// DASHBOARD PAGE

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import ShortenForm from "../components/ShortenForm";
import UrlList from "../components/UrlList";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch user's URLs
  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/urls`);
      setUrls(response.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching URLs:", err);
      setError("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  };

  // Load URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle new URL created
  const handleUrlCreated = (newUrl) => {
    // Add new URL to the beginning of the list
    setUrls([newUrl, ...urls]);
  };

  // Handle URL updated
  const handleUrlUpdated = (updatedUrl) => {
    // Update the URL in the list
    setUrls(urls.map((url) => (url.id === updatedUrl.id ? updatedUrl : url)));
  };

  // Handle URL deleted
  const handleUrlDeleted = (deletedId) => {
    // Remove deleted URL from list
    setUrls(urls.filter((url) => url.id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              URL<span className="text-blue-600">ite</span>
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-medium text-gray-800">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Links</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {urls.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {urls.reduce((sum, url) => sum + url.clicks, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avg. Clicks</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {urls.length > 0
                      ? Math.round(
                          urls.reduce((sum, url) => sum + url.clicks, 0) /
                            urls.length
                        )
                      : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
                </div>
              </div>
            </div>
          </div>

          {/* URL Shortening Form */}
          <ShortenForm
            setShortUrlData={handleUrlCreated}
            authenticated={true}
          />

          {/* URL List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Links
            </h2>
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Loading your links...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <UrlList
                urls={urls}
                onDelete={handleUrlDeleted}
                onUpdate={handleUrlUpdated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;