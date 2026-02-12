import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';

interface RecommendedUser {
    id: number;
    score: number;
    reason: string;
    date: string;
    actionTaken: string;
    user: {
        id: number;
        accountId: string;
        name: string;
        userCode: string;
        gender: string;
        basicDetail?: {
            dateOfBirth?: string;
            religion?: string;
            caste?: string;
            city?: string;
            state?: string;
            education?: string;
            occupation?: string;
            height?: string;
            maritalStatus?: string;
        };
        personPhoto?: {
            photo1?: string;
        };
    };
}

const Recommendations = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState('');

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const auth = getAuthData();
            if (!auth?.token) { navigate('/login'); return; }

            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.RECOMMENDATIONS), {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const json = await res.json();
            if (json.success) {
                setRecommendations(json.data || []);
                setDate(json.date || '');
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (recId: number, action: string, targetAccountId: string) => {
        const auth = getAuthData();
        if (!auth?.token) return;

        try {
            // Mark recommendation action
            await fetch(getApiUrl(API_ENDPOINTS.USERS.RECOMMENDATION_ACTION(recId)), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
                body: JSON.stringify({ action }),
            });

            // If interest/shortlist, also create a profile action
            if (action === 'interest' || action === 'shortlist') {
                await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ACTIONS), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
                    body: JSON.stringify({ actionType: action, targetUserId: targetAccountId }),
                });
            }

            // Update local state
            setRecommendations((prev) =>
                prev.map((r) => (r.id === recId ? { ...r, actionTaken: action } : r))
            );
        } catch (err) {
            console.error('Error performing action:', err);
        }
    };

    const getAge = (dob?: string) => {
        if (!dob) return null;
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B5E20]" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daily Recommendations</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Profiles matched to your preferences {date ? `for ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                        </p>
                    </div>
                    <button onClick={() => navigate('/matches')} className="text-sm text-[#1B5E20] hover:underline font-medium">
                        View All Matches
                    </button>
                </div>

                {recommendations.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-5xl mb-4">💑</div>
                        <h3 className="text-lg font-semibold text-gray-800">No recommendations yet</h3>
                        <p className="text-sm text-gray-500 mt-2">Set your partner preferences to get personalized daily recommendations.</p>
                        <button onClick={() => navigate('/partner-preferences')} className="mt-4 px-6 py-2 bg-[#1B5E20] text-white rounded-lg font-medium hover:bg-[#0D3B13] transition-colors">
                            Set Preferences
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec) => {
                            const u = rec.user;
                            const age = getAge(u.basicDetail?.dateOfBirth);
                            const photo = u.personPhoto?.photo1;
                            const acted = rec.actionTaken !== 'none';

                            return (
                                <div key={rec.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${acted ? 'opacity-75' : 'hover:shadow-md'}`}>
                                    <div className="flex">
                                        {/* Photo */}
                                        <div className="w-32 h-40 bg-gray-100 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${u.accountId}`)}>
                                            {photo ? (
                                                <img src={photo} alt={u.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                                    {u.gender === 'Male' ? '👤' : '👩'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-[#1B5E20]" onClick={() => navigate(`/profile/${u.accountId}`)}>
                                                        {u.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-400">{u.userCode}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(rec.score)}`}>
                                                    {rec.score}%
                                                </span>
                                            </div>

                                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                {age && <span>{age} yrs</span>}
                                                {u.basicDetail?.height && <span> | {u.basicDetail.height}</span>}
                                                {u.basicDetail?.religion && <span> | {u.basicDetail.religion}</span>}
                                                {u.basicDetail?.city && <div>{u.basicDetail.city}{u.basicDetail?.state ? `, ${u.basicDetail.state}` : ''}</div>}
                                                {u.basicDetail?.education && <div>{u.basicDetail.education}</div>}
                                            </div>

                                            <p className="text-xs text-[#1B5E20] mt-2 italic">{rec.reason}</p>

                                            {/* Actions */}
                                            {acted ? (
                                                <div className="mt-3 text-xs text-gray-400 font-medium">
                                                    {rec.actionTaken === 'interest' && '✅ Interest sent'}
                                                    {rec.actionTaken === 'shortlist' && '⭐ Shortlisted'}
                                                    {rec.actionTaken === 'reject' && '❌ Skipped'}
                                                    {rec.actionTaken === 'skipped' && '⏭️ Skipped'}
                                                </div>
                                            ) : (
                                                <div className="mt-3 flex gap-2">
                                                    <button onClick={() => handleAction(rec.id, 'interest', u.accountId)}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all">
                                                        Send Interest
                                                    </button>
                                                    <button onClick={() => handleAction(rec.id, 'shortlist', u.accountId)}
                                                        className="px-3 py-1.5 border border-[#1B5E20] text-[#1B5E20] text-xs font-semibold rounded-lg hover:bg-green-50 transition-all">
                                                        Shortlist
                                                    </button>
                                                    <button onClick={() => handleAction(rec.id, 'skipped', u.accountId)}
                                                        className="px-3 py-1.5 border border-gray-200 text-gray-400 text-xs rounded-lg hover:bg-gray-50 transition-all">
                                                        Skip
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
