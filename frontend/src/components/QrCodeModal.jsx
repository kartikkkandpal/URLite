// QR CODE MODAL COMPONENT

import { useState, useEffect } from "react";
import axios from "axios";

const QRCodeModal = ({ urlId, shortUrl, onClose }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/qr/${urlId}`);
        setQrCode(response.data.data.qrCode);
        setError("");
      } catch (err) {
        console.error("Error fetching QR code:", err);
        setError("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [urlId]);

  // Download QR code as image
  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `qr-code-${shortUrl.split("/").pop()}.png`;
    link.href = qrCode;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* QR Code Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>

            {/* URL Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Short URL</p>
              <p className="text-blue-600 font-medium break-all">{shortUrl}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Scan this QR code with a smartphone to access your short URL
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeModal;