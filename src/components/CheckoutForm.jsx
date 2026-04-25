import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/payment-success", 
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#0B1F3A] dark:text-white mb-2">
            Card Details
          </h3>
          {/* Stripe Payment Element automatically handles responsiveness */}
          <PaymentElement options={{ layout: "tabs" }} />
        </div>

        <button 
          disabled={!stripe || loading}
          className="w-full bg-[#EAB308] text-[#0B1F3A] py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d4a017] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-[#0B1F3A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Pay Now"}
        </button>

        {errorMessage && (
          <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 p-3 rounded-lg border border-red-100">
            {errorMessage}
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-tighter">
          🛡️ Secured by Stripe Encryption
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;