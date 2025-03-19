
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Download, ShieldCheck, Code, Server } from 'lucide-react';

// Mock admin scripts list (in a real app, this would come from the server)
const adminScripts = [
  {
    id: 'admin-1',
    name: 'system_backdoor.py',
    description: 'Advanced system access tool with stealth capabilities',
    category: 'System',
    size: '1.2 MB',
  },
  {
    id: 'admin-2',
    name: 'network_scanner.sh',
    description: 'Scan and map entire network infrastructure',
    category: 'Network',
    size: '845 KB',
  },
  {
    id: 'admin-3',
    name: 'encryption_bypass.js',
    description: 'Tool for analyzing and bypassing encryption protocols',
    category: 'Security',
    size: '3.4 MB',
  },
];

const PanelAccess = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  
  // Simulate a loading sequence
  useEffect(() => {
    // This would ideally check a server-side authentication token
    // For demo purposes, we're just showing the loading animation
    
    const stages = [
      { stage: 1, delay: 500 },
      { stage: 2, delay: 1200 },
      { stage: 3, delay: 800 },
      { stage: 4, delay: 1000 },
    ];
    
    let timeoutId: NodeJS.Timeout;
    
    stages.forEach((item, index) => {
      timeoutId = setTimeout(() => {
        setLoadingStage(item.stage);
        
        // After the final stage, set authenticated to true
        if (index === stages.length - 1) {
          setTimeout(() => setAuthenticated(true), 800);
        }
      }, 
      stages.slice(0, index).reduce((sum, s) => sum + s.delay, 0));
    });
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-fsociety-darker pt-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <Terminal className="w-12 h-12 mx-auto mb-4 text-fsociety-primary animate-pulse" />
            <GlitchText 
              text="INITIALIZING SECURE CONNECTION" 
              className="text-xl font-mono font-bold text-fsociety-primary"
              variant="fast"
            />
          </div>
          
          <div className="space-y-4 font-mono text-sm text-gray-400">
            {loadingStage >= 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border border-fsociety-primary/20 rounded bg-fsociety-secondary/30"
              >
                <span className="text-fsociety-primary">[System] </span>
                Establishing encrypted connection...
              </motion.div>
            )}
            
            {loadingStage >= 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border border-fsociety-primary/20 rounded bg-fsociety-secondary/30"
              >
                <span className="text-fsociety-primary">[Auth] </span>
                Verifying credentials and access level...
              </motion.div>
            )}
            
            {loadingStage >= 3 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border border-fsociety-primary/20 rounded bg-fsociety-secondary/30"
              >
                <span className="text-fsociety-primary">[Security] </span>
                Running integrity checks on secure modules...
              </motion.div>
            )}
            
            {loadingStage >= 4 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border border-fsociety-primary/20 rounded bg-fsociety-secondary/30"
              >
                <span className="text-fsociety-primary">[Access] </span>
                Granting administrative privileges...
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-fsociety-darker pt-16">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-fsociety-primary" />
          <GlitchText 
            text="ADMINISTRATIVE PANEL" 
            className="text-3xl font-mono font-bold text-fsociety-primary"
            variant="slow"
          />
          <p className="text-gray-400 mt-2 font-mono text-sm">ACCESS LEVEL: ROOT</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-fsociety-primary/20 bg-fsociety-secondary/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-fsociety-primary font-mono flex items-center gap-2">
                  <Server className="h-5 w-5" /> Administrative Tools
                </CardTitle>
                <CardDescription className="font-mono text-gray-400">
                  High-security scripts for advanced operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminScripts.map((script) => (
                    <div 
                      key={script.id}
                      className="p-4 border border-fsociety-primary/20 rounded bg-fsociety-muted hover:bg-fsociety-muted/80 transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-mono text-fsociety-primary group-hover:text-shadow transition-all">
                            {script.name}
                          </h3>
                          <p className="text-gray-400 text-sm font-mono mt-1">
                            {script.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 font-mono">
                              {script.category}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {script.size}
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-fsociety-darker text-fsociety-primary hover:bg-fsociety-primary hover:text-black transition-colors"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-fsociety-primary/20 bg-fsociety-secondary/50 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-fsociety-primary font-mono flex items-center gap-2">
                  <Code className="h-5 w-5" /> System Status
                </CardTitle>
                <CardDescription className="font-mono text-gray-400">
                  Secure system information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between items-center p-2 border-b border-fsociety-primary/10">
                    <span className="text-gray-400">Access Level:</span>
                    <span className="text-fsociety-primary">Administrator</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border-b border-fsociety-primary/10">
                    <span className="text-gray-400">Connection:</span>
                    <span className="text-fsociety-primary">Encrypted</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border-b border-fsociety-primary/10">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="text-fsociety-primary">FSO-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border-b border-fsociety-primary/10">
                    <span className="text-gray-400">Last Login:</span>
                    <span className="text-fsociety-primary">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full font-mono bg-fsociety-primary text-black hover:bg-fsociety-accent"
                >
                  RETURN TO DASHBOARD
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PanelAccess;
