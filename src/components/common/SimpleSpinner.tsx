import React from 'react';

interface SimpleSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({ className = '', fullScreen = false }) => {
  const spinner = (
    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B5E20] ${className}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default SimpleSpinner;
