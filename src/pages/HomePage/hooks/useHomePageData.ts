import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api.config';
import { getOppositeGenderProfiles, type UserProfile } from '../../../services/api/user.api';
import { getAuthData, clearAuthData } from '../../../utils/auth';

export const useHomePageData = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [oppositeGenderProfiles, setOppositeGenderProfiles] = useState<UserProfile[]>([]);
    const [profilesLoading, setProfilesLoading] = useState(false);
    const [profilePhotos, setProfilePhotos] = useState<Record<string, { photo1link?: string }>>({});
    const [userPhotos, setUserPhotos] = useState<{ photo1link?: string; photo2link?: string; photo3link?: string; photo4link?: string; photo5link?: string } | null>(null);

    const verifyAuth = async () => {
        try {
            const authData = getAuthData();

            if (!authData || !authData.token) {
                console.log('No auth data, redirecting to login');
                navigate('/login');
                return;
            }

            const token = authData.token;

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
                    if (!data.data.basicDetail) {
                        console.log('No basicDetail found, redirecting to personal-religious-details');
                        navigate('/personal-religious-details');
                        return;
                    }

                    setUserInfo(data.data);
                    localStorage.setItem('userInfo', JSON.stringify(data.data));
                    console.log('User info loaded successfully');
                } else {
                    throw new Error('Failed to load user profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                clearAuthData();
                navigate('/login');
            }
        } catch (error) {
            console.error('Error in verifyAuth:', error);
            clearAuthData();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchOppositeGenderProfiles = async () => {
        if (!userInfo) return;

        try {
            setProfilesLoading(true);
            const authData = getAuthData();
            if (!authData?.token) {
                return;
            }
            
            const response = await getOppositeGenderProfiles(authData.token);
            const profiles = response.data || [];
            setOppositeGenderProfiles(profiles);

            // Fetch photos for each profile
            if (authData?.token) {
                const photoPromises = profiles.map(async (profile: UserProfile) => {
                    try {
                        const photoResponse = await fetch(
                            getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(profile.accountId)),
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${authData.token}`
                                }
                            }
                        );

                        if (photoResponse.ok) {
                            const photoData = await photoResponse.json();
                            if (photoData.success && photoData.data) {
                                return {
                                    accountId: profile.accountId,
                                    photo1link: photoData.data.personphoto?.[0]?.photo1link || null
                                };
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching photos for ${profile.accountId}:`, error);
                    }
                    return { accountId: profile.accountId, photo1link: null };
                });

                const photos = await Promise.all(photoPromises);
                const photosMap: Record<string, { photo1link?: string }> = {};
                photos.forEach(photo => {
                    if (photo.photo1link) {
                        photosMap[photo.accountId] = { photo1link: photo.photo1link };
                    }
                });
                setProfilePhotos(photosMap);
            }
        } catch (error) {
            console.error('Error fetching opposite gender profiles:', error);
        } finally {
            setProfilesLoading(false);
        }
    };

    const fetchUserPhotos = async () => {
        if (!userInfo?.accountId) return;

        try {
            const authData = getAuthData();
            if (authData?.token) {
                const response = await fetch(
                    getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(userInfo.accountId)),
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }
                );

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
            }
        } catch (error) {
            console.error('Error fetching user photos:', error);
        }
    };

    useEffect(() => {
        verifyAuth();
    }, []);

    useEffect(() => {
        if (userInfo && !loading) {
            fetchOppositeGenderProfiles();
            fetchUserPhotos();
        }
    }, [userInfo, loading]);

    return {
        userInfo,
        loading,
        oppositeGenderProfiles,
        profilesLoading,
        profilePhotos,
        userPhotos,
        setUserPhotos,
        refetchProfiles: fetchOppositeGenderProfiles,
        refetchUserPhotos: fetchUserPhotos,
    };
};
