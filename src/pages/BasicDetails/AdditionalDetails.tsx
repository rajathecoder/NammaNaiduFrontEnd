import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOnly from '../../assets/images/logoonly.png';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';
import { DeviceInfo } from '../../utils/deviceInfo';

const AdditionalDetails = () => {
    const [familyStatus, setFamilyStatus] = useState('');
    const [familyType, setFamilyType] = useState('');
    const [familyValues, setFamilyValues] = useState('');
    const [aboutFamily, setAboutFamily] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!familyStatus) {
            alert('Please select family status');
            return;
        }
        if (!familyType) {
            alert('Please select family type');
            return;
        }
        if (!familyValues) {
            alert('Please select family values');
            return;
        }

        setIsSubmitting(true);

        try {
            // Collect all data from sessionStorage
            const basicDetails = JSON.parse(sessionStorage.getItem('basicDetails') || '{}');
            const personalReligiousDetails = JSON.parse(sessionStorage.getItem('personalReligiousDetails') || '{}');
            const professionalDetails = JSON.parse(sessionStorage.getItem('professionalDetails') || '{}');

            // Prepare API payload
            const payload = {
                email: basicDetails.email,
                password: basicDetails.password,
                dobDay: parseInt(basicDetails.day),
                dobMonth: basicDetails.month,
                dobYear: parseInt(basicDetails.year),
                height: personalReligiousDetails.height,
                physicalStatus: personalReligiousDetails.physicalStatus,
                maritalStatus: personalReligiousDetails.maritalStatus,
                religion: personalReligiousDetails.religion,
                caste: personalReligiousDetails.caste,
                subcaste: personalReligiousDetails.subcaste || '',
                willingToMarryFromAnyCaste: personalReligiousDetails.willingToMarryFromAnyCaste !== false,
                dosham: personalReligiousDetails.dosham || 'No',
                country: professionalDetails.country,
                state: professionalDetails.state,
                city: professionalDetails.city,
                pincode: professionalDetails.pincode,
                district: professionalDetails.district,
                education: professionalDetails.education,
                employmentType: professionalDetails.employmentType,
                occupation: professionalDetails.occupation,
                currency: professionalDetails.currency,
                annualIncome: professionalDetails.income,
                familyStatus: familyStatus,
                familyType: familyType,
                familyValues: familyValues,
                aboutFamily: aboutFamily,
                ...(personalReligiousDetails.houseName ? { houseName: personalReligiousDetails.houseName } : {})
            };

            // Get token from localStorage
            const token = localStorage.getItem('token');

            // Call API
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.BASIC_DETAILS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                // Register FCM token after successful registration completion
                const authData = getAuthData();
                if (authData?.token && authData?.accountId) {
                    registerFcmToken(authData.accountId, authData.token).catch(err => {
                        console.error('Failed to register FCM token:', err);
                        // Don't block registration completion if FCM token registration fails
                    });
                }

                // Clear sessionStorage data
                sessionStorage.removeItem('basicDetails');
                sessionStorage.removeItem('personalReligiousDetails');
                sessionStorage.removeItem('professionalDetails');

                // Navigate to success screen
                navigate('/registration-success');
            } else {
                alert(result.message || 'Failed to save basic details. Please try again.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting basic details:', error);
            alert('An error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Register FCM token
    const registerFcmToken = async (accountId: string, token: string) => {
        try {
            const fcmToken = await DeviceInfo.getFcmToken();
            
            // Skip if no real token was obtained
            if (!fcmToken || fcmToken.startsWith('web_fcm_token_')) {
                console.warn('No real FCM token available, skipping registration');
                return;
            }

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

            console.log('FCM token registered successfully');
        } catch (error) {
            console.error('Error registering FCM token:', error);
            // Silently fail - don't block registration completion
        }
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
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">3</span>
                        <span className="text-gray-500">Professional</span>
                        <span className="h-px flex-1 bg-gray-200 mx-2" />
                        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white flex items-center justify-center font-semibold">4</span>
                        <span className="font-semibold text-gray-800">Additional</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-5 sm:p-4">
                <div className="w-full max-w-[760px] flex justify-center">
                    {/* Form Card */}
                    <div className="w-full bg-white rounded-2xl shadow-xl p-10 md:p-8 sm:p-6 border border-gray-100">
                        <form onSubmit={handleSubmit} className="w-full space-y-7">
                            {/* Title */}
                            <div className="text-center space-y-1">
                                <p className="m-0 text-sm text-gray-500">Step 4 of 4</p>
                                <h3 className="m-0 text-xl font-semibold text-gray-800">Additional Details</h3>
                            </div>

                            {/* Family Status */}
                            <div className="text-center">
                                <label className="block text-sm font-semibold text-gray-800 mb-4">Select family status <span className="text-red-500 font-semibold">*</span></label>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyStatus === 'Middle Class' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyStatus('Middle Class')}
                                    >
                                        Middle Class
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyStatus === 'Upper Middle Class' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyStatus('Upper Middle Class')}
                                    >
                                        Upper Middle Class
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyStatus === 'Rich / Affluent' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyStatus('Rich / Affluent')}
                                    >
                                        Rich / Affluent
                                    </button>
                                </div>
                            </div>

                            {/* Family Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-4">Family Type <span className="text-red-500 font-semibold">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyType === 'Joint' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyType('Joint')}
                                    >
                                        Joint
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyType === 'Nuclear' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyType('Nuclear')}
                                    >
                                        Nuclear
                                    </button>
                                </div>
                            </div>

                            {/* Family Values */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-4">Family Values <span className="text-red-500 font-semibold">*</span></label>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyValues === 'Orthodox' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyValues('Orthodox')}
                                    >
                                        Orthodox
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyValues === 'Traditional' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyValues('Traditional')}
                                    >
                                        Traditional
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyValues === 'Moderate' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyValues('Moderate')}
                                    >
                                        Moderate
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-3 px-6 border-2 rounded-full text-sm text-gray-800 cursor-pointer transition-all duration-300 font-medium ${familyValues === 'Liberal' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] border-[#1B5E20] text-white' : 'border-gray-200 bg-white hover:border-[#1B5E20]'}`}
                                        onClick={() => setFamilyValues('Liberal')}
                                    >
                                        Liberal
                                    </button>
                                </div>
                            </div>

                            {/* About My Family */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">About My Family</label>
                                <textarea
                                    value={aboutFamily}
                                    onChange={(e) => setAboutFamily(e.target.value)}
                                    placeholder="Tell us about your family..."
                                    rows={4}
                                    className="w-full py-3 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 placeholder:text-gray-500 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdditionalDetails;

