import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ amount, reference, userEmail, employerId, requestId, returnTo, partnerId, taskId }) => {
    const stripe   = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading]           = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        setErrorMessage(null);

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
            return;
        }

        if (result.paymentIntent?.status === 'succeeded') {
            try {
                // ── Single call — handles email + ALL DB updates ──────────────
                await axios.post('http://localhost:5000/api/payment/confirm-notification', {
                    amount,
                    reference,
                    customerEmail:     userEmail || 'Not Provided',
                    status:            'succeeded',
                    payment_intent_id: result.paymentIntent.id,

                    // Employer payment fields (optional)
                    employer_id: employerId  || null,
                    request_id:  requestId  || null,

                    // B2B partner payment fields (optional)
                    partner_id: partnerId || null,
                    task_id:    taskId    || null,
                });
            } catch (err) {
                console.error('Confirmation Error:', err);
                // Non-fatal — payment already succeeded on Stripe side
            }

            // ── Redirect ──────────────────────────────────────────────────────
            if (returnTo === 'employer') {
                window.location.href =
                    '/employer/dashboard?tab=payment&payment_success=1' +
                    `&amount=${amount}` +
                    `&reference=${encodeURIComponent(reference || 'SNJ-GENERAL')}`;
            } else if (returnTo === 'b2b') {
                window.location.href =
                    '/b2b/dashboard?tab=payment&payment_success=1' +
                    `&amount=${amount}`;
            } else {
                window.location.href = '/payment-success';
            }
        } else {
            setErrorMessage('Payment could not be confirmed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
            >
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-black text-[#0B1F3A] dark:text-white uppercase tracking-tight">
                            Card Details
                        </h3>
                        <div className="flex gap-1">
                            <div className="h-1.5 w-6 bg-[#EAB308] rounded-full"></div>
                            <div className="h-1.5 w-2 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* ── Accepted Cards Badge ───────────────────────────────── */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Accepted:</span>
                        {[
                            { name: 'VISA',  bg: '#1A1F71', color: '#fff',     border: '#1A1F71' },
                            { name: 'MC',    bg: '#EB001B', color: '#fff',     border: '#EB001B', sub: 'MASTERCARD' },
                            { name: 'AMEX',  bg: '#2E77BC', color: '#fff',     border: '#2E77BC' },
                            { name: 'UNION', bg: '#c0392b', color: '#fff',     border: '#c0392b' },
                            { name: '+ MORE', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
                        ].map((card, i) => (
                            <span key={i} style={{
                                background: card.bg,
                                color: card.color,
                                border: `1px solid ${card.border}`,
                                fontSize: 8,
                                fontWeight: 900,
                                padding: '2px 7px',
                                borderRadius: 4,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}>
                                {card.name}
                            </span>
                        ))}
                    </div>

                    {/* ── Stripe Payment Element (handles all card types) ────── */}
                    <div className="min-h-[200px]">
                        <PaymentElement
                            options={{
                                layout: 'tabs',
                                terms: { card: 'never' },
                                // Show card brands in UI
                                wallets: { applePay: 'never', googlePay: 'never' },
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-[#0B1F3A] text-white hover:bg-[#EAB308] hover:text-[#0B1F3A] py-4 rounded-2xl font-black uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment…
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            🔒 Pay ${parseFloat(amount || 0).toFixed(2)} Securely
                        </span>
                    )}
                </button>

                {errorMessage && (
                    <div className="text-red-600 text-xs font-bold mt-2 bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                        ⚠️ {errorMessage}
                    </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">🔒 256-bit SSL</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">✓ PCI DSS</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">⚡ Stripe Secured</span>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;