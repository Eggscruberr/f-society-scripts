
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlitchText from './GlitchText';
import { isAuthenticated, logout } from '@/lib/auth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    setAuth(isAuthenticated());
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12 ${
      scrolled ? 'bg-fsociety-darker/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <GlitchText 
            text="F_SOCIETY" 
            className="font-mono font-bold text-xl text-fsociety-primary group-hover:text-shadow transition-all duration-300"
            variant="subtle"
            glitchInterval={5000}
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8 font-mono text-sm">
          <Link to="/" className={`transition-all duration-300 hover:text-fsociety-primary ${location.pathname === '/' ? 'text-fsociety-primary' : 'text-gray-400'}`}>
            HOME
          </Link>
          {auth && (
            <Link to="/dashboard" className={`transition-all duration-300 hover:text-fsociety-primary ${location.pathname === '/dashboard' ? 'text-fsociety-primary' : 'text-gray-400'}`}>
              DASHBOARD
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {auth ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded text-sm font-mono border border-fsociety-primary text-fsociety-primary hover:bg-fsociety-primary hover:text-white transition-all duration-300"
            >
              LOGOUT
            </button>
          ) : (
            <Link 
              to="/" 
              className="px-4 py-2 rounded text-sm font-mono border border-fsociety-primary text-fsociety-primary hover:bg-fsociety-primary hover:text-white transition-all duration-300"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
