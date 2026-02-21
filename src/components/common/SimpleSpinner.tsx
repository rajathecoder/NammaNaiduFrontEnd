import React from 'react';

interface SimpleSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({ className = '', fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-[9999]'
    : `flex items-center justify-center p-4 ${className}`;

  return (
    <div className={containerClasses}>
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1B5E20] rounded-full animate-spin"></div>
    </div>
  );
};

export default SimpleSpinner;
