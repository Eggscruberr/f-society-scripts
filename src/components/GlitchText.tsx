
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
  variant?: 'slow' | 'fast' | 'subtle';
  onClick?: () => void;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className,
  glitchInterval = 10000,
  variant = 'subtle',
  onClick
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Periodically trigger glitch effect
    const intervalId = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }, glitchInterval);

    return () => clearInterval(intervalId);
  }, [glitchInterval]);

  const getGlitchClass = () => {
    if (!isGlitching) return '';
    
    switch (variant) {
      case 'fast':
        return 'animate-glitch';
      case 'slow':
        return 'animate-glitch-slow';
      case 'subtle':
      default:
        return 'animate-pulse-subtle';
    }
  };

  return (
    <span 
      className={cn('inline-block', getGlitchClass(), className)}
      onClick={onClick}
    >
      {text}
    </span>
  );
};

export default GlitchText;
