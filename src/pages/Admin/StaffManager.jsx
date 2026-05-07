import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, Trash2, ShieldAlert, ShieldCheck, Mail, X, User, Crown, Key, Shield } from 'lucide-react';

const StaffManager = () => {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'admin' });

    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/staff/all-members');
            setMembers(res.data);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    // --- Elegant Role Badge Helper ---
    const getRoleBadge = (role) => {
        const roles = {
            superadmin: 'bg-[#0B1F3A] text-[#EAB308] border border-[#EAB308]/30',
            admin: 'bg-slate-100 text-[#0B1F3A] border border-slate-200',
            recruiter: 'bg-blue-50 text-blue-700 border border-blue-100',
            hr_manager: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
            moderator: 'bg-purple-50 text-purple-700 border border-purple-100'
        };
        return roles[role] || 'bg-gray-100 text-gray-600';
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Revoke Authority?',
            text: "This member will lose all access immediately!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, Revoke Access'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/staff/delete/${id}`);
                    Swal.fire('Deactivated!', 'Authority Revoked successfully.', 'success');
                    fetchMembers();
                } catch (err) { Swal.fire('Error', 'Action failed', 'error'); }
            }
        });
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
        try {
            await axios.put(`http://localhost:5000/api/staff/update-status/${id}`, { status: newStatus });
            fetchMembers();
            Swal.fire({ title: 'System Synced', icon: 'success', timer: 800, showConfirmButton: false });
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', { ...formData, status: 'approved', registeredBy: 'superadmin' });
            Swal.fire('Success', `${formData.role.replace('_', ' ').toUpperCase()} Appointed!`, 'success');
            setShowForm(false);
            fetchMembers();
            setFormData({ full_name: '', email: '', password: '', role: 'admin' });
        } catch (err) { 
            Swal.fire('Error', err.response?.data?.message || 'Appointment Failed', 'error'); 
        }
        setLoading(false);
    };

    // Shared UI Styles
    const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200 rounded-sm font-bold outline-none focus:border-[#EAB308] transition-all text-[#0F172A]";
    const labelStyle = "text-[11px] font-bold uppercase tracking-[2px] text-[#64748B] mb-2 block";

    return (
        <div className="space-y-10 font-['Times_New_Roman',_serif] bg-white p-2">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-sm shadow-sm border border-slate-100 gap-6 border-t-[6px] border-[#0B1F3A]">
                <div>
                    <h2 className="text-[40px] font-bold text-[#0B1F3A] italic uppercase leading-tight">
                        Internal <span className="text-[#EAB308] not-italic">Authority</span>
                    </h2>
                    <p className="text-[16px] text-[#64748B] italic mt-1 font-medium">
                        Manage staff access with <span className="text-[#EAB308] font-bold">Absolute Governance.</span>
                    </p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-3 px-10 py-4 rounded-sm font-bold uppercase tracking-[3px] text-[13px] transition-all shadow-lg ${showForm ? 'bg-[#64748B] text-white' : 'bg-[#EAB308] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white'}`}
                >
                    {showForm ? <X size={18}/> : <UserPlus size={18}/>} 
                    {showForm ? "Close Terminal" : "Appoint Staff"}
                </button>
            </div>

            {/* Appointment Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-12 rounded-sm shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-top-10">
                    <div className="md:col-span-4 border-b border-slate-100 pb-4 mb-2">
                        <h3 className="text-[24px] font-bold text-[#0B1F3A]">New Authority Appointment</h3>
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Member Name</label>
                        <input type="text" className={inputStyle} placeholder="Full Legal Name" value={formData.full_name} onChange={(e)=>setFormData({...formData, full_name: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Corporate Email</label>
                        <input type="email" className={inputStyle} placeholder="email@company.com" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Access Key</label>
                        <input type="password" className={inputStyle} placeholder="••••••••" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className={labelStyle}>Designated Role</label>
                        <select className={inputStyle + " font-bold uppercase"} value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})}>
                            <option value="superadmin">Superadmin</option>
                            <option value="admin">Administrator</option>
                            <option value="hr_manager">HR Manager</option>
                            <option value="moderator">Moderator</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>
                    <button disabled={loading} className="md:col-span-4 bg-[#0B1F3A] text-white p-5 rounded-sm font-bold uppercase tracking-[5px] hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-all shadow-xl">
                        {loading ? "AUTHENTICATING..." : "CONFIRM OFFICIAL APPOINTMENT"}
                    </button>
                </form>
            )}

            {/* Authority Table */}
            <div className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0B1F3A] text-white uppercase text-[12px] font-bold tracking-[2px]">
                            <tr>
                                <th className="p-8 italic">Official Member</th>
                                <th className="p-8 italic">Clearance Level</th>
                                <th className="p-8 text-center italic">Governance</th>
                                <th className="p-8 text-center italic">Terminate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.length > 0 ? members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-all group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-slate-50 text-[#0B1F3A] border border-slate-200 rounded-sm flex items-center justify-center font-bold text-2xl shadow-sm group-hover:border-[#EAB308] transition-colors">
                                                    {member.full_name ? member.full_name[0] : <User size={24}/>}
                                                </div>
                                                {member.role === 'superadmin' && <Crown size={20} className="absolute -top-3 -right-3 text-[#EAB308] drop-shadow-sm" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0F172A] text-[18px] uppercase tracking-tight">{member.full_name}</p>
                                                <p className="text-[13px] text-[#64748B] flex items-center gap-2 italic"><Mail size={14} className="text-[#EAB308]"/> {member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`${getRoleBadge(member.role)} px-5 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-[2px] inline-block min-w-[120px] text-center shadow-sm`}>
                                            {member.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => toggleStatus(member.id, member.status)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all border
                                                ${member.status === 'approved' ? 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-white text-red-600 border-red-100 hover:bg-red-600 hover:text-white'}`}
                                            >
                                                {member.status === 'approved' ? <ShieldCheck size={16}/> : <ShieldAlert size={16}/>}
                                                {member.status}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="w-12 h-12 bg-white text-slate-300 border border-slate-100 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-sm flex items-center justify-center transition-all shadow-sm"
                                            >
                                                <Trash2 size={20}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-24 text-center text-slate-300 font-bold italic uppercase tracking-[10px] text-lg">Empty Records</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffManager;