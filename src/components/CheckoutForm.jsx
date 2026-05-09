// components/CheckoutForm.jsx — COMPLETELY FINAL
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const CheckoutForm = ({
    amount,
    reference,
    userEmail,
    employerId,
    requestId,
    returnTo,
    partnerId,
    taskId,
}) => {
    const stripe   = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading,      setLoading]      = useState(false);
    const [success,      setSuccess]      = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || loading) return;

        setLoading(true);
        setErrorMessage(null);

        // ── Step 1: Stripe payment confirm ────────────────────────────────────
        let result;
        try {
            result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // ← return_url HTTPS দরকার production এ, localhost এ এটা fallback
                    return_url: `${window.location.origin}/payment-success`,
                },
                //redirect: 'if_required', // ← 3DS ছাড়া redirect করবে না
            });
        } catch (stripeErr) {
            setErrorMessage('Payment processing failed. Please try again.');
            setLoading(false);
            return;
        }

        // ── Step 2: Handle Stripe error ───────────────────────────────────────
        if (result.error) {
            // card_error, validation_error etc.
            setErrorMessage(result.error.message || 'Payment failed. Please check your card details.');
            setLoading(false);
            return;
        }

        // ── Step 3: Payment succeeded ─────────────────────────────────────────
        const intent = result.paymentIntent;
        if (intent?.status === 'succeeded') {
            setSuccess(true);

            // ── Step 4: Notify backend (DB update + emails) ───────────────────
            try {
                await axios.post(
                    `${API_BASE}/api/payment/confirm-notification`,
                    {
                        amount,
                        reference,
                        customerEmail:     userEmail || 'Not Provided',
                        status:            'succeeded',
                        payment_intent_id: intent.id,
                        employer_id:       employerId || null,
                        request_id:        requestId  || null,
                        partner_id:        partnerId  || null,
                        task_id:           taskId     || null,
                    },
                    { timeout: 20000 }
                );
            } catch (notifyErr) {
                // Non-fatal — payment succeeded on Stripe, just log
                console.warn('[CheckoutForm] Notification error (non-fatal):', notifyErr?.response?.data || notifyErr.message);
            }

            // ── Step 5: Redirect ──────────────────────────────────────────────
            setTimeout(() => {
                if (returnTo === 'employer') {
                    window.location.href =
                        `/employer-dashboard?tab=payment&payment_success=1` +
                        `&amount=${amount}` +
                        `&reference=${encodeURIComponent(reference || 'SNJ-GENERAL')}`;
                } else if (returnTo === 'b2b') {
                    window.location.href =
                        `/b2b-dashboard?tab=payment&payment_success=1&amount=${amount}`;
                } else {
                    window.location.href = '/payment-success';
                }
            }, 1500); // ← 1.5s দেখাবে success state তারপর redirect

            return;
        }

        // ── Step 6: Other statuses (requires_action etc.) ─────────────────────
        if (intent?.status === 'requires_action') {
            setErrorMessage('Additional verification required. Please follow your bank\'s instructions.');
        } else {
            setErrorMessage('Payment could not be confirmed. Please try again.');
        }
        setLoading(false);
    };

    // ── Success State ─────────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-black text-[#0B1F3A] uppercase tracking-wide mb-2">Payment Successful!</h3>
                <p className="text-slate-500 text-sm">Redirecting you back…</p>
                <div className="mt-4 animate-spin rounded-full h-6 w-6 border-b-2 border-[#EAB308] mx-auto" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-black text-[#0B1F3A] uppercase tracking-tight">
                            Card Details
                        </h3>
                        <div className="flex gap-1">
                            <div className="h-1.5 w-6 bg-[#EAB308] rounded-full" />
                            <div className="h-1.5 w-2 bg-slate-200 rounded-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Accepted:</span>
                        {[
                            { name: 'VISA',   bg: '#1A1F71', color: '#fff' },
                            { name: 'MC',     bg: '#EB001B', color: '#fff' },
                            { name: 'AMEX',   bg: '#2E77BC', color: '#fff' },
                            { name: 'UNION',  bg: '#c0392b', color: '#fff' },
                            { name: '+ MORE', bg: '#f1f5f9', color: '#64748b' },
                        ].map((card) => (
                            <span key={card.name} style={{
                                background:    card.bg,
                                color:         card.color,
                                border:        `1px solid ${card.bg}`,
                                fontSize:      8,
                                fontWeight:    900,
                                padding:       '2px 7px',
                                borderRadius:  4,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}>
                                {card.name}
                            </span>
                        ))}
                    </div>

                    <div className="min-h-[200px]">
                        <PaymentElement
                            options={{
                                layout:  'tabs',
                                terms:   { card: 'never' },
                                wallets: { applePay: 'never', googlePay: 'never' },
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || !elements || loading}
                    className="w-full bg-[#0B1F3A] text-white hover:bg-[#EAB308] hover:text-[#0B1F3A] py-4 rounded-2xl font-black uppercase tracking-[0.2em] active:scale-[0.97] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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