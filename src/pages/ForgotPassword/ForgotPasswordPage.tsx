import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('If this email is registered, an OTP has been sent.');
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        setMessage('Password reset successfully!');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <img src={logoOnly} alt="Namma Naidu Logo" className="h-10 w-auto cursor-pointer" onClick={() => navigate('/')} />
          <button
            className="px-5 py-2 border-2 border-[#a413ed] bg-white text-[#a413ed] rounded-md font-semibold text-sm cursor-pointer transition-all duration-300 hover:bg-[#a413ed] hover:text-white"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[450px] bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white py-5 px-5 text-center">
            <h2 className="m-0 text-xl font-semibold">
              {step === 'email' && 'Forgot Password'}
              {step === 'otp' && 'Enter OTP & New Password'}
              {step === 'success' && 'Password Reset'}
            </h2>
            <p className="text-sm opacity-80 mt-1">
              {step === 'email' && 'Enter your registered email to receive a reset OTP'}
              {step === 'otp' && `OTP sent to ${email}`}
              {step === 'success' && 'Your password has been updated'}
            </p>
          </div>

          <div className="py-7 px-6">
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {message && !error && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {message}
              </div>
            )}

            {/* Step 1: Email input */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset OTP'}
                </button>
              </form>
            )}

            {/* Step 2: OTP + New Password */}
            {step === 'otp' && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                  <input
                    type="text"
                    placeholder="Enter the 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border text-center text-2xl tracking-[0.5em]"
                    required
                  />
                </div>
                <div className="mb-5 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[38px] bg-transparent border-none cursor-pointer text-xl p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 px-3.5 border-2 border-gray-200 rounded-md text-sm transition-all duration-300 focus:outline-none focus:border-[#a413ed] box-border"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); setMessage(''); setOtp(''); }}
                  className="w-full mt-3 py-2 bg-transparent text-[#a413ed] border border-[#a413ed] rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-[#a413ed] hover:text-white"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-gray-600 mb-6">Your password has been reset successfully. You can now login with your new password.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,53,0.4)]"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
