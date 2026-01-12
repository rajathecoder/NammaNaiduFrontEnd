import { useState } from 'react';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import MatchCard from '../HomePage/components/MatchCard';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('criteria');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);

    // Filter states
    const [filters, setFilters] = useState({
        ageMin: '22',
        ageMax: '35',
        religion: 'Hindu',
        caste: 'Kamma Naidu',
        maritalStatus: '',
        city: '',
        occupation: '',
        education: '',
        rasi: '',
        natchathiram: '',
        incomeMin: '',
        hobby: '',
        interest: '',
        profileId: ''
    });

    // Mock data for dropdowns
    const ageOptions = Array.from({ length: 43 }, (_, i) => i + 18); // 18 to 60
    const religionOptions = ["Any", "Hindu", "Christian", "Muslim", "Sikh", "Jain", "Buddhist"];
    const casteOptions = ["Any", "Kamma Naidu", "Balija Naidu", "Gavara Naidu", "Kapu Naidu"];
    const maritalStatusOptions = ["Any", "Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
    const rasiOptions = ["Any", "Mesham", "Rishabham", "Midhunam", "Kadagam", "Simmam", "Kanni", "Thulaam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam"];
    const starOptions = ["Any", "Ashwini", "Bharani", "Krithika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
    const incomeOptions = ["Any", "Below 2 Lakhs", "2 - 5 Lakhs", "5 - 10 Lakhs", "10 - 20 Lakhs", "20 - 50 Lakhs", "Above 50 Lakhs"];

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = async () => {
        const authData = getAuthData();
        if (!authData?.token) { navigate('/login'); return; }

        setSearching(true);
        try {
            const params: any = {
                ageMin: filters.ageMin,
                ageMax: filters.ageMax,
            };
            if (filters.religion && filters.religion !== 'Any') params.religion = filters.religion;
            if (filters.caste && filters.caste !== 'Any') params.caste = filters.caste;
            if (filters.maritalStatus && filters.maritalStatus !== 'Any') params.maritalStatus = filters.maritalStatus;
            if (filters.city) params.city = filters.city;
            if (filters.occupation) params.occupation = filters.occupation;
            if (filters.education) params.education = filters.education;
            if (filters.rasi && filters.rasi !== 'Any') params.rasi = filters.rasi;
            if (filters.natchathiram && filters.natchathiram !== 'Any') params.natchathiram = filters.natchathiram;
            if (filters.incomeMin && filters.incomeMin !== 'Any') params.incomeMin = filters.incomeMin;
            if (filters.hobby) params.hobby = filters.hobby;
            if (filters.interest) params.interest = filters.interest;

            const queryParams = new URLSearchParams(params);
            const url = `${getApiUrl(API_ENDPOINTS.USERS.SEARCH)}?${queryParams.toString()}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });
            const data = await response.json();

            if (data.success) {
                // Map results to MatchCard format
                const mappedResults = data.data.map((user: any) => ({
                    ...user,
                    photo1link: user.personPhoto?.photo1,
                    age: user.basicDetail?.dateOfBirth ? new Date().getFullYear() - new Date(user.basicDetail.dateOfBirth).getFullYear() : null,
                }));
                setResults(mappedResults);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleSearchById = async () => {
        const authData = getAuthData();
        if (!authData?.token) { navigate('/login'); return; }
        if (!filters.profileId) return;

        setSearching(true);
        try {
            const url = `${getApiUrl(API_ENDPOINTS.USERS.SEARCH)}?userCode=${filters.profileId}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const user = data.data[0];
                const mappedUser = {
                    ...user,
                    photo1link: user.personPhoto?.photo1,
                    age: user.basicDetail?.dateOfBirth ? new Date().getFullYear() - new Date(user.basicDetail.dateOfBirth).getFullYear() : null,
                };
                setResults([mappedUser]);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search by ID error:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleAction = (accountId: string) => navigate(`/profile/${accountId}`);

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Header />
            <div className="max-w-6xl mx-auto py-12 px-6">
                <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden mb-12">
                    {/* Tabs */}
                    <div className="flex bg-gray-50/50 p-2 gap-2 border-b border-gray-100">
                        <button
                            className={`flex-1 py-4 px-6 rounded-[30px] text-sm font-bold transition-all duration-300 ${activeTab === 'criteria' ? 'bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
                            onClick={() => { setActiveTab('criteria'); setResults(null); }}
                        >
                            Advanced Search
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 rounded-[30px] text-sm font-bold transition-all duration-300 ${activeTab === 'profileId' ? 'bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
                            onClick={() => { setActiveTab('profileId'); setResults(null); }}
                        >
                            Search by ID
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 rounded-[30px] text-sm font-bold transition-all duration-300 ${activeTab === 'saved' ? 'bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
                            onClick={() => { setActiveTab('saved'); setResults(null); }}
                        >
                            Saved Searches
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-10">
                        {activeTab === 'criteria' && (
                            <div>
                                <div className="mb-10 text-center">
                                    <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">Find your perfect match</h2>
                                    <p className="text-gray-500 font-medium">Customize your search to find the most compatible profiles.</p>
                                </div>

                                <div className="space-y-12">
                                    <div className="bg-gray-50/30 p-8 rounded-[32px] border border-gray-100">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">👤</div>
                                            <h3 className="text-xl font-bold text-[#1a1a1a]">Profile Preferences</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Age Range</label>
                                                <div className="flex items-center gap-4">
                                                    <select value={filters.ageMin} onChange={(e) => handleFilterChange('ageMin', e.target.value)} className="flex-1 h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                        {ageOptions.map(age => <option key={age} value={age}>{age} Yrs</option>)}
                                                    </select>
                                                    <span className="text-gray-300 font-bold">to</span>
                                                    <select value={filters.ageMax} onChange={(e) => handleFilterChange('ageMax', e.target.value)} className="flex-1 h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                        {ageOptions.map(age => <option key={age} value={age}>{age} Yrs</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Marital Status</label>
                                                <select value={filters.maritalStatus} onChange={(e) => handleFilterChange('maritalStatus', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Religion</label>
                                                <select value={filters.religion} onChange={(e) => handleFilterChange('religion', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {religionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Caste</label>
                                                <select value={filters.caste} onChange={(e) => handleFilterChange('caste', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {casteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City / Location</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter city (e.g. Hyderabad)"
                                                    value={filters.city}
                                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                                    className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Occupation</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter occupation (e.g. Engineer)"
                                                    value={filters.occupation}
                                                    onChange={(e) => handleFilterChange('occupation', e.target.value)}
                                                    className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Education</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. B.Tech, MS, MBA"
                                                    value={filters.education}
                                                    onChange={(e) => handleFilterChange('education', e.target.value)}
                                                    className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Annual Income</label>
                                                <select value={filters.incomeMin} onChange={(e) => handleFilterChange('incomeMin', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {incomeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/30 p-8 rounded-[32px] border border-gray-100">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">✨</div>
                                            <h3 className="text-xl font-bold text-[#1a1a1a]">Horoscope & Lifestyle</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Rasi (Zodiac)</label>
                                                <select value={filters.rasi} onChange={(e) => handleFilterChange('rasi', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {rasiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Natchathiram (Star)</label>
                                                <select value={filters.natchathiram} onChange={(e) => handleFilterChange('natchathiram', e.target.value)} className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none">
                                                    {starOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Specific Hobbies</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Photography, Cooking"
                                                    value={filters.hobby}
                                                    onChange={(e) => handleFilterChange('hobby', e.target.value)}
                                                    className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Interests</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Travel, Music"
                                                    value={filters.interest}
                                                    onChange={(e) => handleFilterChange('interest', e.target.value)}
                                                    className="h-14 bg-white border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative p-10 rounded-[40px] bg-gradient-to-br from-[#1a1a1a] to-[#333] border border-gray-800 overflow-hidden text-white group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FB34AA30] to-[#C204E730] blur-[80px] -mr-32 -mt-32 transition-all"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#FB34AA] to-[#C204E7] rounded-3xl flex items-center justify-center text-4xl shadow-2xl">⭐</div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold mb-2">Premium Search Filters</h4>
                                                <p className="text-gray-400 text-sm font-medium">Filter by Star, Horoscope, Education Institute, and Workplace.</p>
                                            </div>
                                            <button className="h-12 px-8 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">Upgrade Now</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center mt-16">
                                    <button
                                        className="h-16 px-20 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white rounded-full text-lg font-black shadow-2xl shadow-[#FB34AA40] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-70"
                                        onClick={handleSearch}
                                        disabled={searching}
                                    >
                                        {searching ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <span>🔍</span>}
                                        Find Matches
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profileId' && (
                            <div className="py-20 text-center max-w-md mx-auto">
                                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">Search by Profile ID</h3>
                                <div className="relative mb-8">
                                    <input
                                        type="text"
                                        placeholder="Enter Profile ID (e.g., NN#00001)"
                                        value={filters.profileId}
                                        onChange={(e) => handleFilterChange('profileId', e.target.value)}
                                        className="w-full h-16 bg-gray-50 border border-gray-100 rounded-3xl px-8 text-lg font-bold text-gray-700 shadow-inner focus:bg-white focus:ring-4 focus:ring-[#FB34AA10] outline-none"
                                    />
                                </div>
                                <button
                                    className="w-full h-16 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white rounded-3xl text-lg font-black shadow-xl shadow-[#FB34AA20] hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                                    onClick={handleSearchById}
                                    disabled={searching || !filters.profileId}
                                >
                                    {searching ? "Searching..." : "View Profile"}
                                </button>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="py-24 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🔖</div>
                                <h3 className="text-xl font-bold text-gray-400">No saved searches yet</h3>
                                <p className="text-gray-400 text-sm mt-2">Your saved searches will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {searching && results === null && (
                    <div className="py-20">
                        <Loading message="Fetching matches..." />
                    </div>
                )}

                {results !== null && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-[#1a1a1a]">
                                Search Results <span className="text-[#FB34AA] ml-2 font-bold bg-[#FB34AA10] px-4 py-1 rounded-full text-lg">{results.length}</span>
                            </h3>
                            <button className="text-gray-400 font-bold hover:text-[#C204E7]" onClick={() => setResults(null)}>Clear Results</button>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {results.map((profile) => (
                                    <MatchCard
                                        key={profile.accountId}
                                        profile={profile}
                                        onPrimaryAction={(e) => {
                                            e.stopPropagation();
                                            handleAction(profile.accountId);
                                        }}
                                        primaryButtonText="View Profile"
                                        onFavorite={() => { }}
                                        isFavorite={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                                <div className="text-6xl mb-6">🏜️</div>
                                <h3 className="text-2xl font-bold text-gray-400">No matches found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters for better results.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
