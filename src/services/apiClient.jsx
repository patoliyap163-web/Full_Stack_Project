// API client with JWT interceptor
import { authService } from "./authService";

const API_BASE_URL = "http://localhost:8080";

const parseResponse = async (response, fallbackMessage) => {
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (response.status === 401) {
    authService.handleUnauthorized(data?.message || "Session expired or logged out");
  }

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// Helper function to get headers with JWT token
const getHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const token = authService.getToken();
  console.log("🔑 API Request - Token from sessionStorage:", token ? "Present" : "NOT FOUND");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header added:", `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.log("❌ No token found, request will be unauthenticated");
  }

  return headers;
};

// Generic fetch function with interceptor
export const apiCall = async (endpoint, options = {}) => {
  const { method = "GET", body = null, ...otherOptions } = options;

  const fetchOptions = {
    method,
    headers: getHeaders(options.headers),
    ...otherOptions,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  console.log(`🌐 Making ${method} request to: ${API_BASE_URL}${endpoint}`);
  console.log("📋 Request headers:", fetchOptions.headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

  console.log(`📡 Response status: ${response.status} ${response.statusText}`);

  if (response.status === 401) {
    console.log("🚫 401 Unauthorized - clearing auth and redirecting to login");
  }

  return await parseResponse(response, `API request failed: ${endpoint}`);
};

export default apiCall;
