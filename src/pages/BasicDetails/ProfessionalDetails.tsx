import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import useMasterData from '../../hooks/useMasterData';

interface PostOffice {
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
}

interface PincodeResponse {
    Message: string;
    Status: string;
    PostOffice: PostOffice[];
}

const ProfessionalDetails = () => {
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [district, setDistrict] = useState('');
    const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [education, setEducation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [occupation, setOccupation] = useState('');
  const [currency, setCurrency] = useState('');
  const [income, setIncome] = useState('');
    const navigate = useNavigate();
  const { masters, loading: mastersLoading, error: mastersError, refetch } = useMasterData([
    'education',
    'employment-type',
    'occupation',
    'income-currency',
    'income-range',
  ]);

  const educationOptions = masters.education ?? [];
  const employmentOptions = masters['employment-type'] ?? [];
  const occupationOptions = masters.occupation ?? [];
  const currencyOptions = masters['income-currency'] ?? [];
  const incomeOptions = masters['income-range'] ?? [];

  useEffect(() => {
    if (!education && educationOptions.length) {
      setEducation(educationOptions[0].name);
    }
  }, [education, educationOptions]);

  useEffect(() => {
    if (!employmentType && employmentOptions.length) {
      setEmploymentType(employmentOptions[0].name);
    }
  }, [employmentType, employmentOptions]);

  useEffect(() => {
    if (!occupation && occupationOptions.length) {
      setOccupation(occupationOptions[0].name);
    }
  }, [occupation, occupationOptions]);

  useEffect(() => {
    if (!currency && currencyOptions.length) {
      setCurrency(currencyOptions[0].name);
    }
  }, [currency, currencyOptions]);

  useEffect(() => {
    if (!income && incomeOptions.length) {
      setIncome(incomeOptions[0].name);
    }
  }, [income, incomeOptions]);

  // Fetch pincode details when pincode is entered
  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        setLoadingPincode(true);
        setPincodeError(null);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data: PincodeResponse[] = await response.json();
          
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffices = data[0].PostOffice;
            setPostOffices(postOffices);
            
            // Auto-fill district, state, country from first post office
            if (postOffices[0]) {
              setDistrict(postOffices[0].District);
              setState(postOffices[0].State);
              setCountry(postOffices[0].Country);
              
              // Auto-select first post office name as city if available
              if (postOffices[0].Name && !city) {
                setCity(postOffices[0].Name);
              }
            }
          } else {
            setPincodeError('Invalid pincode or no data found');
            setPostOffices([]);
            setDistrict('');
            setState('');
            setCountry('');
            setCity(''); // Clear city when pincode is invalid
          }
        } catch (error) {
          console.error('Error fetching pincode details:', error);
          setPincodeError('Failed to fetch pincode details');
          setPostOffices([]);
        } finally {
          setLoadingPincode(false);
        }
      } else if (pincode.length === 0) {
        // Reset when pincode is cleared
        setPostOffices([]);
        setDistrict('');
        setState('');
        setCountry('');
        setPincodeError(null);
        // Keep city value if user manually entered it
      }
    };

    // Debounce pincode API call
    const timeoutId = setTimeout(() => {
      fetchPincodeDetails();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pincode]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!country && !district) {
            alert('Please enter pincode or select a country');
            return;
        }
        if (!state && !district) {
            alert('Please enter pincode or select a state');
            return;
        }
        if (postOffices.length > 0 && !city) {
            alert('Please select a city');
            return;
        }
        if (postOffices.length === 0 && !city) {
            alert('Please enter a city');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('professionalDetails', JSON.stringify({
            country,
            state,
            city,
            pincode,
            district,
            education,
            employmentType,
            occupation,
            currency,
            income
        }));
        
        console.log('Professional Details:', {
            country,
            state,
            city,
            education,
            employmentType,
            occupation,
            currency,
            income
        });
        // Navigate to Additional Details page (Step 4)
        navigate('/additional-details');
    };

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
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">2</span>
                        <span className="text-gray-500">Personal & Religious</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white flex items-center justify-center font-semibold">3</span>
                        <span className="font-semibold text-gray-800">Professional</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">4</span>
                        <span className="text-gray-500">Additional</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-4 sm:p-4">
                <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-12 max-w-[900px] w-full md:p-8 sm:p-6">
                    <form onSubmit={handleNext} className="w-full">

                        {/* Location Details */}
                        <div className="relative mb-7">
                            <label className="block text-sm font-medium text-gray-800 mb-2">Pincode</label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setPincode(value);
                                }}
                                className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20]"
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                            />
                            {loadingPincode && <p className="text-xs text-gray-500 mt-1 italic">Fetching details...</p>}
                            {pincodeError && <p className="text-xs text-[#b91c1c] mt-1">{pincodeError}</p>}
                        </div>

                        {district && (
                            <div className="relative mb-7">
                                <label className="block text-sm font-medium text-gray-800 mb-2">District</label>
                                <input
                                    type="text"
                                    value={district}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-100 cursor-not-allowed transition-all duration-300"
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-7">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">State <span className="text-[#1B5E20] font-semibold">*</span></label>
                                {district ? (
                                    <input
                                        type="text"
                                        value={state}
                                        className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-100 cursor-not-allowed transition-all duration-300"
                                        readOnly
                                    />
                                ) : (
                                    <select
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20]"
                                        required
                                    >
                                        <option value="">Select state</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    </select>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">Country <span className="text-[#1B5E20] font-semibold">*</span></label>
                                {district ? (
                                    <input
                                        type="text"
                                        value={country}
                                        className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-100 cursor-not-allowed transition-all duration-300"
                                        readOnly
                                    />
                                ) : (
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20]"
                                        required
                                    >
                                        <option value="">Select country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        {postOffices.length > 0 && (
                            <div className="relative mb-7">
                                <label className="block text-sm font-medium text-gray-800 mb-2">City <span className="text-[#1B5E20] font-semibold">*</span></label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20]"
                                    required
                                >
                                    <option value="">Select city</option>
                                    {postOffices.map((office, index) => (
                                        <option key={index} value={office.Name}>
                                            {office.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {!postOffices.length && (
                            <div className="relative mb-7">
                                <label className="block text-sm font-medium text-gray-800 mb-2">City <span className="text-[#1B5E20] font-semibold">*</span></label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20]"
                                    placeholder="Enter city"
                                    required
                                />
                            </div>
                        )}

                        {/* Professional Details */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 mt-4">Professional Details</h3>

                        <div className="grid grid-cols-2 gap-4 mb-7">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">Educational Details</label>
                                <select
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20] disabled:opacity-50"
                                    required
                                    disabled={!educationOptions.length}
                                >
                                    <option value="">Select education</option>
                                    {educationOptions.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">Employment Type</label>
                                <select
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20] disabled:opacity-50"
                                    required
                                    disabled={!employmentOptions.length}
                                >
                                    <option value="">Select employment type</option>
                                    {employmentOptions.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="relative mb-7">
                            <label className="block text-sm font-medium text-gray-800 mb-2">Occupation</label>
                            <select
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20] disabled:opacity-50"
                                required
                                disabled={!occupationOptions.length}
                            >
                                <option value="">Select occupation</option>
                                {occupationOptions.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Annual Income */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 mt-4">Annual Income</h3>

                        <div className="grid grid-cols-2 gap-4 mb-7">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">Annual Income Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20] disabled:opacity-50"
                                    required
                                    disabled={!currencyOptions.length}
                                >
                                    <option value="">Select currency</option>
                                    {currencyOptions.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.code ? `${item.code} - ${item.name}` : item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-800 mb-2">Annual Income</label>
                                <select
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="w-full py-3.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-[#1B5E20] focus:shadow-[0_0_0_1px_#1B5E20] disabled:opacity-50"
                                    required
                                    disabled={!incomeOptions.length}
                                >
                                    <option value="">Select income range</option>
                                    {incomeOptions.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(mastersLoading || mastersError) && (
                            <div className="mb-7">
                                {mastersLoading && <p className="text-xs text-gray-600 my-1">Loading master data...</p>}
                                {mastersError && (
                                    <p className="text-xs text-[#b91c1c] my-1">
                                        {mastersError}{' '}
                                        <button type="button" onClick={refetch} className="ml-1 border-none bg-transparent text-inherit font-semibold cursor-pointer underline p-0">
                                            Retry
                                        </button>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Next Button */}
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDetails;

