// Auth service for managing JWT tokens in sessionStorage

const TOKEN_KEY = "auth_token";
const USER_KEY = "user";
const AUTH_MESSAGE_KEY = "auth_message";

const clearStoredAuth = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const redirectToLogin = () => {
  window.location.href = "/login";
};

export const authService = {
  setToken: (token) => {
    if (token) {
      console.log("[auth] Storing token in sessionStorage");
      sessionStorage.setItem(TOKEN_KEY, token);
      console.log("[auth] Token stored successfully");
    } else {
      console.log("[auth] No token provided to store");
    }
  },

  getToken: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log("[auth] Getting token from sessionStorage:", token ? "Found" : "NOT FOUND");
    return token;
  },

  removeToken: () => {
    console.log("[auth] Removing token from storage");
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const hasToken = !!sessionStorage.getItem(TOKEN_KEY);
    console.log("[auth] Authentication check:", hasToken ? "Authenticated" : "Not authenticated");
    return hasToken;
  },

  setUser: (user) => {
    if (user) {
      console.log("[auth] Storing user data:", user);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser: () => {
    const user = sessionStorage.getItem(USER_KEY);
    const parsedUser = user ? JSON.parse(user) : null;
    console.log("[auth] Getting user data:", parsedUser);
    return parsedUser;
  },

  setAuthMessage: (message) => {
    if (message) {
      sessionStorage.setItem(AUTH_MESSAGE_KEY, message);
    } else {
      sessionStorage.removeItem(AUTH_MESSAGE_KEY);
    }
  },

  consumeAuthMessage: () => {
    const message = sessionStorage.getItem(AUTH_MESSAGE_KEY);
    sessionStorage.removeItem(AUTH_MESSAGE_KEY);
    return message;
  },

  clearAuth: (message) => {
    console.log("[auth] Clearing auth data");
    clearStoredAuth();
    authService.setAuthMessage(message || "");
    window.dispatchEvent(new Event("userChanged"));
  },

  handleUnauthorized: (message = "Session expired or logged out") => {
    console.log("[auth] Unauthorized response received");
    authService.clearAuth(message);
    redirectToLogin();
  },

  logout: (message) => {
    console.log("[auth] Logging out");
    authService.clearAuth(message);
    redirectToLogin();
  },
};
