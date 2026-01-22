import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import { getSubscriptionPlans, purchaseSubscription, type SubscriptionPlan } from '../../services/api/subscription.api';
import { getAuthData } from '../../utils/auth';
import logoOnly from '../../assets/images/logoonly.png';

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [planType, setPlanType] = useState<'months' | 'year'>('months');
    const [error, setError] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, [planType]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            // Public endpoint - no token required
            const response = await getSubscriptionPlans(
                { status: 'active', planType },
                undefined // No token needed for public endpoint
            );

            if (response.success && response.data) {
                setPlans(response.data);
            } else {
                setError(response.message || 'Failed to fetch plans');
            }
        } catch (err: any) {
            console.error('Error fetching plans:', err);
            setError(err.message || 'Error loading subscription plans');
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = (plan: SubscriptionPlan) => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }
        setSelectedPlan(plan);
        setShowConfirmModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedPlan) return;

        try {
            setProcessingPayment(true);
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            const response = await purchaseSubscription(selectedPlan.id, authData.token);

            if (response.success) {
                // Update local storage manually to reflect new balance immediately for Header
                const currentAuthData = getAuthData();
                if (currentAuthData && currentAuthData.userInfo && response.data?.newBalance !== undefined) {
                    const updatedUserInfo = { ...currentAuthData.userInfo, profileViewTokens: response.data.newBalance };

                    // Update userInfo in localStorage
                    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

                    // Also update the full auth data object if it exists separately
                    // (Assuming getAuthData logic reads from 'userInfo' key or 'authData' key)
                    // Based on getAuthData util usually reading specific keys.
                }

                alert(`Payment Successful! ${response.message || ''}`);
                navigate('/home');
            } else {
                alert(response.message || 'Payment failed');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            alert(error.message || 'An error occurred during payment');
        } finally {
            setProcessingPayment(false);
            setShowConfirmModal(false);
            setSelectedPlan(null);
        }
    };

    const monthlyPlans = plans.filter(p => p.planType === 'months');
    const yearlyPlans = plans.filter(p => p.planType === 'year');

    return (
        <div className="min-h-screen bg-white py-8 px-4 md:py-4 md:px-2">
            <div className="text-center mb-8">
                <img src={logoOnly} alt="Namma Naidu Logo" className="h-[60px] w-auto mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 m-0 md:text-2xl">Nanma Naidu Membership Plans</h1>
            </div>

            <div className="max-w-[1200px] mx-auto bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative md:p-6">
                <button
                    className="absolute top-4 right-4 w-10 h-10 border-none bg-gray-100 rounded-full text-2xl font-light text-gray-600 cursor-pointer flex items-center justify-center transition-all duration-300 z-10 hover:bg-[#a413ed] hover:text-white hover:rotate-90"
                    onClick={() => navigate('/home')}
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-full border-2 border-[#a413ed] p-1 bg-white shadow-sm">
                        <button
                            className={`px-8 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'months'
                                ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white'
                                : 'text-gray-700 hover:text-gray-900'}`}
                            onClick={() => setPlanType('months')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`px-8 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'year'
                                ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white'
                                : 'text-gray-700 hover:text-gray-900'}`}
                            onClick={() => setPlanType('year')}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                {loading && (
                    <Loading message="Loading plans..." size="medium" />
                )}

                {error && (
                    <div className="text-center py-4 text-[#ef4444] bg-[#fee2e2] rounded-lg px-4">{error}</div>
                )}

                {!loading && !error && (
                    <>
                        {planType === 'months' && monthlyPlans.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {monthlyPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-200 hover:border-[#a413ed] hover:shadow-[0_6px_16px_rgba(251,52,170,0.18)]"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{plan.planName}</h3>
                                        <div className="text-3xl font-bold text-gray-900 mb-2">₹{plan.offerAmount || plan.amount}/-</div>
                                        <div className="text-sm text-gray-600 mb-6">
                                            For {plan.maxProfile} {plan.maxProfile === 1 ? 'profile' : 'profiles'}
                                        </div>
                                        <button
                                            className="w-full bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-[0_6px_16px_rgba(251,52,170,0.35)] hover:-translate-y-0.5"
                                            onClick={() => handlePayNow(plan)}
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {planType === 'year' && yearlyPlans.length > 0 && (
                            <div className="mb-8">
                                {yearlyPlans.map((plan) => (
                                    <div key={plan.id} className="bg-white border-2 border-gray-200 border-t-4 border-t-[#a413ed] rounded-xl p-10 text-center relative max-w-[600px] mx-auto transition-all duration-300 hover:shadow-[0_4px_20px_rgba(251,52,170,0.3)]">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white py-2 px-6 rounded-full text-sm font-semibold">Best Price</div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">{plan.planName}</h3>
                                        <div className="text-4xl font-bold text-gray-900 my-4">₹{plan.offerAmount || plan.amount}/-</div>
                                        <div className="text-lg text-gray-600 mb-6">
                                            For {plan.validMonth} year{plan.validMonth > 1 ? 's' : ''} unlimited profiles
                                        </div>
                                        <button
                                            className="w-full bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-[0_6px_16px_rgba(251,52,170,0.35)] hover:-translate-y-0.5"
                                            onClick={() => handlePayNow(plan)}
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {((planType === 'months' && monthlyPlans.length === 0) ||
                            (planType === 'year' && yearlyPlans.length === 0)) && (
                                <div className="text-center py-8 text-gray-600 text-lg">No plans available at the moment.</div>
                            )}
                    </>
                )}

                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <p className="text-base text-gray-600 mb-4">Need any help in making Payment?</p>
                    <a href="tel:+919876543210" className="inline-block py-3.5 px-8 bg-[#10B981] text-white rounded-lg no-underline text-base font-semibold transition-all duration-300 hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
                        📞 +91 9876543210
                    </a>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-[fadeIn_0.3s_ease]">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h2>
                        <p className="text-gray-600 mb-6">
                            Are you ready to pay <span className="font-bold text-gray-800">₹{selectedPlan.offerAmount || selectedPlan.amount}</span> for plan <span className="font-bold text-gray-800">{selectedPlan.planName}</span>?
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors hover:bg-gray-200"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setSelectedPlan(null);
                                }}
                                disabled={processingPayment}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                onClick={confirmPayment}
                                disabled={processingPayment}
                            >
                                {processingPayment ? <Loading size="small" color="white" /> : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlans;


