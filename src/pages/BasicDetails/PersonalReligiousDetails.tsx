import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import useMasterData from '../../hooks/useMasterData';

const PersonalReligiousDetails = () => {
    const [height, setHeight] = useState('');
    const [physicalStatus, setPhysicalStatus] = useState('Normal');
    const [maritalStatus, setMaritalStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
    const [subcaste, setSubcaste] = useState('');
    const [houseName, setHouseName] = useState('');
    const [willingToMarryFromAnyCaste, setWillingToMarryFromAnyCaste] = useState(true);
    const [dosham, setDosham] = useState('No');
    const navigate = useNavigate();
  const { masters, loading: mastersLoading, error: mastersError, refetch } = useMasterData([
    'religion',
    'caste',
  ]);
  const religionOptions = masters.religion ?? [];
  const casteOptions = masters.caste ?? [];

  useEffect(() => {
    if (!religion && religionOptions.length) {
      setReligion(religionOptions[0].name);
    }
  }, [religion, religionOptions]);

  useEffect(() => {
    if (!caste && casteOptions.length) {
      setCaste(casteOptions[0].name);
    }
  }, [caste, casteOptions]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!physicalStatus) {
            alert('Please select your physical status');
            return;
        }
        if (!maritalStatus) {
            alert('Please select your marital status');
            return;
        }
        
        // Save to sessionStorage
        sessionStorage.setItem('personalReligiousDetails', JSON.stringify({
            height,
            physicalStatus,
            maritalStatus,
            religion,
            caste,
            subcaste,
            houseName,
            willingToMarryFromAnyCaste,
            dosham
        }));
        // Navigate to Professional Details page
        navigate('/professional-details');
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Generate height options (4'0" to 7'0")
    const heights = [];
    for (let feet = 4; feet <= 7; feet++) {
        for (let inches = 0; inches < 12; inches++) {
            if (feet === 7 && inches > 0) break;
            heights.push(`${feet}' ${inches}"`);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdf4ff] via-white to-[#eef2ff] text-gray-900">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur border-b border-gray-200 py-4 px-6 md:px-4 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <img src={logoOnly} alt="Namma Naidu Logo" className="h-10 w-auto md:h-9 sm:h-8" />
                    </div>

                    {/* Right: Help CTA */}
                    <div className="flex items-center gap-2 text-sm justify-end">
                        <span className="text-gray-600">Need help?</span>
                        <a
                            href="tel:8144998877"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <span className="text-base">📞</span>
                            8144-99-88-77
                        </a>
                    </div>
                </div>
            </header>

            {/* Progress Indicator */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1200px] mx-auto px-6 py-3 md:px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">1</span>
                        <span className="text-gray-500">Basic Details</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white flex items-center justify-center font-semibold">2</span>
                        <span className="font-semibold text-gray-800">Personal & Religious</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">3</span>
                        <span className="text-gray-500">Professional</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">4</span>
                        <span className="text-gray-500">Additional</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-5 sm:p-4">
                <div className="w-full max-w-[760px] flex justify-center">
                    {/* Form Card */}
                    <div className="w-full bg-white rounded-2xl shadow-xl p-10 md:p-8 sm:p-6 border border-gray-100">
                        <form onSubmit={handleNext} className="w-full space-y-7">
                            {/* Title */}
                            <div className="text-center space-y-1">
                                <p className="m-0 text-sm text-gray-500">Step 2 of 4</p>
                                <h3 className="m-0 text-xl font-semibold text-gray-800">Personal & Religious Details</h3>
                            </div>

                            {/* Height */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Height</label>
                                <select
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20"
                                    required
                                >
                                    <option value="">Select your height</option>
                                    {heights.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Physical Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Your physical status <span className="text-[#1B5E20] font-semibold">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${physicalStatus === 'Normal' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setPhysicalStatus('Normal')}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${physicalStatus === 'Physically challenged' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setPhysicalStatus('Physically challenged')}
                                    >
                                        Physically challenged
                                    </button>
                                </div>
                            </div>

                            {/* Marital Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Your marital status <span className="text-[#1B5E20] font-semibold">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${maritalStatus === 'Never married' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setMaritalStatus('Never married')}
                                    >
                                        Never married
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${maritalStatus === 'Widower' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setMaritalStatus('Widower')}
                                    >
                                        Widower
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${maritalStatus === 'Awaiting divorce' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setMaritalStatus('Awaiting divorce')}
                                    >
                                        Awaiting divorce
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${maritalStatus === 'Divorced' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setMaritalStatus('Divorced')}
                                    >
                                        Divorced
                                    </button>
                                </div>
                            </div>

                            {/* Religion Section */}
                            <div className="space-y-5">
                                <h4 className="text-lg font-semibold text-gray-800 m-0 text-center">Religion</h4>

                                {/* Religion and Caste in one row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Religion */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Religion</label>
                                        <select
                                            value={religion}
                                            onChange={(e) => setReligion(e.target.value)}
                                            className="w-full py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 disabled:opacity-50"
                                            required
                                            disabled={!religionOptions.length}
                                        >
                                            <option value="">Select religion</option>
                                            {religionOptions.map((item) => (
                                                <option key={item.id} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {mastersLoading && (
                                            <p className="text-xs text-gray-600 mt-1">Loading religion options...</p>
                                        )}
                                        {mastersError && (
                                            <p className="text-xs text-[#b91c1c] mt-1">
                                                {mastersError} <button type="button" onClick={refetch} className="ml-1 border-none bg-transparent text-inherit font-semibold cursor-pointer underline p-0">Retry</button>
                                            </p>
                                        )}
                                    </div>

                                    {/* Caste */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Caste</label>
                                        <select
                                            value={caste}
                                            onChange={(e) => setCaste(e.target.value)}
                                            className="w-full py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 disabled:opacity-50"
                                            required
                                            disabled={!casteOptions.length}
                                        >
                                            <option value="">Select caste</option>
                                            {casteOptions.map((item) => (
                                                <option key={item.id} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {mastersLoading && (
                                            <p className="text-xs text-gray-600 mt-1">Loading caste options...</p>
                                        )}
                                        {mastersError && (
                                            <p className="text-xs text-[#b91c1c] mt-1">
                                                {mastersError} <button type="button" onClick={refetch} className="ml-1 border-none bg-transparent text-inherit font-semibold cursor-pointer underline p-0">Retry</button>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Subcaste */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter subcaste (Optional)"
                                        value={subcaste}
                                        onChange={(e) => setSubcaste(e.target.value)}
                                        className="w-full py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 box-border focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 placeholder:text-gray-500"
                                    />
                                </div>

                                {/* House Name */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">House Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your house name"
                                        value={houseName}
                                        onChange={(e) => setHouseName(e.target.value)}
                                        className="w-full py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 box-border focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Willing to marry from any caste */}
                            <div>
                                <label className="flex items-center cursor-pointer select-none text-sm text-gray-800">
                                    <input
                                        type="checkbox"
                                        checked={willingToMarryFromAnyCaste}
                                        onChange={(e) => setWillingToMarryFromAnyCaste(e.target.checked)}
                                        className="mr-3 h-4 w-4 accent-[#1B5E20]"
                                    />
                                    <span>Willing to marry from any caste</span>
                                </label>
                            </div>

                            {/* Dosham */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Do you have any dosham? <span className="text-gray-500 font-normal">(Optional)</span></label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${dosham === 'No' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setDosham('No')}
                                    >
                                        No
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${dosham === 'Yes' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setDosham('Yes')}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-4 border rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-200 font-medium ${dosham === "Don't know" ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setDosham("Don't know")}
                                    >
                                        Don't know
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-1/3 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:border-[#1B5E20] hover:text-[#1B5E20] bg-white"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalReligiousDetails;

