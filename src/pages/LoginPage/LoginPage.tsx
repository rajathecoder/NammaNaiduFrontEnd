import { useState } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import familyAnimation from '../../assets/images/family.json';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { setAuthData } from '../../utils/auth';
import { DeviceInfo } from '../../utils/deviceInfo';
import { isValidEmail, isValidMobile } from '../../utils/validation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email or mobile
        const isEmail = isValidEmail(email);
        const isMobile = isValidMobile(email.replace(/\D/g, ''));

        if (!isEmail && !isMobile) {
             alert('Please enter a valid email address or 10-digit mobile number');
             return;
        }

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                if (data.data.isAdmin) {
                    // Store admin token and info
                    localStorage.setItem('adminToken', data.data.token);
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
                    localStorage.setItem('adminRole', data.data.admin?.role || 'Super Admin');
                    // Redirect to admin dashboard
                    navigate('/admin/dashboard');
                } else {
                    // Store user token, userId, accountId and info (including refresh token)
                    const user = data.data.user;
                    setAuthData(
                        data.data.token,
                        user.id || 0,
                        user.accountId || '',
                        user,
                        data.data.refreshToken
                    );

                    // Register FCM token after successful login
                    registerFcmToken(user.accountId || '', data.data.token).catch(err => {
                        console.error('Failed to register FCM token:', err);
                        // Don't block login if FCM token registration fails
                    });

                    // Check if basicDetails exists, if not redirect to personal-religious-details screen
                    if (!data.data.hasBasicDetails) {
                        navigate('/personal-religious-details');
                    } else {
                        // Redirect to home page
                        navigate('/home');
                    }
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server. Please try again.');
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
            // Silently fail - don't block login
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-3 px-6">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <img src={logoOnly} alt="Namma Naidu Logo" className="h-10 w-auto" />
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2 border-2 border-[#ff6b35] bg-white text-[#ff6b35] rounded-md font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-[#ff6b35] hover:text-white" onClick={() => navigate('/')}>
                            Register Free
                        </button>
                        <button className="flex items-center gap-1 px-3.5 py-1.5 border border-gray-300 bg-white rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-gray-100">
                            <span className="inline-flex items-center justify-center w-[18px] h-[18px] border-2 border-gray-600 rounded-full text-xs font-bold">?</span> Help
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-row max-w-[1400px] mx-auto w-full py-8 px-6 gap-8 items-center min-h-0">
                {/* Left Side - App Download & Lottie Animation */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 leading-snug">
                        To speed up your partner search,
                        <br />
                        download <span className="font-bold bg-gradient-to-r from-[#a413ed] to-[#8b10c9] bg-clip-text text-transparent">Namma Naidu App</span>
                    </h2>

                    <div className="w-full max-w-[400px] mb-6">
                        <Lottie
                            animationData={familyAnimation}
                            loop={true}
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="flex gap-4 mb-6 justify-center">
                        <a href="#" className="block">
                            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" className="h-[45px] w-auto" />
                        </a>
                        <a href="#" className="block">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-[45px] w-auto" />
                        </a>
                    </div>

                    <div className="border-t border-gray-200 pt-6 w-full max-w-[400px]">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Namma Naidu Matrimony App</p>
                        <div className="flex items-center gap-2 mb-2 justify-center">
                            <span className="text-2xl font-bold text-gray-800">4.7</span>
                            <span className="text-lg">⭐⭐⭐⭐</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[450px] bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white py-5 px-5 text-center">
                            <h2 className="m-0 text-xl font-semibold">Member Login</h2>
                        </div>

                        <form onSubmit={handleLogin} className="py-7 px-6 sm:py-6 sm:px-5">
                            <div className="mb-5 relative">
                                <input
                                    type="text"
                                    placeholder="E-mail or Mobile Number"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border"
                                    required
                                />
                            </div>

                            <div className="mb-5 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-xl p-1"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    👁️
                                </button>
                            </div>

                            <div className="mb-5">
                                <label className="flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={keepLoggedIn}
                                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                        className="mr-2 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-700">Keep me logged in</span>
                                </label>
                            </div>

                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)]">
                                LOGIN
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-600 mb-2 font-semibold">Trouble logging in?</p>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem('registrationData');
                                            localStorage.setItem('otpFlow', 'login');
                                            navigate('/verify-otp');
                                        }}
                                        className="text-[#a413ed] no-underline text-xs transition-colors duration-300 hover:text-[#8b10c9] hover:underline"
                                    >
                                        Login with OTP
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-[#a413ed] no-underline text-xs transition-colors duration-300 hover:text-[#8b10c9] hover:underline bg-transparent border-none cursor-pointer"
                                    >Forgot Password?</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;


