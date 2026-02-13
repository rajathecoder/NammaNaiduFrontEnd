import React from 'react';

interface SimpleSpinnerProps {
  className?: string;
}

const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B5E20] ${className}`}
    ></div>
  );
};

export default SimpleSpinner;
