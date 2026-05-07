import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51TQA4u2KyKRyK9qYqHVMzOzw2r4Roc38GU552YUyWzI3zPyUZNC6ZNtXJnr9wMfKhmiiGP7BxlGWYSqBIf7PTD5y00Is8OHkqv', {
  //advancedFraudSignals: false,
});

const PaymentPage = () => {
  const location    = useLocation();
  const paymentData = location.state || {};

  const amount      = paymentData.amount      || 50;
  const reference   = paymentData.reference   || 'SNJ-GENERAL';
  const label       = paymentData.label       || 'Visa Processing';
  const currency    = paymentData.currency    || 'usd';
  const employerId  = paymentData.employer_id || null;   // ← employer payment হলে থাকবে
  const requestId   = paymentData.request_id  || null;   // ← specific request হলে থাকবে
  const returnTo    = paymentData.returnTo    || null;   // ← 'employer' হলে dashboard-এ ফিরবে

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const getSecret = async () => {
      try {
        const res = await axios.post('https://snj-global-agency-backend-nhxq.onrender.com/api/payment/create-intent', {
          amount,
          currency,
          customerName: reference,
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error('Error fetching secret', err);
      }
    };
    getSecret();
  }, [amount, currency, reference]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0B1F3A',
      colorBackground: '#ffffff',
      colorText: '#0B1F3A',
      borderRadius: '12px',
    },
  };
  const options = { clientSecret, appearance, loader: 'never' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-40 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">

        {/* Header */}
        <div className="bg-[#0B1F3A] p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest">
            Secure <span className="text-[#EAB308]">Payment</span>
          </h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-tighter">
            SNJ Global Routes Official Checkout
          </p>
          {/* Employer payment indicator */}
          {employerId && (
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">
                Employer Portal Payment
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          <div className="mb-6 flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase">Service Fee</p>
              <h3 className="text-lg font-bold text-[#0B1F3A] dark:text-white">{label}</h3>
              <p className="text-xs text-slate-400 mt-1">Ref: {reference}</p>
              {requestId && (
                <p className="text-xs text-yellow-600 mt-1 font-bold">REQ-{requestId}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Total Amount</p>
              <h3 className="text-xl font-black text-[#EAB308]">${Number(amount).toFixed(2)}</h3>
            </div>
          </div>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                amount={amount}
                reference={reference}
                employerId={employerId}
                requestId={requestId}
                returnTo={returnTo}
              />
            </Elements>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EAB308]"></div>
              <p className="mt-4 text-sm italic text-slate-400 animate-pulse">
                Initializing Secure Gateway...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-widest">
            Your data is encrypted. No card info is stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;