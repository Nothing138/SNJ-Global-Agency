import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, Edit3, XCircle, CheckCircle, Calendar, DollarSign, Users, X, Activity } from 'lucide-react';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState(null);

    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/jobs/all", {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' }
            });
            setJobs(res.data.jobs);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#d33',
            background: '#fff', 
            color: '#0B1F3A'
        });

        if (confirm.isConfirmed) {
            await axios.delete(`http://localhost:5000/api/admin/jobs/delete/${id}`, {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' }
            });
            Swal.fire('Deleted!', 'Job removed successfully.', 'success');
            fetchJobs();
        }
    };

    const toggleStatus = async (job) => {
        const newStatus = job.status === 'active' ? 'close' : 'active';
        try {
            await axios.put(`http://localhost:5000/api/admin/jobs/update/${job.id}`, 
                { ...job, status: newStatus },
                { headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' } }
            );
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/jobs/update/${editingJob.id}`, 
                editingJob,
                { headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' } }
            );
            Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
            setEditingJob(null);
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="h-16 w-16 border-4 border-t-[#0B1F3A] border-[#EAB308] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 min-h-screen bg-white font-['Times_New_Roman',_serif]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 border-b border-slate-100 pb-10">
                <div>
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight italic">
                        Live Job <span className="text-[#EAB308]">Operations</span>
                    </h1>
                    <p className="text-[#64748B] text-[18px] mt-2 font-medium">Manage your career broadcasts and track performance.</p>
                </div>
                
                <div className="bg-[#0B1F3A] p-6 rounded-sm flex items-center gap-6 shadow-xl border-b-4 border-[#EAB308]">
                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-[#EAB308]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-[14px] uppercase font-bold text-white/70 tracking-widest">Live Inventory</p>
                        <p className="text-3xl font-bold text-white leading-none">
                            {jobs.filter(j => j.status === 'active').length} <span className="text-[16px] text-[#EAB308]">Active</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {jobs.map((job) => (
                    <div key={job.id} 
                        className={`group relative bg-white border border-slate-200 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-[#EAB308] ${job.status === 'close' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        
                        {/* Status Label */}
                        <div className="flex justify-between items-center mb-6">
                            <span className={`px-4 py-1 text-[12px] font-bold uppercase tracking-widest border ${job.status === 'active' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                {job.status}
                            </span>
                            <div className="flex items-center gap-2 text-[#64748B]">
                                <Users size={16} />
                                <span className="text-sm font-bold uppercase italic">{job.total_applicants || 0} Applicants</span>
                            </div>
                        </div>

                        {/* Job Content */}
                        <div className="space-y-4">
                            <h2 className="text-[28px] md:text-[32px] font-bold text-[#0F172A] leading-tight group-hover:text-[#0B1F3A] transition-colors line-clamp-2">
                                {job.job_title}
                            </h2>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="flex items-center gap-3 text-[#64748B] text-[16px] italic">
                                    <DollarSign size={18} className="text-[#EAB308]"/> 
                                    <span>Remuneration: <b className="text-[#0B1F3A] not-italic">{job.salary_range} USD</b></span>
                                </div>
                                <div className="flex items-center gap-3 text-[#64748B] text-[16px]">
                                    <Calendar size={18} className="text-[#EAB308]"/> 
                                    <span>Deadline: {new Date(job.end_date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 flex gap-3">
                                <button onClick={() => toggleStatus(job)} 
                                    className="h-12 flex-1 bg-[#f8fafc] border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-all flex justify-center items-center">
                                    {job.status === 'active' ? <XCircle size={20}/> : <CheckCircle size={20}/>}
                                </button>
                                
                                <button onClick={() => setEditingJob(job)} 
                                    className="h-12 flex-1 bg-[#f8fafc] border border-slate-200 text-blue-800 hover:bg-blue-800 hover:text-white transition-all flex justify-center items-center">
                                    <Edit3 size={20}/>
                                </button>

                                <button onClick={() => handleDelete(job.id)} 
                                    className="h-12 flex-1 bg-[#EAB308] text-[#0B1F3A] font-bold hover:bg-[#0B1F3A] hover:text-white transition-all flex justify-center items-center shadow-md">
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EDIT MODAL --- */}
            {editingJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg p-10 rounded-sm shadow-2xl border-t-[6px] border-[#EAB308] relative">
                        <button onClick={() => setEditingJob(null)} className="absolute top-6 right-6 text-slate-400 hover:text-[#0B1F3A]">
                            <X size={32} />
                        </button>
                        
                        <h3 className="text-[34px] font-bold text-[#0B1F3A] mb-8 italic">Edit Job Posting</h3>
                        
                        <form onSubmit={handleUpdateSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[14px] uppercase font-bold text-[#64748B]">Position Title</label>
                                <input className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#EAB308] outline-none text-[#0F172A] font-bold text-lg" value={editingJob.job_title} onChange={(e) => setEditingJob({...editingJob, job_title: e.target.value})} />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[14px] uppercase font-bold text-[#64748B]">Monthly Salary (USD)</label>
                                <input className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#EAB308] outline-none text-[#0F172A] font-bold text-lg" value={editingJob.salary_range} onChange={(e) => setEditingJob({...editingJob, salary_range: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] uppercase font-bold text-[#64748B]">Expiration Date</label>
                                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#EAB308] outline-none text-[#0F172A] font-bold" value={editingJob.end_date.split('T')[0]} onChange={(e) => setEditingJob({...editingJob, end_date: e.target.value})} />
                            </div>

                            <button type="submit" className="w-full py-5 bg-[#EAB308] text-[#0B1F3A] font-bold uppercase tracking-[2px] hover:bg-[#0B1F3A] hover:text-white transition-all shadow-lg mt-4 text-lg">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;