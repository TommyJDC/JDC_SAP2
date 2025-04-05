import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <Loader2 size={size} className={`animate-spin text-jdc-yellow ${className}`} />
  );
};

export default LoadingSpinner;
