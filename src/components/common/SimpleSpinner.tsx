import React from 'react';

interface SimpleSpinnerProps {
    className?: string;
}

const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({ className = '' }) => {
    return (
        <div className={`flex items-center justify-center min-h-[50vh] w-full ${className}`}>
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1B5E20] rounded-full animate-spin"></div>
        </div>
    );
};

export default SimpleSpinner;
