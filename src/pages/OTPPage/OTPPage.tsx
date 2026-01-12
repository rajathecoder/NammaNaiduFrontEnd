import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { setAuthData } from '../../utils/auth';
import { DeviceInfo } from '../../utils/deviceInfo';

const OTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [timer, setTimer] = useState(28);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get registration data from localStorage
        const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
        if (registrationData.mobile) {
            setMobileNumber(registrationData.mobile);
        }
    }, []);

    useEffect(() => {
        // Focus first input on mount
        inputRefs[0].current?.focus();
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
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
        if (value && index < 4) {
            inputRefs[index + 1].current?.focus();
        }
        
        // Auto-submit when all 5 digits are entered
        if (value && index === 4) {
            const fullOtp = [...newOtp].join('');
            if (fullOtp.length === 5 && /^\d{5}$/.test(fullOtp)) {
                // Small delay to allow user to see the last digit
                setTimeout(() => {
                    const form = inputRefs[0].current?.closest('form');
                    if (form) {
                        form.requestSubmit();
                    }
                }, 100);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('').trim();
        
        // Validate 5-digit OTP
        if (otpValue.length !== 5) {
            alert('Please enter all 5 digits of the OTP');
            // Focus on first empty input
            const firstEmptyIndex = otp.findIndex(digit => !digit);
            if (firstEmptyIndex !== -1) {
                inputRefs[firstEmptyIndex].current?.focus();
            } else {
                inputRefs[0].current?.focus();
            }
            return;
        }
        
        // Validate that all are digits
        if (!/^\d{5}$/.test(otpValue)) {
            alert('OTP must contain only numbers (0-9)');
            return;
        }
        
        setIsVerifying(true);
        
        try {
            // Get registration data from localStorage
            const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
            
            if (!registrationData.mobile || !registrationData.countryCode) {
                alert('Registration data not found. Please register again.');
                navigate('/');
                return;
            }
            
            // Call verify-otp API
            const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.VERIFY_OTP), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: registrationData.mobile,
                    countryCode: registrationData.countryCode,
                    otp: otpValue,
                    name: registrationData.name,
                    gender: registrationData.gender,
                    profileFor: registrationData.profileFor
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.data) {
                // Save token, userId, accountId and userInfo to localStorage
                if (data.data.token && data.data.user) {
                    const user = data.data.user;
                    setAuthData(
                        data.data.token,
                        user.id || 0,
                        user.accountId || '',
                        user
                    );

                    // Register FCM token after OTP verification
                    registerFcmToken(user.accountId || '', data.data.token).catch(err => {
                        console.error('Failed to register FCM token:', err);
                        // Don't block registration if FCM token registration fails
                    });
                }
                
                // Clear registration data
                localStorage.removeItem('registrationData');
                
                // Navigate to Basic Details page
                navigate('/basic-details');
            } else {
                alert(data.message || 'Invalid OTP. Please try again.');
                setIsVerifying(false);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred. Please try again.');
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (canResend) {
            setTimer(28);
            setCanResend(false);
            
            try {
                // Get registration data from localStorage
                const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
                
                if (!registrationData.mobile) {
                    alert('Registration data not found. Please register again.');
                    navigate('/');
                    return;
                }
                
                // Call send-otp API again
                const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.SEND_OTP), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: registrationData.name,
                        gender: registrationData.gender,
                        mobile: registrationData.mobile,
                        countryCode: registrationData.countryCode,
                        profileFor: registrationData.profileFor
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('OTP resent successfully!');
                } else {
                    alert(data.message || 'Failed to resend OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error resending OTP:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    // Register FCM token
    const registerFcmToken = async (accountId: string, token: string) => {
        try {
            const fcmToken = await DeviceInfo.getFcmToken();
            const deviceModel = DeviceInfo.getDeviceModel();
            const deviceIP = await DeviceInfo.getDeviceIP();

            await fetch(getApiUrl(API_ENDPOINTS.DEVICES.STORE_FCM_TOKEN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    uuid: accountId,
                    fcmToken: fcmToken,
                    device: DeviceInfo.deviceType,
                    deviceModel: deviceModel,
                    ip: deviceIP
                })
            });
        } catch (error) {
            console.error('Error registering FCM token:', error);
            // Silently fail - don't block registration
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-8 md:px-4">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center md:flex-col md:gap-3">
                    <img src={logoOnly} alt="Namma Naidu Logo" className="h-11 w-auto md:h-9 sm:h-8" />
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Need help? Call</span>
                        <a href="tel:8144998877" className="text-[#ff6b35] font-semibold text-lg no-underline transition-colors duration-300 hover:text-[#e55a25]">📞 8144-99-88-77</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-4 sm:p-4">
                <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-12 max-w-[600px] w-full md:p-8 sm:p-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-left md:text-2xl">Enter OTP</h2>

                    <div className="flex justify-center mb-8">
                        <div className="w-[120px] h-[120px] rounded-full border-[3px] border-[#4caf50] flex flex-col items-center justify-center gap-2 sm:w-[100px] sm:h-[100px]">
                            <div className="text-4xl sm:text-3xl">📱</div>
                            <div className="text-2xl tracking-widest text-gray-600 sm:text-xl">• • • • •</div>
                        </div>
                    </div>

                    <p className="text-center text-base text-gray-800 mb-10 font-medium">
                        Please enter the 5-digit code sent to {mobileNumber ? `+91 ${mobileNumber}` : 'your mobile number'}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex justify-center gap-4 mb-8 md:gap-3 sm:gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
                                        if (pastedData.length === 5) {
                                            const newOtp = pastedData.split('');
                                            setOtp(newOtp);
                                            inputRefs[4].current?.focus();
                                        }
                                    }}
                                    className="w-[60px] h-[60px] border-2 border-gray-200 rounded-lg text-center text-2xl font-semibold text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#FB34AA] focus:shadow-[0_0_0_3px_rgba(251,52,170,0.1)] md:w-[50px] md:h-[50px] md:text-xl sm:w-[45px] sm:h-[45px] sm:text-lg"
                                    placeholder="0"
                                />
                            ))}
                        </div>
                        {otp.join('').length < 5 && (
                            <p className="text-center text-sm text-[#ff6b35] -mt-6 mb-4 font-medium">Enter 5-digit OTP</p>
                        )}

                        <div className="flex justify-between items-center mb-8 px-4 md:flex-col md:gap-4 md:items-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-600">Didn't receive the OTP?</span>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className={`bg-transparent border-none font-semibold text-sm cursor-pointer p-0 text-left transition-colors duration-300 ${!canResend ? 'text-gray-500 cursor-not-allowed' : 'text-[#ff6b35] hover:text-[#e55a25]'}`}
                                    disabled={!canResend}
                                >
                                    Resend OTP {!canResend && `${timer} sec`}
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 items-end md:items-start">
                                <span className="text-xs text-gray-600">Verify with Missed</span>
                                <a href="tel:+919790770977" className="text-[#ff6b35] font-semibold text-sm no-underline transition-colors duration-300 hover:text-[#e55a25]">
                                    Call to +91 9790770977
                                </a>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-lg text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={isVerifying}>
                            {isVerifying ? 'Verifying...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;

