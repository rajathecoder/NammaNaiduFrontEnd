import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Loading from '../../components/common/Loading';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import MatchCard from '../HomePage/components/MatchCard';


interface InterestProfile {
    accountId: string;
    name: string;
    userCode?: string;
    photo1link?: string;
    profileveriffied?: number;
    age?: number;
    basicDetail?: {
        height?: string;
        caste?: string;
        occupation?: string;
        city?: string;
    };
    createdAt?: string;
}

const Interests = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const [interestsByMe, setInterestsByMe] = useState<InterestProfile[]>([]);
    const [interestsByOther, setInterestsByOther] = useState<InterestProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [shortlistedProfiles, setShortlistedProfiles] = useState<Set<string>>(new Set());


    const handleInterestAction = async (accountId: string, action: 'accept' | 'view') => {
        if (action === 'view') {
            navigate(`/profile/${accountId}`);
            return;
        }

        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTIONS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    actionType: 'accept',
                    targetUserId: accountId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Find the profile in interestsByOther
                const acceptedProfile = interestsByOther.find(p => p.accountId === accountId);

                if (acceptedProfile) {
                    // Remove from interestsByOther
                    setInterestsByOther(prev => prev.filter(p => p.accountId !== accountId));

                    // Add to interestsByMe (if not already there)
                    setInterestsByMe(prev => {
                        const exists = prev.some(p => p.accountId === accountId);
                        if (exists) return prev;
                        return [acceptedProfile, ...prev];
                    });

                    // Switch to "Interest by Me" tab
                    setActiveTab('sent');

                    alert('Interest accepted successfully!');
                } else {
                    // Fallback if profile not found in list for some reason
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error accepting interest:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (accountId: string) => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        const isShortlisted = shortlistedProfiles.has(accountId);
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
    };

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

    useEffect(() => {
        fetchShortlistedProfiles();

        const fetchInterests = async () => {
            try {
                setLoading(true);
                const authData = getAuthData();
                if (!authData?.token) {
                    navigate('/login');
                    return;
                }

                const token = authData.token;

                // Fetch all my actions (interest, accept, shortlist, etc.)
                const sentResponse = await fetch(
                    getApiUrl(API_ENDPOINTS.USERS.MY_PROFILE_ACTIONS),
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const receivedResponse = await fetch(
                    `${getApiUrl(API_ENDPOINTS.USERS.RECEIVED_PROFILE_ACTIONS)}?actionType=interest`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (sentResponse.ok && receivedResponse.ok) {
                    const sentData = await sentResponse.json();
                    const receivedData = await receivedResponse.json();

                    let myInterests: InterestProfile[] = [];
                    let otherInterests: InterestProfile[] = [];

                    if (sentData?.success && sentData.data) {
                        // Filter for only 'interest' and 'accept' actions
                        const relevantActions = sentData.data.filter((action: any) =>
                            action.actionType === 'interest' || action.actionType === 'accept'
                        );

                        myInterests = relevantActions.map((action: any) => {
                            const profile = action.targetUser;
                            if (!profile) return null;
                            const age = profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : null;
                            const height = profile.basicDetail?.height || '';
                            const occupation = profile.basicDetail?.occupation || 'Not Specified';
                            return {
                                ...profile,
                                photo1link: profile.personPhoto?.photo1,
                                profileId: profile.userCode || 'N/A',
                                age,
                                height,
                                occupation,
                                lastSeen: 'Recently active',
                                shortlisted: false
                            };
                        }).filter(Boolean);
                    }

                    if (receivedData?.success && receivedData.data) {
                        // For received, we only care about pending interests
                        // But we also need to filter out ones we've already Accepted (which are in myInterests now)
                        otherInterests = receivedData.data.map((action: any) => {
                            const profile = action.user;
                            if (!profile) return null;
                            const age = profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : null;
                            const height = profile.basicDetail?.height || '';
                            const occupation = profile.basicDetail?.occupation || 'Not Specified';
                            return {
                                ...profile,
                                photo1link: profile.personPhoto?.photo1,
                                profileId: profile.userCode || 'N/A',
                                age,
                                height,
                                occupation,
                                lastSeen: 'Recently active',
                                shortlisted: false
                            };
                        }).filter(Boolean);
                    }

                    // Filter out profiles from 'otherInterests' that are already in 'myInterests'
                    // This logic effectively hides profiles from "Interest by Other" if I have already sent an interest OR accepted their interest
                    const myInterestIds = new Set(myInterests.map(p => p.accountId));
                    otherInterests = otherInterests.filter(p => !myInterestIds.has(p.accountId));

                    setInterestsByMe(myInterests);
                    setInterestsByOther(otherInterests);
                }
            } catch (error) {
                console.error('Error fetching interests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterests();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="max-w-[1400px] mx-auto p-8">
                    <Loading message="Loading interests..." size="medium" />
                </div>
            </div>
        );
    }

    const currentInterests = activeTab === 'received' ? interestsByOther : interestsByMe;
    const emptyMessage = activeTab === 'received'
        ? 'No interests received from others yet.'
        : 'You haven\'t sent any interests yet.';

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-[1400px] mx-auto p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Interests</h1>

                <div className="flex gap-4 mb-8">
                    <button
                        className={`py-3 px-8 rounded-2xl font-bold transition-all duration-300 shadow-md ${activeTab === 'received' ? 'bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('received')}
                    >
                        Interest by Other ({interestsByOther.length})
                    </button>
                    <button
                        className={`py-3 px-8 rounded-2xl font-bold transition-all duration-300 shadow-md ${activeTab === 'sent' ? 'bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        Interest by Me ({interestsByMe.length})
                    </button>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    {currentInterests.length === 0 ? (
                        <div>
                            <p className="text-center text-gray-600 py-8">{emptyMessage}</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                            {currentInterests.map((interest) => (
                                <MatchCard
                                    key={interest.accountId}
                                    profile={interest}
                                    profilePhoto={interest.photo1link}
                                    primaryButtonText={activeTab === 'received' ? "Accept" : "View Profile"}
                                    onPrimaryAction={(e) => {
                                        e.stopPropagation();
                                        handleInterestAction(interest.accountId, activeTab === 'received' ? 'accept' : 'view');
                                    }}
                                    onFavorite={(e) => {
                                        e.stopPropagation();
                                        handleShortlist(interest.accountId);
                                    }}
                                    isFavorite={shortlistedProfiles.has(interest.accountId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interests;
