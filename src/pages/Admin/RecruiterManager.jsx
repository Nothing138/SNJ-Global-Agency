import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, ShieldAlert, ShieldCheck, Trash2, Briefcase, Users, Ban, CheckCircle, Search, ExternalLink } from 'lucide-react';

const RecruiterManager = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'list'
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecruiters = async () => {
        try {
            const res = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/recruiters/manage');
            setRecruiters(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchRecruiters(); }, []);

    const updateStatus = async (id, status) => {
        const actionText = status === 'approved' ? 'Approve' : status === 'suspended' ? 'Suspend' : 'Activate';
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${actionText} this recruiter.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: `Yes, ${actionText}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`http://snj-global-agency-production.up.railway.app/api/admin/recruiters/${id}/status`, { status });
                Swal.fire('Updated!', `Recruiter status is now ${status}.`, 'success');
                fetchRecruiters();
            }
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Recruiter?',
            text: "This will wipe all their data and jobs!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#0B1F3A',
            confirmButtonText: 'Delete Permanently'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://snj-global-agency-production.up.railway.app/api/admin/recruiters/${id}`);
                fetchRecruiters();
            }
        });
    };

    const pendingRequests = recruiters.filter(r => r.status === 'pending');
    const approvedRecruiters = recruiters.filter(r => (r.status === 'approved' || r.status === 'suspended') && r.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // UI Styles based on your requested theme
    const activeTabStyle = "bg-[#0B1F3A] text-white shadow-lg";
    const inactiveTabStyle = "bg-slate-100 text-[#64748B] hover:bg-slate-200";

    return (
        <div className="space-y-10 font-['Times_New_Roman',_serif] bg-white min-h-screen p-2">
            {/* Header & Tabs */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] italic uppercase tracking-tight">
                        Recruiter <span className="text-[#EAB308] not-italic">HQ</span>
                    </h1>
                    <div className="flex gap-4 mt-8">
                        <button 
                            onClick={() => setActiveTab('requests')}
                            className={`px-8 py-3 rounded-sm font-bold text-[12px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'requests' ? activeTabStyle : inactiveTabStyle}`}
                        >
                            Requests Area ({pendingRequests.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('list')}
                            className={`px-8 py-3 rounded-sm font-bold text-[12px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'list' ? activeTabStyle : inactiveTabStyle}`}
                        >
                            Authorized Agencies ({approvedRecruiters.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'list' && (
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-3.5 text-[#64748B]" size={18}/>
                        <input 
                            placeholder="Filter by Agency Name..." 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-sm font-bold text-sm outline-none focus:border-[#EAB308] transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-8">
                {(activeTab === 'requests' ? pendingRequests : approvedRecruiters).map(rec => (
                    <div key={rec.id} className="relative group transition-all duration-300 hover:-translate-y-1">
                        {/* Shadow Effect */}
                        <div className="absolute inset-0 bg-[#0B1F3A]/5 rounded-sm translate-x-2 translate-y-2"></div>
                        
                        <div className="relative bg-white border border-slate-200 rounded-sm p-8 flex flex-col lg:flex-row gap-8 items-center hover:border-[#EAB308] transition-colors shadow-sm">
                            
                            {/* Profile Section */}
                            <div className="flex items-center gap-6 lg:w-1/4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden shadow-inner">
                                    {rec.logo_url ? <img src={rec.logo_url} alt="" className="w-full h-full object-cover"/> : <Users className="text-[#0B1F3A]" size={32}/>}
                                </div>
                                <div>
                                    <h4 className="text-[24px] font-bold text-[#0F172A] leading-tight mb-1">{rec.company_name}</h4>
                                    <p className="text-[14px] font-medium text-[#64748B] italic tracking-wide">{rec.email}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mt-3 inline-block shadow-sm ${rec.status === 'suspended' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#EAB308]/10 text-[#0B1F3A] border border-[#EAB308]/20'}`}>
                                        Status: {rec.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-grow text-center lg:border-l lg:border-r border-slate-100 lg:px-10">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Total Jobs</p>
                                    <p className="text-[22px] font-bold text-[#0B1F3A] flex items-center justify-center gap-2">
                                        <Briefcase size={18} className="text-[#EAB308]"/> {rec.total_jobs}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Selected</p>
                                    <p className="text-[22px] font-bold text-green-600 flex items-center justify-center gap-2">
                                        <CheckCircle size={18}/> {rec.hired_count}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Rejected</p>
                                    <p className="text-[22px] font-bold text-red-500 flex items-center justify-center gap-2">
                                        <Ban size={18}/> {rec.rejected_count}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">In Review</p>
                                    <p className="text-[22px] font-bold text-[#EAB308]">{rec.pending_count}</p>
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="flex flex-wrap gap-4 lg:w-1/5 justify-end">
                                {rec.status === 'pending' ? (
                                    <>
                                        <button onClick={() => updateStatus(rec.id, 'approved')} className="flex-1 bg-[#EAB308] text-[#0B1F3A] p-4 rounded-sm font-bold text-[12px] uppercase tracking-widest hover:bg-[#0B1F3A] hover:text-white transition-all flex items-center justify-center gap-2 shadow-md">
                                            <ShieldCheck size={18}/> Approve
                                        </button>
                                        <button onClick={() => handleDelete(rec.id)} className="p-4 bg-red-50 text-red-500 rounded-sm border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                            <Trash2 size={18}/>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {rec.status === 'suspended' ? (
                                            <button onClick={() => updateStatus(rec.id, 'approved')} className="flex-1 bg-[#0B1F3A] text-white p-4 rounded-sm font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md">
                                                <ShieldCheck size={18}/> Activate
                                            </button>
                                        ) : (
                                            <button onClick={() => updateStatus(rec.id, 'suspended')} className="flex-1 bg-white text-red-600 border border-red-200 p-4 rounded-sm font-bold text-[12px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
                                                <Ban size={18}/> Suspend
                                            </button>
                                        )}
                                        <button className="p-4 bg-slate-50 text-[#0B1F3A] border border-slate-200 rounded-sm hover:bg-[#EAB308] transition-all shadow-sm">
                                            <ExternalLink size={18}/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {((activeTab === 'requests' ? pendingRequests : approvedRecruiters).length === 0) && (
                    <div className="p-24 text-center bg-white rounded-sm border-2 border-dashed border-slate-100">
                        <p className="font-bold italic uppercase text-slate-300 tracking-[8px] text-xl">No Records Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterManager;