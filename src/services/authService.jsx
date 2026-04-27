// Auth service for managing JWT tokens in sessionStorage

const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

export const authService = {
  // Store token in sessionStorage
  setToken: (token) => {
    if (token) {
      console.log("[auth] Storing token in sessionStorage");
      sessionStorage.setItem(TOKEN_KEY, token);
      console.log("[auth] Token stored successfully");
    } else {
      console.log("[auth] No token provided to store");
    }
  },

  // Get token from sessionStorage
  getToken: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log("[auth] Getting token from sessionStorage:", token ? "Found" : "NOT FOUND");
    return token;
  },

  // Remove token from sessionStorage
  removeToken: () => {
    console.log("[auth] Removing token from sessionStorage");
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const hasToken = !!sessionStorage.getItem(TOKEN_KEY);
    console.log("[auth] Authentication check:", hasToken ? "Authenticated" : "Not authenticated");
    return hasToken;
  },

  // Store user data
  setUser: (user) => {
    if (user) {
      console.log("[auth] Storing user data:", user);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user data
  getUser: () => {
    const user = sessionStorage.getItem(USER_KEY);
    const parsedUser = user ? JSON.parse(user) : null;
    console.log("[auth] Getting user data:", parsedUser);
    return parsedUser;
  },

  // Clear all auth data
  logout: () => {
    console.log("[auth] Logging out - clearing auth data");
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("userChanged"));
  },
};
