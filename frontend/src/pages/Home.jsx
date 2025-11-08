// HOME PAGE

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ShortenForm from "../components/ShortenForm";
import ShortUrlDisplay from "../components/ShortUrlDisplay";

const Home = () => {
  const [shortUrlData, setShortUrlData] = useState(null);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              URL<span className="text-blue-600">ite</span>
            </h1>

            {!isAuthenticated && (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Shorten Your URLs
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Transform long URLs into short, easy-to-share links in seconds
          </p>

          {!isAuthenticated && (
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-blue-800 text-sm">
                💡{" "}
                <Link to="/register" className="font-medium underline">
                  Sign up
                </Link>{" "}
                to track clicks and manage your links!
              </p>
            </div>
          )}
        </div>

        {/* URL Shortening Section */}
        <div className="max-w-2xl mx-auto">
          {/* URL Shortening Form */}
          <ShortenForm setShortUrlData={setShortUrlData} />

          {/* Display shortened URL if generated */}
          {shortUrlData && <ShortUrlDisplay data={shortUrlData} />}
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose URLite?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Generate short URLs instantly with our optimized system
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Secure & Reliable
              </h4>
              <p className="text-gray-600">
                Your links are safe and accessible anytime, anywhere
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Track Analytics
              </h4>
              <p className="text-gray-600">
                Monitor clicks and performance with detailed stats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2024 URLite - Simple & Fast URL Shortener</p>
      </footer>
    </div>
  );
};

export default Home;