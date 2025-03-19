
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ScriptCard from '@/components/ScriptCard';
import GlitchText from '@/components/GlitchText';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { getScripts, Script } from '@/lib/scripts';
import { Search, Filter, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const navigate = useNavigate();
  
  const user = getCurrentUser();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Fetch scripts
    const fetchScripts = async () => {
      try {
        const scriptData = await getScripts();
        setScripts(scriptData);
        setFilteredScripts(scriptData);
      } catch (error) {
        console.error('Error fetching scripts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScripts();
  }, [navigate]);
  
  useEffect(() => {
    // Apply filters and search
    let filtered = scripts;
    
    if (searchTerm) {
      filtered = filtered.filter(
        script => 
          script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          script.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(script => script.category === filterCategory);
    }
    
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(script => script.language === filterLanguage);
    }
    
    setFilteredScripts(filtered);
  }, [searchTerm, filterCategory, filterLanguage, scripts]);
  
  const categories = ['all', 'exploit', 'reconnaissance', 'utility', 'cryptography'];
  const languages = ['all', 'python', 'bash', 'javascript', 'ruby'];

  return (
    <div className="min-h-screen bg-fsociety-dark overflow-x-hidden">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome, <span className="text-fsociety-primary font-mono">{user?.username}</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Access and download our custom scripts for your operations
                </p>
              </div>
              
              <div className="relative mt-4 md:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search scripts..."
                  className="pl-10 pr-4 py-2 bg-fsociety-secondary border border-fsociety-muted rounded-md text-white w-full md:w-64 focus:border-fsociety-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center mr-2">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-400">Filter:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-fsociety-secondary rounded-md p-1">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 py-1 px-2 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-fsociety-secondary rounded-md p-1">
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 py-1 px-2 focus:outline-none"
                  >
                    <option value="all">All Languages</option>
                    {languages.slice(1).map(language => (
                      <option key={language} value={language}>
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </header>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Cpu size={40} className="text-fsociety-primary animate-pulse mb-4" />
              <p className="text-gray-400 font-mono">LOADING SCRIPTS...</p>
            </div>
          ) : filteredScripts.length === 0 ? (
            <div className="text-center py-16 bg-fsociety-secondary bg-opacity-30 rounded-lg border border-fsociety-muted">
              <div className="inline-block p-3 bg-fsociety-muted rounded-full mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No scripts found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t border-fsociety-muted py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <GlitchText 
                text="F_SOCIETY" 
                className="font-mono font-bold text-fsociety-primary"
                variant="subtle"
              />
            </div>
            <div className="text-sm text-gray-500 font-mono">
              &lt;coded_with_chaos/&gt; | <span className="text-fsociety-primary">FREEDOM</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
