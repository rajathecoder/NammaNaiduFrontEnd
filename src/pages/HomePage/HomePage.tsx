import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Loading from '../../components/common/Loading';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getOppositeGenderProfiles } from '../../services/api/user.api';
import type { UserProfile } from '../../services/api/user.api';
import { getAuthData, clearAuthData } from '../../utils/auth';
import verifiedBadge from '../../assets/images/verified-badge.png';
import HoroscopeModal from './components/HoroscopeModal';
import FamilyDetailsModal from './components/FamilyDetailsModal';
import PhotoUploadModal from './components/PhotoUploadModal';
import HobbiesModal from './components/HobbiesModal/HobbiesModal';
import { useImageUtils } from './hooks/useImageUtils';
import MatchCard from './components/MatchCard';
import type { FamilyData, Sibling } from './types';


const HomePage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [oppositeGenderProfiles, setOppositeGenderProfiles] = useState<UserProfile[]>([]);
    const [profilesLoading, setProfilesLoading] = useState(false);
    const [profilePhotos, setProfilePhotos] = useState<Record<string, { photo1link?: string }>>({});
    const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());
    const [shortlistedProfiles, setShortlistedProfiles] = useState<Set<string>>(new Set());
    const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState({
        rasi: '',
        natchathiram: '',
        birthPlace: '',
        birthTime: '',
    });
    const [showHobbiesModal, setShowHobbiesModal] = useState(false);
    const [activeHobbyTab, setActiveHobbyTab] = useState<'hobbies' | 'music' | 'reading' | 'movies' | 'sports' | 'food' | 'languages'>('hobbies');
    const [selectedHobbies, setSelectedHobbies] = useState<Set<string>>(new Set());
    const [selectedMusicGenres, setSelectedMusicGenres] = useState<Set<string>>(new Set());
    const [selectedBookTypes, setSelectedBookTypes] = useState<Set<string>>(new Set());
    const [selectedMovieTypes, setSelectedMovieTypes] = useState<Set<string>>(new Set());
    const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
    const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
    const [showMoreHobbies, setShowMoreHobbies] = useState(false);
    const [showMoreMusic, setShowMoreMusic] = useState(false);
    const [showMoreBooks, setShowMoreBooks] = useState(false);
    const [showMoreMovies, setShowMoreMovies] = useState(false);
    const [showMoreSports, setShowMoreSports] = useState(false);
    const [showMoreCuisines, setShowMoreCuisines] = useState(false);
    const [showMoreLanguages, setShowMoreLanguages] = useState(false);
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [familyData, setFamilyData] = useState<FamilyData>({
        fatherName: '',
        fatherOccupation: '',
        fatherStatus: 'alive',
        motherName: '',
        motherOccupation: '',
        motherStatus: 'alive',
        siblings: [],
    });
    const [newSibling, setNewSibling] = useState<Sibling>({ name: '', gender: '' });
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [personPhotos, setPersonPhotos] = useState<Array<{ photoplacement: number; photobase64: string; preview: string }>>([]);
    const [proofPhoto, setProofPhoto] = useState<{ base64: string; preview: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [userPhotos, setUserPhotos] = useState<{ photo1link?: string; photo2link?: string; photo3link?: string; photo4link?: string; photo5link?: string; prooflink?: string } | null>(null);
    const [hobbiesData, setHobbiesData] = useState<{
        hobbies: string[];
        musicGenres: string[];
        bookTypes: string[];
        movieTypes: string[];
        sports: string[];
        cuisines: string[];
        languages: string[];
    } | null>(null);

    // Use image utilities hook
    const { fileToBase64 } = useImageUtils();

    const verifyAuth = async () => {
        try {
            const authData = getAuthData();

            // If no auth data, redirect to login
            if (!authData || !authData.token) {
                console.log('No auth data, redirecting to login');
                navigate('/login');
                return;
            }

            const token = authData.token;

            // Fetch profile to check if basicDetails exists
            try {
                const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.data) {
                    // Check if basicDetails exists
                    if (!data.data.basicDetail) {
                        // No basicDetails, redirect to personal-religious-details screen
                        console.log('No basicDetail found, redirecting to personal-religious-details');
                        navigate('/personal-religious-details');
                        return;
                    }

                    // Update userInfo with latest data
                    setUserInfo(data.data);
                    localStorage.setItem('userInfo', JSON.stringify(data.data));
                    console.log('User info loaded successfully');
                } else {
                    // If API fails, use stored userInfo but still check
                    console.log('API response not successful, using stored userInfo');
                    if (authData?.userInfo) {
                        setUserInfo(authData.userInfo);
                    }
                }
            } catch (apiError) {
                console.error('Error fetching profile:', apiError);
                // Fallback to stored userInfo
                if (authData?.userInfo) {
                    setUserInfo(authData.userInfo);
                    console.log('Using stored userInfo as fallback');
                } else {
                    console.error('No stored userInfo available');
                    navigate('/login');
                    return;
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Auth verification error:', error);
            clearAuthData();
            navigate('/login');
        }
    };

    useEffect(() => {
        // Verify authentication on mount
        verifyAuth();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dropdown = document.querySelector('.profile-dropdown-menu');
            const avatar = document.querySelector('.user-avatar-small');

            if (dropdown && avatar && !avatar.contains(target) && !dropdown.contains(target)) {
                dropdown.classList.remove('show');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Fetch horoscope details
    const fetchHoroscopeDetails = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !userInfo?.accountId) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOROSCOPE), {
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
                        rasi: data.data.rasi || '',
                        natchathiram: data.data.natchathiram || '',
                        birthPlace: data.data.birthPlace || '',
                        birthTime: data.data.birthTime || '',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching horoscope details:', error);
        }
    };

    // Fetch family details
    const fetchFamilyDetails = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !userInfo?.accountId) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.FAMILY), {
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
                        fatherName: data.data.fatherName || '',
                        fatherOccupation: data.data.fatherOccupation || '',
                        fatherStatus: data.data.fatherStatus || 'alive',
                        motherName: data.data.motherName || '',
                        motherOccupation: data.data.motherOccupation || '',
                        motherStatus: data.data.motherStatus || 'alive',
                        siblings: data.data.siblings || [],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching family details:', error);
        }
    };

    // Fetch hobbies data
    const fetchHobbiesData = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !userInfo?.accountId) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOBBIES), {
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

    // Calculate profile completeness score
    const calculateProfileCompleteness = (): number => {
        let score = 0;

        // 20% for account creation (always true if userInfo exists)
        if (userInfo) {
            score += 20;
        }

        // 40% if horoscope data is entered
        if (horoscopeData.rasi || horoscopeData.natchathiram || horoscopeData.birthPlace || horoscopeData.birthTime) {
            score += 20; // Additional 20% (total 40%)
        }

        // 60% if hobbies are entered
        if (hobbiesData) {
            const totalHobbies = hobbiesData.hobbies.length +
                hobbiesData.musicGenres.length +
                hobbiesData.bookTypes.length +
                hobbiesData.movieTypes.length +
                hobbiesData.sports.length +
                hobbiesData.cuisines.length +
                hobbiesData.languages.length;
            if (totalHobbies > 0) {
                score += 20; // Additional 20% (total 60%)
            }
        }

        // 80% if photos/documents are added
        if (userPhotos) {
            const hasPhotos = userPhotos.photo1link || userPhotos.photo2link || userPhotos.photo3link ||
                userPhotos.photo4link || userPhotos.photo5link;
            if (hasPhotos) {
                score += 20; // Additional 20% (total 80%)
            }
        }

        // 100% if family data is entered
        if (familyData.fatherName || familyData.motherName ||
            (familyData.siblings && familyData.siblings.length > 0)) {
            score += 20; // Additional 20% (total 100%)
        }

        return Math.min(score, 100);
    };

    // Check if components are completed
    const isHoroscopeCompleted = (): boolean => {
        return !!(horoscopeData.rasi || horoscopeData.natchathiram || horoscopeData.birthPlace || horoscopeData.birthTime);
    };

    const isHobbiesCompleted = (): boolean => {
        if (!hobbiesData) return false;
        const totalHobbies = hobbiesData.hobbies.length +
            hobbiesData.musicGenres.length +
            hobbiesData.bookTypes.length +
            hobbiesData.movieTypes.length +
            hobbiesData.sports.length +
            hobbiesData.cuisines.length +
            hobbiesData.languages.length;
        return totalHobbies > 0;
    };

    const isPhotosCompleted = (): boolean => {
        if (!userPhotos) return false;
        return !!(userPhotos.photo1link || userPhotos.photo2link || userPhotos.photo3link ||
            userPhotos.photo4link || userPhotos.photo5link);
    };

    const isFamilyCompleted = (): boolean => {
        return !!(familyData.fatherName || familyData.motherName ||
            (familyData.siblings && familyData.siblings.length > 0));
    };

    // Fetch opposite gender profiles when user info is available
    useEffect(() => {
        const fetchOppositeGenderProfiles = async () => {
            const authData = getAuthData();
            if (!authData?.token || !userInfo || loading) {
                console.log('Skipping fetch - conditions:', {
                    hasToken: !!authData?.token,
                    hasUserInfo: !!userInfo,
                    loading
                });
                return;
            }

            console.log('Fetching opposite gender profiles...');
            setProfilesLoading(true);
            try {
                const response = await getOppositeGenderProfiles(authData.token);
                console.log('API Response:', {
                    success: response.success,
                    count: response.count,
                    dataLength: response.data?.length
                });

                if (response.success && response.data) {
                    setOppositeGenderProfiles(response.data);
                    console.log(`Successfully loaded ${response.data.length} profiles`);

                    // Fetch photos for each profile
                    const photosMap: Record<string, { photo1link?: string }> = {};
                    await Promise.all(
                        response.data.map(async (profile: UserProfile) => {
                            try {
                                const photosResponse = await fetch(
                                    getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(profile.accountId)),
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${authData.token}`
                                        }
                                    }
                                );

                                if (photosResponse.ok) {
                                    const photosData = await photosResponse.json();
                                    if (photosData.success && photosData.data?.personphoto) {
                                        const photos = photosData.data.personphoto;
                                        if (Array.isArray(photos) && photos.length > 0) {
                                            // Find photo1 - API returns objects with photoplacement and photo1link
                                            const photo1 = photos.find((p: any) => p.photoplacement === 1);
                                            if (photo1) {
                                                // The link is stored as photo1link when photoplacement is 1
                                                const photo1link = photo1.photo1link;
                                                if (photo1link && photo1link.trim() !== '' && photo1link !== 'null') {
                                                    photosMap[profile.accountId] = { photo1link: photo1link };
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error(`Error fetching photos for ${profile.accountId}:`, error);
                            }
                        })
                    );
                    setProfilePhotos(photosMap);

                    // Fetch user's sent interests to determine button state
                    try {
                        const interestsResponse = await fetch(
                            `${getApiUrl(API_ENDPOINTS.USERS.MY_PROFILE_ACTIONS)}?actionType=interest`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authData.token}`
                                }
                            }
                        );

                        if (interestsResponse.ok) {
                            const interestsData = await interestsResponse.json();
                            if (interestsData.success && interestsData.data) {
                                const sentIds = new Set<string>();
                                interestsData.data.forEach((action: any) => {
                                    sentIds.add(action.targetUserId || action.targetUser?.accountId);
                                });
                                setSentInterests(sentIds);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching sent interests:', error);
                    }
                } else {
                    console.warn('API returned success=false or no data:', response);
                }
            } catch (error: any) {
                console.error('Error fetching opposite gender profiles:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                // Set empty array on error so UI doesn't break
                setOppositeGenderProfiles([]);
            } finally {
                setProfilesLoading(false);
            }
        };

        if (userInfo && !loading) {
            fetchOppositeGenderProfiles();
            fetchHoroscopeDetails();
            fetchFamilyDetails();
            fetchHobbiesData();

            // Fetch user photos
            const fetchUserPhotos = async () => {
                try {
                    const authData = getAuthData();
                    if (!authData?.token || !userInfo?.accountId) {
                        return;
                    }

                    const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(userInfo.accountId)), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.data) {
                            // Convert response to photo links object
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
    }, [userInfo, loading]);

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

    const handleAddSibling = () => {
        if (newSibling.name.trim()) {
            setFamilyData(prev => ({
                ...prev,
                siblings: [...prev.siblings, { ...newSibling }]
            }));
            setNewSibling({ name: '', gender: '' });
        }
    };

    const handleRemoveSibling = (index: number) => {
        setFamilyData(prev => ({
            ...prev,
            siblings: prev.siblings.filter((_, i) => i !== index)
        }));
    };

    const handleFamilySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                alert('Please login to continue');
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.FAMILY), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(familyData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Family details saved successfully!');
                setShowFamilyModal(false);
                // Refresh family data
                fetchFamilyDetails();
            } else {
                alert(data.message || 'Failed to save family details. Please try again.');
            }
        } catch (error) {
            console.error('Error saving family details:', error);
            alert('Failed to save family details. Please try again.');
        }
    };

    const handleHoroscopeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                alert('Please login to continue');
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOROSCOPE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    rasi: horoscopeData.rasi,
                    natchathiram: horoscopeData.natchathiram,
                    birthPlace: horoscopeData.birthPlace,
                    birthTime: horoscopeData.birthTime,
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Horoscope details saved successfully!');
                setShowHoroscopeModal(false);
                // Refresh horoscope data
                fetchHoroscopeDetails();
            } else {
                alert(data.message || 'Failed to save horoscope details. Please try again.');
            }
        } catch (error) {
            console.error('Error saving horoscope:', error);
            alert('Failed to save horoscope details. Please try again.');
        }
    };

    const handleConnect = useCallback(async (accountId: string) => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTIONS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    actionType: 'interest',
                    targetUserId: accountId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Interest sent successfully!');
                // Add to sent interests set to update UI
                setSentInterests(prev => new Set(prev).add(accountId));
            } else {
                alert(data.message || 'Failed to send interest');
            }
        } catch (error) {
            console.error('Error sending interest:', error);
            alert('An error occurred while sending interest');
        }
    }, [navigate]);

    const handleShortlist = useCallback(async (accountId: string, isShortlisted: boolean) => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        const method = isShortlisted ? 'DELETE' : 'POST';

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTIONS), {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    actionType: 'shortlist',
                    targetUserId: accountId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update UI immediately
                setShortlistedProfiles(prev => {
                    const newSet = new Set(prev);
                    if (isShortlisted) {
                        newSet.delete(accountId);
                    } else {
                        newSet.add(accountId);
                    }
                    return newSet;
                });
            }
        } catch (error) {
            console.error('Error updating shortlist status:', error);
        }
    }, [navigate]);

    const handleCardPrimaryAction = useCallback((profile: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (sentInterests.has(profile.accountId)) {
            navigate(`/profile/${profile.accountId}`);
        } else {
            handleConnect(profile.accountId);
        }
    }, [sentInterests, navigate, handleConnect]);

    const handleCardFavorite = useCallback((profile: any, e: React.MouseEvent) => {
        e.stopPropagation();
        handleShortlist(profile.accountId, shortlistedProfiles.has(profile.accountId));
    }, [handleShortlist, shortlistedProfiles]);

    const fetchShortlistedProfiles = async () => {
        const authData = getAuthData();
        if (!authData?.token) return;

        try {
            const response = await fetch(
                `${getApiUrl(API_ENDPOINTS.USERS.MY_PROFILE_ACTIONS)}?actionType=shortlist`,
                {
                    headers: {
                        'Authorization': `Bearer ${authData.token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const shortlistedIds = new Set<string>();
                    data.data.forEach((action: any) => {
                        shortlistedIds.add(action.targetUserId || action.targetUser?.accountId);
                    });
                    setShortlistedProfiles(shortlistedIds);
                }
            }
        } catch (error) {
            console.error('Error fetching shortlisted profiles:', error);
        }
    };

    // Load shortlisted profiles on mount
    useEffect(() => {
        fetchShortlistedProfiles();
    }, []);

    const toggleSelection = (item: string, category: 'hobbies' | 'music' | 'books' | 'movies' | 'sports' | 'cuisines' | 'languages') => {
        switch (category) {
            case 'hobbies':
                setSelectedHobbies(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'music':
                setSelectedMusicGenres(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'books':
                setSelectedBookTypes(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'movies':
                setSelectedMovieTypes(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'sports':
                setSelectedSports(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'cuisines':
                setSelectedCuisines(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
            case 'languages':
                setSelectedLanguages(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item)) {
                        newSet.delete(item);
                    } else {
                        newSet.add(item);
                    }
                    return newSet;
                });
                break;
        }
    };

    const handleHobbiesSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                alert('Please login to continue');
                return;
            }

            // Collect all selected items from all categories
            const allSelections = {
                hobbies: Array.from(selectedHobbies),
                musicGenres: Array.from(selectedMusicGenres),
                bookTypes: Array.from(selectedBookTypes),
                movieTypes: Array.from(selectedMovieTypes),
                sports: Array.from(selectedSports),
                cuisines: Array.from(selectedCuisines),
                languages: Array.from(selectedLanguages),
            };

            const totalSelections = allSelections.hobbies.length + allSelections.musicGenres.length +
                allSelections.bookTypes.length + allSelections.movieTypes.length +
                allSelections.sports.length + allSelections.cuisines.length +
                allSelections.languages.length;

            if (totalSelections === 0) {
                alert('Please select at least one interest');
                return;
            }

            // Save hobbies/interests via API
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOBBIES), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(allSelections)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Interests saved successfully!');
                setShowHobbiesModal(false);
                // Refresh hobbies data
                fetchHobbiesData();
            } else {
                alert(data.message || 'Failed to save interests. Please try again.');
                return;
            }
            // Reset selections
            setSelectedHobbies(new Set());
            setSelectedMusicGenres(new Set());
            setSelectedBookTypes(new Set());
            setSelectedMovieTypes(new Set());
            setSelectedSports(new Set());
            setSelectedCuisines(new Set());
            setSelectedLanguages(new Set());
            setActiveHobbyTab('hobbies');
            // Reset show more states
            setShowMoreHobbies(false);
            setShowMoreMusic(false);
            setShowMoreBooks(false);
            setShowMoreMovies(false);
            setShowMoreSports(false);
            setShowMoreCuisines(false);
            setShowMoreLanguages(false);
        } catch (error) {
            console.error('Error saving hobbies:', error);
            alert('Failed to save interests. Please try again.');
        }
    };


    // Handle proof document upload
    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size is too large. Please upload an image smaller than 10MB.');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setProofPhoto({ base64, preview: base64 });
        } catch (error) {
            console.error('Error converting proof file:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    // Handle profile photo upload (auto-assign placement)
    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size is too large. Please upload an image smaller than 10MB.');
            return;
        }

        // Check if max photos reached
        if (personPhotos.length >= 5) {
            alert('Maximum 5 photos allowed');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            // Auto-assign next available placement (1-5)
            const nextPlacement = personPhotos.length + 1;
            const newPhoto = { photoplacement: nextPlacement, photobase64: base64, preview: base64 };
            setPersonPhotos([...personPhotos, newPhoto]);

            // Reset input to allow same file to be selected again
            e.target.value = '';
        } catch (error) {
            console.error('Error converting photo file:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    // Remove profile photo
    const handleRemovePhoto = (placement: number) => {
        setPersonPhotos(personPhotos.filter(p => p.photoplacement !== placement));
    };

    // Handle photo upload submit
    const handlePhotoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!proofPhoto) {
            alert('Please upload Aadhar card');
            return;
        }

        if (personPhotos.length === 0) {
            alert('Please upload at least one profile photo');
            return;
        }

        if (personPhotos.length > 5) {
            alert('Maximum 5 photos allowed');
            return;
        }

        try {
            setUploading(true);
            const authData = getAuthData();
            if (!authData?.token || !userInfo?.accountId) {
                alert('Please login to continue');
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPLOAD_PHOTOS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    personid: userInfo.accountId,
                    personphoto: personPhotos.map(p => ({
                        photoplacement: p.photoplacement,
                        photobase64: p.photobase64,
                        photopath: '' // Not used in backend
                    })),
                    proofbase64: proofPhoto.base64,
                    proofpath: '' // Not used in backend
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Photos uploaded successfully!');
                setShowPhotoModal(false);
                setPersonPhotos([]);
                setProofPhoto(null);
                // Refresh user photos
                const authData = getAuthData();
                if (authData?.token && userInfo?.accountId) {
                    const refreshResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(userInfo.accountId)), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    });
                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        if (refreshData.success && refreshData.data) {
                            const photoLinks: any = {};
                            if (refreshData.data.personphoto && Array.isArray(refreshData.data.personphoto)) {
                                refreshData.data.personphoto.forEach((photo: any) => {
                                    const placement = photo.photoplacement;
                                    const linkKey = `photo${placement}link` as keyof typeof photoLinks;
                                    photoLinks[linkKey] = photo[linkKey];
                                });
                            }
                            setUserPhotos(photoLinks);
                        }
                    }
                }
            } else {
                alert(data.message || 'Failed to upload photos. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Failed to upload photos. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Header />
                <div className="max-w-7xl mx-auto p-6">
                    <Loading message="Loading..." size="medium" />
                </div>
            </div>
        );
    }

    // Safety check - if no userInfo after loading, show error or redirect
    if (!userInfo) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center flex-col">
                <div>Unable to load user information</div>
                <button onClick={() => navigate('/login')} className="mt-5 px-5 py-2.5">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6 flex gap-6">
                {/* Left Sidebar - Consolidated */}
                <aside className="w-72 flex flex-col gap-4 shrink-0">
                    {/* Profile Card */}
                    {userInfo && (
                        <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 sm:p-4">
                            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 relative shadow-lg sm:w-[70px] sm:h-[70px] sm:text-2xl overflow-hidden">
                                {userPhotos?.photo1link ? (
                                    <img
                                        src={userPhotos.photo1link}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{userInfo.name?.charAt(0) || 'U'}</span>
                                )}
                                {/* Verified Badge - Top Right */}
                                {userInfo.profileveriffied === 1 && (
                                    <div className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center shadow-md z-20 sm:w-5 sm:h-5">
                                        <img src={verifiedBadge} alt="Verified" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-2 my-1.5">
                                <h3 className="text-lg font-bold text-gray-900 sm:text-base">{userInfo.name || 'User'}</h3>
                                {userInfo.profileveriffied === 1 && (
                                    <div className="flex items-center gap-1">
                                        <img src={verifiedBadge} alt="Verified" className="w-4 h-4" />
                                        <span className="text-xs font-semibold text-blue-600">Verified</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 my-1 font-medium">Member ID: {userInfo.userCode || 'N/A'}</p>
                            <div className="mt-2 text-red-600 text-xs font-semibold">
                                Free member
                            </div>
                        </div>
                    )}

                    {/* Upgrade Card */}
                    <div className="bg-gradient-to-br from-[#a413ed] to-[#8b10c9] rounded-2xl p-6 text-center text-white shadow-[0_8px_24px_rgba(251,52,170,0.25)] sm:p-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm sm:w-10 sm:h-10">
                            <svg className="w-6 h-6 text-white sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold mb-2 sm:text-xs">Upgrade membership to call or message with matches</h4>
                        <button
                            className="bg-white text-[#a413ed] border-none rounded-lg px-6 py-2.5 font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl w-full text-sm mt-2 sm:text-xs sm:py-2"
                            onClick={() => navigate('/subscription-plans')}
                        >
                            Upgrade now
                        </button>
                    </div>

                    {/* Switch Account */}
                    {/* <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100">
                        <button className="flex items-center justify-between w-full py-2 px-3 text-gray-700 no-underline rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium text-sm border-none bg-transparent cursor-pointer">
                            <span>Switch account</span>
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div> */}

                    {/* Navigation Links */}
                    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100">
                        <a href="#" className="flex items-center gap-3 py-3 px-3 text-gray-700 no-underline rounded-lg transition-all duration-200 mb-1 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium text-sm" onClick={(e) => { e.preventDefault(); navigate('/my-profile'); }}>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Edit profile
                        </a>
                        <a href="#" className="flex items-center gap-3 py-3 px-3 text-gray-700 no-underline rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium text-sm">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Edit preferences
                        </a>
                    </div>

                    {/* Support & Help Section */}
                    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 m-0 mb-3 uppercase tracking-widest px-3">Support & Help</h4>
                        <div className="flex flex-col gap-1">
                            <a href="#" className="flex items-center gap-3 p-3 text-gray-700 no-underline rounded-lg transition-all duration-200 text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </a>
                            <a href="#" className="flex items-center gap-3 p-3 text-gray-700 no-underline rounded-lg transition-all duration-200 text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Help
                            </a>
                            <a href="#" className="flex items-center gap-3 p-3 text-gray-700 no-underline rounded-lg transition-all duration-200 text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 font-medium">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Success Stories
                            </a>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button className="flex items-center justify-center gap-2 w-full py-3 px-4 text-red-600 border-2 border-red-200 bg-white rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer hover:bg-red-50 hover:border-red-300" onClick={handleLogout}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>

                </aside>

                {/* Main Content Area - Right Side */}
                <main className="flex-1 flex flex-col gap-6 min-w-0">
                    {/* Complete Profile Section */}
                    {(() => {
                        const completenessScore = calculateProfileCompleteness();
                        if (completenessScore >= 100) return null; // Hide section when 100% complete

                        return (
                            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 md:p-6">
                                <h2 className="text-2xl font-bold text-gray-900 m-0 mb-6 md:text-xl md:mb-4">Complete Your Profile</h2>
                                <div className="mb-6 md:mb-4">
                                    <div className="flex justify-between items-center mb-3 md:mb-2">
                                        <span className="text-base text-gray-600 font-medium md:text-sm">Profile completeness score</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-[#a413ed] to-[#8b10c9] bg-clip-text text-transparent md:text-xl">{completenessScore}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden md:h-2.5">
                                        <div className="h-full bg-gradient-to-r from-[#a413ed] to-[#8b10c9] rounded-full transition-all duration-500" style={{ width: `${completenessScore}%` }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 md:grid-cols-2">
                                    {!isHoroscopeCompleted() && (
                                        <div
                                            className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-4"
                                            onClick={() => setShowHoroscopeModal(true)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center md:w-8 md:h-8">
                                                    <svg className="w-6 h-6 text-purple-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 m-0 md:text-sm">Add Horoscope</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 m-0 md:text-xs">Complete your astrological details</p>
                                        </div>
                                    )}
                                    {!isHobbiesCompleted() && (
                                        <div
                                            className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-4"
                                            onClick={() => setShowHobbiesModal(true)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center md:w-8 md:h-8">
                                                    <svg className="w-6 h-6 text-purple-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 m-0 md:text-sm">Add Hobbies</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 m-0 md:text-xs">Share your interests and hobbies</p>
                                        </div>
                                    )}
                                    {!isPhotosCompleted() && (
                                        <div
                                            className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-4"
                                            onClick={() => setShowPhotoModal(true)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center md:w-8 md:h-8">
                                                    <svg className="w-6 h-6 text-purple-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 m-0 md:text-sm">Add Photo & Document</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 m-0 md:text-xs">Upload photos and verification documents</p>
                                        </div>
                                    )}
                                    {!isFamilyCompleted() && (
                                        <div
                                            className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-4"
                                            onClick={() => setShowFamilyModal(true)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center md:w-8 md:h-8">
                                                    <svg className="w-6 h-6 text-amber-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 m-0 md:text-sm">Family Details</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 m-0 md:text-xs">Add information about your family</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* New Matches Section */}
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 mb-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-[#1a1a1a] m-0">Daily Recommendations</h2>
                            <button
                                className="text-[#8b10c9] font-bold text-sm bg-transparent border-none cursor-pointer hover:underline"
                                onClick={() => navigate('/matches')}
                            >
                                See All
                            </button>
                        </div>
                        {profilesLoading ? (
                            <Loading message="Loading matches..." size="medium" />
                        ) : oppositeGenderProfiles.length > 0 ? (
                            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                                {oppositeGenderProfiles.slice(0, 5).map((profile) => (
                                    <MatchCard
                                        key={profile.accountId}
                                        profile={profile}
                                        profilePhoto={profilePhotos[profile.accountId]?.photo1link}
                                        primaryButtonText={sentInterests.has(profile.accountId) ? "View Profile" : "Connect"}
                                        onPrimaryAction={handleCardPrimaryAction}
                                        onFavorite={handleCardFavorite}
                                        isFavorite={shortlistedProfiles.has(profile.accountId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-gray-50 rounded-xl">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-gray-500 font-medium">No matches found</p>
                            </div>
                        )}

                    </div>

                    {/* All Matches Section */}
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 mb-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-[#1a1a1a] m-0">All Matches</h2>
                            <button
                                className="text-[#8b10c9] font-bold text-sm bg-transparent border-none cursor-pointer hover:underline"
                                onClick={() => navigate('/matches')}
                            >
                                See All
                            </button>
                        </div>
                        {profilesLoading ? (
                            <Loading message="Loading matches..." size="medium" />
                        ) : oppositeGenderProfiles.length > 0 ? (
                            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                                {oppositeGenderProfiles.slice(0, 5).map((profile) => (
                                    <MatchCard
                                        key={profile.accountId}
                                        profile={profile}
                                        profilePhoto={profilePhotos[profile.accountId]?.photo1link}
                                        primaryButtonText={sentInterests.has(profile.accountId) ? "View Profile" : "Connect"}
                                        onPrimaryAction={handleCardPrimaryAction}
                                        onFavorite={handleCardFavorite}
                                        isFavorite={shortlistedProfiles.has(profile.accountId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-gray-50 rounded-xl">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-gray-500 font-medium">No matches found</p>
                            </div>
                        )}

                    </div>

                    {/* Assisted Service Section */}
                    <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-2xl p-8 flex items-center gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:flex-col">
                        <div className="flex-1">
                            <div className="text-5xl mb-4">💑</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 m-0 mb-2">Assisted service</h3>
                                <p className="text-base text-gray-600 m-0 mb-4">Personalised matchmaking service</p>
                                <p className="text-xl font-semibold text-[#a413ed] my-4">Find your match <strong>10x faster</strong></p>
                                <p className="text-sm text-gray-700 my-4 leading-relaxed">Personalized matchmaking service through expert Relationship Manager</p>
                                <ul className="list-none p-0 m-4 my-0">
                                    <li className="py-2 text-gray-800 font-medium">✓ Guaranteed matches</li>
                                    <li className="py-2 text-gray-800 font-medium">✓ Better response</li>
                                    <li className="py-2 text-gray-800 font-medium">✓ Save time & effort</li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-[200px] h-[250px] flex items-center justify-center md:w-full md:h-[150px]">
                            <div className="text-8xl opacity-30">👩‍💼</div>
                        </div>
                    </div>

                    {/* Become a Paid Member Section */}
                    <div className="bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] rounded-2xl p-8 flex items-center gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:flex-col">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 m-0 mb-4">Become a paid member</h3>
                            <p className="text-lg text-gray-600 m-0 mb-6">Get up to <strong className="text-[#a413ed] text-xl">54% OFF</strong> on paid membership!</p>
                            <ul className="list-none p-0 m-4 my-0 grid grid-cols-2 gap-3 md:grid-cols-1">
                                <li className="p-3 bg-white rounded-lg text-gray-800 font-medium text-sm">📞 Call/WhatsApp matches</li>
                                <li className="p-3 bg-white rounded-lg text-gray-800 font-medium text-sm">💬 Unlimited messages</li>
                                <li className="p-3 bg-white rounded-lg text-gray-800 font-medium text-sm">👍 Higher chances of response</li>
                                <li className="p-3 bg-white rounded-lg text-gray-800 font-medium text-sm">👁️ View and match horoscopes</li>
                            </ul>
                        </div>
                        <div className="w-[200px] h-[250px] flex items-center justify-center md:w-full md:h-[150px]">
                            <div className="text-8xl opacity-30">👩</div>
                        </div>
                    </div>

                    {/* Who Viewed You Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0 mb-1.5">Who Viewed You (45)</h2>
                                <p className="text-gray-500 text-sm mt-1 font-medium">Members who have viewed your profile</p>
                            </div>
                        </div>
                        <div className="flex gap-5 overflow-x-auto pb-4 mb-4 scrollbar-thin scrollbar-thumb-[#a413ed] scrollbar-track-gray-100">
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/11')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                                <h4 className="text-base font-bold text-gray-900 my-2">Keerthana M</h4>
                                <p className="text-sm text-gray-600 my-1 font-medium">28 Yrs • 4'10"</p>
                                <span className="block text-xs text-gray-500 mt-2">Viewed on: 29 Nov 2025</span>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/12')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                                <h4 className="text-base font-bold text-gray-900 my-2">Mansi</h4>
                                <p className="text-sm text-gray-600 my-1 font-medium">27 Yrs • 5'4"</p>
                                <span className="block text-xs text-gray-500 mt-2">Viewed on: 29 Nov 2025</span>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/13')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                                <h4 className="text-base font-bold text-gray-900 my-2">Dhanalakshmi</h4>
                                <p className="text-sm text-gray-600 my-1 font-medium">29 Yrs • 5'0"</p>
                                <span className="block text-xs text-gray-500 mt-2">Viewed on: 29 Nov 2025</span>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/14')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                                <h4 className="text-base font-bold text-gray-900 my-2">Ramya</h4>
                                <p className="text-sm text-gray-600 my-1 font-medium">28 Yrs • 5'3"</p>
                                <span className="block text-xs text-gray-500 mt-2">Viewed on: 29 Nov 2025</span>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/15')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                                <h4 className="text-base font-bold text-gray-900 my-2">Yamini Raja</h4>
                                <p className="text-sm text-gray-600 my-1 font-medium">23 Yrs • 5'7"</p>
                                <span className="block text-xs text-gray-500 mt-2">Viewed on: 29 Nov 2025</span>
                            </div>
                        </div>
                        <button className="w-full p-4 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,52,170,0.3)]">
                            View All →
                        </button>
                    </div>

                    {/* Profiles You Viewed Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 m-0 mb-1.5">Profiles You Viewed (7)</h2>
                                <p className="text-gray-500 text-sm mt-1 font-medium">Members that you have viewed</p>
                            </div>
                        </div>
                        <div className="flex gap-5 overflow-x-auto pb-4 mb-4 scrollbar-thin scrollbar-thumb-[#a413ed] scrollbar-track-gray-100">
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/16')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/17')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/18')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/19')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                            </div>
                            <div className="min-w-[200px] text-center p-5 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(251,52,170,0.15)] hover:border-[#a413ed]" onClick={() => navigate('/profile/20')}>
                                <div className="w-[140px] h-[140px] rounded-2xl bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-6xl mx-auto mb-4 text-white shadow-lg">👤</div>
                            </div>
                        </div>
                        <button className="w-full p-4 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(251,52,170,0.3)]">
                            View All →
                        </button>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16 pt-12 px-8 pb-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-8 mb-8 lg:grid-cols-2 md:grid-cols-1">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-2xl">🎨</div>
                            <h4 className="text-base font-semibold text-gray-800 m-0">About Us</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed m-0">
                            NammaNaidu Matrimony is part of BharatMatrimony, pioneers of online matrimony service.
                            We are the most trusted matrimony service (Brand Trust Report). Millions of people have
                            found their life partners through us.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-gray-800 m-0 mb-4">Help & Support</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">24x7 Live help</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">Contact us</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">Feedback</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">FAQs</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-gray-800 m-0 mb-4">Information</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">About Us</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">Success stories</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">Terms & Conditions</a></li>
                            <li className="mb-2"><a href="#" className="text-gray-600 no-underline text-sm transition-colors duration-200 hover:text-[#a413ed]">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-base font-semibold text-gray-800 m-0 mb-4">Follow Us</h4>
                        <div className="flex items-center gap-3">
                            <a href="#" className="text-2xl no-underline transition-transform duration-200 hover:scale-125">📘</a>
                            <a href="#" className="text-2xl no-underline transition-transform duration-200 hover:scale-125">🐦</a>
                            <a href="#" className="text-2xl no-underline transition-transform duration-200 hover:scale-125">📷</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 mt-8">
                    <div className="max-w-[1400px] mx-auto text-center">
                        <p className="text-xs text-gray-600 m-0">
                            This website is strictly for matrimonial purpose only and not a dating website.
                            Copyright © 2025 Matrimony.com, the most trusted matrimony brand.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Floating Chat Button */}
            <button className="fixed bottom-8 right-8 w-[60px] h-[60px] rounded-full bg-[#10B981] border-none text-white text-2xl cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-[1000] transition-transform duration-200 hover:scale-110 hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] flex items-center justify-center" aria-label="Chat Support">
                💬
            </button>

            {/* Horoscope Modal */}
            <HoroscopeModal
                isOpen={showHoroscopeModal}
                onClose={() => {
                    setShowHoroscopeModal(false);
                    // Refresh horoscope data to get latest from server
                    fetchHoroscopeDetails();
                }}
                data={horoscopeData}
                onChange={setHoroscopeData}
                onSubmit={handleHoroscopeSubmit}
            />

            {/* Family Details Modal */}
            <FamilyDetailsModal
                isOpen={showFamilyModal}
                onClose={() => setShowFamilyModal(false)}
                data={familyData}
                newSibling={newSibling}
                onChange={setFamilyData}
                onSiblingChange={setNewSibling}
                onAddSibling={handleAddSibling}
                onRemoveSibling={handleRemoveSibling}
                onSubmit={handleFamilySubmit}
            />

            {/* Hobbies Modal */}
            <HobbiesModal
                isOpen={showHobbiesModal}
                onClose={() => setShowHobbiesModal(false)}
                activeTab={activeHobbyTab}
                onTabChange={setActiveHobbyTab}
                selections={{
                    hobbies: selectedHobbies,
                    musicGenres: selectedMusicGenres,
                    bookTypes: selectedBookTypes,
                    movieTypes: selectedMovieTypes,
                    sports: selectedSports,
                    cuisines: selectedCuisines,
                    languages: selectedLanguages,
                }}
                showMoreStates={{
                    hobbies: showMoreHobbies,
                    music: showMoreMusic,
                    books: showMoreBooks,
                    movies: showMoreMovies,
                    sports: showMoreSports,
                    cuisines: showMoreCuisines,
                    languages: showMoreLanguages,
                }}
                onToggleSelection={toggleSelection}
                onToggleShowMore={(category) => {
                    switch (category) {
                        case 'hobbies': setShowMoreHobbies(!showMoreHobbies); break;
                        case 'music': setShowMoreMusic(!showMoreMusic); break;
                        case 'books': setShowMoreBooks(!showMoreBooks); break;
                        case 'movies': setShowMoreMovies(!showMoreMovies); break;
                        case 'sports': setShowMoreSports(!showMoreSports); break;
                        case 'cuisines': setShowMoreCuisines(!showMoreCuisines); break;
                        case 'languages': setShowMoreLanguages(!showMoreLanguages); break;
                    }
                }}
                onSubmit={handleHobbiesSubmit}
            />

            {/* Photo Upload Modal */}
            <PhotoUploadModal
                isOpen={showPhotoModal}
                onClose={() => {
                    setShowPhotoModal(false);
                    setPersonPhotos([]);
                    setProofPhoto(null);
                }}
                personPhotos={personPhotos}
                proofPhoto={proofPhoto}
                uploading={uploading}
                onProfilePhotoUpload={handleProfilePhotoUpload}
                onProofUpload={handleProofUpload}
                onRemovePhoto={handleRemovePhoto}
                onSubmit={handlePhotoSubmit}
            />
        </div>
    );
};

export default HomePage;
