import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData, clearAuthData } from '../../utils/auth';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [visibility, setVisibility] = useState('members');
    const [profileStatus, setProfileStatus] = useState('draft');
    const [completionPct, setCompletionPct] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const auth = getAuthData();
            if (!auth?.token) return;
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` };

            // Fetch both endpoints in parallel
            const [meRes, profileRes] = await Promise.all([
                fetch(getApiUrl(API_ENDPOINTS.USERS.ME), { headers }),
                fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_COMPLETE), { headers }),
            ]);
            const [meJson, profileJson] = await Promise.all([meRes.json(), profileRes.json()]);

            if (meJson.success && meJson.data) {
                setCompletionPct(meJson.data.profileCompletion ?? 0);
            }
            if (profileJson.success && profileJson.data) {
                setVisibility(profileJson.data.profileVisibility ?? 'members');
                setProfileStatus(profileJson.data.profileStatus ?? 'draft');
            }
        } catch (err) {
            console.error('Error loading profile settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVisibilityChange = async (newVisibility: string) => {
        setIsSaving(true);
        setSuccessMsg('');
        try {
            const auth = getAuthData();
            if (!auth?.token) return;
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_VISIBILITY), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
                body: JSON.stringify({ visibility: newVisibility }),
            });
            const json = await res.json();
            if (json.success) {
                setVisibility(newVisibility);
                setSuccessMsg('Visibility updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                alert(json.message || 'Failed to update visibility');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const auth = getAuthData();
            if (!auth?.token) return;
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.DELETE_PROFILE), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
            });
            const json = await res.json();
            if (json.success) {
                clearAuthData();
                navigate('/login');
            } else {
                alert(json.message || 'Failed to delete account');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const statusColors: Record<string, { bg: string; text: string; label: string }> = {
        draft: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'Draft' },
        submitted: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Submitted' },
        approved: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Approved' },
        rejected: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Rejected' },
    };

    const visibilityOptions = [
        { value: 'public', icon: '🌐', title: 'Public', desc: 'Visible to everyone, including non-members' },
        { value: 'members', icon: '👥', title: 'Members Only', desc: 'Only visible to logged-in members' },
        { value: 'hidden', icon: '🔒', title: 'Hidden', desc: 'Your profile is hidden from all searches' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#a413ed]" />
                </div>
            </div>
        );
    }

    const currentStatus = statusColors[profileStatus] || statusColors.draft;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your profile visibility and account settings</p>
                    </div>
                    <button onClick={() => navigate('/my-profile')} className="text-sm text-[#a413ed] hover:underline font-medium">
                        Back to Profile
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">{successMsg}</div>
                )}

                {/* Profile Status & Completion */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${currentStatus.bg} ${currentStatus.text}`}>
                            {currentStatus.label}
                        </span>
                        {profileStatus === 'draft' && (
                            <span className="text-sm text-gray-500">Complete your registration to submit your profile for review</span>
                        )}
                    </div>

                    {/* Completion Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                            <span className="text-sm font-bold text-[#a413ed]">{completionPct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className="h-3 rounded-full bg-gradient-to-r from-[#a413ed] to-[#8b10c9] transition-all duration-500"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>
                        {completionPct < 100 && (
                            <p className="text-xs text-gray-500 mt-2">
                                Add more details to your profile to increase visibility and get better matches.
                            </p>
                        )}
                    </div>
                </div>

                {/* Profile Visibility */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h2>
                    <div className="space-y-3">
                        {visibilityOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleVisibilityChange(opt.value)}
                                disabled={isSaving}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${visibility === opt.value
                                    ? 'border-[#a413ed] bg-purple-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    } disabled:opacity-50`}
                            >
                                <span className="text-2xl">{opt.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{opt.title}</div>
                                    <div className="text-sm text-gray-500">{opt.desc}</div>
                                </div>
                                {visibility === opt.value && (
                                    <div className="w-6 h-6 rounded-full bg-[#a413ed] flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                    <div className="space-y-2">
                        <button onClick={() => navigate('/partner-preferences')} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">💑</span>
                                <span className="font-medium text-gray-800">Partner Preferences</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button onClick={() => navigate('/my-profile')} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📝</span>
                                <span className="font-medium text-gray-800">Edit Profile</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Delete Account (Danger Zone) */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Deleting your account will hide your profile from all searches. Your data will be retained for 30 days before permanent deletion.
                    </p>
                    {!showDeleteConfirm ? (
                        <button onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
                            Delete My Account
                        </button>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                            <p className="text-sm font-medium text-red-700 mb-3">Are you sure you want to delete your account? This action cannot be easily undone.</p>
                            <div className="flex gap-3">
                                <button onClick={handleDeleteAccount} disabled={isDeleting}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50">
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
