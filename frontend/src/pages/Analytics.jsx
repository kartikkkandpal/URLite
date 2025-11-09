// ANALYTICS PAGE

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Analytics = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(null);
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [timeRange, setTimeRange] = useState(7);

  const API_URL = "http://localhost:5000/api";

  // Fetch all analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch URL details
      const urlsResponse = await axios.get(`${API_URL}/urls`);
      const urlData = urlsResponse.data.data.find((u) => u.id === urlId);

      if (!urlData) {
        setError("URL not found");
        setLoading(false);
        return;
      }
      setUrl(urlData);

      // Fetch analytics data in parallel
      const [
        summaryRes,
        timelineRes,
        referrersRes,
        devicesRes,
        locationsRes,
        browsersRes,
      ] = await Promise.all([
        axios.get(`${API_URL}/analytics/${urlId}/summary`),
        axios.get(`${API_URL}/analytics/${urlId}/timeline?days=${timeRange}`),
        axios.get(`${API_URL}/analytics/${urlId}/referrers`),
        axios.get(`${API_URL}/analytics/${urlId}/devices`),
        axios.get(`${API_URL}/analytics/${urlId}/locations`),
        axios.get(`${API_URL}/analytics/${urlId}/browsers`),
      ]);

      setSummary(summaryRes.data.data);
      setTimeline(timelineRes.data.data);
      setReferrers(referrersRes.data.data);
      setDevices(devicesRes.data.data);
      setLocations(locationsRes.data.data);
      setBrowsers(browsersRes.data.data);

      setError("");
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [urlId, timeRange]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-700"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* URL Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {url.title && (
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {url.title}
              </h2>
            )}
            <div className="mb-2">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium text-lg"
              >
                {url.shortUrl}
              </a>
            </div>
            <p className="text-gray-600 text-sm truncate">{url.originalUrl}</p>
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-blue-600">
                  {summary.totalClicks}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm mb-1">Unique Visitors</p>
                <p className="text-3xl font-bold text-green-600">
                  {summary.uniqueVisitors}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm mb-1">Today</p>
                <p className="text-3xl font-bold text-purple-600">
                  {summary.clicksToday}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-3xl font-bold text-orange-600">
                  {summary.clicksThisWeek}
                </p>
              </div>
            </div>
          )}

          {/* Timeline Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Click Trends</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>

            {timeline.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex items-end gap-2 h-64 min-w-max">
                  {timeline.map((day, index) => {
                    const maxClicks = Math.max(
                      ...timeline.map((d) => d.clicks),
                      1
                    );
                    const height = (day.clicks / maxClicks) * 100;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1 min-w-10"
                      >
                        <div className="text-xs text-gray-600 mb-2">
                          {day.clicks}
                        </div>
                        <div
                          className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                          style={{
                            height: `${height}%`,
                            minHeight: day.clicks > 0 ? "4px" : "0",
                          }}
                          title={`${day.date}: ${day.clicks} clicks`}
                        />
                        <div className="text-xs text-gray-500 mt-2 rotate-45 origin-top-left whitespace-nowrap">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No data available
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Referrers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top Referrers
              </h3>
              {referrers.length > 0 ? (
                <div className="space-y-3">
                  {referrers.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{ref.referrer}</span>
                      <span className="font-medium text-blue-600">
                        {ref.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No data available
                </p>
              )}
            </div>

            {/* Devices */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Devices</h3>
              {devices.length > 0 ? (
                <div className="space-y-3">
                  {devices.map((dev, index) => {
                    const total = devices.reduce((sum, d) => sum + d.count, 0);
                    const percentage = ((dev.count / total) * 100).toFixed(1);

                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-700">{dev.device}</span>
                          <span className="text-sm text-gray-600">
                            {dev.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No data available
                </p>
              )}
            </div>

            {/* Locations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top Locations
              </h3>
              {locations.length > 0 ? (
                <div className="space-y-3">
                  {locations.map((loc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{loc.country}</span>
                      <span className="font-medium text-purple-600">
                        {loc.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No data available
                </p>
              )}
            </div>

            {/* Browsers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top Browsers
              </h3>
              {browsers.length > 0 ? (
                <div className="space-y-3">
                  {browsers.map((browser, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{browser.browser}</span>
                      <span className="font-medium text-orange-600">
                        {browser.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No data available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;