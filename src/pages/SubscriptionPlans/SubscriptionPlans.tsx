import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import {
  getSubscriptionPlans,
  createRazorpayOrder,
  verifyRazorpayPayment,
  reportPaymentFailed,
  applyCoupon,
  type SubscriptionPlan,
} from '../../services/api/subscription.api';
import { getAuthData } from '../../utils/auth';
import logoOnly from '../../assets/images/logoonly.png';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SFL6TaKyiOGNBI';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState<'months' | 'year'>('months');
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<{ valid: boolean; discount: number; finalAmount: number; message: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    loadRazorpayScript();
  }, [planType]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubscriptionPlans({ status: 'active', planType }, undefined);
      if (response.success && response.data) {
        setPlans(response.data);
      } else {
        setError(response.message || 'Failed to fetch plans');
      }
    } catch (err: any) {
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
    setCouponCode('');
    setCouponResult(null);
    setShowConfirmModal(true);
  };

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim() || !selectedPlan) return;
    setCouponLoading(true);
    setCouponResult(null);
    try {
      const authData = getAuthData();
      if (!authData?.token) return;
      const res = await applyCoupon(couponCode.trim(), selectedPlan.id, authData.token);
      if (res.success && res.data) {
        setCouponResult({
          valid: true,
          discount: res.data.discount,
          finalAmount: res.data.finalAmount,
          message: res.data.message || `Coupon applied! You save Rs. ${res.data.discount}`,
        });
      } else {
        setCouponResult({ valid: false, discount: 0, finalAmount: selectedPlan.offerAmount || selectedPlan.amount, message: res.message || 'Invalid coupon' });
      }
    } catch {
      setCouponResult({ valid: false, discount: 0, finalAmount: selectedPlan.offerAmount || selectedPlan.amount, message: 'Error applying coupon' });
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, selectedPlan]);

  const confirmPayment = async () => {
    if (!selectedPlan) return;

    const authData = getAuthData();
    if (!authData?.token) {
      navigate('/login');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      setProcessingPayment(true);

      // Step 1: Create Razorpay order on backend
      const orderRes = await createRazorpayOrder(
        selectedPlan.id,
        couponResult?.valid ? couponCode.trim() : undefined,
        authData.token
      );

      if (!orderRes.success || !orderRes.data) {
        alert(orderRes.message || 'Failed to create order');
        setProcessingPayment(false);
        return;
      }

      const { razorpayOrderId, transactionId, amount, currency } = orderRes.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: amount, // amount in paise from server
        currency: currency || 'INR',
        name: 'Namma Naidu',
        description: `${selectedPlan.planName} Subscription`,
        image: logoOnly,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await verifyRazorpayPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transactionId,
              },
              authData.token
            );

            if (verifyRes.success) {
              alert('Payment Successful! Your subscription is now active.');
              navigate('/home');
            } else {
              alert(verifyRes.message || 'Payment verification failed');
            }
          } catch {
            alert('Payment verification error. Please contact support.');
          }
        },
        prefill: {
          name: authData.userInfo?.name || '',
          email: authData.userInfo?.email || '',
          contact: authData.userInfo?.mobile || '',
        },
        theme: {
          color: '#1B5E20',
        },
        modal: {
          ondismiss: async () => {
            // User closed the checkout — report failure
            try {
              await reportPaymentFailed(
                { razorpay_order_id: razorpayOrderId, transactionId },
                authData.token
              );
            } catch { /* silent */ }
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async (resp: any) => {
        try {
          await reportPaymentFailed(
            {
              razorpay_order_id: razorpayOrderId,
              transactionId,
              error: resp.error,
            },
            authData.token
          );
        } catch { /* silent */ }
        alert(`Payment failed: ${resp.error?.description || 'Unknown error'}`);
        setProcessingPayment(false);
      });
      razorpay.open();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
      setProcessingPayment(false);
    }
  };

  const monthlyPlans = plans.filter((p) => p.planType === 'months');
  const yearlyPlans = plans.filter((p) => p.planType === 'year');

  const getDisplayAmount = () => {
    if (!selectedPlan) return 0;
    if (couponResult?.valid) return couponResult.finalAmount;
    return selectedPlan.offerAmount || selectedPlan.amount;
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:py-4 md:px-2">
      <div className="text-center mb-8">
        <img src={logoOnly} alt="Namma Naidu Logo" className="h-[60px] w-auto mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 m-0 md:text-2xl">Nanma Naidu Membership Plans</h1>
      </div>

      <div className="max-w-[1200px] mx-auto bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative md:p-6">
        <button
          className="absolute top-4 right-4 w-10 h-10 border-none bg-gray-100 rounded-full text-2xl font-light text-gray-600 cursor-pointer flex items-center justify-center transition-all duration-300 z-10 hover:bg-[#1B5E20] hover:text-white hover:rotate-90"
          onClick={() => navigate('/home')}
          aria-label="Close"
        >
          x
        </button>
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border-2 border-[#1B5E20] p-1 bg-white shadow-sm">
            <button
              className={`px-8 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'months' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setPlanType('months')}
            >
              Monthly
            </button>
            <button
              className={`px-8 py-2 rounded-full text-sm font-semibold transition-colors ${planType === 'year' ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white' : 'text-gray-700 hover:text-gray-900'}`}
              onClick={() => setPlanType('year')}
            >
              Yearly
            </button>
          </div>
        </div>

        {loading && <Loading message="Loading plans..." size="medium" />}
        {error && <div className="text-center py-4 text-[#ef4444] bg-[#fee2e2] rounded-lg px-4">{error}</div>}

        {!loading && !error && (
          <>
            {planType === 'months' && monthlyPlans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {monthlyPlans.map((plan) => (
                  <div key={plan.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-200 hover:border-[#1B5E20] hover:shadow-[0_6px_16px_rgba(27,94,32,0.15)]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{plan.planName}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">Rs. {plan.offerAmount || plan.amount}/-</div>
                    <div className="text-sm text-gray-600 mb-6">For {plan.maxProfile} {plan.maxProfile === 1 ? 'profile' : 'profiles'}</div>
                    <button className="w-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-[0_6px_16px_rgba(27,94,32,0.3)] hover:-translate-y-0.5" onClick={() => handlePayNow(plan)}>
                      Pay Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            {planType === 'year' && yearlyPlans.length > 0 && (
              <div className="mb-8">
                {yearlyPlans.map((plan) => (
                  <div key={plan.id} className="bg-white border-2 border-gray-200 border-t-4 border-t-[#1B5E20] rounded-xl p-10 text-center relative max-w-[600px] mx-auto transition-all duration-300 hover:shadow-[0_4px_20px_rgba(27,94,32,0.25)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white py-2 px-6 rounded-full text-sm font-semibold">Best Price</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">{plan.planName}</h3>
                    <div className="text-4xl font-bold text-gray-900 my-4">Rs. {plan.offerAmount || plan.amount}/-</div>
                    <div className="text-lg text-gray-600 mb-6">For {plan.validMonth} year{plan.validMonth > 1 ? 's' : ''} unlimited profiles</div>
                    <button className="w-full bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-[0_6px_16px_rgba(27,94,32,0.3)] hover:-translate-y-0.5" onClick={() => handlePayNow(plan)}>
                      Pay Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            {((planType === 'months' && monthlyPlans.length === 0) || (planType === 'year' && yearlyPlans.length === 0)) && (
              <div className="text-center py-8 text-gray-600 text-lg">No plans available at the moment.</div>
            )}
          </>
        )}

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-600 mb-4">Need any help in making Payment?</p>
          <a href="tel:+919876543210" className="inline-block py-3.5 px-8 bg-[#10B981] text-white rounded-lg no-underline text-base font-semibold transition-all duration-300 hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
            +91 9876543210
          </a>
        </div>
      </div>

      {/* Confirmation Modal with Coupon */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Purchase</h2>
            <p className="text-gray-600 mb-4">
              Plan: <span className="font-bold text-gray-800">{selectedPlan.planName}</span>
            </p>

            {/* Coupon Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Have a coupon code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {couponResult && (
                <div className={`mt-2 text-sm ${couponResult.valid ? 'text-green-600' : 'text-red-500'}`}>
                  {couponResult.message}
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Plan Price</span>
                <span>Rs. {selectedPlan.offerAmount || selectedPlan.amount}</span>
              </div>
              {couponResult?.valid && couponResult.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Coupon Discount</span>
                  <span>- Rs. {couponResult.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>Rs. {getDisplayAmount()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors hover:bg-gray-200"
                onClick={() => { setShowConfirmModal(false); setSelectedPlan(null); setCouponCode(''); setCouponResult(null); }}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={confirmPayment}
                disabled={processingPayment}
              >
                {processingPayment ? <Loading size="small" color="white" /> : `Pay Rs. ${getDisplayAmount()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
