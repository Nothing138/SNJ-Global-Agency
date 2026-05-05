import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Briefcase, MapPin, DollarSign, FileText, Building, Send, Calendar, Tag, Globe } from 'lucide-react';

const PostJob = () => {
    const [jobData, setJobData] = useState({
        job_title: '', 
        company_name: '', 
        country: '', 
        salary_range: '', 
        job_type: 'on-site', 
        job_description: '',
        category: 'General',
        end_date: ''
    });

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:5000/api/admin/jobs/post"; 
            const response = await axios.post(url, jobData, {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2024' }
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Job Published!',
                    text: 'Circular broadcasted across the globe successfully.',
                    icon: 'success',
                    background: '#ffffff',
                    color: '#0B1F3A',
                    confirmButtonColor: '#EAB308',
                });

                setJobData({ 
                    job_title: '', company_name: '', country: '', 
                    salary_range: '', job_type: 'on-site', 
                    job_description: '', category: 'General', end_date: ''
                });
            }
        } catch (err) { 
            console.error("Post Error:", err);
            Swal.fire({
                title: 'Error',
                text: 'Check server connection!',
                icon: 'error',
                confirmButtonColor: '#0B1F3A'
            }); 
        }
    };

    // Helper for input styling to match the Navy/White theme
    const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200 rounded-sm font-bold outline-none focus:border-[#EAB308] transition-all duration-300 text-[#0F172A] text-lg";
    const labelStyle = "text-[14px] font-bold uppercase tracking-widest text-[#64748B] mb-2 flex items-center gap-2";

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-['Times_New_Roman',_serif]">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-12 border-b border-slate-100 pb-8">
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight italic uppercase">
                        Broadcast <span className="text-[#EAB308] not-italic">New Opportunity</span>
                    </h1>
                    <p className="text-[#64748B] text-[18px] mt-2 font-medium italic">
                        Deploy a new job circular to the <span className="text-[#EAB308] font-bold">Global Talent Network.</span>
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t-[6px] border-[#0B1F3A] space-y-10">
                    
                    {/* Row 1: Title & Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-1">
                            <label className={labelStyle}><Briefcase size={16} className="text-[#EAB308]"/> Job Designation</label>
                            <input className={inputStyle} placeholder="Executive Engineer" value={jobData.job_title} onChange={(e) => setJobData({...jobData, job_title: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyle}><Building size={16} className="text-[#EAB308]"/> Organization Name</label>
                            <input className={inputStyle} placeholder="JM IT Global" value={jobData.company_name} onChange={(e) => setJobData({...jobData, company_name: e.target.value})} required />
                        </div>
                    </div>

                    {/* Row 2: Location, Salary, Expiry */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-1">
                            <label className={labelStyle}><Globe size={16} className="text-[#EAB308]"/> Location/Country</label>
                            <input className={inputStyle} placeholder="London / Remote" value={jobData.country} onChange={(e) => setJobData({...jobData, country: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyle}><DollarSign size={16} className="text-[#EAB308]"/> Annual Remuneration</label>
                            <input 
                                type="text" 
                                className={inputStyle} 
                                placeholder="95000" 
                                value={jobData.salary_range} 
                                onChange={(e) => setJobData({...jobData, salary_range: e.target.value.replace(/\D/g, '')})} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyle + " text-[#0B1F3A]"}><Calendar size={16} className="text-[#EAB308]"/> Application Deadline</label>
                            <input 
                                type="date" 
                                className={inputStyle + " border-[#0B1F3A]/10"} 
                                min={today} 
                                value={jobData.end_date} 
                                onChange={(e) => setJobData({...jobData, end_date: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Row 3: Type & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-1">
                            <label className={labelStyle}><Layers size={16} className="text-[#EAB308]"/> Employment Type</label>
                            <select className={inputStyle + " cursor-pointer appearance-none"} value={jobData.job_type} onChange={(e) => setJobData({...jobData, job_type: e.target.value})}>
                                <option value="on-site">On-site (Standard)</option>
                                <option value="remote">Remote (Virtual)</option>
                                <option value="hybrid">Hybrid (Flexible)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyle}><Tag size={16} className="text-[#EAB308]"/> Business Category</label>
                            <input className={inputStyle} placeholder="Information Technology" value={jobData.category} onChange={(e) => setJobData({...jobData, category: e.target.value})} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className={labelStyle}><FileText size={16} className="text-[#EAB308]"/> Role Description & Requirements</label>
                        <textarea rows="5" className={inputStyle + " resize-none leading-[1.6]"} placeholder="Outline the core responsibilities and qualifications..." value={jobData.job_description} onChange={(e) => setJobData({...jobData, job_description: e.target.value})} required></textarea>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-[#EAB308] text-[#0B1F3A] py-6 rounded-sm font-bold text-[18px] uppercase tracking-[4px] hover:bg-[#0B1F3A] hover:text-white transition-all duration-500 shadow-xl flex items-center justify-center gap-4 group">
                        Confirm & Broadcast Circular <Send size={22} className="group-hover:translate-x-2 transition-transform"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;