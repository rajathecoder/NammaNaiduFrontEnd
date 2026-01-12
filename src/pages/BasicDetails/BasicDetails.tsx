import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';

const BasicDetails = () => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

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

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#FB34AA] focus:ring-2 focus:ring-[#FB34AA]/20 placeholder:text-gray-500"
                                    required
                                />
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
