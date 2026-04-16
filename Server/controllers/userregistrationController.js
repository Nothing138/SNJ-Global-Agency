const db = require('../config/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// OTP Store করার জন্য (Temporary Memory)
let otpStore = {}; 

// --- 1. OTP পাঠানোর Function ---
const sendOTP = async (req, res) => {
    const { email } = req.body;
    
    // ৬ ডিজিটের র্যান্ডম কোড জেনারেট করা
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

    // Gmail Configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'njmit2538@gmail.com', // আপনার জিমেইল
            pass: 'ayev qwgh cygc hefh'    // জিমেইল অ্যাপ পাসওয়ার্ড
        }
    });

    // ইমেইল অপশন কনফিগারেশন
    const mailOptions = {
        // এখানে নাম পরিবর্তন করে "SNJ Global Routes Agency" করা হয়েছে
        from: '"SNJ Global Routes Agency"', 
        to: email,
        subject: "Verification Code for SNJ Global Routes",
        text: `Your verification code is: ${otp}`,
        html: `
            <div style="font-family: 'Times New Roman', serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #0B1F3A;">SNJ Global Routes Agency</h2>
                <p style="font-size: 16px; color: #64748B;">Hello,</p>
                <p style="font-size: 16px; color: #64748B;">Your 6-digit verification code is:</p>
                <h1 style="color: #EAB308; letter-spacing: 5px;">${otp}</h1>
                <p style="font-size: 14px; color: #94a3b8;">This code will expire in 5 minutes.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);

        // Memory-তে OTP সেভ রাখা
        otpStore[email] = otp;
        
        res.status(200).json({ success: true, message: 'OTP sent to your email!' });
    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

// --- 2. Registration Function ---
const registerUser = async (req, res) => {
    const { full_name, email, password, otp } = req.body;

    // OTP চেক করা (Validation)
    // অনেক সময় ফ্রন্টএন্ড থেকে স্ট্রিং বা নাম্বার আসতে পারে, তাই টাইপ চেক করা ভালো
    if (!otpStore[email] || otpStore[email].toString() !== otp.toString()) {
        return res.status(400).json({ success: false, message: "Invalid or Expired OTP!" });
    }

    try {
        // পাসওয়ার্ড হ্যাশ করা
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // ডাটাবেসে ইউজার সেভ করা
        const query = 'INSERT INTO users (full_name, email, password, role, status) VALUES (?, ?, ?, "candidate", "pending")';
        
        // আপনার db configuration অনুযায়ী নিচের লাইনটি কাজ করবে
        await db.query(query, [full_name, email, hashedPassword]);

        // সফল হলে ওই ইমেইলের OTP ডিলিট করে দেওয়া
        delete otpStore[email];

        res.status(201).json({ success: true, message: 'Registration Successful!' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Registration failed or Email already exists' });
    }
};

module.exports = { sendOTP, registerUser };