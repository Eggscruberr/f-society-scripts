
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
}

const API_URL = '/api';

export const getScripts = async (): Promise<Script[]> => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      return [];
    }
    
    const response = await fetch(`${API_URL}/scripts`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scripts: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch scripts');
    }
    
    return data.scripts;
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return [];
  }
};

export const getScriptById = async (id: string): Promise<Script | undefined> => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      return undefined;
    }
    
    const response = await fetch(`${API_URL}/scripts/${id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch script: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch script');
    }
    
    return data.script;
  } catch (error) {
    console.error('Error fetching script by id:', error);
    return undefined;
  }
};

export const downloadScript = async (script: Script): Promise<void> => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('No authenticated user');
      return;
    }
    
    // Log download attempt
    const logResponse = await fetch(`${API_URL}/scripts/${script.id}/download`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });
    
    if (!logResponse.ok) {
      console.warn('Failed to log download');
    }
    
    // Create blob with the source code
    const blob = new Blob([script.sourceCode], { type: 'text/plain' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.name;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading script:', error);
  }
};
