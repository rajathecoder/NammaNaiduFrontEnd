import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import marriageCoupleAnimation from '../../assets/images/MarriageCouplehugging.json';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl } from '../../config/api.config';

const RegisterPage = () => {
    const [profileFor, setProfileFor] = useState('Myself');
    const [gender, setGender] = useState('Male');
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [mobile, setMobile] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            alert('Please agree to the Terms & Conditions and Privacy Policy');
            return;
        }

        setIsSubmitting(true);

        try {
            const normalizedMobile = mobile.replace(/\D/g, '');
            if (!normalizedMobile) {
                alert('Please enter a valid mobile number');
                setIsSubmitting(false);
                return;
            }

            // Prepare payload for new OTP API
            const mobileno = `${countryCode}${normalizedMobile}`;
            const payload = {
                mobileno: mobileno,
                isemailid: false
            };

            console.log('📤 RegisterPage - Sending OTP Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(getApiUrl('/api/auth/otp/send'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            console.log('📥 RegisterPage - OTP Response:', JSON.stringify(data, null, 2));

            if (data.status && data.otp) {
                // Store registration data in localStorage for OTP verification
                localStorage.setItem('otpFlow', 'register');
                localStorage.setItem('registrationData', JSON.stringify({
                    name,
                    gender,
                    mobile: normalizedMobile,
                    countryCode,
                    profileFor,
                    mobileno: mobileno,
                    otp: data.otp, // Store OTP for verification
                }));

                alert(`OTP sent successfully! Your OTP is: ${data.otp}`);
                // Navigate to OTP verification page
                navigate('/verify-otp');
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            const message = error instanceof Error ? error.message : 'An error occurred. Please try again.';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen h-full flex flex-col bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-[100]">
                <div className="max-w-[1400px] mx-auto flex flex-row justify-between items-center sm:px-3">
                    <img src={logoOnly} alt="Namma Naidu Logo" className="h-10 w-auto sm:h-8" />
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm sm:hidden">Already a member?</span>
                        <button className="px-5 py-1.5 border-2 border-[#ff6b35] bg-white text-[#ff6b35] rounded-md font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-[#ff6b35] hover:text-white" onClick={() => navigate('/login')}>LOGIN</button>
                        <button className="flex items-center gap-1 px-3.5 py-1.5 border border-gray-300 bg-white rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-gray-100">
                            <span className="inline-flex items-center justify-center w-[18px] h-[18px] border-2 border-gray-600 rounded-full text-xs font-bold">?</span> Help
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-row max-w-[1400px] mx-auto w-full py-8 px-6 gap-8 items-center min-h-0">
                {/* Left Side - Lottie Animation */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[500px]">
                        <Lottie
                            animationData={marriageCoupleAnimation}
                            loop={true}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[450px] bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white py-5 px-5 text-center">
                            <h2 className="m-0 text-xl font-semibold">Create a Matrimony Profile</h2>
                        </div>

                        <form onSubmit={handleRegister} className="p-6 sm:p-5">
                            <div className="text-center text-base font-semibold text-gray-800 mb-6">Find your perfect match</div>

                            {/* Profile Created For */}
                            <div className="mb-6">
                                <label className="block text-xs text-gray-600 mb-0 font-medium text-left">Profile created for</label>
                                <div className="flex gap-3 items-stretch flex-row w-full">
                                    <select
                                        value={profileFor}
                                        onChange={(e) => setProfileFor(e.target.value)}
                                        className="flex-1 py-3 px-3.5 border border-gray-300 rounded text-sm transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:border-[#a413ed] focus:shadow-[0_0_0_2px_rgba(251,52,170,0.1)]"
                                    >
                                        <option>Myself</option>
                                        <option>Son</option>
                                        <option>Daughter</option>
                                        <option>Brother</option>
                                        <option>Sister</option>
                                        <option>Friend</option>
                                        <option>Relative</option>
                                    </select>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="flex-1 py-3 px-3.5 border border-gray-300 rounded text-sm transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:border-[#a413ed] focus:shadow-[0_0_0_2px_rgba(251,52,170,0.1)]"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="mb-6">
                                <label className="block text-xs text-gray-600 mb-2 font-medium text-left">Name</label>
                                <input
                                    type="text"
                                    placeholder="Raja"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full py-3 px-3.5 border border-gray-300 rounded text-sm transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:border-[#a413ed] focus:shadow-[0_0_0_2px_rgba(251,52,170,0.1)]"
                                    required
                                />
                            </div>

                            {/* Mobile Number */}
                            <div className="mb-6">
                                <div className="flex gap-3 items-stretch flex-row w-full">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="w-20 py-3 px-3.5 border border-gray-300 rounded text-sm transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:border-[#a413ed] focus:shadow-[0_0_0_2px_rgba(251,52,170,0.1)]"
                                    >
                                        <option>+91</option>
                                        <option>+1</option>
                                        <option>+44</option>
                                        <option>+65</option>
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="9865614558"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="flex-1 min-w-[200px] text-base py-3.5 px-4 border border-gray-300 rounded transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:border-[#a413ed] focus:shadow-[0_0_0_2px_rgba(251,52,170,0.1)]"
                                        required
                                    />
                                </div>
                                <small className="block text-xs text-gray-500 mt-1.5">OTP will be sent to this number</small>
                            </div>

                            {/* Register Button */}
                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 mt-3.5 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending OTP...' : 'REGISTER FREE →'}
                            </button>

                            {/* Terms and Conditions */}
                            <div className="mt-5 text-xs text-gray-600">
                                <label className="flex gap-2 cursor-pointer items-start">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-0.5 cursor-pointer"
                                    />
                                    <span>
                                        *By clicking register free, I agree to the{' '}
                                        <a href="#" className="text-[#a413ed] no-underline hover:underline">T&C</a> and{' '}
                                        <a href="#" className="text-[#a413ed] no-underline hover:underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;


