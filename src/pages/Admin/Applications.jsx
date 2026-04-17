import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Clock, CheckCircle, XCircle, Eye, Trash2, Search, Filter, ShieldCheck, ShieldAlert, CreditCard } from 'lucide-react';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAmount, setShowAmount] = useState({});

    const fetchData = async () => {
        try {
            const res = await axios.get('https://snj-global-agency-backend.onrender.com/api/admin/visa-applications');
            setApps(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async (app) => {
        const { value: formValues } = await Swal.fire({
            title: `<span style="font-family: 'Times New Roman', serif; font-style: italic; color: #0B1F3A; font-weight: bold; font-size: 24px;">Manage Application</span>`,
            html: `
                <div style="text-align: left; font-family: 'Times New Roman', serif; padding: 10px;">
                    <label style="font-size: 11px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Process Status</label>
                    <select id="swal-status" style="width: 100%; padding: 12px; margin: 8px 0 20px 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; font-weight: bold; color: #0B1F3A; outline: none;">
                        <option value="submitted" ${app.application_status === 'submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="reviewing" ${app.application_status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
                        <option value="embassy_update" ${app.application_status === 'embassy_update' ? 'selected' : ''}>Embassy Update</option>
                        <option value="approved" ${app.application_status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="rejected" ${app.application_status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                    
                    <label style="font-size: 11px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">Payment Control</label>
                    <select id="swal-payment" style="width: 100%; padding: 12px; margin-top: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; font-weight: bold; color: #0B1F3A; outline: none;" ${app.payment_status === 'paid' ? 'disabled' : ''}>
                        <option value="unpaid" ${app.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                        <option value="paid" ${app.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Sync Database',
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            customClass: { popup: 'rounded-[32px]' },
            preConfirm: () => ({
                application_status: document.getElementById('swal-status').value,
                payment_status: document.getElementById('swal-payment').value
            })
        });

        if (formValues) {
            try {
                await axios.put(`https://snj-global-agency-backend.onrender.com/api/admin/visa-applications/${app.id}`, formValues);
                Swal.fire({ title: 'Synced!', icon: 'success', confirmButtonColor: '#EAB308' });
                fetchData();
            } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Wipe Data?',
            text: "Permanent action. This cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Confirm Delete',
            customClass: { popup: 'rounded-[32px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://snj-global-agency-backend.onrender.com/api/admin/visa-applications/${id}`);
                    fetchData();
                    Swal.fire('Deleted!', '', 'success');
                } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
            }
        });
    };

    const filteredApps = apps.filter(app => {
        const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              app.destination_country?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.application_status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-10 p-6 font-['Times_New_Roman',_serif] bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-[48px] font-bold text-[#0B1F3A] uppercase tracking-tighter leading-none mb-2">
                        Visa <span className="text-[#EAB308] italic font-medium lowercase">Control.</span>
                    </h1>
                    <p className="text-[#64748B] text-[18px] italic">
                        Authoritative Management of <span className="text-[#0F172A] font-bold">Premium Quality Services</span>
                    </p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                        <input 
                            placeholder="Find application..." 
                            className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-b-2 border-slate-100 rounded-2xl text-[16px] text-[#0B1F3A] shadow-sm outline-none focus:border-[#EAB308] transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-6 py-3 bg-[#0B1F3A] text-white rounded-2xl text-[12px] font-bold uppercase tracking-widest cursor-pointer outline-none hover:bg-[#EAB308] transition-colors"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Global Filter</option>
                        <option value="submitted">Submitted</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>
            </div>

            {/* Application Table */}
            <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(11,31,58,0.05)] border border-slate-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0B1F3A] text-white text-[11px] font-bold uppercase tracking-[0.25em]">
                        <tr>
                            <th className="p-8">Official Name</th>
                            <th className="p-8">Classification</th>
                            <th className="p-8">Destination</th>
                            <th className="p-8">Financials</th>
                            <th className="p-8">Status</th>
                            <th className="p-8">Payment</th>
                            <th className="p-8 text-right">Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredApps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/80 transition-all group">
                                <td className="p-8">
                                    <p className="font-bold text-[#0B1F3A] text-[20px] group-hover:text-[#EAB308] transition-colors tracking-tight">
                                        {app.full_name}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref No: {app.id}2026-X</p>
                                </td>
                                <td className="p-8">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-[#0F172A]">{app.visa_type_name || 'Standard'}</span>
                                        <span className="text-[12px] text-[#EAB308] italic font-semibold">{app.visa_type}</span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className="font-bold text-[#0F172A] uppercase text-[14px] tracking-wider">{app.destination_country}</span>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setShowAmount({...showAmount, [app.id]: !showAmount[app.id]})}
                                            className="text-slate-300 hover:text-[#0B1F3A] transition-colors"
                                        >
                                            {showAmount[app.id] ? <ShieldCheck size={18}/> : <ShieldAlert size={18}/>}
                                        </button>
                                        <span className={`font-bold text-[#0B1F3A] text-[17px] ${showAmount[app.id] ? 'blur-0' : 'blur-[6px]'} transition-all duration-500`}>
                                            ${app.application_charge ? Number(app.application_charge).toLocaleString() : '0.00'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${app.application_status === 'approved' ? 'bg-green-50 text-green-600' : 
                                          app.application_status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-[#0B1F3A]'}`}>
                                        {app.application_status}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest ${app.payment_status === 'paid' ? 'text-[#EAB308]' : 'text-slate-300'}`}>
                                        <CreditCard size={14}/>
                                        {app.payment_status}
                                    </div>
                                </td>
                                <td className="p-8 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            onClick={() => handleUpdate(app)} 
                                            className="bg-[#EAB308] text-[#0B1F3A] px-5 py-2.5 rounded-xl hover:bg-[#0B1F3A] hover:text-white transition-all font-bold text-[12px] uppercase tracking-tighter"
                                        >
                                            Review File
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(app.id)} 
                                            className="text-slate-200 hover:text-red-600 transition-colors p-2"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredApps.length === 0 && (
                    <div className="p-32 text-center flex flex-col items-center">
                        <XCircle size={64} className="text-slate-100 mb-6"/>
                        <p className="text-[20px] font-bold italic text-slate-300 uppercase tracking-[0.4em]">Database: No Entries</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;