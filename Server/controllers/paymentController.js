const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'njmit2538@gmail.com', // আপনার জিমেইল
        pass: 'ayev qwgh cygc hefh'    // জিমেইল থেকে জেনারেট করা ১৬ অক্ষরের App Password
    }
});

const confirmPaymentAndNotify = async (req, res) => {
    try {
        const { amount, reference, customerEmail, status } = req.body;

        if (status === 'succeeded') {
            const mailOptions = {
                from: '"SNJ Global Routes" <njmit2538@gmail.com>',
                to: 'directorsnj932@gmail.com',
                subject: `New Payment Received: $${amount}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
                        <h2 style="color: #0B1F3A;">Payment Success Notification</h2>
                        <p>A user has just completed a payment on <strong>SNJ Global Routes</strong>.</p>
                        <p><strong>Amount:</strong> $${amount}</p>
                        <p><strong>Reference:</strong> ${reference}</p>
                        <p><strong>Customer Email:</strong> ${customerEmail}</p>
                        <p><strong>Status:</strong> Success</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ success: true, message: "Admin notified" });
        }
        
        res.status(400).json({ success: false, message: "Payment not successful" });
    } catch (error) {
        console.error("Email Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to notify admin" });
    }
};

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, customerName } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // সেন্টে কনভার্ট করা হচ্ছে ($1 = 100 cents)
            currency: currency || 'usd',
            description: `Payment for ${customerName || 'Service'}`,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPaymentAndNotify
};