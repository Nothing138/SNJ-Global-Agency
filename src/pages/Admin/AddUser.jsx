import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react'; // আইকন ব্যবহারের জন্য

const AddUser = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'admin' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("New User Added Successfully!");
        } catch (err) {
            alert("Error adding user!");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-['Times_New_Roman',_serif]">
            <div className="bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 max-w-lg w-full">
                
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h2 className="text-[40px] lg:text-[48px] font-bold text-[#0B1F3A] leading-tight mb-2 tracking-tight">
                        Create <span className="text-[#EAB308] italic font-light">Account.</span>
                    </h2>
                    <p className="text-[16px] text-[#64748B] font-normal leading-[1.6]">
                        Register a new <span className="italic text-[#EAB308] font-medium">Internal Member</span> to the system.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <UserPlus className="absolute left-4 top-3 text-[#64748B]" size={18} />
                            <input 
                                type="text" 
                                placeholder="Enter full name" 
                                className="w-full border border-slate-200 bg-[#F8FAFC] p-3 pl-12 rounded-xl focus:outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" 
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-[#64748B]" size={18} />
                            <input 
                                type="email" 
                                placeholder="example@domain.com" 
                                className="w-full border border-slate-200 bg-[#F8FAFC] p-3 pl-12 rounded-xl focus:outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-[#64748B]" size={18} />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full border border-slate-200 bg-[#F8FAFC] p-3 pl-12 rounded-xl focus:outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-1">Assign Role</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-3 text-[#64748B]" size={18} />
                            <select 
                                className="w-full border border-slate-200 bg-[#F8FAFC] p-3 pl-12 rounded-xl focus:outline-none focus:border-[#EAB308] appearance-none transition-all text-[#0F172A]" 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="admin">Administrator</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#EAB308] text-[#0B1F3A] py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[14px] hover:bg-[#0B1F3A] hover:text-white transition-all duration-500 shadow-lg shadow-[#EAB308]/20"
                    >
                        Register User
                    </button>
                </form>

                {/* Footer Note */}
                <p className="mt-8 text-center text-[12px] text-[#64748B] uppercase tracking-widest">
                    Authorized Access <span className="text-[#EAB308] font-bold">Only</span>
                </p>
            </div>
        </div>
    );
};

export default AddUser;