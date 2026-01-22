import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import { getUserProfileByAccountId, getOppositeGenderProfiles, viewProfileDetails, type UserProfile } from '../../services/api/user.api';
import verifiedBadge from '../../assets/images/verified-badge.png';

const ProfileDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // This is accountId from URL
    const [activeTab, setActiveTab] = useState<'personal' | 'horoscope' | 'family' | 'hobbies' | 'preferences'>('personal');
    const [profileActions, setProfileActions] = useState<Set<string>>(new Set());
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [similarMatches, setSimilarMatches] = useState<UserProfile[]>([]);
    const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(-1);
    const [profilePhotos, setProfilePhotos] = useState<{ photo1link?: string; photo2link?: string; photo3link?: string; photo4link?: string; photo5link?: string; prooflink?: string } | null>(null);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [horoscopeData, setHoroscopeData] = useState<{ rasi?: string; natchathiram?: string; birthPlace?: string; birthTime?: string } | null>(null);
    const [familyData, setFamilyData] = useState<{ fatherName?: string; fatherOccupation?: string; fatherStatus?: string; motherName?: string; motherOccupation?: string; motherStatus?: string; siblings?: any[] } | null>(null);
    const [hobbiesData, setHobbiesData] = useState<{ hobbies?: string[]; musicGenres?: string[]; bookTypes?: string[]; movieTypes?: string[]; sports?: string[]; cuisines?: string[]; languages?: string[] } | null>(null);
    const [hasViewedDetails, setHasViewedDetails] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Fetch opposite gender profiles
    const fetchSimilarMatches = async (userId?: number) => {
        const authData = getAuthData();
        if (!authData?.token || !authData?.userId) return;

        try {
            const targetUserId = userId || authData.userId;
            const response = await getOppositeGenderProfiles(authData.token, targetUserId);

            if (response.success && response.data) {
                setSimilarMatches(response.data);
                // Find current profile index in the list
                if (id) {
                    const index = response.data.findIndex((p: UserProfile) => p.accountId === id);
                    setCurrentProfileIndex(index >= 0 ? index : -1);
                }
            }
        } catch (err: any) {
            console.error('Error fetching similar matches:', err);
        }
    };

    // Fetch profile data when component loads
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                setError('Profile ID is required');
                setProfileLoading(false);
                return;
            }

            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            setProfileLoading(true);
            setError(null);

            try {
                console.log('Fetching profile for accountId:', id);
                const response = await getUserProfileByAccountId(authData.token, id);

                if (response.success && response.data) {
                    setProfile(response.data);
                    setTargetUserId(response.data.accountId);
                    // Extract view status flags from API response
                    setHasViewedDetails(response.hasViewedDetails ?? false);
                    setIsOwnProfile(response.isOwnProfile ?? false);
                    // Fetch profile actions after profile is loaded
                    fetchProfileActions(response.data.accountId);
                    // Fetch similar matches using the current user's ID
                    if (authData.userId) {
                        fetchSimilarMatches(authData.userId);
                    }
                    // Fetch profile photos
                    fetchProfilePhotos(response.data.accountId);
                    // Fetch horoscope, family, and hobbies data
                    fetchHoroscopeData(response.data.accountId);
                    fetchFamilyData(response.data.accountId);
                    fetchHobbiesData(response.data.accountId);
                } else {
                    setError('Failed to load profile');
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError(err.message || 'Failed to load profile');
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, [id, navigate]);

    const fetchProfileActions = async (targetId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token) return;
            const token = authData.token;

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTION_BY_TARGET(targetId)), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
                const actions = new Set<string>();
                data.data.forEach((a: any) => {
                    if (['interest', 'shortlist', 'reject'].includes(a.actionType)) {
                        actions.add(a.actionType);
                    }
                });
                setProfileActions(actions);
            }
        } catch (error) {
            console.error('Error fetching profile actions:', error);
        }
    };

    const fetchProfilePhotos = async (accountId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !accountId) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(accountId)), {
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
                    if (data.data.prooflink) {
                        photoLinks.prooflink = data.data.prooflink;
                    }
                    setProfilePhotos(photoLinks);
                }
            }
        } catch (error) {
            console.error('Error fetching profile photos:', error);
        }
    };

    const fetchHoroscopeData = async (accountId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !accountId) {
                return;
            }

            const response = await fetch(getApiUrl(`/api/users/horoscope/${accountId}`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setHoroscopeData({
                        rasi: data.data.rasi || null,
                        natchathiram: data.data.natchathiram || null,
                        birthPlace: data.data.birthPlace || null,
                        birthTime: data.data.birthTime || null,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching horoscope data:', error);
        }
    };

    const fetchFamilyData = async (accountId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !accountId) {
                return;
            }

            const response = await fetch(getApiUrl(`/api/users/family/${accountId}`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setFamilyData({
                        fatherName: data.data.fatherName || null,
                        fatherOccupation: data.data.fatherOccupation || null,
                        fatherStatus: data.data.fatherStatus || null,
                        motherName: data.data.motherName || null,
                        motherOccupation: data.data.motherOccupation || null,
                        motherStatus: data.data.motherStatus || null,
                        siblings: data.data.siblings || [],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching family data:', error);
        }
    };

    const fetchHobbiesData = async (accountId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !accountId) {
                return;
            }

            const response = await fetch(getApiUrl(`/api/users/hobbies/${accountId}`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setHobbiesData({
                        hobbies: data.data.hobbies || [],
                        musicGenres: data.data.musicGenres || [],
                        bookTypes: data.data.bookTypes || [],
                        movieTypes: data.data.movieTypes || [],
                        sports: data.data.sports || [],
                        cuisines: data.data.cuisines || [],
                        languages: data.data.languages || [],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching hobbies data:', error);
        }
    };

    // Get all available photos
    const getAllPhotos = () => {
        const photos: string[] = [];
        if (profilePhotos) {
            for (let i = 1; i <= 5; i++) {
                const photoKey = `photo${i}link` as keyof typeof profilePhotos;
                const photoUrl = profilePhotos[photoKey];
                if (photoUrl && photoUrl.trim() !== '' && photoUrl !== 'null') {
                    photos.push(photoUrl as string);
                }
            }
        }
        return photos;
    };

    const handleImageClick = (index: number) => {
        const allPhotos = getAllPhotos();
        if (allPhotos.length > 0) {
            setSelectedImageIndex(index);
            setShowImageGallery(true);
        }
    };

    const handleActionClick = async (actionType: 'interest' | 'shortlist' | 'reject') => {
        if (!targetUserId) {
            console.error('Target user ID not available');
            return;
        }

        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }
        const token = authData.token;

        setLoading(true);
        try {
            const isActionActive = profileActions.has(actionType);
            const method = isActionActive ? 'DELETE' : 'POST';

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTIONS), {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    actionType,
                    targetUserId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setProfileActions(prev => {
                    const newSet = new Set(prev);
                    if (isActionActive) {
                        newSet.delete(actionType);
                    } else {
                        newSet.add(actionType);
                    }
                    return newSet;
                });
            } else {
                console.error(`Error ${isActionActive ? 'removing' : 'creating'} action:`, data.message);
            }
        } catch (error) {
            console.error('Error handling profile action:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate age from dateOfBirth
    const calculateAge = (dateOfBirth?: string) => {
        if (!dateOfBirth) return null;
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            years--;
            months += 12;
        }

        return { years, months };
    };

    // Format location - this will be called after profile is loaded
    const formatLocation = (profileData: UserProfile | null) => {
        if (!profileData?.basicDetail) return 'Not specified';
        // Hide location if details not viewed and not own profile
        if (!hasViewedDetails && !isOwnProfile) {
            return '';
        }
        const parts = [
            profileData.basicDetail.city,
            profileData.basicDetail.state,
            profileData.basicDetail.country
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Not specified';
    };

    // Handle view details button click
    const handleViewDetails = async () => {
        if (!id || isOwnProfile || hasViewedDetails) return;

        setShowConfirmDialog(true);
    };

    // Confirm view details
    const confirmViewDetails = async () => {
        setShowConfirmDialog(false);
        if (!id) return;

        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        setIsViewingDetails(true);
        try {
            const response = await viewProfileDetails(authData.token, id);
            
            if (response.success && response.data) {
                setProfile(response.data);
                setHasViewedDetails(true);
                // Reload additional details with full information
                fetchHoroscopeData(id);
                fetchFamilyData(id);
                fetchHobbiesData(id);
            } else {
                // Check for NO_TOKENS error
                if (response.code === 'NO_TOKENS') {
                    setShowUpgradeDialog(true);
                } else {
                    alert(response.message || 'Failed to view profile details');
                }
            }
        } catch (err: any) {
            console.error('Error viewing profile details:', err);
            if (err.message?.includes('token') || err.message?.includes('NO_TOKENS')) {
                setShowUpgradeDialog(true);
            } else {
                alert(err.message || 'Failed to view profile details');
            }
        } finally {
            setIsViewingDetails(false);
        }
    };

    // Navigate to previous profile
    const navigateToPreviousProfile = () => {
        if (currentProfileIndex > 0 && similarMatches.length > 0) {
            const previousProfile = similarMatches[currentProfileIndex - 1];
            navigate(`/profile/${previousProfile.accountId}`);
        }
    };

    // Navigate to next profile
    const navigateToNextProfile = () => {
        if (currentProfileIndex >= 0 && currentProfileIndex < similarMatches.length - 1) {
            const nextProfile = similarMatches[currentProfileIndex + 1];
            navigate(`/profile/${nextProfile.accountId}`);
        }
    };


    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-lg text-gray-600">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-red-600 mb-5 text-lg">
                            {error || 'Profile not found'}
                        </div>
                        <button onClick={() => navigate('/home')} className="py-2.5 px-5 bg-[#ff6b35] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]">
                            Go Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Hide age if details not viewed
    const age = (hasViewedDetails || isOwnProfile) ? calculateAge(profile.basicDetail?.dateOfBirth) : null;
    const height = profile.basicDetail?.height || 'Not specified';
    const maritalStatus = profile.basicDetail?.maritalStatus || 'Not specified';
    const education = profile.basicDetail?.education || 'Not specified';
    const occupation = profile.basicDetail?.occupation || 'Not specified';
    const religion = profile.basicDetail?.religion || 'Not specified';
    const caste = profile.basicDetail?.caste || 'Not specified';
    const subcaste = profile.basicDetail?.subcaste || 'Not specified';
    const location = formatLocation(profile);

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Header />

            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100/50">
                    <button
                        className="h-12 px-8 bg-gray-50 text-gray-700 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:bg-white hover:shadow-md hover:text-[#8b10c9]"
                        onClick={() => navigate('/home')}
                    >
                        <span>←</span> All Matches
                    </button>
                    <div className="flex gap-4">
                        <button
                            className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-600 font-bold transition-all hover:shadow-lg hover:border-[#a413ed40] hover:text-[#a413ed] disabled:opacity-30"
                            onClick={navigateToPreviousProfile}
                            disabled={currentProfileIndex <= 0 || similarMatches.length === 0}
                        >
                            ←
                        </button>
                        <button
                            className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-600 font-bold transition-all hover:shadow-lg hover:border-[#8b10c940] hover:text-[#8b10c9] disabled:opacity-30"
                            onClick={navigateToNextProfile}
                            disabled={currentProfileIndex >= similarMatches.length - 1 || similarMatches.length === 0}
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="col-span-8 lg:col-span-12">
                        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
                            {/* Profile Header Block */}
                            <div className="p-6 border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
                                <div className="flex gap-6 items-start md:flex-col">
                                    <div className="relative shrink-0">
                                        <div
                                            className={`w-[160px] h-[160px] rounded-[32px] bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-white text-5xl font-black overflow-hidden shadow-xl shadow-[#a413ed20] relative ${getAllPhotos().length > 0 ? 'cursor-pointer group' : ''}`}
                                            onClick={() => getAllPhotos().length > 0 && handleImageClick(0)}
                                        >
                                            {profilePhotos?.photo1link && profilePhotos.photo1link.trim() !== '' && profilePhotos.photo1link !== 'null' ? (
                                                <img
                                                    src={profilePhotos.photo1link}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span>{profile.name?.charAt(0) || '👤'}</span>
                                            )}
                                            {getAllPhotos().length > 0 && (
                                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-white/20">
                                                    {getAllPhotos().length} Photos
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-2">
                                        <div className="flex items-center flex-wrap gap-3 mb-2">
                                            <h1 className="text-2xl font-black text-[#1a1a1a] m-0">{profile.name || 'User'}</h1>
                                            {profile.profileveriffied === 1 && (
                                                <div className="flex items-center gap-1.5 bg-[#E0F2FE] px-3 py-1 rounded-full border border-[#BAE6FD]">
                                                    <img src={verifiedBadge} alt="Verified" className="w-3 h-3" />
                                                    <span className="text-[9px] font-black text-[#0284C7] uppercase tracking-wider">Verified</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[#8b10c9] font-bold text-sm mb-4 flex items-center gap-1">
                                            <span className="opacity-50 text-gray-400">#</span>{profile.userCode || 'N/A'}
                                        </p>

                                        <div className="flex items-center gap-2 text-gray-600 font-bold text-xs bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                            <span>{maritalStatus}</span>
                                            {(hasViewedDetails || isOwnProfile) && age && (
                                                <>
                                                    <span className="opacity-20 text-gray-300">|</span>
                                                    <span>{age.years} Yrs</span>
                                                </>
                                            )}
                                            <span className="opacity-20 text-gray-300">|</span>
                                            <span>{height}</span>
                                            <span className="opacity-20 text-gray-300">|</span>
                                            <span className="text-[#8b10c9]">{caste}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* View Details Button - Only show if not own profile and details not viewed */}
                            {!isOwnProfile && !hasViewedDetails && (
                                <div className="p-4 bg-gradient-to-r from-[#a413ed10] to-[#8b10c910] border-b border-gray-100/50">
                                    <button
                                        className="w-full h-12 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                                        onClick={handleViewDetails}
                                        disabled={isViewingDetails}
                                    >
                                        {isViewingDetails ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>👁</span>
                                                <span>View Details</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Action Buttons Row */}
                            {!isOwnProfile && (
                                <div className="p-4 bg-gray-50/20 flex gap-3 flex-wrap border-b border-gray-100/50">
                                    <button
                                        className={`flex-1 min-w-[140px] h-11 flex items-center justify-center gap-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg disabled:opacity-50 ${profileActions.has('interest') ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white shadow-[#a413ed30]' : 'bg-white text-gray-600 hover:shadow-xl hover:-translate-y-0.5 border border-gray-100'}`}
                                        onClick={() => handleActionClick('interest')}
                                        disabled={loading}
                                    >
                                        <span className="text-lg">{profileActions.has('interest') ? '❤' : '♡'}</span>
                                        {profileActions.has('interest') ? 'Sent' : 'Interest'}
                                    </button>
                                    <button
                                        className={`flex-1 min-w-[140px] h-11 flex items-center justify-center gap-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg disabled:opacity-50 ${profileActions.has('shortlist') ? 'bg-[#1a1a1a] text-white shadow-gray-400/30' : 'bg-white text-gray-600 hover:shadow-xl hover:-translate-y-0.5 border border-gray-100'}`}
                                        onClick={() => handleActionClick('shortlist')}
                                        disabled={loading}
                                    >
                                        <span className="text-lg">★</span>
                                        {profileActions.has('shortlist') ? 'Starred' : 'Shortlist'}
                                    </button>
                                    <button
                                        className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 hover:shadow-lg border border-gray-100 group"
                                        onClick={() => handleActionClick('reject')}
                                        disabled={loading}
                                    >
                                        <span className="group-hover:rotate-90 transition-transform">✕</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tabs Navigation */}
                        <div className="px-6 border-b border-gray-100 bg-white sticky top-0 z-20 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-8 min-w-max">
                                {[
                                    { id: 'personal', label: 'Personal' },
                                    { id: 'horoscope', label: 'Horoscope' },
                                    { id: 'family', label: 'Family' },
                                    { id: 'hobbies', label: 'Interests' },
                                    { id: 'preferences', label: 'Compatibility' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#a413ed]' : 'text-gray-400 hover:text-gray-600'}`}
                                        onClick={() => setActiveTab(tab.id as any)}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] rounded-t-full"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Details Body */}
                        <div className="p-6 min-h-[300px]">
                            {activeTab === 'personal' && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg shadow-sm">👤</div>
                                        <h3 className="text-lg font-black text-[#1a1a1a]">Personal Details</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                        {(hasViewedDetails || isOwnProfile) && age && (
                                            <DetailRow label="Age" value={`${age.years} Yrs ${age.months > 0 ? `& ${age.months} Mos` : ''}`} />
                                        )}
                                        <DetailRow label="Height" value={height} />
                                        <DetailRow label="Status" value={maritalStatus} />
                                        <DetailRow label="Physical" value={profile.basicDetail?.physicalStatus || 'Normal'} />
                                        {(hasViewedDetails || isOwnProfile) && location && (
                                            <DetailRow label="Location" value={location} />
                                        )}
                                        <DetailRow label="Religion" value={religion} />
                                        <DetailRow label="Caste" value={caste} />
                                        <DetailRow label="Subcaste" value={subcaste} />
                                        <DetailRow label="Education" value={education} />
                                        <DetailRow label="Occupation" value={occupation} />
                                        <DetailRow label="Income" value={profile.basicDetail?.annualIncome ? `${profile.basicDetail.currency || '₹'} ${profile.basicDetail.annualIncome}` : 'Privacy Protected'} />
                                    </div>
                                    {!hasViewedDetails && !isOwnProfile && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <p className="text-sm text-yellow-800 font-bold">
                                                Contact information and address details are hidden. Click "View Details" above to unlock.
                                            </p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {activeTab === 'horoscope' && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {horoscopeData && (horoscopeData.rasi || horoscopeData.natchathiram) ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg shadow-sm">🔮</div>
                                                <h3 className="text-lg font-black text-[#1a1a1a]">Horoscope</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 bg-[#fdf2f8]/30 p-6 rounded-2xl border border-[#fce7f3]">
                                                <DetailRow label="Rasi" value={horoscopeData.rasi} />
                                                <DetailRow label="Star" value={horoscopeData.natchathiram} />
                                                <DetailRow label="Birth Place" value={horoscopeData.birthPlace} />
                                                <DetailRow label="Birth Time" value={horoscopeData.birthTime} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 font-bold text-sm">No horoscope details available.</div>
                                    )}
                                </section>
                            )}

                            {activeTab === 'family' && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {(familyData && (familyData.fatherName || familyData.motherName)) ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg shadow-sm">👨‍👩‍👧‍👦</div>
                                                <h3 className="text-lg font-black text-[#1a1a1a]">Family Background</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <DetailRow label="Father" value={familyData.fatherName} />
                                                <DetailRow label="Father Occupation" value={familyData.fatherOccupation} />
                                                <DetailRow label="Mother" value={familyData.motherName} />
                                                <DetailRow label="Mother Occupation" value={familyData.motherOccupation} />
                                                {familyData.siblings && familyData.siblings.length > 0 && (
                                                    <div className="col-span-2 md:col-span-3 mt-2">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Siblings</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {familyData.siblings.map((sibling: any, idx) => (
                                                                <span key={idx} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-700 border border-gray-100">
                                                                    {typeof sibling === 'string' ? sibling : `${sibling.name} (${sibling.relation})`}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 font-bold text-sm">No family details available.</div>
                                    )}
                                </section>
                            )}

                            {activeTab === 'hobbies' && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {hobbiesData ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg shadow-sm">🎨</div>
                                                <h3 className="text-lg font-black text-[#1a1a1a]">Interests & Hobbies</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                                {hobbiesData?.hobbies && hobbiesData.hobbies.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interests</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.hobbies.map((hobby, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{hobby}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {hobbiesData?.musicGenres && hobbiesData.musicGenres.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Music</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.musicGenres.map((music, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{music}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {hobbiesData?.bookTypes && hobbiesData.bookTypes.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reading</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.bookTypes.map((book, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{book}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {hobbiesData?.movieTypes && hobbiesData.movieTypes.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Movies</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.movieTypes.map((movie, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{movie}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {hobbiesData?.sports && hobbiesData.sports.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sports</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.sports.map((sport, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{sport}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {hobbiesData?.cuisines && hobbiesData.cuisines.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Food & Cuisines</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {hobbiesData.cuisines.map((cuisine, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">{cuisine}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 font-bold text-sm">No interests details available.</div>
                                    )}
                                </section>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-4xl mb-4">✨</div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2">Compatibility Check</h3>
                                    <p className="text-gray-400 font-bold max-w-sm mx-auto text-sm">Compare your lifestyle and values with {profile.name} to see if you are a perfect match.</p>
                                    <button className="mt-6 h-10 px-8 bg-[#1a1a1a] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-200">View Compatibility</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Similar Profiles */}
                <div className="col-span-4 lg:hidden">
                    <div className="sticky top-8">
                        <div className="bg-[#1a1a1a] rounded-[40px] p-8 text-white mb-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-150"></div>
                            <h4 className="text-xl font-black mb-2 relative z-10">Premium Match</h4>
                            <p className="text-gray-400 text-sm mb-6 font-bold relative z-10 font-medium">Unlock contact details and unlimited messaging for this profile.</p>
                            <button className="w-full h-12 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-xl hover:-translate-y-1">Upgrade Now</button>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h4 className="text-xl font-black text-[#1a1a1a] mb-6">Similar Profiles</h4>
                            <div className="space-y-6">
                                {similarMatches.slice(0, 3).map((match: any) => (
                                    <div
                                        key={match.accountId}
                                        className="flex gap-4 items-center group cursor-pointer"
                                        onClick={() => navigate(`/profile/${match.accountId}`)}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-[#a413ed10] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">{match.name?.charAt(0) || '👤'}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-[#1a1a1a] truncate group-hover:text-[#a413ed] transition-colors">{match.name}</div>
                                            <div className="text-xs text-gray-400 font-bold">{match.age || '?'} Yrs • {match.basicDetail?.city || 'Not Specified'}</div>
                                        </div>
                                        <div className="text-gray-300 group-hover:text-[#a413ed] transition-colors">›</div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#8b10c9] transition-colors border-t border-gray-50 pt-6" onClick={() => navigate('/home')}>View All Recommendations</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Gallery Modal */}
            {showImageGallery && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-10 animate-in fade-in duration-300">
                    <button className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-all z-20" onClick={() => setShowImageGallery(false)}>✕</button>

                    <div className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center">
                        <button
                            className="absolute left-0 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white text-3xl hover:bg-white/15 transition-all disabled:opacity-0"
                            onClick={() => setSelectedImageIndex(prev => Math.max(0, prev - 1))}
                            disabled={selectedImageIndex === 0}
                        >‹</button>

                        <div className="w-full h-full flex items-center justify-center p-12">
                            <img
                                src={getAllPhotos()[selectedImageIndex]}
                                alt="Gallery"
                                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
                            />
                        </div>

                        <button
                            className="absolute right-0 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white text-3xl hover:bg-white/15 transition-all disabled:opacity-0"
                            onClick={() => setSelectedImageIndex(prev => Math.min(getAllPhotos().length - 1, prev + 1))}
                            disabled={selectedImageIndex === getAllPhotos().length - 1}
                        >›</button>

                        <div className="absolute bottom-4 flex gap-3">
                            {getAllPhotos().map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === selectedImageIndex ? 'w-8 bg-[#a413ed]' : 'bg-white/20'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black text-[#1a1a1a] mb-4">Confirm View Details</h3>
                        <p className="text-gray-600 mb-6 font-medium">
                            Did you conform view this account?
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200"
                                onClick={() => setShowConfirmDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 h-11 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg"
                                onClick={confirmViewDetails}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Dialog */}
            {showUpgradeDialog && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black text-[#1a1a1a] mb-4">Upgrade Required</h3>
                        <p className="text-gray-600 mb-6 font-medium">
                            You have used all your profile view tokens. Please upgrade your subscription to view more profiles.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200"
                                onClick={() => setShowUpgradeDialog(false)}
                            >
                                Close
                            </button>
                            <button
                                className="flex-1 h-11 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg"
                                onClick={() => {
                                    setShowUpgradeDialog(false);
                                    navigate('/subscription');
                                }}
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, isFullWidth = false }: { label: string; value: any; isFullWidth?: boolean }) => {
    if (!value && value !== 0) return null;
    return (
        <div className={`${isFullWidth ? 'col-span-2' : ''} group`}>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block group-hover:text-[#a413ed] transition-colors">{label}</span>
            <div className="text-base font-bold text-gray-700 leading-snug">{value}</div>
        </div>
    );
};

export default ProfileDetail;



