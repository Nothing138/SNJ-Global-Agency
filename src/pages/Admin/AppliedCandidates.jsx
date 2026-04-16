import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Filter, Trash2, CheckCircle, XCircle, FileText, Mail, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck, Briefcase } from 'lucide-react';

const AppliedCandidates = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/applied-candidates');
            setApplicants(res.data);
            setFilteredData(res.data);
        } catch (err) { 
            console.error("Axios Fetch Error:", err); 
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        let result = applicants.filter(app => {
            const name = app.full_name || "";
            const job = app.job_title || "";
            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 job.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
        });

        setFilteredData(result);
        setCurrentPage(1);
    }, [searchQuery, filterStatus, sortOrder, applicants]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://snj-global-agency-production.up.railway.app/api/admin/applications/${id}/status`, { status: newStatus });
            const Toast = Swal.mixin({ 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 2000,
                background: '#0B1F3A',
                color: '#fff'
            });
            Toast.fire({ icon: 'success', title: `Status Updated: ${newStatus.toUpperCase()}` });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '<span style="font-family: Times New Roman, serif;">Confirm Deletion?</span>',
            text: "This action will permanently remove the candidate record.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, Delete',
            customClass: { popup: 'rounded-[20px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://snj-global-agency-production.up.railway.app/api/admin/applications/${id}`);
                    fetchData();
                } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
            }
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'hired': return 'bg-green-50 text-green-700 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            case 'shortlisted': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'applied': return 'bg-slate-50 text-slate-700 border-slate-200';
            case 'interview': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    if (loading) return (
        <div className="p-20 text-center font-['Times_New_Roman',_serif] text-[24px] font-bold text-[#0B1F3A] italic">
            Synchronizing Database...
        </div>
    );

    return (
        <div className="space-y-10 pb-20 font-['Times_New_Roman',_serif] bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-[48px] font-bold text-[#0B1F3A] leading-tight tracking-tight uppercase">
                        Candidate <span className="text-[#EAB308] italic font-medium">Registry.</span>
                    </h1>
                    <p className="text-[18px] text-[#64748B] italic mt-2">
                        Overseeing <span className="text-[#0F172A] font-bold not-italic">{filteredData.length} active profiles</span> with Premium Authority.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                        <input 
                            placeholder="Search by name or role..." 
                            className="w-full lg:w-72 pl-12 pr-4 py-3 bg-[#F8FAFC] border-b-2 border-slate-200 text-[#0F172A] text-[16px] outline-none focus:border-[#EAB308] transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <select 
                            className="pl-6 pr-10 py-3 bg-[#0B1F3A] text-white text-[12px] font-bold uppercase tracking-widest appearance-none outline-none cursor-pointer hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-colors rounded-none"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">Global Filter</option>
                            <option value="interview">Interview</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="p-3 bg-[#F8FAFC] text-[#0B1F3A] border border-slate-200 hover:bg-[#0B1F3A] hover:text-white transition-all"
                    >
                        <ArrowUpDown size={20}/>
                    </button>
                </div>
            </div>

            {/* Candidates Grid/List */}
            <div className="grid grid-cols-1 gap-6">
                {currentItems.length > 0 ? currentItems.map(app => (
                    <div key={app.id} className="group bg-white border border-slate-100 hover:shadow-[0_20px_50px_rgba(11,31,58,0.08)] transition-all p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#0B1F3A] group-hover:bg-[#EAB308] transition-colors"></div>
                        
                        {/* Name & Identity */}
                        <div className="flex items-center gap-6 w-full lg:w-1/3">
                            <div className="w-16 h-16 bg-[#0B1F3A] text-[#EAB308] flex items-center justify-center text-[22px] font-bold italic shadow-lg">
                                {app.full_name ? app.full_name.charAt(0) : "?"}
                            </div>
                            <div>
                                <h4 className="text-[22px] font-bold text-[#0F172A] tracking-tight">{app.full_name}</h4>
                                <p className="text-[14px] text-[#64748B] flex items-center gap-2 mt-1 italic">
                                    <Mail size={14} className="text-[#EAB308]"/> {app.email}
                                </p>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="w-full lg:w-1/4">
                            <p className="text-[11px] font-bold text-[#EAB308] uppercase tracking-[0.2em] mb-1">Applied For</p>
                            <h5 className="text-[18px] font-bold text-[#0F172A] leading-tight">{app.job_title}</h5>
                            <span className="text-[13px] text-slate-400 italic">Submission: {new Date(app.created_at).toDateString()}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="w-full lg:w-auto text-center">
                            <span className={`px-6 py-2 rounded-none text-[10px] font-bold uppercase tracking-[0.25em] border ${getStatusColor(app.status)}`}>
                                {app.status}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                            <a href={`http://snj-global-agency-production.up.railway.app${app.resume_url}`} target="_blank" rel="noreferrer" 
                               className="p-3 text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-50 transition-all" title="View Dossier">
                                <FileText size={20}/>
                            </a>
                            
                            <div className="h-10 w-[1px] bg-slate-100 hidden lg:block mx-2"></div>
                            
                            <button onClick={() => updateStatus(app.id, 'shortlisted')} 
                                    className="p-3 text-blue-400 hover:bg-blue-50 transition-all" title="Shortlist">
                                <UserCheck size={20}/>
                            </button>

                            <button onClick={() => updateStatus(app.id, 'hired')} 
                                    className="p-3 text-green-500 hover:bg-green-50 transition-all" title="Approve Hire">
                                <CheckCircle size={20}/>
                            </button>

                            <button onClick={() => updateStatus(app.id, 'rejected')} 
                                    className="p-3 text-red-400 hover:bg-red-50 transition-all" title="Decline">
                                <XCircle size={20}/>
                            </button>

                            <button onClick={() => handleDelete(app.id)} 
                                    className="p-3 text-slate-300 hover:text-red-600 transition-all" title="Purge Record">
                                <Trash2 size={20}/>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-32 bg-[#F8FAFC] border-2 border-dashed border-slate-200">
                        <p className="text-[20px] font-bold italic text-slate-300 uppercase tracking-[0.3em]">No Candidate Data Found</p>
                    </div>
                )}
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B1F3A] p-8 shadow-2xl">
                <p className="text-[12px] font-bold uppercase text-white/50 tracking-[0.2em]">
                    Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} — {Math.min(indexOfLastItem, filteredData.length)} <span className="text-[#EAB308]">of {filteredData.length} Profiles</span>
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={`px-6 py-2 border border-white/20 text-white transition-all text-[11px] font-bold uppercase tracking-widest ${currentPage === 1 ? 'opacity-20' : 'hover:bg-[#EAB308] hover:text-[#0B1F3A] hover:border-[#EAB308]'}`}
                    >
                        Previous
                    </button>
                    <button 
                        disabled={indexOfLastItem >= filteredData.length}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={`px-6 py-2 border border-white/20 text-white transition-all text-[11px] font-bold uppercase tracking-widest ${indexOfLastItem >= filteredData.length ? 'opacity-20' : 'hover:bg-[#EAB308] hover:text-[#0B1F3A] hover:border-[#EAB308]'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppliedCandidates;