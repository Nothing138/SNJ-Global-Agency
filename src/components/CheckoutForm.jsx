import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ amount, reference, userEmail, employerId, requestId, returnTo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      try {
        // ── Email notification (existing) ──
        await axios.post('https://snj-global-agency-backend-nhxq.onrender.com/api/payment/confirm-notification', {
          amount,
          reference,
          customerEmail: userEmail || 'Not Provided',
          status: 'succeeded',
        });
      } catch (err) {
        console.error('Notification Error:', err);
      }

      // ── NEW: Record payment → due কমাবে ──
      if (employerId) {
        try {
          await axios.post('https://snj-global-agency-backend-nhxq.onrender.com/api/employer-payment/record', {
            employer_id: employerId,
            amount_paid: amount,
            reference:   reference || 'SNJ-GENERAL',
            request_id:  requestId || null,
          });
        } catch (err) {
          console.error('Record payment error:', err);
        }
      }

      // ── Redirect ──
      if (returnTo === 'employer') {
        // employer dashboard payment tab-এ ফিরে যাবে
        window.location.href = '/employer/dashboard?tab=payment&payment_success=1&amount=' + amount + '&reference=' + encodeURIComponent(reference || 'SNJ-GENERAL');
      } else {
        window.location.href = '/payment-success';
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
          <div className="min-h-[200px]">
            <PaymentElement options={{ layout: 'tabs', terms: { card: 'never' } }} />
          </div>
        </div>

        <button
          disabled={!stripe || loading}
          className="w-full bg-[#0B1F3A] text-white hover:bg-[#EAB308] hover:text-[#0B1F3A] py-4 rounded-2xl font-black uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg"
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
          <div className="text-red-600 text-xs font-bold mt-2 bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
            ⚠️ {errorMessage}
          </div>
        )}

        <p className="text-[9px] text-slate-400 uppercase tracking-widest text-center">
          Bank-grade 256-bit SSL Encryption
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;