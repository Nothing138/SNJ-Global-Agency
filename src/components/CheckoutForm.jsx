import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ amount, reference, userEmail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // ১. পেমেন্ট কনফার্ম করা
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // এখানে পেমেন্ট সাকসেস হওয়ার পর ইউজারকে যেখানে পাঠাতে চান সেই URL দিন
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required', // যদি কার্ডে অতিরিক্ত ভেরিফিকেশন না লাগে তবে রিডাইরেক্ট করবে না
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setLoading(false);
    } else {
      // ২. পেমেন্ট সফল হলে ব্যাকএন্ডে নোটিফিকেশন পাঠানো
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        try {
          await axios.post('http://localhost:5000/api/payment/confirm-notification', {
            amount: amount,
            reference: reference,
            customerEmail: userEmail || 'Not Provided',
            status: 'succeeded'
          });
          
          // সফল হলে সাকসেস পেজে নিয়ে যান
          window.location.href = "/payment-success";
        } catch (err) {
          console.error("Notification Error:", err);
          // ইমেইল না গেলেও পেমেন্ট যেহেতু সফল, তাই ইউজারকে সাকসেস পেজেই পাঠানো উচিত
          window.location.href = "/payment-success";
        }
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-[#0B1F3A] dark:text-white uppercase tracking-tight">
              Card Details
            </h3>
            <div className="flex gap-1">
              <div className="h-1.5 w-6 bg-[#EAB308] rounded-full"></div>
              <div className="h-1.5 w-2 bg-slate-200 rounded-full"></div>
            </div>
          </div>

          {/* Stripe Payment Element: Responsiveness handles automatically by Stripe */}
          <div className="min-h-[200px]">
             <PaymentElement options={{ 
               layout: "tabs",
               // Appearance settings
               terms: { card: 'never' } // কিছু ক্ষেত্রে শর্তাবলী নিচে দেখানো বন্ধ করে
             }} />
          </div>
        </div>

        <button 
          disabled={!stripe || loading}
          className="w-full bg-[#0B1F3A] text-white hover:bg-[#EAB308] hover:text-[#0B1F3A] py-4 rounded-2xl font-black uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg group"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
               Proceed to Pay ${amount}
            </span>
          )}
        </button>

        {errorMessage && (
          <div className="text-red-600 text-xs font-bold mt-2 bg-red-50 p-4 rounded-xl border-l-4 border-red-500 animate-bounce">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest text-center">
              Bank-grade 256-bit SSL Encryption
            </p>
            <div className="opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Stripe branding stays here usually as part of the element */}
            </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;