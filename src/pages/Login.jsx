import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, UserPlus, Globe } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    const colors = {
        navy: '#0B1F3A',
        gold: '#D4AF37',
        slate: '#64748B'
    };

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(emailRegex.test(email) && password.length >= 6);
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Save token and user info
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('source', res.data.source); // 'users' or 'b2b_partners'

            const userData = {
                id: res.data.id,
                name: res.data.user.name || email.split('@')[0],
                email: email,
                role: res.data.role,
                source: res.data.source,
                ...(res.data.user.company_name && { company_name: res.data.user.company_name })
            };
            localStorage.setItem('user', JSON.stringify(userData));

            window.dispatchEvent(new Event('authChange'));

            Swal.fire({
                icon: 'success',
                title: 'Access Granted',
                text: 'Welcome to Global Routes Portal',
                showConfirmButton: false,
                timer: 1500,
                background: '#fff',
                color: colors.navy
            });

            // Use the redirectTo value sent from backend
            setTimeout(() => {
                navigate(res.data.redirectTo || '/');
            }, 1000);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: err.response?.data?.message || 'Invalid email or password',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative font-['Times_New_Roman',_serif]">
            {/* Background Decorative Elements */}
            <div
                className="absolute top-0 left-0 w-full h-64 bg-[#0B1F3A] z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] z-10"
            >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(11,31,58,0.3)] border border-slate-100 overflow-hidden">

                    {/* Header Section */}
                    <div className="bg-white p-8 pt-12 text-center">
                        <motion.div className="inline-flex items-center justify-center w-20 h-20 bg-[#0B1F3A] rounded-2xl mb-6 shadow-xl">
                            <Globe size={40} className="text-[#D4AF37]" />
                        </motion.div>

                        <h1 className="text-4xl font-bold text-[#0B1F3A] uppercase tracking-tighter leading-none mb-2">
                            GLOBAL<span className="text-[#D4AF37]">ROUTES</span>
                        </h1>
                        <p className="text-[#64748B] text-[12px] font-bold uppercase tracking-[0.4em]">Official Access Portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="px-8 lg:px-12 pb-10 space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-widest ml-1">Email Identity</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@globalroutes.com"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-[#0B1F3A] outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-widest">Secure Key</label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[#D4AF37] hover:underline text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-[#0B1F3A] outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3
                                ${!isValid || loading
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#0B1F3A] hover:bg-[#D4AF37] text-white hover:text-[#0B1F3A]'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Enter Workspace</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3">New to the platform?</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 text-[#0B1F3A] hover:text-[#D4AF37] font-bold uppercase text-xs tracking-widest transition-colors"
                        >
                            <UserPlus size={16} />
                            Create Account
                        </Link>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#64748B] hover:text-[#0B1F3A] text-[11px] font-bold uppercase tracking-[0.3em] transition-colors"
                    >
                        ← Exit to Public Site
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;