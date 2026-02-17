import React from 'react';

interface SimpleSpinnerProps {
    className?: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    fullScreen?: boolean;
}

const SimpleSpinner: React.FC<SimpleSpinnerProps> = ({
    className = '',
    size = 'medium',
    color = 'border-[#1B5E20]', // Default to brand green
    fullScreen = true
}) => {
    const sizeClasses = {
        small: 'w-6 h-6 border-2',
        medium: 'w-10 h-10 border-3',
        large: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div
            className={`
                rounded-full
                animate-spin
                border-t-transparent
                ${sizeClasses[size]}
                ${color}
                ${className}
            `}
            role="status"
            aria-label="Loading"
        />
    );

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] w-full">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default SimpleSpinner;
