
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
  lastIp: string;
  userAgent: string;
  isActive: boolean;
  lastLogin: number | null;
  securityQuestions?: string[];
  mfaEnabled: boolean;
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
  accessLevel: number; // Permission level required
  hash: string; // File integrity hash
  lastModified: number;
}

interface DbAuditLog {
  id: string;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

// IP-based rate limiting map (simulated)
const ipAttempts: Record<string, { count: number, lastAttempt: number }> = {};

// Active tokens for blacklisting on logout (simulated)
const activeTokens: Set<string> = new Set();

// Initial mock data
const users: DbUser[] = [
  {
    id: 1, 
    username: 'elliot',
    // This is a bcrypt hash of 'mrrobot'
    passwordHash: '$2a$10$XJhkXnGYOuDt/vDX3ByeBu9wNMQSxr0ZLm2ikv0l9.Q32N3BpDt0a',
    role: 'admin',
    failedLoginAttempts: 0,
    lastLoginAttempt: 0,
    lastIp: '',
    userAgent: '',
    isActive: true,
    lastLogin: null,
    mfaEnabled: false
  },
  {
    id: 2,
    username: 'darlene',
    // Hash of 'fsociety'
    passwordHash: '$2a$10$7JiLVLwCKX4rqKGJ.ZIgUeYe5tN7Qd2tG/nFWRnJ7iBDbKEMvlDvS',
    role: 'user',
    failedLoginAttempts: 0,
    lastLoginAttempt: 0,
    lastIp: '',
    userAgent: '',
    isActive: true,
    lastLogin: null,
    mfaEnabled: false
  }
];

// Mock scripts
const scripts: DbScript[] = [];

// Audit logs
const auditLogs: DbAuditLog[] = [];

// Helper functions for security
function getClientIP(request: any): string {
  // In a real app, this would extract the IP from X-Forwarded-For or req.ip
  return '127.0.0.1';
}

function logActivity(userId: number, action: string, resourceType: string, resourceId: string, success: boolean, request: any, details?: string) {
  const ip = getClientIP(request);
  const userAgent = request.requestHeaders['User-Agent'] || 'Unknown';
  
  auditLogs.push({
    id: CryptoJS.lib.WordArray.random(16).toString(),
    userId,
    action,
    resourceType,
    resourceId,
    timestamp: Date.now(),
    ipAddress: ip,
    userAgent,
    success,
    details
  });
}

// Check rate limiting based on IP
function checkRateLimit(request: any): boolean {
  const ip = getClientIP(request);
  const now = Date.now();
  
  if (!ipAttempts[ip]) {
    ipAttempts[ip] = { count: 1, lastAttempt: now };
    return true;
  }
  
  const ipData = ipAttempts[ip];
  
  // Reset after 15 minutes
  if (now - ipData.lastAttempt > 15 * 60 * 1000) {
    ipAttempts[ip] = { count: 1, lastAttempt: now };
    return true;
  }
  
  // Too many attempts
  if (ipData.count >= 10) {
    return false;
  }
  
  // Increment counter
  ipData.count += 1;
  ipData.lastAttempt = now;
  return true;
}

// Validate and extract JWT token
function validateToken(request: any): { valid: boolean, userId?: number, role?: string } {
  const authHeader = request.requestHeaders.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }
  
  const token = authHeader.split(' ')[1];
  
  // Check if token has been blacklisted (logged out)
  if (!activeTokens.has(token)) {
    return { valid: false };
  }
  
  // In a real app, verify JWT signature here
  // For mock purposes, we'll just return a successful validation
  return { valid: true, userId: 1, role: 'admin' };
}

// Start the mock server
export function startMockServer() {
  createServer({
    routes() {
      this.namespace = 'api';
      
      // Add security headers to all responses
      this.pretender.handledRequest = function(verb, path, request) {
        request.responseHeaders = {
          ...request.responseHeaders,
          'Content-Security-Policy': "default-src 'self'",
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        };
      };
      
      // Login endpoint
      this.post('/login', (schema, request) => {
        try {
          // Rate limiting check
          if (!checkRateLimit(request)) {
            return new Response(429, {}, { 
              success: false, 
              message: 'Too many login attempts. Try again later.' 
            });
          }
          
          const body = JSON.parse(request.requestBody);
          const { username, password } = body;
          
          // Validate inputs
          if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            return new Response(400, {}, { success: false, message: 'Invalid request format' });
          }
          
          // Find user
          const user = users.find(u => u.username === username);
          
          if (!user) {
            return new Response(401, {}, { success: false, message: 'Invalid credentials' });
          }
          
          // Check if account is active
          if (!user.isActive) {
            return new Response(403, {}, { success: false, message: 'Account disabled' });
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
          
          // Update login attempt info
          user.lastLoginAttempt = now;
          user.lastIp = getClientIP(request);
          user.userAgent = request.requestHeaders['User-Agent'] || 'Unknown';
          
          if (!isPasswordValid) {
            // Log failed attempt
            user.failedLoginAttempts += 1;
            logActivity(user.id, 'LOGIN_FAILED', 'AUTH', user.id.toString(), false, request);
            
            return new Response(401, {}, { success: false, message: 'Invalid credentials' });
          }
          
          // Reset failed attempts on successful login
          user.failedLoginAttempts = 0;
          user.lastLogin = now;
          
          // Generate JWT-like token
          const token = CryptoJS.lib.WordArray.random(32).toString();
          
          // Add to active tokens
          activeTokens.add(token);
          
          // Log successful login
          logActivity(user.id, 'LOGIN', 'AUTH', user.id.toString(), true, request);
          
          return {
            success: true,
            username: user.username,
            token,
            role: user.role
          };
        } catch (error) {
          console.error('Login error:', error);
          return new Response(500, {}, { success: false, message: 'Internal server error' });
        }
      });
      
      // Logout endpoint
      this.post('/logout', (schema, request) => {
        const auth = validateToken(request);
        
        if (auth.valid && auth.userId) {
          // In a real app, blacklist the token here
          // Extract token
          const token = request.requestHeaders.Authorization.split(' ')[1];
          activeTokens.delete(token);
          
          // Log the logout
          logActivity(auth.userId, 'LOGOUT', 'AUTH', auth.userId.toString(), true, request);
        }
        
        return { success: true };
      });
      
      // Refresh token endpoint
      this.post('/refresh-token', (schema, request) => {
        const auth = validateToken(request);
        
        if (!auth.valid) {
          return new Response(401, {}, { success: false });
        }
        
        // Extract the old token and invalidate it
        const oldToken = request.requestHeaders.Authorization.split(' ')[1];
        activeTokens.delete(oldToken);
        
        // Generate new token
        const token = CryptoJS.lib.WordArray.random(32).toString();
        activeTokens.add(token);
        
        // Log token refresh
        logActivity(auth.userId!, 'TOKEN_REFRESH', 'AUTH', auth.userId!.toString(), true, request);
        
        return {
          success: true,
          token
        };
      });
      
      // Get scripts endpoint - requires authentication
      this.get('/scripts', (schema, request) => {
        const auth = validateToken(request);
        
        if (!auth.valid) {
          return new Response(401, {}, { success: false, message: 'Authentication required' });
        }
        
        // Filter scripts based on user's role/permissions
        let accessibleScripts = scripts;
        
        if (auth.role !== 'admin') {
          // Non-admin users can only see public scripts or scripts they own
          accessibleScripts = scripts.filter(script => 
            script.isPublic || script.authorId === auth.userId
          );
        }
        
        // Log the action
        logActivity(auth.userId!, 'LIST_SCRIPTS', 'SCRIPT', 'all', true, request);
        
        return {
          success: true,
          scripts: accessibleScripts
        };
      });
      
      // Get script by ID endpoint - requires authentication
      this.get('/scripts/:id', (schema, request) => {
        const id = request.params.id;
        const auth = validateToken(request);
        
        if (!auth.valid) {
          return new Response(401, {}, { success: false, message: 'Authentication required' });
        }
        
        const script = scripts.find(s => s.id === id);
        
        if (!script) {
          logActivity(auth.userId!, 'GET_SCRIPT_FAILED', 'SCRIPT', id, false, request, 'Script not found');
          return new Response(404, {}, { success: false, message: 'Script not found' });
        }
        
        // Check if user has permission to access this script
        if (auth.role !== 'admin' && !script.isPublic && script.authorId !== auth.userId) {
          logActivity(auth.userId!, 'GET_SCRIPT_FAILED', 'SCRIPT', id, false, request, 'Access denied');
          return new Response(403, {}, { success: false, message: 'Access denied' });
        }
        
        // Log the action
        logActivity(auth.userId!, 'GET_SCRIPT', 'SCRIPT', id, true, request);
        
        return {
          success: true,
          script
        };
      });
      
      // Download script endpoint
      this.post('/scripts/:id/download', (schema, request) => {
        const id = request.params.id;
        const auth = validateToken(request);
        
        if (!auth.valid) {
          return new Response(401, {}, { success: false, message: 'Authentication required' });
        }
        
        const script = scripts.find(s => s.id === id);
        
        if (!script) {
          logActivity(auth.userId!, 'DOWNLOAD_FAILED', 'SCRIPT', id, false, request, 'Script not found');
          return new Response(404, {}, { success: false, message: 'Script not found' });
        }
        
        // Check if user has permission to download this script
        if (auth.role !== 'admin' && !script.isPublic && script.authorId !== auth.userId) {
          logActivity(auth.userId!, 'DOWNLOAD_FAILED', 'SCRIPT', id, false, request, 'Access denied');
          return new Response(403, {}, { success: false, message: 'Access denied' });
        }
        
        // Increment download count
        script.downloadCount += 1;
        
        // Log the download
        logActivity(auth.userId!, 'DOWNLOAD_SCRIPT', 'SCRIPT', id, true, request);
        
        return {
          success: true,
        };
      });
      
      // Audit logs endpoint (admin only)
      this.get('/audit-logs', (schema, request) => {
        const auth = validateToken(request);
        
        if (!auth.valid) {
          return new Response(401, {}, { success: false, message: 'Authentication required' });
        }
        
        if (auth.role !== 'admin') {
          return new Response(403, {}, { success: false, message: 'Admin access required' });
        }
        
        // Pagination parameters
        const page = parseInt(request.queryParams.page || '1');
        const limit = parseInt(request.queryParams.limit || '50');
        const offset = (page - 1) * limit;
        
        // Sort logs by timestamp descending
        const sortedLogs = [...auditLogs].sort((a, b) => b.timestamp - a.timestamp);
        
        // Apply pagination
        const paginatedLogs = sortedLogs.slice(offset, offset + limit);
        
        return {
          success: true,
          logs: paginatedLogs,
          total: auditLogs.length,
          page,
          totalPages: Math.ceil(auditLogs.length / limit)
        };
      });
    },
  });
}

