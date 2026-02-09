import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import { getAuthData, clearAuthData } from '../../utils/auth';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userPhotos, setUserPhotos] = useState<{ photo1link?: string } | null>(null);

    useEffect(() => {
        // Get user info from auth data
        const authData = getAuthData();
        if (authData?.userInfo) {
            setUserInfo(authData.userInfo);

            // Fetch user photos
            const fetchUserPhotos = async () => {
                try {
                    if (!authData?.token || !authData.userInfo?.accountId) {
                        return;
                    }

                    const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(authData.userInfo.accountId)), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.data) {
                            const photoLinks: any = {};
                            if (data.data.personphoto && Array.isArray(data.data.personphoto)) {
                                data.data.personphoto.forEach((photo: any) => {
                                    const placement = photo.photoplacement;
                                    const linkKey = `photo${placement}link` as keyof typeof photoLinks;
                                    photoLinks[linkKey] = photo[linkKey];
                                });
                            }
                            setUserPhotos(photoLinks);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user photos:', error);
                }
            };

            fetchUserPhotos();
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dropdown = document.querySelector('.header-profile-dropdown-menu');
            const avatar = document.querySelector('.header-user-avatar-small');

            if (dropdown && avatar && !avatar.contains(target) && !dropdown.contains(target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        // Revoke refresh token on backend before clearing local data
        try {
            const authData = getAuthData();
            if (authData?.token) {
                await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGOUT), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`,
                    },
                    body: JSON.stringify({ refreshToken: authData.refreshToken }),
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        }

        // Clear all user-related data from localStorage
        clearAuthData();

        // Navigate to login page
        navigate('/login');
    };

    const handleNavClick = (e: React.MouseEvent, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    const isActive = (path: string) => {
        // Exact match
        if (location.pathname === path) return true;
        // Check if current path starts with the route path followed by a slash
        // This handles nested routes like /messages/123
        if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
        return false;
    };

    return (
        <header className="bg-white border-b border-gray-200 py-4 px-8 sticky top-0 z-[100] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
                <img
                    src={logoOnly}
                    alt="Namma Naidu Logo"
                    className="h-[45px] w-auto cursor-pointer"
                    onClick={() => navigate('/home')}
                />
                <nav className="flex items-center gap-8 flex-1 justify-center md:gap-4 md:text-sm">
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/home')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/home')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </a>
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/matches')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/matches')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Matches
                    </a>
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/interests')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/interests')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Interests
                    </a>
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/messages')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/messages')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                    </a>
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/search')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/search')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                    </a>
                    <a
                        href="#"
                        className={`text-gray-700 no-underline text-[0.95rem] font-medium flex items-center gap-2 transition-colors duration-300 relative pb-1 ${isActive('/notifications')
                            ? 'text-[#a413ed] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#a413ed] after:to-[#8b10c9]'
                            : 'hover:text-[#a413ed]'
                            }`}
                        onClick={(e) => handleNavClick(e, '/notifications')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                        <span className="bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold ml-1">8</span>
                    </a>
                </nav>
                {userInfo && (
                    <div className="relative flex items-center">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-white font-semibold text-base cursor-pointer transition-transform duration-200 hover:scale-105 shadow-md overflow-hidden"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {userPhotos?.photo1link ? (
                                <img
                                    src={userPhotos.photo1link}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{userInfo.name?.charAt(0) || userInfo.email?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        {showDropdown && (
                            <div className="absolute top-[calc(100%+10px)] right-0 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] min-w-[250px] z-[1000] animate-[dropdownFadeIn_0.3s_ease]">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-100">
                                    <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-white font-semibold text-xl shrink-0 shadow-md overflow-hidden">
                                        {userPhotos?.photo1link ? (
                                            <img
                                                src={userPhotos.photo1link}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{userInfo.name?.charAt(0) || userInfo.email?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-gray-800 m-0 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{userInfo.name || 'User'}</p>
                                        <p className="text-sm text-gray-600 m-0 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{userInfo.email || userInfo.phone || ''}</p>
                                        <div className="flex items-center gap-1 text-sm text-[#a413ed] font-medium">
                                            <span>🎫</span>
                                            <span>Tokens: {userInfo.profileViewTokens !== undefined ? userInfo.profileViewTokens : 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 py-3 px-4 text-gray-800 no-underline text-[0.95rem] transition-colors duration-200 border-none bg-transparent w-full text-left cursor-pointer font-inherit hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        navigate('/my-profile');
                                    }}
                                >
                                    <span className="text-lg w-5 text-center">👤</span>
                                    My Profile
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 py-3 px-4 text-gray-800 no-underline text-[0.95rem] transition-colors duration-200 border-none bg-transparent w-full text-left cursor-pointer font-inherit hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        navigate('/subscription-plans');
                                    }}
                                >
                                    <span className="text-lg w-5 text-center">👑</span>
                                    Subscription Plans
                                </a>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <button
                                    className="flex items-center gap-3 py-3 px-4 text-[#e74c3c] no-underline text-[0.95rem] transition-colors duration-200 border-none bg-transparent w-full text-left cursor-pointer font-inherit hover:bg-[#fee] hover:text-[#c0392b]"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDropdown(false);
                                        handleLogout();
                                    }}
                                >
                                    <span className="text-lg w-5 text-center">🚪</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;


