import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import { useMasterData } from '../../hooks/useMasterData';

interface PartnerPreferenceData {
    ageMin: number | '';
    ageMax: number | '';
    heightMin: string;
    heightMax: string;
    religions: string[];
    castes: string[];
    willingToMarryFromAnyCaste: boolean;
    educations: string[];
    occupations: string[];
    incomeMin: string;
    incomeMax: string;
    locations: string[];
    maritalStatuses: string[];
    dosham: string;
    diet: string;
}

const PartnerPreferences = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const { masters, loading: mastersLoading } = useMasterData(['religion', 'caste', 'education', 'occupation']);

    const [form, setForm] = useState<PartnerPreferenceData>({
        ageMin: 18,
        ageMax: 35,
        heightMin: '',
        heightMax: '',
        religions: [],
        castes: [],
        willingToMarryFromAnyCaste: false,
        educations: [],
        occupations: [],
        incomeMin: '',
        incomeMax: '',
        locations: [],
        maritalStatuses: [],
        dosham: 'Does not matter',
        diet: 'Does not matter',
    });

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const auth = getAuthData();
            if (!auth?.token) return;
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.PARTNER_PREFERENCES), {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
            });
            const json = await res.json();
            if (json.success && json.data) {
                const d = json.data;
                setForm({
                    ageMin: d.ageMin ?? 18,
                    ageMax: d.ageMax ?? 35,
                    heightMin: d.heightMin ?? '',
                    heightMax: d.heightMax ?? '',
                    religions: d.religions ?? [],
                    castes: d.castes ?? [],
                    willingToMarryFromAnyCaste: d.willingToMarryFromAnyCaste ?? false,
                    educations: d.educations ?? [],
                    occupations: d.occupations ?? [],
                    incomeMin: d.incomeMin ?? '',
                    incomeMax: d.incomeMax ?? '',
                    locations: d.locations ?? [],
                    maritalStatuses: d.maritalStatuses ?? [],
                    dosham: d.dosham ?? 'Does not matter',
                    diet: d.diet ?? 'Does not matter',
                });
            }
        } catch (err) {
            console.error('Error loading partner preferences:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMsg('');
        try {
            const auth = getAuthData();
            if (!auth?.token) return;
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.PARTNER_PREFERENCES), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) {
                setSuccessMsg('Partner preferences saved successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                alert(json.message || 'Failed to save preferences');
            }
        } catch (err) {
            console.error('Error saving partner preferences:', err);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleArrayItem = (field: keyof PartnerPreferenceData, value: string) => {
        setForm((prev) => {
            const arr = prev[field] as string[];
            return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
        });
    };

    const ChipSelect = ({ label, options, field, selected }: { label: string; options: string[]; field: keyof PartnerPreferenceData; selected: string[] }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggleArrayItem(field, opt)}
                        className={`py-2 px-4 border-2 rounded-full text-sm cursor-pointer transition-all duration-200 font-medium ${selected.includes(opt) ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] border-[#a413ed] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-[#a413ed]'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    const SingleSelect = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
        <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={`py-2 px-4 border-2 rounded-full text-sm cursor-pointer transition-all duration-200 font-medium ${value === opt ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] border-[#a413ed] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-[#a413ed]'}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    const heightOptions = ["4'0\"", "4'6\"", "5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\"", "6'4\"", "6'6\""];
    const incomeOptions = ['No Income', 'Below 2 Lakh', '2-4 Lakh', '4-7 Lakh', '7-10 Lakh', '10-15 Lakh', '15-25 Lakh', '25-50 Lakh', '50 Lakh - 1 Crore', 'Above 1 Crore'];
    const maritalOptions = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
    const doshamOptions = ['Yes', 'No', 'Does not matter'];
    const dietOptions = ['Vegetarian', 'Non-Vegetarian', 'Does not matter'];

    if (isLoading || mastersLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#a413ed]" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Partner Preferences</h1>
                        <p className="text-sm text-gray-500 mt-1">Set your ideal partner criteria to get better matches</p>
                    </div>
                    <button onClick={() => navigate('/my-profile')} className="text-sm text-[#a413ed] hover:underline font-medium">
                        Back to Profile
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">{successMsg}</div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                    {/* Age Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Age Range</label>
                        <div className="flex items-center gap-4">
                            <input type="number" min={18} max={100} value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value ? parseInt(e.target.value) : '' })}
                                className="w-24 py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed] focus:ring-2 focus:ring-[#a413ed]/20" placeholder="Min" />
                            <span className="text-gray-400">to</span>
                            <input type="number" min={18} max={100} value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value ? parseInt(e.target.value) : '' })}
                                className="w-24 py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed] focus:ring-2 focus:ring-[#a413ed]/20" placeholder="Max" />
                            <span className="text-sm text-gray-500">years</span>
                        </div>
                    </div>

                    {/* Height Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Height Range</label>
                        <div className="flex items-center gap-4">
                            <select value={form.heightMin} onChange={(e) => setForm({ ...form, heightMin: e.target.value })}
                                className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed]">
                                <option value="">Min Height</option>
                                {heightOptions.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className="text-gray-400">to</span>
                            <select value={form.heightMax} onChange={(e) => setForm({ ...form, heightMax: e.target.value })}
                                className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed]">
                                <option value="">Max Height</option>
                                {heightOptions.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Marital Status */}
                    <ChipSelect label="Marital Status" options={maritalOptions} field="maritalStatuses" selected={form.maritalStatuses} />

                    {/* Religion */}
                    <ChipSelect label="Religion" options={(masters.religion || []).map((m) => m.name)} field="religions" selected={form.religions} />

                    {/* Caste */}
                    <div>
                        <ChipSelect label="Caste" options={(masters.caste || []).map((m) => m.name)} field="castes" selected={form.castes} />
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                            <input type="checkbox" checked={form.willingToMarryFromAnyCaste} onChange={(e) => setForm({ ...form, willingToMarryFromAnyCaste: e.target.checked })}
                                className="w-4 h-4 text-[#a413ed] border-gray-300 rounded focus:ring-[#a413ed]" />
                            <span className="text-sm text-gray-600">Willing to marry from any caste</span>
                        </label>
                    </div>

                    {/* Education */}
                    <ChipSelect label="Education" options={(masters.education || []).map((m) => m.name)} field="educations" selected={form.educations} />

                    {/* Occupation */}
                    <ChipSelect label="Occupation" options={(masters.occupation || []).map((m) => m.name)} field="occupations" selected={form.occupations} />

                    {/* Income Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Annual Income Range</label>
                        <div className="flex items-center gap-4">
                            <select value={form.incomeMin} onChange={(e) => setForm({ ...form, incomeMin: e.target.value })}
                                className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed]">
                                <option value="">Min Income</option>
                                {incomeOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                            <span className="text-gray-400">to</span>
                            <select value={form.incomeMax} onChange={(e) => setForm({ ...form, incomeMax: e.target.value })}
                                className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#a413ed]">
                                <option value="">Max Income</option>
                                {incomeOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Dosham */}
                    <SingleSelect label="Dosham Preference" options={doshamOptions} value={form.dosham} onChange={(v) => setForm({ ...form, dosham: v })} />

                    {/* Diet */}
                    <SingleSelect label="Diet Preference" options={dietOptions} value={form.diet} onChange={(v) => setForm({ ...form, diet: v })} />

                    {/* Save */}
                    <button onClick={handleSave} disabled={isSaving}
                        className="w-full py-4 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerPreferences;
