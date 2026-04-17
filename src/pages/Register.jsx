import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, MailQuestion, Compass } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', otp: '' });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    const theme = {
        navy: '#0B1F3A',
        gold: '#EAB308',
        body: '#64748B'
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Google Login Logic (Mockup for UI)
    const handleGoogleLogin = () => {
        window.location.href = 'https://snj-global-agency-backend.onrender.com/api/auth/google'; // আপনার ব্যাকএন্ডের গুগল পাথ
    };

    const handleSendOtp = async () => {
        if (!formData.email || !formData.full_name) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Details',
                text: 'Please provide your name and email first.',
                confirmButtonColor: theme.navy
            });
        }
        setLoading(true);
        try {
            // Note: ব্যাকএন্ডে অবশ্যই 'SNJ Global Routes Agency' হিসেবে ইমেইল কনফিগার করবেন
            const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/verify/send-otp', { email: formData.email });
            if (res.data.success) {
                setIsOtpSent(true);
                setTimer(60);
                Swal.fire({
                    icon: 'success',
                    title: 'Code Sent',
                    text: 'Verification code sent to your email.',
                    confirmButtonColor: theme.gold
                });
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to send OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpSent) return;
        
        setLoading(true);
        try {
            const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/verify/register', formData);
            if (res.data.success) {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Verified Successfully!', 
                    text: 'Welcome to SNJ Global Routes Agency.',
                    timer: 2000, 
                    showConfirmButton: false 
                });
                setTimeout(() => navigate('/login'), 2000); 
            }
        } catch (err) {
            // Error handling for "Verification Failed"
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: err.response?.data?.message || 'The code you entered is incorrect.',
                confirmButtonColor: theme.navy
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4" style={{ fontFamily: '"Times New Roman", serif' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
            >
                {/* Left Side */}
                <div className="md:w-[40%] bg-[#0B1F3A] p-12 text-white flex flex-col justify-between relative">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                            <Compass size={32} className="text-[#EAB308]" />
                        </div>
                        <h2 className="text-4xl font-bold uppercase leading-tight">
                            Premium <br /> 
                            <span className="italic text-[#EAB308]">Quality</span> Services
                        </h2>
                        <p className="mt-6 text-slate-300 text-lg">Join a global network of professionals and elite travel services.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <ShieldCheck className="text-[#EAB308]" size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Secure Verification</span>
                    </div>
                </div>

                {/* Right Side */}
                <div className="md:w-[60%] p-8 md:p-16">
                    <div className="mb-8">
                        <h1 className="text-[40px] font-bold text-[#0B1F3A] uppercase leading-tight">
                            Join <span className="italic text-[#EAB308]">SNJ</span> Global Routes
                        </h1>
                        <p className="text-[#64748B] text-lg">Create your professional account to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-[#0B1F3A]">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required type="text" placeholder="John Doe" 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#EAB308]"
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-[#0B1F3A]">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required type="email" placeholder="john@snj.com" 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#EAB308]"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-[#0B1F3A]">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="password" placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#EAB308]"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isOtpSent && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#EAB308] uppercase">Enter 6-Digit Code</label>
                                    <div className="relative">
                                        <MailQuestion className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308]" size={18} />
                                        <input required type="text" maxLength="6" placeholder="000000" 
                                            className="w-full pl-12 py-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center font-bold tracking-[0.5em] text-xl"
                                            onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-4 space-y-4">
                            {!isOtpSent ? (
                                <button type="button" onClick={handleSendOtp} disabled={loading}
                                    className="w-full bg-[#EAB308] text-[#0B1F3A] py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#d4a017] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Get Verification Code'}
                                </button>
                            ) : (
                                <button type="submit" disabled={loading}
                                    className="w-full bg-[#0B1F3A] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'} <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Already a member? <Link to="/login" className="text-[#0B1F3A] hover:underline ml-1">Sign In</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;