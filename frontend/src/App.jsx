// MAIN APP COMPONENT

import { useState } from "react";
import ShortenForm from "./components/ShortenForm";
import ShortUrlDisplay from "./components/ShortUrlDisplay";

function App() {
  // State to store the generated short URL data
  const [shortUrlData, setShortUrlData] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            URL<span className="text-blue-600">ite</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Shorten your long URLs into easy-to-share links
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* URL Shortening Form */}
          <ShortenForm setShortUrlData={setShortUrlData} />

          {/* Display shortened URL if generated */}
          {shortUrlData && <ShortUrlDisplay data={shortUrlData} />}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>© 2024 URLite - Simple & Fast URL Shortener</p>
        </div>
      </div>
    </div>
  );
}

export default App;