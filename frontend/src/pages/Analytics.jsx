// ANALYTICS PAGE

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AnalyticsChart from "../components/AnalyticsChart";

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
  const [chartType, setChartType] = useState("bar");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  // Prepare device data for pie chart
  const deviceChartData = devices.map((dev) => ({
    name: dev.device,
    value: dev.count,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:underline font-medium"
            >
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
                className="text-blue-600 hover:text-blue-700 transition-colors"
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
              <h1 className="text-2xl font-bold text-gray-800">
                Analytics Dashboard
              </h1>
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
        <div className="max-w-7xl mx-auto">
          {/* URL Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
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
                <p className="text-gray-600 text-sm truncate">
                  {url.originalUrl}
                </p>
              </div>
              {url.isCustom && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  Custom
                </span>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Clicks</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {summary.totalClicks}
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
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Unique Visitors
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {summary.uniqueVisitors}
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Today</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {summary.clicksToday}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">This Week</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {summary.clicksThisWeek}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-600"
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Chart */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Click Trends Over Time
                </h3>
                <div className="flex gap-3">
                  {/* Chart Type Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        chartType === "bar"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Bar
                    </button>
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        chartType === "line"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Line
                    </button>
                  </div>

                  {/* Time Range Selector */}
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                </div>
              </div>

              {timeline.length > 0 ? (
                <AnalyticsChart type={chartType} data={timeline} />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No click data available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Devices Pie Chart */}
            {devices.length > 0 && (
              <AnalyticsChart
                type="pie"
                data={deviceChartData}
                title="Device Distribution"
              />
            )}

            {/* Referrers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top Referrers
              </h3>
              {referrers.length > 0 ? (
                <div className="space-y-3">
                  {referrers.map((ref, index) => {
                    const total = referrers.reduce(
                      (sum, r) => sum + r.count,
                      0
                    );
                    const percentage = ((ref.count / total) * 100).toFixed(1);

                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-700 font-medium">
                            {ref.referrer}
                          </span>
                          <span className="text-sm text-gray-600">
                            {ref.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No referrer data available
                </p>
              )}
            </div>
          </div>

          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : "📍"}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {loc.country}
                        </span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {loc.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No location data available
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
                  {browsers.map((browser, index) => {
                    const total = browsers.reduce((sum, b) => sum + b.count, 0);
                    const percentage = ((browser.count / total) * 100).toFixed(
                      1
                    );

                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-700 font-medium">
                            {browser.browser}
                          </span>
                          <span className="text-sm text-gray-600">
                            {browser.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No browser data available
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