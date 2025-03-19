
// This is a mock server to simulate backend API calls
// In a real application, this would be a Node.js server with MySQL

import { createServer, Response } from 'miragejs';
import CryptoJS from 'crypto-js';

// Simulated database tables
interface DbUser {
  id: number;
  username: string;
  passwordHash: string; // Hashed password
  role: string;
  failedLoginAttempts: number;
  lastLoginAttempt: number;
}

interface DbScript {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  fileSize: string;
  dateAdded: string;
  downloadCount: number;
  sourceCode: string;
  authorId: number; // References user id
  isPublic: boolean;
}

// Initial mock data
const users: DbUser[] = [
  {
    id: 1, 
    username: 'elliot',
    // This is a bcrypt hash of 'mrrobot' - in a real app, use bcrypt in the backend
    passwordHash: '$2a$10$XJhkXnGYOuDt/vDX3ByeBu9wNMQSxr0ZLm2ikv0l9.Q32N3BpDt0a',
    role: 'admin',
    failedLoginAttempts: 0,
    lastLoginAttempt: 0
  },
  {
    id: 2,
    username: 'darlene',
    // Hash of 'fsociety'
    passwordHash: '$2a$10$7JiLVLwCKX4rqKGJ.ZIgUeYe5tN7Qd2tG/nFWRnJ7iBDbKEMvlDvS',
    role: 'user',
    failedLoginAttempts: 0,
    lastLoginAttempt: 0
  }
];

// Start the mock server
export function startMockServer() {
  createServer({
    routes() {
      this.namespace = 'api';
      
      // Login endpoint
      this.post('/login', (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        
        // Find user
        const user = users.find(u => u.username === username);
        
        if (!user) {
          return new Response(401, {}, { success: false, message: 'Invalid credentials' });
        }
        
        // Check for brute force attacks
        const now = Date.now();
        if (user.failedLoginAttempts >= 5 && (now - user.lastLoginAttempt) < 300000) {
          return new Response(429, {}, { 
            success: false, 
            message: 'Too many failed attempts. Try again later.' 
          });
        }
        
        // In a real app, use bcrypt.compare here
        // For this mock, we'll just simulate password verification
        const isPasswordValid = (username === 'elliot' && password === CryptoJS.SHA256('mrrobot').toString()) || 
                               (username === 'darlene' && password === CryptoJS.SHA256('fsociety').toString());
        
        if (!isPasswordValid) {
          // Update failed login attempts
          user.failedLoginAttempts += 1;
          user.lastLoginAttempt = now;
          
          return new Response(401, {}, { success: false, message: 'Invalid credentials' });
        }
        
        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        
        // Generate JWT-like token
        const token = CryptoJS.lib.WordArray.random(32).toString();
        
        return {
          success: true,
          username: user.username,
          token,
          role: user.role
        };
      });
      
      // Logout endpoint
      this.post('/logout', () => {
        return { success: true };
      });
      
      // Refresh token endpoint
      this.post('/refresh-token', (schema, request) => {
        const authHeader = request.requestHeaders.Authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(401, {}, { success: false });
        }
        
        // Generate new token
        const token = CryptoJS.lib.WordArray.random(32).toString();
        
        return {
          success: true,
          token
        };
      });
      
      // Get scripts endpoint - requires authentication
      this.get('/scripts', (schema, request) => {
        const authHeader = request.requestHeaders.Authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(401, {}, { success: false });
        }
        
        // Extract user info from token (in a real app)
        // For now, just return the scripts from scripts.ts
        return {
          success: true,
          scripts: [] // These would be loaded from the database
        };
      });
    },
  });
}
