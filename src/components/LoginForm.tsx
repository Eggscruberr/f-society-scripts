
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '@/lib/auth';
import GlitchText from './GlitchText';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate network request
    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="glass-panel p-8 w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <GlitchText 
          text="F_SOCIETY" 
          className="text-3xl font-mono font-bold text-fsociety-primary text-shadow"
          variant="slow"
        />
        <p className="text-gray-400 mt-2 font-mono text-sm">ACCESS TERMINAL</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-mono text-gray-400 mb-1">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="_"
            autoComplete="off"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-mono text-gray-400 mb-1">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="_"
          />
        </div>
        
        {error && (
          <div className="text-fsociety-error text-sm font-mono py-2 px-3 bg-fsociety-error bg-opacity-10 rounded border border-fsociety-error border-opacity-20">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`button-primary w-full font-mono ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'AUTHENTICATING...' : 'LOGIN'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => setShowPasswordHint(!showPasswordHint)}
          className="text-gray-500 text-xs hover:text-fsociety-primary transition-colors font-mono"
        >
          {showPasswordHint ? 'HIDE HINT' : 'NEED A HINT?'}
        </button>
        
        {showPasswordHint && (
          <div className="mt-2 p-3 bg-fsociety-muted rounded text-xs font-mono text-gray-400 text-left">
            <p>Try these credentials:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>username: <span className="text-fsociety-primary">elliot</span> / password: <span className="text-fsociety-primary">mrrobot</span></li>
              <li>username: <span className="text-fsociety-primary">darlene</span> / password: <span className="text-fsociety-primary">fsociety</span></li>
              <li>username: <span className="text-fsociety-primary">admin</span> / password: <span className="text-fsociety-primary">admin</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
