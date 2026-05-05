import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle2, UserSearch, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userExists, setUserExists] = useState(false); // User found status
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🔍 Step 1: User check korbe
    const handleCheckUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/check-user', { email });
            if (res.data.exists) {
                setUserExists(true);
                Swal.fire({ icon: 'success', title: 'User Found', text: 'Now set your new password.', timer: 1500, showConfirmButton: false, background: '#0f172a', color: '#fff' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Not Found', text: 'No account with this email!', background: '#0f172a', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    // 💾 Step 2: Password Update korbe
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            return Swal.fire('Error', 'Password must be 6+ chars', 'error');
        }
        setLoading(true);
        try {
            await axios.put('http://localhost:5000/api/admin/reset-password-direct', { email, newPassword });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password updated. Redirecting to login...',
                timer: 2000,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#fff'
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            Swal.fire('Error', 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px] z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 rounded-2xl mb-4 text-blue-500">
                            {userExists ? <CheckCircle2 size={32} /> : <UserSearch size={32} />}
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                            {userExists ? 'Set New Password' : 'Find Account'}
                        </h2>
                    </div>

                    {!userExists ? (
                        // 🔍 Phase 1: Search Email
                        <form onSubmit={handleCheckUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input 
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter registered email"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3">
                                {loading ? 'Searching...' : 'Search Account'}
                            </button>
                        </form>
                    ) : (
                        // 🔐 Phase 2: Update Password
                        <AnimatePresence>
                            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Account Found: {email}</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                                        <input 
                                            type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter 6+ character password"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-blue-500/30 rounded-2xl text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3">
                                    {loading ? 'Updating...' : 'Update & Login'} <Save size={18} />
                                </button>
                                <button type="button" onClick={() => setUserExists(false)} className="w-full text-slate-500 text-[10px] uppercase font-bold tracking-widest">Wrong Email? Change it</button>
                            </motion.form>
                        </AnimatePresence>
                    )}

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <Link to="/login" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;