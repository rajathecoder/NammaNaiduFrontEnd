import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api.config';
import { getOppositeGenderProfiles, type UserProfile } from '../../../services/api/user.api';
import { getAuthData, clearAuthData } from '../../../utils/auth';

export const useHomePageData = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

            // ⚡ Bolt: Prevent N+1 fetches by extracting photo from nested personphoto payload
            // The backend already nests associated data (like personphoto) inside the getOppositeGenderProfiles response payload
            if (authData?.token) {
                const photosMap: Record<string, { photo1link?: string }> = {};
                // Extract photo1link directly from the nested personphoto array exactly as it appears in the backend payload
                profiles.forEach((profile: UserProfile & { personphoto?: Array<{ photoplacement: number, photo1link?: string }> }) => {
                    if (profile.personphoto && Array.isArray(profile.personphoto)) {
                        const primaryPhoto = profile.personphoto.find(p => p.photoplacement === 1);
                        if (primaryPhoto && primaryPhoto.photo1link) {
                            photosMap[profile.accountId] = { photo1link: primaryPhoto.photo1link };
                        }
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const photoLinks: any = {};
                        if (data.data.personphoto && Array.isArray(data.data.personphoto)) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

