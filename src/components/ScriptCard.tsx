
import React, { useState } from 'react';
import { Script, downloadScript } from '@/lib/scripts';
import { FileCode, Download, Code, Clock, HardDrive } from 'lucide-react';

interface ScriptCardProps {
  script: Script;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      downloadScript(script);
      setIsDownloading(false);
    }, 800);
  };
  
  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'python':
        return 'bg-blue-500';
      case 'bash':
        return 'bg-green-600';
      case 'javascript':
        return 'bg-yellow-500';
      case 'ruby':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exploit':
        return 'bg-red-600 bg-opacity-20 text-red-400';
      case 'reconnaissance':
        return 'bg-blue-600 bg-opacity-20 text-blue-400';
      case 'utility':
        return 'bg-purple-600 bg-opacity-20 text-purple-400';
      case 'cryptography':
        return 'bg-green-600 bg-opacity-20 text-green-400';
      default:
        return 'bg-gray-600 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <div className="bg-fsociety-secondary border border-fsociety-muted rounded-lg overflow-hidden card-hover">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-md ${getLanguageColor(script.language)} flex items-center justify-center mr-3`}>
              <FileCode size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-mono text-white font-medium">{script.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{script.description}</p>
            </div>
          </div>
          <span className={`text-xs font-mono px-2 py-1 rounded ${getCategoryColor(script.category)}`}>
            {script.category}
          </span>
        </div>
        
        <div className="border-t border-fsociety-muted my-3 pt-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-mono">
            <div className="flex items-center">
              <Code size={14} className="mr-1.5" />
              <span>{script.language}</span>
            </div>
            <div className="flex items-center">
              <HardDrive size={14} className="mr-1.5" />
              <span>{script.fileSize}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              <span>{script.dateAdded}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`mt-3 w-full py-2.5 flex justify-center items-center text-sm font-mono rounded transition-all ${
            isDownloading 
              ? 'bg-fsociety-muted text-gray-400 cursor-not-allowed' 
              : 'bg-fsociety-primary text-white hover:bg-fsociety-accent'
          }`}
        >
          <Download size={16} className="mr-2" />
          {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD SCRIPT'}
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
