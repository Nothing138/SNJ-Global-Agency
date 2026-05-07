import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Search, Eye, Edit3, X, ChevronLeft, ChevronRight,
  Building2, Mail, Phone, Globe, ShieldCheck, Ban, Trash,
  Briefcase, CheckCircle2, AlertCircle, ArrowUpDown, FilterX, UserX
} from 'lucide-react';

const B2BPartnerList = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [viewData, setViewData] = useState(null);
    const [activeActionId, setActiveActionId] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchB2B = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/b2b/list`, {
                params: {
                    page,
                    limit,
                    search: searchTerm,
                    status: statusFilter,
                    sortBy,
                    sortOrder
                }
            });
            if (res.data.success) {
                setPartners(res.data.data);
                setTotalPages(res.data.pagination.totalPages);
                setTotalCount(res.data.pagination.total || res.data.data.length);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setPartners([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, statusFilter, searchTerm, sortBy, sortOrder]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchB2B();
        }, 300);
        return () => clearTimeout(delay);
    }, [fetchB2B]);

    const handleSort = (field) => {
        const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(order);
    };

    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setSortBy('id');
        setSortOrder('desc');
        setPage(1);
    };

    const handleStatus = async (id, newStatus) => {
        setActiveActionId(null);
        const result = await Swal.fire({
            title: 'Update Status?',
            text: `Set partner status to ${newStatus.toUpperCase()}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#EAB308',
            cancelButtonColor: '#1e293b',
            confirmButtonText: 'Yes, Update',
            background: '#0B1F3A',
            color: '#fff',
            customClass: { popup: 'rounded-[20px]' }
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`http://localhost:5000/api/b2b/status/${id}`, { status: newStatus });
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#0B1F3A',
                        color: '#fff'
                    });
                    fetchB2B();
                }
            } catch (err) {
                Swal.fire('Error', 'Server update failed', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This partner will be permanently removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete',
            background: '#0B1F3A',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/b2b/${id}`);
                fetchB2B();
            } catch (err) {
                Swal.fire('Error', 'Deletion failed', 'error');
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-10 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1F3A] dark:text-white tracking-tight">B2B Partners</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and monitor all corporate partnerships</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-[#0B1F3A] px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Entities: </span>
                        <span className="text-lg font-black text-[#EAB308]">{totalCount}</span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white dark:bg-[#0B1F3A] p-4 rounded-[24px] shadow-xl border border-slate-100 dark:border-white/5">
                <div className="lg:col-span-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search by company, name or email..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none focus:ring-2 ring-[#EAB308]/40 dark:text-white transition-all"
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="lg:col-span-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="w-full bg-slate-50 dark:bg-white/5 px-4 py-4 rounded-xl font-bold dark:text-white border-none outline-none ring-1 ring-slate-200 dark:ring-white/10 cursor-pointer appearance-none"
                    >
                        <option value="">All Status</option>
                        <option value="approved">✅ Approved</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="blocked">🚫 Blocked</option>
                        <option value="rejected">❌ Rejected</option>
                    </select>
                </div>

                <div className="lg:col-span-3 flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-xl transition-all"
                    >
                        <FilterX size={18} /> Reset
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="w-full bg-white dark:bg-[#0B1F3A] rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-white/5 overflow-hidden">

                {/* Scrollable table wrapper */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">

                        {/* Header */}
                        <thead className="bg-white dark:bg-[#0B1F3A]">
                            <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-black border-b border-slate-200 dark:border-white/10">

                                <th className="px-8 py-5 text-left w-[30%] cursor-pointer hover:text-[#EAB308]" onClick={() => handleSort('company_name')}>
                                    <div className="flex items-center gap-2">
                                        Partner <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th className="px-8 py-5 text-left w-[25%]">Contact</th>

                                <th className="px-8 py-5 text-left w-[15%] cursor-pointer hover:text-[#EAB308]" onClick={() => handleSort('country')}>
                                    <div className="flex items-center gap-2">
                                        Country <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th className="px-8 py-5 text-left w-[15%]">Status</th>

                                <th className="px-8 py-5 text-right w-[15%]">Actions</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">

                            {/* Loading State */}
                            {loading && (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                                                    <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="h-3 w-40 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                                                <div className="h-3 w-28 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6"><div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-8 py-6"><div className="h-6 w-20 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" /></td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {/* Empty State */}
                            {!loading && partners.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Building2 size={40} className="text-slate-300 dark:text-white/20" />
                                            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">No partners found</p>
                                            <button
                                                onClick={handleReset}
                                                className="text-xs text-[#EAB308] underline underline-offset-4 font-bold"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Data Rows */}
                            {!loading && partners.map((b2b) => (
                                <tr
                                    key={b2b.id}
                                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-200"
                                >

                                    {/* Company */}
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/5 flex items-center justify-center">
                                                <Building2 size={22} className="text-[#EAB308]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-base text-[#0B1F3A] dark:text-white truncate">
                                                    {b2b.company_name}
                                                </p>
                                                <span className="text-xs text-slate-400">
                                                    #B2B-{String(b2b.id).padStart(4, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-8 py-5">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-sm text-[#0B1F3A] dark:text-white">
                                                <Mail size={14} className="text-[#EAB308] shrink-0" />
                                                <span className="truncate">{b2b.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Phone size={13} className="shrink-0" />
                                                <span>{b2b.phone}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Country */}
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#0B1F3A] dark:text-white">
                                            <Globe size={15} className="text-blue-400 shrink-0" />
                                            {b2b.country}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide ${
                                            b2b.status === 'approved'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                : b2b.status === 'blocked'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                                                : b2b.status === 'rejected'
                                                ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-amber-500/15 dark:text-amber-400'
                                        }`}>
                                            {b2b.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end items-center gap-2" ref={activeActionId === b2b.id ? dropdownRef : null}>

                                            {/* View */}
                                            <button
                                                onClick={() => setViewData(b2b)}
                                                title="View Details"
                                                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <Eye size={17} />
                                            </button>

                                            {/* Status Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveActionId(activeActionId === b2b.id ? null : b2b.id)}
                                                    title="Change Status"
                                                    className={`p-2.5 rounded-xl transition-all ${
                                                        activeActionId === b2b.id
                                                            ? 'bg-[#EAB308] text-black'
                                                            : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-white'
                                                    }`}
                                                >
                                                    <Edit3 size={17} />
                                                </button>

                                                {activeActionId === b2b.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#152a47] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 z-50">
                                                        <StatusBtn icon={<ShieldCheck size={14} />} label="Approve" color="text-green-600 dark:text-green-400" onClick={() => handleStatus(b2b.id, 'approved')} />
                                                        <StatusBtn icon={<AlertCircle size={14} />} label="Pending" color="text-amber-500" onClick={() => handleStatus(b2b.id, 'pending')} />
                                                        <StatusBtn icon={<UserX size={14} />} label="Reject" color="text-slate-500 dark:text-slate-400" onClick={() => handleStatus(b2b.id, 'rejected')} />
                                                        <StatusBtn icon={<Ban size={14} />} label="Block" color="text-red-500" onClick={() => handleStatus(b2b.id, 'blocked')} last />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(b2b.id)}
                                                title="Delete Partner"
                                                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <Trash size={17} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-[#0B1F3A] dark:text-white">
                            Page {page} of {totalPages}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {limit} partners per page
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white disabled:opacity-30 hover:bg-[#EAB308] hover:text-black hover:border-transparent transition-all font-bold text-sm"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white disabled:opacity-30 hover:bg-[#EAB308] hover:text-black hover:border-transparent transition-all font-bold text-sm"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* View Detail Modal */}
            {viewData && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10 bg-[#020617]/80 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setViewData(null); }}
                >
                    <div className="bg-white dark:bg-[#0B1F3A] w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">

                        {/* Modal Header */}
                        <div className="relative shrink-0 h-36 bg-gradient-to-r from-[#EAB308] to-[#fbbf24] px-10 flex items-center">
                            <button
                                onClick={() => setViewData(null)}
                                className="absolute top-6 right-6 p-2.5 bg-black/10 hover:bg-black/25 rounded-full transition-all"
                            >
                                <X size={22} className="text-[#0B1F3A]" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight">
                                    Partner Profile
                                </h2>
                                <p className="text-[#0B1F3A]/60 font-bold text-xs uppercase tracking-widest mt-1">
                                    ID: #B2B-{String(viewData.id).padStart(4, '0')}
                                </p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 md:p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <InfoBox label="Legal Entity Name" value={viewData.company_name} icon={<Building2 size={17} />} />
                            <InfoBox label="Authorized Personnel" value={viewData.full_name} icon={<CheckCircle2 size={17} />} />
                            <InfoBox label="Operational Region" value={viewData.country} icon={<Globe size={17} />} />
                            <InfoBox label="Corporate Email" value={viewData.email} icon={<Mail size={17} />} />
                            <InfoBox label="Primary Contact" value={viewData.phone} icon={<Phone size={17} />} />
                            <InfoBox label="Account Standing" value={viewData.status} icon={<ShieldCheck size={17} />} highlight />
                            <InfoBox label="Business Objective" value={viewData.purpose} icon={<Briefcase size={17} />} fullWidth />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Helper Components ────────────────────────────────────────────────────────

const StatusBtn = ({ icon, label, color, onClick, last }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black ${color} hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all ${!last ? 'border-b border-slate-100 dark:border-white/5' : ''}`}
    >
        {icon}
        <span>{label.toUpperCase()}</span>
    </button>
);

const InfoBox = ({ label, value, icon, highlight, fullWidth }) => (
    <div className={`flex flex-col gap-2.5 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
        <div className="flex items-center gap-2.5 text-[#EAB308]">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
        </div>
        <div className={`text-base font-bold leading-snug break-words ${highlight ? 'text-[#EAB308] uppercase tracking-widest' : 'text-[#0B1F3A] dark:text-white'}`}>
            {value || '—'}
        </div>
    </div>
);

export default B2BPartnerList;