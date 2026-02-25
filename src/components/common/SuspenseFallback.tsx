import React from 'react';

const SuspenseFallback: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default SuspenseFallback;
