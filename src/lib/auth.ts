
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

// MySQL connection info
// In a production app, these would be in environment variables
const API_URL = '/api';

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    // Sanitize inputs
    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      throw new Error("Invalid username format");
    }
    
    // Hash the password with SHA-256 before sending (adds client-side security layer)
    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    // In a real application, this would be a fetch to your backend API
    // Here we simulate a backend API call that would talk to MySQL
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password: hashedPassword,
      }),
      credentials: 'include', // Important for security - sends cookies
    });
    
    if (!response.ok) {
      // Check for specific error responses
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      } else if (response.status === 429) {
        throw new Error("Too many login attempts. Please try again later.");
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
      const encryptedUserInfo = CryptoJS.AES.encrypt(
        JSON.stringify(userInfo),
        'fsociety_secret_key' // In a real app, use a secure key from environment variables
      ).toString();
      
      localStorage.setItem(USER_KEY, encryptedUserInfo);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    
    // Log the error but don't expose details to the user
    toast.error("Authentication failed");
    
    return false;
  }
};

export const logout = (): void => {
  // Clear local storage
  localStorage.removeItem(USER_KEY);
  
  // In a real app, also invalidate the token on the server
  fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(err => {
    console.error('Logout error:', err);
  });
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

export const getCurrentUser = (): User | null => {
  try {
    const encryptedUserStr = localStorage.getItem(USER_KEY);
    if (!encryptedUserStr) return null;
    
    // Decrypt the user info
    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedUserStr,
      'fsociety_secret_key' // Should match the encryption key
    );
    const userStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    // If there's an error, clear the corrupt data
    localStorage.removeItem(USER_KEY);
    return null;
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
          'Authorization': `Bearer ${user.token}`
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
        
        // Encrypt and store
        const encryptedUserInfo = CryptoJS.AES.encrypt(
          JSON.stringify(updatedUser),
          'fsociety_secret_key'
        ).toString();
        
        localStorage.setItem(USER_KEY, encryptedUserInfo);
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// Role-based authorization helper
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === requiredRole;
};

// Initialize a token refresh mechanism
export const initAuth = (): void => {
  // Check token validity every minute
  setInterval(() => {
    if (isAuthenticated()) {
      refreshToken().catch(console.error);
    }
  }, 60000);
};
