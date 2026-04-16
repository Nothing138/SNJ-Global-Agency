import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageRecruiters = () => {
    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/pending-recruiters');
            setRecruiters(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleApprove = async (id) => {
        Swal.fire({
            title: 'Confirm Approval?',
            text: "This recruiter will be granted platform access.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A', // Navy
            cancelButtonColor: '#64748B', // Light Gray
            confirmButtonText: 'Yes, Approve!',
            background: '#ffffff',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`http://snj-global-agency-production.up.railway.app/api/admin/approve-recruiter/${id}`);
                    
                    if (res.data.success) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Recruiter has been approved.',
                            icon: 'success',
                            confirmButtonColor: '#EAB308', // Gold
                            timer: 2000
                        });
                        fetchPending();
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    return (
        <div className="p-8 md:p-12 bg-white min-h-screen font-['Times_New_Roman',_serif]">
            {/* Header Section */}
            <div className="mb-12 border-b border-slate-100 pb-8">
                <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight italic uppercase tracking-tight">
                    Recruiter <span className="text-[#EAB308] not-italic">Requests</span>
                </h1>
                <p className="text-[#64748B] text-[18px] mt-2 font-medium">Review and authorize new corporate access requests.</p>
            </div>

            {/* List Section */}
            <div className="max-w-6xl space-y-6">
                {recruiters.length === 0 ? (
                    <div className="bg-[#f8fafc] p-16 rounded-sm border border-slate-100 text-center shadow-inner">
                         <p className="text-[#64748B] text-xl italic font-medium">No pending requests found in the archive.</p>
                    </div>
                ) : (
                    recruiters.map(r => (
                        <div key={r.id} className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-[#EAB308]">
                            
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#0B1F3A] rounded-full flex items-center justify-center border-2 border-[#EAB308]/20">
                                    <UserCheck className="text-[#EAB308]" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-[28px] font-bold text-[#0F172A] leading-none mb-1">{r.full_name}</h4>
                                    <p className="text-[16px] text-[#64748B] italic tracking-wide">{r.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2px] text-[#EAB308] bg-[#0B1F3A] px-5 py-2 rounded-full shadow-md">
                                    <Clock size={14}/> Awaiting Audit
                                </span>
                                
                                <button 
                                    onClick={() => handleApprove(r.id)}
                                    className="bg-[#EAB308] text-[#0B1F3A] px-10 py-4 rounded-sm font-bold text-[14px] uppercase tracking-widest hover:bg-[#0B1F3A] hover:text-white transition-all shadow-lg active:scale-95 border-b-4 border-[#0B1F3A]/20"
                                >
                                    Approve Access
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageRecruiters;