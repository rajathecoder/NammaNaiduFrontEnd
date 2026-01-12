import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import accountsCreatedAnimation from '../../assets/images/accountscreated.json';
import logoOnly from '../../assets/images/logoonly.png';

const RegistrationSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to subscription page after 3 seconds
        const timer = setTimeout(() => {
            navigate('/subscription-plans');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,182,193,0.1)_0%,rgba(221,160,221,0.1)_50%,transparent_100%)] animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="w-full max-w-[600px] p-8 z-[1] md:p-4">
                <div className="text-center mb-12">
                    <img src={logoOnly} alt="Namma Naidu Logo" className="h-20 w-auto mx-auto mb-4" />
                    <h1 className="font-['Georgia','Times_New_Roman',serif] text-3xl font-semibold text-gray-900 m-0 md:text-2xl">Nanma Naidu Matrimony</h1>
                </div>

                <div className="bg-white rounded-[20px] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-2 border-transparent bg-[linear-gradient(white,white),linear-gradient(135deg,#ff6b9d,#c44569,#a29bfe)] bg-origin-border bg-clip-padding relative overflow-hidden md:p-8">
                    <div className="w-full h-[300px] mb-8 flex items-center justify-center">
                        <Lottie
                            animationData={accountsCreatedAnimation}
                            loop={true}
                            className="w-full h-full max-w-[400px] max-h-[300px]"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center m-0 mb-4 md:text-xl">You have completed all the steps.</h2>
                    <p className="text-base text-gray-600 text-center m-0 leading-relaxed">Your profile will be reviewed and activated within 24 hours</p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;

