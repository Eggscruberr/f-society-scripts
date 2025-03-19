
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';
import GlitchText from '@/components/GlitchText';

const Index: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-fsociety-dark overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-fsociety-primary rounded-full filter blur-[150px]"
          animate={{ 
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-fsociety-accent rounded-full filter blur-[150px]"
          animate={{ 
            x: [0, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
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
              <motion.span 
                className="text-gradient font-mono"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                F_SOCIETY
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-gray-400 mb-8 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Our mission is to free the world from the invisible chains of debt. 
              We are hackers, activists, and vigilantes. We are legion. We do not forgive. 
              We do not forget.
            </motion.p>
            
            <div className="hidden md:block">
              <motion.div 
                className="font-mono text-xs text-gray-500 border-l-2 border-fsociety-primary pl-4 py-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p>// AUTHORIZED ACCESS ONLY</p>
                <p>// ALL ACTIVITIES ARE MONITORED AND RECORDED</p>
              </motion.div>
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

      {/* Binary code animation in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-fsociety-primary font-mono text-xs"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{ 
              top: ["0%", "100%"],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...Array(10)].map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Index;
