
import { getCurrentUser } from './auth';

export interface Script {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'bash' | 'javascript' | 'ruby';
  category: 'exploit' | 'reconnaissance' | 'utility' | 'cryptography';
  fileSize: string;
  dateAdded: string;
  downloadCount: number;
  sourceCode: string;
  authorId?: number;
  isPublic?: boolean;
  accessLevel?: number;
  hash?: string;
  lastModified?: number;
}

const API_URL = '/api';

// Helper function to validate API responses
const validateApiResponse = (response: Response, errorMessage: string): Promise<any> => {
  if (!response.ok) {
    // Different handling based on status code
    if (response.status === 401) {
      throw new Error('Authentication required');
    } else if (response.status === 403) {
      throw new Error('Access denied');
    } else if (response.status === 404) {
      throw new Error('Resource not found');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    } else {
      throw new Error(`${errorMessage}: ${response.statusText}`);
    }
  }
  
  return response.json().then(data => {
    if (!data.success) {
      throw new Error(data.message || errorMessage);
    }
    return data;
  });
};

export const getScripts = async (): Promise<Script[]> => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      return [];
    }
    
    const response = await fetch(`${API_URL}/scripts`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    });
    
    const data = await validateApiResponse(response, 'Failed to fetch scripts');
    return data.scripts;
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return [];
  }
};

export const getScriptById = async (id: string): Promise<Script | undefined> => {
  try {
    // Input validation
    if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
      throw new Error('Invalid script ID format');
    }
    
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      return undefined;
    }
    
    const response = await fetch(`${API_URL}/scripts/${encodeURIComponent(id)}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    });
    
    const data = await validateApiResponse(response, 'Failed to fetch script');
    return data.script;
  } catch (error) {
    console.error('Error fetching script by id:', error);
    return undefined;
  }
};

export const downloadScript = async (script: Script): Promise<void> => {
  try {
    // Input validation
    if (!script || !script.id) {
      throw new Error('Invalid script');
    }
    
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      throw new Error('Authentication required');
    }
    
    // Log download attempt
    const logResponse = await fetch(`${API_URL}/scripts/${encodeURIComponent(script.id)}/download`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    });
    
    await validateApiResponse(logResponse, 'Failed to log download');
    
    // Verify file hash before downloading (security feature)
    if (script.hash) {
      const calculatedHash = await calculateFileHash(script.sourceCode);
      if (calculatedHash !== script.hash) {
        throw new Error('File integrity check failed');
      }
    }
    
    // Create blob with the source code
    const blob = new Blob([script.sourceCode], { type: 'text/plain' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeFilename(script.name);
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading script:', error);
    throw error;
  }
};

// Calculate a hash of a file for integrity checking
async function calculateFileHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sanitize filename to prevent directory traversal attacks
function sanitizeFilename(filename: string): string {
  // Remove potentially dangerous characters
  return filename.replace(/[/\\?%*:|"<>]/g, '-');
}

