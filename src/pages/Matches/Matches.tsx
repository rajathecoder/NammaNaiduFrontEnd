import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Loading from '../../components/common/Loading';
import { getOppositeGenderProfiles, type UserProfile } from '../../services/api/user.api';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import MatchCard from '../HomePage/components/MatchCard';

interface MatchProfile extends UserProfile {
    photo1link?: string;
    profileveriffied?: number;
    profileId?: string;
    lastSeen?: string;
    shortlisted?: boolean;
    createdAt?: string;
}

const Matches = () => {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('your-matches');
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 12;
    const [allMatches, setAllMatches] = useState<MatchProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [sentInterests, setSentInterests] = useState<Set<string>>(new Set());

    const handleConnect = async (accountId: string) => {
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
    };

    const handleShortlist = async (accountId: string) => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        // Check if currently shortlisted
        const currentMatch = allMatches.find(m => m.accountId === accountId);
        const isCurrentlyShortlisted = currentMatch?.shortlisted;

        try {
            const method = isCurrentlyShortlisted ? 'DELETE' : 'POST';

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
                const message = isCurrentlyShortlisted ? 'Profile removed from shortlist!' : 'Profile shortlisted!';
                alert(message);

                // Update the shortlisted status in the UI
                setAllMatches(prev => prev.map(match =>
                    match.accountId === accountId
                        ? { ...match, shortlisted: !isCurrentlyShortlisted }
                        : match
                ));
            }
        } catch (error) {
            console.error('Error updating shortlist status:', error);
        }
    };

    // Fetch matches from API
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const authData = getAuthData();
                if (!authData?.token) {
                    navigate('/login');
                    return;
                }

                // Fetch opposite gender profiles
                const response = await getOppositeGenderProfiles(authData.token);

                if (response.success && response.data) {
                    // Fetch user's shortlist actions to mark profiles
                    const shortlistResponse = await fetch(
                        `${getApiUrl(API_ENDPOINTS.USERS.MY_PROFILE_ACTIONS)}?actionType=shortlist`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authData.token}`
                            }
                        }
                    );

                    let shortlistedIds = new Set();
                    if (shortlistResponse.ok) {
                        const dl = await shortlistResponse.json();
                        if (dl.success && dl.data) {
                            dl.data.forEach((action: any) => {
                                shortlistedIds.add(action.targetUserId || action.targetUser?.accountId);
                            });
                        }
                    }

                    // Optimized: Photos are now included in the response data from backend
                    const mappedMatches = response.data.map((profile: any) => {
                        // Calculate age from dateOfBirth
                        let age: number | null = null;
                        if (profile.basicDetail?.dateOfBirth) {
                            const birthYear = new Date(profile.basicDetail.dateOfBirth).getFullYear();
                            age = new Date().getFullYear() - birthYear;
                        }

                        // Map photo from personPhoto association
                        const photo1link = profile.personPhoto?.photo1;

                        return {
                            ...profile,
                            photo1link,
                            profileId: profile.userCode || 'N/A',
                            lastSeen: 'Recently active',
                            shortlisted: shortlistedIds.has(profile.accountId),
                            age,
                        } as MatchProfile;
                    });

                    setAllMatches(mappedMatches);

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
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [navigate]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter]);



    // Calculate pagination with filtering
    const getFilteredProfiles = () => {
        if (selectedFilter === 'newly-joined') {
            // Filter profiles created in the last 5 days
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

            return allMatches.filter(match => {
                if (match.createdAt) {
                    const createdDate = new Date(match.createdAt);
                    return createdDate >= fiveDaysAgo;
                }
                return false;
            });
        }

        if (selectedFilter === 'shortlisted-by-you') {
            // Filter profiles that are shortlisted
            return allMatches.filter(match => match.shortlisted === true);
        }

        // Add other filters here if needed
        return allMatches;
    };

    const filteredProfiles = getFilteredProfiles();
    const totalProfiles = filteredProfiles.length;
    const totalPages = Math.ceil(totalProfiles / profilesPerPage);
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage <= 4) {
                // Near the start: show 1, 2, 3, 4, 5, ..., last
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Near the end: show 1, ..., last-4, last-3, last-2, last-1, last
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle: show 1, ..., current-1, current, current+1, ..., last
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa]">
                <Header />
                <div className="max-w-7xl mx-auto p-12">
                    <Loading message="Curating your matches..." size="medium" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Header />
            <div className="max-w-7xl mx-auto p-8 flex gap-8">
                {/* Sidebar */}
                <div className="w-80 flex flex-col gap-6 shrink-0">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Discovery</h3>
                            <div className="space-y-2">
                                <div
                                    className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 gap-3 ${selectedFilter === 'your-matches' ? 'bg-gradient-to-r from-[#1B5E2015] to-[#0D3B1315] text-[#0D3B13] border border-[#0D3B1320]' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedFilter('your-matches')}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedFilter === 'your-matches' ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>👤</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold">Your Matches</div>
                                        <p className="text-[11px] opacity-70 leading-tight">Profiles matching you</p>
                                    </div>
                                    <span className="text-lg opacity-40">›</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Interactions</h3>
                            <div className="space-y-2">
                                <div
                                    className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 gap-3 ${selectedFilter === 'shortlisted-by-you' ? 'bg-gradient-to-r from-[#1B5E2015] to-[#0D3B1315] text-[#0D3B13] border border-[#0D3B1320]' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedFilter('shortlisted-by-you')}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedFilter === 'shortlisted-by-you' ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>⭐</div>
                                    <div className="flex-1 text-sm font-bold">Shortlisted by you</div>
                                    <span className="text-lg opacity-40">›</span>
                                </div>
                                <div
                                    className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 gap-3 ${selectedFilter === 'viewed-you' ? 'bg-gradient-to-r from-[#1B5E2015] to-[#0D3B1315] text-[#0D3B13] border border-[#0D3B1320]' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedFilter('viewed-you')}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedFilter === 'viewed-you' ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>👁️</div>
                                    <div className="flex-1 text-sm font-bold">Who viewed you</div>
                                    <span className="text-lg opacity-40">›</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Quick Find</h3>
                            <div className="space-y-2">
                                <div
                                    className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 gap-3 ${selectedFilter === 'newly-joined' ? 'bg-gradient-to-r from-[#1B5E2015] to-[#0D3B1315] text-[#0D3B13] border border-[#0D3B1320]' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedFilter('newly-joined')}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${selectedFilter === 'newly-joined' ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>🆕</div>
                                    <div className="flex-1 text-sm font-bold">Newly Joined</div>
                                    <span className="text-lg opacity-40">›</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-8 min-w-0">
                    <div className="mb-0">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-extrabold text-[#1a1a1a] m-0">
                                {totalProfiles} Matches <span className="text-gray-400 font-medium text-base ml-2">based on your preferences</span>
                            </h2>
                            {totalProfiles > 0 && (
                                <p className="text-sm text-gray-500 font-bold bg-gray-100 px-4 py-1.5 rounded-full">
                                    {indexOfFirstProfile + 1} - {Math.min(indexOfLastProfile, totalProfiles)} of {totalProfiles}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3 flex-wrap items-center">
                            <button className="h-10 px-6 border border-gray-100 bg-white rounded-2xl shadow-sm text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2 transition-all hover:shadow-md hover:border-[#1B5E2040]">
                                <span>⚙️</span> Filter
                            </button>
                            <button className="h-10 px-6 border border-gray-100 bg-white rounded-2xl shadow-sm text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2 transition-all hover:shadow-md hover:border-[#1B5E2040]">Sort by ▼</button>
                            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
                            <button className="h-10 px-6 border border-gray-100 bg-white rounded-[20px] text-xs font-bold text-gray-500 cursor-pointer transition-all hover:bg-gray-50 hover:text-[#0D3B13]">Newly joined</button>
                            <button className="h-10 px-6 border border-gray-100 bg-white rounded-[20px] text-xs font-bold text-gray-500 cursor-pointer transition-all hover:bg-gray-50 hover:text-[#0D3B13]">Profiles with photo</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentProfiles.length === 0 ? (
                            <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <div className="text-5xl mb-4">🔍</div>
                                <p className="text-gray-500 font-bold text-lg">No matches found for this filter</p>
                                <button className="mt-4 text-[#0D3B13] font-bold hover:underline" onClick={() => setSelectedFilter('your-matches')}>Clear all filters</button>
                            </div>
                        ) : (
                            currentProfiles.map((match) => (
                                <MatchCard
                                    key={match.accountId || match.id}
                                    profile={match}
                                    profilePhoto={match.photo1link}
                                    primaryButtonText={sentInterests.has(match.accountId) ? "View Profile" : "Connect"}
                                    onPrimaryAction={(e) => {
                                        e.stopPropagation();
                                        if (sentInterests.has(match.accountId)) {
                                            navigate(`/profile/${match.accountId}`);
                                        } else {
                                            handleConnect(match.accountId);
                                        }
                                    }}
                                    onFavorite={(e) => {
                                        e.stopPropagation();
                                        handleShortlist(match.accountId);
                                    }}
                                    isFavorite={match.shortlisted}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12 py-8">
                            <button
                                className="h-12 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 shadow-sm transition-all hover:shadow-md hover:border-[#1B5E20] disabled:opacity-40 disabled:cursor-not-allowed"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                ← Prev
                            </button>

                            <div className="flex gap-2 items-center">
                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <button
                                            key={`page-${page}`}
                                            className={`w-12 h-12 rounded-2xl font-extrabold transition-all border-2 ${currentPage === page ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white border-transparent shadow-lg scale-110' : 'bg-white text-gray-400 border-gray-50 hover:border-[#1B5E2020] hover:text-[#0D3B13]'}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ) : (
                                        <span key={`ellipsis-${index}`} className="px-2 text-gray-300 font-bold">{page}</span>
                                    )
                                ))}
                            </div>

                            <button
                                className="h-12 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 shadow-sm transition-all hover:shadow-md hover:border-[#1B5E20] disabled:opacity-40 disabled:cursor-not-allowed"
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Matches;

