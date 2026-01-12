import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/images/Loading.json';

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
}

const Loading: React.FC<LoadingProps> = ({
    message = 'Loading...',
    fullScreen = false,
    size = 'medium',
    color,
    className = ''
}) => {
    // Use a simple spinner for small size (buttons, inline)
    if (size === 'small') {
        const spinnerColor = color === 'white' ? 'border-white' : 'border-[#FB34AA]';
        const textColor = color === 'white' ? 'text-white' : 'text-gray-600';

        return (
            <div className={`flex items-center justify-center gap-2 ${className}`}>
                <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${spinnerColor}`}></div>
                {message && message !== 'Loading...' && (
                    <span className={`text-sm font-medium ${textColor}`}>{message}</span>
                )}
            </div>
        );
    }

    const sizeClasses = {
        small: 'w-32 h-32', // kept for backward compat if anyone uses small NOT in the new way, but I'm hijacking 'small' above. 
        // Actually, since I handled 'small' above, this key is unused or needs to be 'medium' fallback.
        medium: 'w-64 h-64',
        large: 'w-96 h-96'
    };

    const containerClasses = fullScreen
        ? 'min-h-screen bg-gray-100 flex justify-center items-center'
        : `flex flex-col items-center justify-center py-12 px-4 min-h-[400px] ${className}`;

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center justify-center">
                <div className={sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium}>
                    <Lottie
                        animationData={loadingAnimation}
                        loop={true}
                        className="w-full h-full"
                    />
                </div>
                {message && (
                    <p className="text-gray-600 mt-4 font-medium">{message}</p>
                )}
            </div>
        </div>
    );
};

export default Loading;

