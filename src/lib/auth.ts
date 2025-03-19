
// This is a client-side mock of authentication
// In a real application, this would use JWT, cookies, or other secure mechanisms

const USER_KEY = 'fsociety_user';

export interface User {
  username: string;
  token: string;
}

// Mock users
// In a real app, this would be validated against a backend
const VALID_USERS = [
  { username: 'elliot', password: 'mrrobot' },
  { username: 'darlene', password: 'fsociety' },
  { username: 'admin', password: 'admin' },
];

export const login = (username: string, password: string): boolean => {
  // Check if the user is valid
  const user = VALID_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Create a mock token (in a real app, this would come from the server)
    const token = `mock_token_${Math.random().toString(36).substring(2)}`;
    
    // Store user info in localStorage
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        username: user.username,
        token,
      })
    );
    
    return true;
  }

  return false;
};

export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem(USER_KEY);
  return !!user;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    return null;
  }
};
