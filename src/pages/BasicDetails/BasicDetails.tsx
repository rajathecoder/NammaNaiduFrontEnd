import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

const BasicDetails = () => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [showOtpFields, setShowOtpFields] = useState(false);
    const navigate = useNavigate();
    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        // Focus first OTP input when OTP fields are shown
        if (showOtpFields) {
            otpInputRefs[0].current?.focus();
        }
    }, [showOtpFields]);

    const handleSendOtp = async () => {
        if (!email.trim()) {
            alert('Please enter your email address');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        setIsSendingOtp(true);

        try {
            const payload = {
                mailid: email.trim(),
                isemailid: true
            };

            console.log('📤 BasicDetails - Sending OTP Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(getApiUrl('/api/auth/otp/send'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log('📥 BasicDetails - OTP Response:', JSON.stringify(data, null, 2));

            if (data.status && data.otp) {
                alert(`OTP sent successfully! Your OTP is: ${data.otp}`);
                setShowOtpFields(true);
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numeric input
        if (value && !/^\d$/.test(value)) {
            return;
        }

        // Only allow single digit
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input when a digit is entered
        if (value && index < 5) {
            otpInputRefs[index + 1].current?.focus();
        }

        // Auto-verify when all 6 digits are entered
        const otpValue = newOtp.join('');
        if (otpValue.length === 6 && !isEmailVerified && !isVerifyingOtp) {
            // Small delay to ensure the last digit is set in state, then verify
            setTimeout(() => {
                handleVerifyOtp(otpValue);
            }, 200);
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOtp = async (otpValueOverride?: string) => {
        // Use override if provided (for auto-verify), otherwise use state
        const otpValue = (otpValueOverride || otp.join('')).trim();

        // Validate 6-digit OTP
        if (otpValue.length !== 6) {
            alert('Please enter all 6 digits of the OTP');
            return;
        }

        // Validate that all are digits
        if (!/^\d{6}$/.test(otpValue)) {
            alert('OTP must contain only numbers (0-9)');
            return;
        }

        // Prevent duplicate verification
        if (isVerifyingOtp || isEmailVerified) {
            return;
        }

        setIsVerifyingOtp(true);

        try {
            const payload = {
                mailid: email.trim(),
                otp: otpValue,
                isemailid: true
            };

            console.log('📤 BasicDetails - Verifying OTP Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(getApiUrl('/api/auth/otp/verify'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log('📥 BasicDetails - Verify OTP Response:', JSON.stringify(data, null, 2));

            if (data.status && data.response === 'Verified Successfully') {
                setIsEmailVerified(true);
                setShowOtpFields(false);
                // Clear OTP fields after successful verification
                setOtp(['', '', '', '', '', '']);
                // Show success message without blocking
                const successMsg = document.createElement('div');
                successMsg.textContent = '✓ Email verified successfully!';
                successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
                document.body.appendChild(successMsg);
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            } else {
                // Clear OTP on error for retry
                setOtp(['', '', '', '', '', '']);
                otpInputRefs[0].current?.focus();
                alert(data.response || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEmailVerified) {
            alert('Please verify your email address before continuing');
            return;
        }

        // Save to localStorage
        localStorage.setItem('basicDetails', JSON.stringify({
            day,
            month,
            year,
            email,
            password
        }));

        console.log('Basic Details:', { day, month, year, email, password });
        // Navigate to Personal and Religious Details page
        navigate('/personal-religious-details');
    };

    // Generate days (1-31)
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate years (1950-2010)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 61 }, (_, i) => currentYear - 14 - i);

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
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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
                        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white flex items-center justify-center font-semibold">1</span>
                        <span className="font-semibold text-gray-800">Basic Details</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">2</span>
                        <span className="text-gray-500">Personal & Religious</span>
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
                            {/* Date of Birth */}
                            <div>
                                {/* Center: Step + Title */}
                                <div className="flex flex-col items-center text-center flex-1">
                                    <p className="m-0 text-sm text-gray-500">Step 1 of 4</p>
                                    <h3 className="m-0 text-lg font-semibold text-gray-800">Basic Details</h3>
                                </div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">Date of birth</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <select
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        className="py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20"
                                        required
                                    >
                                        <option value="">Day</option>
                                        {days.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20"
                                        required
                                    >
                                        <option value="">Month</option>
                                        {months.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="py-3 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20"
                                        required
                                    >
                                        <option value="">Year</option>
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Email Verification */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Email {isEmailVerified && <span className="text-green-600">✓ Verified</span>}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setIsEmailVerified(false);
                                            setShowOtpFields(false);
                                            setOtp(['', '', '', '', '', '']);
                                        }}
                                        disabled={isEmailVerified}
                                        className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20 placeholder:text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isEmailVerified || isSendingOtp || !email.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSendingOtp ? 'Sending...' : 'Verify'}
                                    </button>
                                </div>

                                {/* OTP Input Fields - Always show when OTP is sent */}
                                {showOtpFields && (
                                    <div className={`mt-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                                        isEmailVerified 
                                            ? 'bg-green-50 border-green-300' 
                                            : 'bg-gray-50 border-gray-300'
                                    }`}>
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            {isEmailVerified && (
                                                <span className="text-green-600 text-xl">✓</span>
                                            )}
                                            <label className={`block text-sm font-semibold ${
                                                isEmailVerified ? 'text-green-700' : 'text-gray-800'
                                            }`}>
                                                {isEmailVerified 
                                                    ? 'Email verified successfully!' 
                                                    : `Enter OTP sent to ${email}`}
                                            </label>
                                        </div>
                                        {!isEmailVerified && (
                                            <>
                                                <div className="flex justify-center gap-3 mb-4">
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            ref={otpInputRefs[index]}
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                            onPaste={(e) => {
                                                                e.preventDefault();
                                                                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                                                if (pastedData.length === 6) {
                                                                    const newOtp = pastedData.split('');
                                                                    setOtp(newOtp);
                                                                    otpInputRefs[5].current?.focus();
                                                                }
                                                            }}
                                                            className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20"
                                                            placeholder="0"
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={isVerifyingOtp || otp.join('').length !== 6}
                                                    className="w-full py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                                                </button>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    OTP will be verified automatically when all 6 digits are entered
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Create password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20 placeholder:text-gray-500"
                                    minLength={8}
                                    maxLength={20}
                                    required
                                />
                            </div>

                            {/* Next Button */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicDetails;
