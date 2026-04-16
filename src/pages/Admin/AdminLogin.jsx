import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LockKeyhole, Mail } from 'lucide-react'; // আইকন ব্যবহারের জন্য

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://snj-global-agency-production.up.railway.app/api/auth/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('role', res.data.user.role);

            const role = res.data.user.role;

            if (role === 'admin' || role === 'recruiter' || role === 'superadmin' || role === 'hr_manager') {
                navigate('/admin/dashboard');
            } else {
                Swal.fire('Access Denied', 'You are not authorized!', 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'Invalid Email or Password', 'error');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-white font-['Times_New_Roman',_serif]">
            <div className="w-full max-w-md p-10 bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-2xl">
                
                {/* 🧠 Headings (H1) */}
                <div className="text-center mb-10">
                    <h1 className="text-[40px] lg:text-[48px] font-bold text-[#0B1F3A] leading-tight mb-2 uppercase tracking-tight">
                        Admin <span className="text-[#EAB308] italic font-light lowercase">Login.</span>
                    </h1>
                    {/* 📄 Body Text / Subtitle */}
                    <p className="text-[18px] text-[#64748B] leading-[1.6]">
                        Secure access to <span className="italic text-[#EAB308] font-medium">Management Dashboard</span>
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Official Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-[#64748B]" size={18} />
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                className="w-full border-b-2 border-slate-200 bg-transparent p-3 pl-12 focus:outline-none focus:border-[#EAB308] transition-all text-[#0F172A] text-[16px]" 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-4 top-3.5 text-[#64748B]" size={18} />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full border-b-2 border-slate-200 bg-transparent p-3 pl-12 focus:outline-none focus:border-[#EAB308] transition-all text-[#0F172A] text-[16px]" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* ✨ Button → Light Gold */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-[#EAB308] text-[#0B1F3A] py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[14px] hover:bg-[#0B1F3A] hover:text-white transition-all duration-500 shadow-lg shadow-[#EAB308]/20"
                        >
                            Authorize & Enter
                        </button>
                    </div>
                </form>

                {/* Footer Note */}
                <div className="mt-10 text-center">
                    <p className="text-[14px] text-[#64748B] italic">
                        Authorized Personnel <span className="text-[#EAB308] font-bold">Only.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;