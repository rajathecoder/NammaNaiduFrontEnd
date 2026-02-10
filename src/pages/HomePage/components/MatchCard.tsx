import React from 'react';
import { useNavigate } from 'react-router-dom';
import verifiedBadge from '../../../assets/images/verified-badge.png';

interface MatchCardProps {
    profile: any;
    profilePhoto?: string;
    primaryButtonText?: string;
    onPrimaryAction?: (profile: any) => void;
    onFavorite?: (profile: any) => void;
    isFavorite?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = React.memo(({
    profile,
    profilePhoto,
    primaryButtonText = "Connect",
    onPrimaryAction,
    onFavorite,
    isFavorite = false
}) => {
    const navigate = useNavigate();

    const age = profile.basicDetail?.dateOfBirth
        ? new Date().getFullYear() - new Date(profile.basicDetail.dateOfBirth).getFullYear()
        : null;

    const height = profile.basicDetail?.height || '';
    const occupation = profile.basicDetail?.occupation || 'Not Specified';

    return (
        <div
            className="relative min-w-[200px] max-w-[280px] h-[320px] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => navigate(`/profile/${profile.accountId}`)}
        >
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 bg-gray-200">
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt={profile.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.fallback-initial')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'fallback-initial w-full h-full flex items-center justify-center text-6xl text-white font-bold bg-gradient-to-br from-[#a413ed] to-[#8b10c9]';
                                fallback.textContent = profile.name?.charAt(0) || '👤';
                                parent.appendChild(fallback);
                            }
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-white font-bold bg-gradient-to-br from-[#a413ed] to-[#8b10c9]">
                        {profile.name?.charAt(0) || '👤'}
                    </div>
                )}
            </div>

            {/* Verified Badge - Glassy look */}
            {profile.profileveriffied === 1 && (
                <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 border border-white/40 z-10 shadow-sm">
                    <img src={verifiedBadge} alt="Verified" className="w-3 h-3 drop-shadow-md" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider drop-shadow-sm">Verified</span>
                </div>
            )}

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Info Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-0.5 drop-shadow-md truncate">
                        {profile.name}{age ? `, ${age}` : ''}
                    </h3>
                    <p className="text-gray-300 text-xs font-medium drop-shadow-sm truncate">
                        {occupation}
                    </p>
                    <p className="text-gray-300 text-[10px] drop-shadow-sm">
                        {height}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="h-9 px-4 flex-1 bg-white text-[#8b10c9] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#8b10c9] hover:text-white hover:scale-[1.05] active:scale-95 border-none cursor-pointer shadow-lg whitespace-nowrap"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onPrimaryAction) {
                                onPrimaryAction(profile);
                            }
                        }}
                    >
                        {primaryButtonText}
                    </button>
                    <button
                        className={`w-9 h-9 backdrop-blur-md border rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-[1.05] active:scale-95 cursor-pointer shadow-lg ${isFavorite ? 'bg-[#a413ed] border-[#a413ed] text-white' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onFavorite) onFavorite(profile);
                        }}
                    >
                        <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
});


export default MatchCard;
