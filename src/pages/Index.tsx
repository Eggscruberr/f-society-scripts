
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';
import GlitchText from '@/components/GlitchText';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-fsociety-dark overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-fsociety-primary rounded-full filter blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-fsociety-accent rounded-full filter blur-[150px]" />
      </div>
      
      <Navbar />
      
      <div className="relative z-10 pt-32 pb-20 min-h-screen flex flex-col">
        <div className="container px-4 mx-auto max-w-6xl flex-grow flex flex-col md:flex-row items-center justify-center md:justify-between gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <GlitchText 
                text="Welcome to " 
                className="text-white font-sans"
                variant="subtle"
              />
              <br />
              <span className="text-gradient font-mono">F_SOCIETY</span>
            </h1>
            
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              Our mission is to free the world from the invisible chains of debt. 
              We are hackers, activists, and vigilantes. We are legion. We do not forgive. 
              We do not forget.
            </p>
            
            <div className="hidden md:block">
              <div className="font-mono text-xs text-gray-500 border-l-2 border-fsociety-primary pl-4 py-1">
                <p>// AUTHORIZED ACCESS ONLY</p>
                <p>// ALL ACTIVITIES ARE MONITORED AND RECORDED</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-5/12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
