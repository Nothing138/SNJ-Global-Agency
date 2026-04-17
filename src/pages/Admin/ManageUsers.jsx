import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'recruiter' });

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://snj-global-agency-backend.onrender.com/api/auth/register', formData);
            Swal.fire({
                title: 'Success',
                text: 'New Staff Authorized!',
                icon: 'success',
                confirmButtonColor: '#0B1F3A'
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Could not authorize staff',
                icon: 'error',
                confirmButtonColor: '#0B1F3A'
            });
        }
    };

    return (
        <div className="bg-white p-10 md:p-14 rounded-sm shadow-2xl border-t-[6px] border-[#EAB308] max-w-xl mx-auto my-10 font-['Times_New_Roman',_serif]">
            
            {/* Heading (H2 Style) */}
            <h2 className="text-[34px] font-bold text-[#0B1F3A] italic uppercase tracking-tight mb-2">
                Authorize <span className="text-[#EAB308] not-italic">New Personnel</span>
            </h2>
            
            {/* Subtitle / Body Text Style */}
            <p className="text-[#64748B] text-[16px] mb-8 leading-[1.6]">
                Please enter the official credentials to register a new <i className="text-[#EAB308] font-bold">Staff or Recruiter</i> into the system.
            </p>

            <form onSubmit={handleAddUser} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[14px] uppercase font-bold text-[#0F172A] tracking-widest">Full Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. John Doe" 
                        className="w-full p-4 bg-[#f8fafc] border border-slate-200 rounded-sm outline-none focus:border-[#0B1F3A] transition-all text-[#0F172A] font-bold text-lg" 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[14px] uppercase font-bold text-[#0F172A] tracking-widest">Email Address</label>
                    <input 
                        type="email" 
                        placeholder="official@company.com" 
                        className="w-full p-4 bg-[#f8fafc] border border-slate-200 rounded-sm outline-none focus:border-[#0B1F3A] transition-all text-[#0F172A] font-bold text-lg" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[14px] uppercase font-bold text-[#0F172A] tracking-widest">Secure Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-4 bg-[#f8fafc] border border-slate-200 rounded-sm outline-none focus:border-[#0B1F3A] transition-all text-[#0F172A] font-bold text-lg" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[14px] uppercase font-bold text-[#0F172A] tracking-widest">Assigned Role</label>
                    <select 
                        className="w-full p-4 bg-[#f8fafc] border border-slate-200 rounded-sm outline-none focus:border-[#0B1F3A] transition-all text-[#0F172A] font-bold text-lg appearance-none cursor-pointer" 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="recruiter">Recruiter (Standard)</option>
                        <option value="admin">Administrator (Full Access)</option>
                    </select>
                </div>

                {/* Button Style (Light Gold) */}
                <button className="w-full bg-[#EAB308] text-[#0B1F3A] py-5 rounded-sm font-bold text-[16px] uppercase tracking-[3px] hover:bg-[#0B1F3A] hover:text-white transition-all shadow-lg active:scale-95 mt-4">
                    Create Official Account
                </button>
            </form>
        </div>
    );
};

export default ManageUsers;