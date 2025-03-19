
// This module handles authentication with MySQL database
import { toast } from "sonner";
import CryptoJS from "crypto-js";

const USER_KEY = 'fsociety_user';
const TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

export interface User {
  username: string;
  token: string;
  tokenExpiry: number;
  role: string;
}

// Connection info - these would be environment variables in production
const API_URL = '/api';

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    // Input validation
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    
    // Prevent SQL injection - only allow alphanumeric and underscore characters
    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      throw new Error("Invalid username format");
    }
    
    // Hash the password with SHA-256 before sending (adds client-side security layer)
    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    // In production, this would connect to a real MySQL server
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': generateCSRFToken(), // CSRF protection
      },
      body: JSON.stringify({
        username,
        password: hashedPassword,
      }),
      credentials: 'include', // Important for security - sends cookies
    });
    
    if (!response.ok) {
      // Handle specific error responses
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      } else if (response.status === 429) {
        throw new Error("Too many login attempts. Please try again later.");
      } else if (response.status === 403) {
        throw new Error("Access forbidden");
      }
      throw new Error(`Server error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Create a token expiry time
      const tokenExpiry = Date.now() + TOKEN_EXPIRY;
      
      // Store user info in localStorage (encrypted)
      const userInfo = {
        username: data.username,
        token: data.token,
        tokenExpiry: tokenExpiry,
        role: data.role || 'user'
      };
      
      // Encrypt the user info before storing
      const encryptionKey = generateEncryptionKey(); // Generate a unique key per session
      const encryptedUserInfo = CryptoJS.AES.encrypt(
        JSON.stringify(userInfo),
        encryptionKey
      ).toString();
      
      // Store the encrypted data and the key (in a secure HttpOnly cookie in production)
      localStorage.setItem(USER_KEY, encryptedUserInfo);
      sessionStorage.setItem('encryption_key', encryptionKey); // In production, use HttpOnly cookies
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    toast.error("Authentication failed");
    return false;
  }
};

// Generate a random encryption key
const generateEncryptionKey = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

// Generate a CSRF token
const generateCSRFToken = (): string => {
  const token = sessionStorage.getItem('csrf_token');
  if (token) return token;
  
  const newToken = CryptoJS.lib.WordArray.random(16).toString();
  sessionStorage.setItem('csrf_token', newToken);
  return newToken;
};

export const logout = (): void => {
  // Clear client-side storage
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('encryption_key');
  sessionStorage.removeItem('csrf_token');
  
  // Invalidate the token on the server (in production)
  fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': generateCSRFToken(),
    },
    credentials: 'include',
  }).catch(err => {
    console.error('Logout error:', err);
  });
};

export const getCurrentUser = (): User | null => {
  try {
    const encryptedUserStr = localStorage.getItem(USER_KEY);
    if (!encryptedUserStr) return null;
    
    const encryptionKey = sessionStorage.getItem('encryption_key');
    if (!encryptionKey) {
      // If encryption key is missing, force logout
      logout();
      return null;
    }
    
    // Decrypt the user info
    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedUserStr,
      encryptionKey
    );
    const userStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!userStr) return null;
    
    const user = JSON.parse(userStr) as User;
    
    // Verify token hasn't been tampered with (would need signature verification in production)
    if (!user.token || !user.tokenExpiry) {
      logout();
      return null;
    }
    
    return user;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    // If there's an error, clear the corrupt data
    logout();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const user = getCurrentUser();
    
    if (!user) return false;
    
    // Check if token is expired
    if (user.tokenExpiry < Date.now()) {
      // Token expired, log out
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const user = getCurrentUser();
    if (!user) return false;
    
    // If token is about to expire (less than 5 minutes left), refresh it
    if (user.tokenExpiry - Date.now() < 300000) {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-CSRF-Token': generateCSRFToken(),
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update the token
        const tokenExpiry = Date.now() + TOKEN_EXPIRY;
        
        const updatedUser = {
          ...user,
          token: data.token,
          tokenExpiry: tokenExpiry
        };
        
        // Re-encrypt with the current encryption key
        const encryptionKey = sessionStorage.getItem('encryption_key') || generateEncryptionKey();
        const encryptedUserInfo = CryptoJS.AES.encrypt(
          JSON.stringify(updatedUser),
          encryptionKey
        ).toString();
        
        localStorage.setItem(USER_KEY, encryptedUserInfo);
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    logout(); // Force logout on error
    return false;
  }
};

// Role-based authorization helper
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // In production, verify role with the server for critical operations
  return user.role === requiredRole;
};

// Initialize a token refresh mechanism
export const initAuth = (): void => {
  // Check token validity every minute
  setInterval(() => {
    if (isAuthenticated()) {
      refreshToken().catch(err => {
        console.error('Token refresh failed:', err);
        logout(); // Force logout on persistent errors
      });
    }
  }, 60000);
  
  // Add event listeners for security
  window.addEventListener('storage', (event) => {
    // Detect if localStorage was modified from another tab/window
    if (event.key === USER_KEY) {
      // Force reauthentication
      window.location.reload();
    }
  });
};

// For session activity tracking
let lastActivity = Date.now();
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Set up inactivity monitoring
export const setupInactivityMonitor = (): void => {
  const resetTimer = () => {
    lastActivity = Date.now();
  };
  
  // Set up activity listeners
  ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  // Check for inactivity every minute
  setInterval(() => {
    if (isAuthenticated() && (Date.now() - lastActivity > INACTIVITY_TIMEOUT)) {
      toast.info("Session expired due to inactivity");
      logout();
      window.location.href = '/';
    }
  }, 60000);
};

