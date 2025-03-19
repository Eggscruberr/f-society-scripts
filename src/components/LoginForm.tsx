
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '@/lib/auth';
import GlitchText from './GlitchText';
import { motion } from 'framer-motion';
import { Keyboard, Lock, ShieldAlert, Loader } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
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
        setLoginSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Delay navigation to show the success animation
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <motion.div 
      className="glass-panel p-8 w-full max-w-md mx-auto relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-fsociety-primary opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fsociety-error opacity-5 rounded-full blur-3xl"></div>
      
      <div className="mb-8 text-center relative">
        <GlitchText 
          text="F_SOCIETY" 
          className="text-3xl font-mono font-bold text-fsociety-primary text-shadow"
          variant="slow"
          glitchInterval={3000}
        />
        <motion.p 
          className="text-gray-400 mt-2 font-mono text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ACCESS TERMINAL
        </motion.p>
        <div className="mt-2 h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-fsociety-primary to-transparent"></div>
      </div>
      
      {loginSuccess ? (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-fsociety-primary text-fsociety-primary"
            initial={{ scale: 0.5, borderWidth: 5 }}
            animate={{ scale: 1, borderWidth: 2 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
          <GlitchText 
            text="ACCESS GRANTED" 
            className="text-fsociety-primary font-mono text-lg"
            variant="fast" 
          />
          <p className="text-gray-500 mt-2 font-mono text-xs">REDIRECTING TO DASHBOARD...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="username" className="block text-sm font-mono text-gray-400 mb-1 flex items-center">
              <Keyboard size={14} className="mr-1.5 text-fsociety-primary" />
              USERNAME
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pr-10"
                placeholder="_"
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <span className="font-mono text-xs">&gt;</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label htmlFor="password" className="block text-sm font-mono text-gray-400 mb-1 flex items-center">
              <Lock size={14} className="mr-1.5 text-fsociety-primary" />
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="_"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <span className="font-mono text-xs">&gt;</span>
              </div>
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              className="text-fsociety-error text-sm font-mono py-2 px-3 bg-fsociety-error bg-opacity-10 rounded border border-fsociety-error border-opacity-20 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShieldAlert size={16} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          
          <motion.button
            type="submit"
            disabled={loading}
            className={`button-primary w-full font-mono relative overflow-hidden ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ 
              boxShadow: "0 0 15px rgba(0, 195, 154, 0.5)", 
              scale: 1.02 
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader size={16} className="mr-2 animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              <>
                <span className="relative z-10">LOGIN</span>
                <motion.span 
                  className="absolute inset-0 bg-fsociety-accent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </motion.button>
        </form>
      )}
      
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <button 
          onClick={() => setShowPasswordHint(!showPasswordHint)}
          className="text-gray-500 text-xs hover:text-fsociety-primary transition-colors font-mono flex items-center mx-auto"
        >
          <span className="mr-1">{showPasswordHint ? '▲' : '▼'}</span>
          {showPasswordHint ? 'HIDE HINT' : 'NEED A HINT?'}
        </button>
        
        {showPasswordHint && (
          <motion.div 
            className="mt-3 p-3 bg-fsociety-muted rounded text-xs font-mono text-gray-400 text-left"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p>Try these credentials:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>username: <span className="text-fsociety-primary">elliot</span> / password: <span className="text-fsociety-primary">mrrobot</span></li>
              <li>username: <span className="text-fsociety-primary">darlene</span> / password: <span className="text-fsociety-primary">fsociety</span></li>
              <li>username: <span className="text-fsociety-primary">admin</span> / password: <span className="text-fsociety-primary">admin</span></li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
