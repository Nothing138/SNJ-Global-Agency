import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Search, Eye, Trash2, ChevronLeft, ChevronRight, X, ChevronDown
} from 'lucide-react';

const EmployeeList = () => {
    const [employees, setEmployees]           = useState([]);
    const [loading, setLoading]               = useState(true);
    const [searchTerm, setSearchTerm]         = useState('');
    const [statusFilter, setStatusFilter]     = useState('');
    const [page, setPage]                     = useState(1);
    const [limit, setLimit]                   = useState(10);
    const [totalPages, setTotalPages]         = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openDropdown, setOpenDropdown]     = useState(null); // which row's dropdown is open
    const dropdownRef = useRef(null);

    // ── Close dropdown when clicking outside ──────────────────────────────
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => { fetchEmployees(); }, [page, limit, statusFilter]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/employer/list`, {
                params: { page, limit, search: searchTerm, status: statusFilter }
            });
            setEmployees(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            console.error("Error fetching employers:", err);
        }
        setLoading(false);
    };

    const handleStatusChange = async (id, newStatus) => {
        setOpenDropdown(null);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Change status to "${newStatus}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update'
        });
        if (result.isConfirmed) {
            try {
                await axios.put(`https://snj-global-agency-backend.onrender.com/api/employer/status/${id}`, { status: newStatus });
                Swal.fire('Updated!', 'Employer status changed.', 'success');
                fetchEmployees();
            } catch {
                Swal.fire('Error', 'Failed to update status.', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Permanent Delete?',
            text: "This cannot be undone!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Delete Now',
            confirmButtonColor: '#ef4444',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`https://snj-global-agency-backend.onrender.com/api/employer/${id}`);
                Swal.fire('Deleted!', 'Employer record removed.', 'success');
                fetchEmployees();
            } catch {
                Swal.fire('Error', 'Failed to delete.', 'error');
            }
        }
    };

    // ── Status badge helper ────────────────────────────────────────────────
    const StatusBadge = ({ status }) => {
        const map = {
            approved: 'bg-green-100 text-green-700',
            pending:  'bg-amber-100  text-amber-700',
            rejected: 'bg-red-100   text-red-600',
            blocked:  'bg-gray-100  text-gray-600',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${map[status] || 'bg-gray-100 text-gray-500'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">

            {/* ── Header & Filters ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0B1F3A] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by company name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 ring-[#EAB308]/50 transition-all dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchEmployees()}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-2xl outline-none border-none dark:text-white text-sm font-bold"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="blocked">Blocked</option>
                    </select>

                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-2xl outline-none border-none dark:text-white text-sm font-bold"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white dark:bg-[#0B1F3A] rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-white/5">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-400 text-sm font-semibold">
                        Loading employers...
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                        No employers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 text-[#64748B] dark:text-white/60 text-[11px] uppercase tracking-[0.15em] font-black">
                                    <th className="px-6 py-5">#</th>
                                    <th className="px-6 py-5">Company Info</th>
                                    <th className="px-6 py-5">Industry / Country</th>
                                    <th className="px-6 py-5">Contact</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {employees.map((emp, i) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                                        {/* # */}
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-400">
                                                {(page - 1) * limit + i + 1}
                                            </span>
                                        </td>

                                        {/* Company Info */}
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                                                {emp.company_name}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                ID: {emp.id} · Cap: {emp.hiring_capacity}
                                            </div>
                                        </td>

                                        {/* Industry / Country */}
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                                                {emp.industry}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{emp.country}</div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-semibold text-[#0B1F3A] dark:text-white/80 truncate max-w-[180px]">
                                                {emp.email}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{emp.phone}</div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            <StatusBadge status={emp.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">

                                                {/* View button */}
                                                <button
                                                    onClick={() => setSelectedEmployee(emp)}
                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={15} />
                                                </button>

                                                {/* Status dropdown — click-based, not hover */}
                                                <div className="relative" ref={openDropdown === emp.id ? dropdownRef : null}>
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === emp.id ? null : emp.id)}
                                                        className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-xl text-xs font-bold hover:bg-[#0B1F3A] hover:text-[#EAB308] transition-all"
                                                        title="Change Status"
                                                    >
                                                        Status <ChevronDown size={12} />
                                                    </button>

                                                    {openDropdown === emp.id && (
                                                        <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 shadow-2xl rounded-xl border dark:border-white/10 overflow-hidden w-36">
                                                            {['approved', 'rejected', 'blocked', 'pending'].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleStatusChange(emp.id, s)}
                                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold capitalize transition-colors
                                                                        ${s === 'approved' ? 'hover:bg-green-50 text-green-600' :
                                                                          s === 'rejected' ? 'hover:bg-red-50 text-red-600' :
                                                                          s === 'blocked'  ? 'hover:bg-gray-50 text-gray-600' :
                                                                          'hover:bg-amber-50 text-amber-600'}
                                                                    `}
                                                                >
                                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Pagination ── */}
                {!loading && (
                    <div className="px-8 py-5 bg-slate-50 dark:bg-white/5 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg bg-white dark:bg-white/10 border dark:border-white/10 disabled:opacity-30 hover:bg-[#0B1F3A] hover:text-[#EAB308] transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg bg-white dark:bg-white/10 border dark:border-white/10 disabled:opacity-30 hover:bg-[#0B1F3A] hover:text-[#EAB308] transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── View / Detail Modal ── */}
            {selectedEmployee && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1F3A]/60 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setSelectedEmployee(null); }}
                >
                    <div className="bg-white dark:bg-[#0B1F3A] w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border dark:border-white/10">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-8 py-6 bg-[#0B1F3A]">
                            <div>
                                <div className="text-[#EAB308] text-xs font-black uppercase tracking-widest mb-1">
                                    Employer Details — ID #{selectedEmployee.id}
                                </div>
                                <div className="text-white text-lg font-black">
                                    {selectedEmployee.company_name}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Status Banner */}
                        <div className={`px-8 py-3 text-xs font-black uppercase tracking-widest text-center
                            ${selectedEmployee.status === 'approved' ? 'bg-green-100 text-green-700' :
                              selectedEmployee.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
                              selectedEmployee.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'}`
                        }>
                            Account Status: {selectedEmployee.status}
                        </div>

                        {/* Details Grid */}
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <DetailItem label="Company Name"    value={selectedEmployee.company_name} />
                            <DetailItem label="Industry"        value={selectedEmployee.industry} />
                            <DetailItem label="Country"         value={selectedEmployee.country} />
                            <DetailItem label="Hiring Capacity" value={selectedEmployee.hiring_capacity} />
                            <DetailItem label="Email Address"   value={selectedEmployee.email} />
                            <DetailItem label="Phone Number"    value={selectedEmployee.phone} />
                            <DetailItem label="Trade License"   value={selectedEmployee.trade_license} />
                            <DetailItem label="Business Reg."   value={selectedEmployee.business_reg} />
                            <DetailItem label="Owner ID"        value={selectedEmployee.owner_id} />
                            <DetailItem label="Email Verified"  value={selectedEmployee.is_email_verified ? '✅ Verified' : '❌ Not Verified'} />
                            <DetailItem label="Registered At"   value={new Date(selectedEmployee.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                        </div>

                        {/* Description if available */}
                        {selectedEmployee.description && (
                            <div className="px-8 pb-8">
                                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/5">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Company Description
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed">
                                        {selectedEmployee.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Modal Footer Actions */}
                        <div className="px-8 py-5 bg-slate-50 dark:bg-white/5 border-t dark:border-white/5 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { handleStatusChange(selectedEmployee.id, 'approved'); setSelectedEmployee(null); }}
                                className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] text-[#EAB308] text-sm font-black hover:opacity-90 transition-all"
                            >
                                Approve Employer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Reusable detail row ────────────────────────────────────────────────────────
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold text-[#0B1F3A] dark:text-white break-all">{value || '—'}</span>
    </div>
);

export default EmployeeList;