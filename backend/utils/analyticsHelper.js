//  UTILS TO HELP WITH ANALYTICS DATA PROCESSING

import { UAParser } from "ua-parser-js";
import axios from "axios";

// Parse user agent string to extract device, browser, and OS info
export const parseUserAgent = (userAgentString) => {
  if (!userAgentString) {
    return {
      device: "Unknown",
      browser: "Unknown",
      os: "Unknown",
    };
  }

  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  // Determine device type
  let device = "Desktop";
  if (result.device.type === "mobile") {
    device = "Mobile";
  } else if (result.device.type === "tablet") {
    device = "Tablet";
  }

  return {
    device,
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
  };
};

// Get geographic location from IP address
export const getGeoLocation = async (ipAddress) => {
  // Skip for localhost/private IPs
  if (
    !ipAddress ||
    ipAddress === "::1" ||
    ipAddress.startsWith("127.") ||
    ipAddress.startsWith("192.168.")
  ) {
    return {
      country: "Local",
      city: "Local",
    };
  }

  try {
    // Using ipapi.co free API (150 requests/day limit)
    // You can use other services like ip-api.com, ipgeolocation.io, etc.
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
      timeout: 3000, // 3 second timeout
    });

    return {
      country: response.data.country_name || "Unknown",
      city: response.data.city || "Unknown",
    };
  } catch (error) {
    // If geolocation fails, return unknown
    console.error("Geolocation error:", error.message);
    return {
      country: "Unknown",
      city: "Unknown",
    };
  }
};

// Extract referrer domain from full URL
export const parseReferrer = (referrerUrl) => {
  if (!referrerUrl) {
    return "Direct";
  }

  try {
    const url = new URL(referrerUrl);
    const hostname = url.hostname.replace("www.", "");

    // Map common domains to readable names
    const referrerMap = {
      "google.com": "Google",
      "google.co.in": "Google",
      "facebook.com": "Facebook",
      "twitter.com": "Twitter",
      "linkedin.com": "LinkedIn",
      "instagram.com": "Instagram",
      "reddit.com": "Reddit",
      "youtube.com": "YouTube",
      "t.co": "Twitter",
      "fb.me": "Facebook",
    };

    return referrerMap[hostname] || hostname;
  } catch (error) {
    return "Direct";
  }
};

// Get client IP address from request
export const getClientIp = (req) => {
  // Check various headers that might contain the real IP
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    null
  );
};