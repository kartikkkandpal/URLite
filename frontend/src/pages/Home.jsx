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
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-green-50 pt-10">
      {/* Header/Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg fixed top-4 left-8 right-8 z-50 rounded-2xl">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800">
                URL<span className="text-green-700">ite</span>
              </h1>
            </div>

            {!isAuthenticated && (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-green-700 font-medium hover:text-green-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
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
            <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-green-800 text-sm">
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
      <footer className="bg-white/80 backdrop-blur-sm mt-2 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="URLite logo" className="h-10 w-10" />
              <p className="text-gray-800 text-sm">
                © {new Date().getFullYear()} URLite - Tiny Links. Big Impact.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/kartikkkandpal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 19h-2.5v-9h2.5v9zm-1.25-10.29c-.8 0-1.45-.65-1.45-1.45 0-.8.65-1.45 1.45-1.45s1.45.65 1.45 1.45c0 .8-.65 1.45-1.45 1.45zm12 10.29h-2.5v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-2.5v-9h2.4v1.23h.03c.34-.64 1.17-1.32 2.4-1.32 2.56 0 3.03 1.69 3.03 3.89v5.2z" />
                  </svg>
                </a>

                <a
                  href="https://github.com/kartikkkandpal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.5-4-1.5-.6-1.6-1.4-2-1.4-2-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1.1.1-.9.4-1.4.7-1.7-2.7-.3-5.6-1.4-5.6-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.3a11.6 11.6 0 016.2 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.8.2 3.1.1 3.4.8.9 1.2 2 1.2 3.4 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;