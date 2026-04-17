import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Search, FilterX, Edit3, Trash2, Globe,
    ArrowUpDown, ChevronLeft, ChevronRight,
    AlertCircle, X, Save, UserX, CheckCircle2,
    PlusCircle, Tag, Clock, Briefcase,
    FileText, BarChart3, Plane, Award, ShieldCheck,
    EyeOff, XCircle,
} from 'lucide-react';

const API = 'https://snj-global-agency-backend.onrender.com/api/b2b';

// ── Per-service config ────────────────────────────────────────
const SERVICE_CONFIG = {
    visa: {
        label: 'Visa',
        endpoint: `${API}/pricing`,
        icon: <ShieldCheck size={15} />,
        statusOptions: ['active', 'inactive', 'pending'],
        color: 'from-[#EAB308] to-[#fbbf24]',
        accent: '#EAB308',
        tabActive: 'bg-[#EAB308] text-black',
        tabInactive: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white',
    },
    travel: {
        label: 'Travel',
        endpoint: `${API}/pricing/travel`,
        icon: <Plane size={15} />,
        statusOptions: ['active', 'inactive', 'hidden'],
        color: 'from-[#3b82f6] to-[#60a5fa]',
        accent: '#3b82f6',
        tabActive: 'bg-[#3b82f6] text-white',
        tabInactive: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white',
    },
    citizenship: {
        label: 'Citizenship',
        endpoint: `${API}/pricing/citizenship`,
        icon: <Award size={15} />,
        statusOptions: ['active', 'inactive', 'closed'],
        color: 'from-[#8b5cf6] to-[#a78bfa]',
        accent: '#8b5cf6',
        tabActive: 'bg-[#8b5cf6] text-white',
        tabInactive: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white',
    },
};

// Status styling — covers all possible values across services
const statusStyle = {
    active:   'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    inactive: 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400',
    pending:  'bg-yellow-100 text-yellow-700 dark:bg-amber-500/15 dark:text-amber-400',
    hidden:   'bg-slate-200 text-slate-500 dark:bg-white/8 dark:text-slate-500',
    closed:   'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
};

const statusIcon = (s) => ({
    active:   <CheckCircle2 size={13} />,
    inactive: <UserX size={13} />,
    pending:  <AlertCircle size={13} />,
    hidden:   <EyeOff size={13} />,
    closed:   <XCircle size={13} />,
}[s] || <AlertCircle size={13} />);

// ── Shared field wrapper ──────────────────────────────────────
const Field = ({ label, icon, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
            {icon && <span className="opacity-60">{icon}</span>}
            {label}
        </label>
        {children}
    </div>
);

const inputCls = "w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-[#EAB308] rounded-xl text-sm text-[#0B1F3A] dark:text-white outline-none focus:ring-2 ring-[#EAB308]/20 transition-all placeholder:text-slate-300 dark:placeholder:text-white/20";

// ── Add Modal ─────────────────────────────────────────────────
const AddModal = ({ serviceType, onClose, onAdded }) => {
    const cfg = SERVICE_CONFIG[serviceType];
    const isVisa = serviceType === 'visa';

    const EMPTY = {
        country: '', country_code: '',
        b2b_price: '', b2c_price: '',
        // visa-only
        processing_time: '', working_type: '', visa_type: '',
        // travel/citizenship shared
        travel_time: '',
        status: 'pending',
    };
    const [form, setForm]     = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (k, v) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrors(p => ({ ...p, [k]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.country.trim())       e.country       = 'Country name is required';
        if (!form.country_code.trim())  e.country_code  = 'Country code is required (2 letters)';
        else if (!/^[A-Za-z]{2}$/.test(form.country_code.trim())) e.country_code = 'Must be exactly 2 letters';
        const b2b = parseFloat(form.b2b_price);
        const b2c = parseFloat(form.b2c_price);
        if (isNaN(b2b) || b2b <= 0)    e.b2b_price     = 'Enter a valid positive price';
        if (isNaN(b2c) || b2c <= 0)    e.b2c_price     = 'Enter a valid positive price';
        if (isVisa && !form.processing_time.trim()) e.processing_time = 'Processing time is required';
        if (!isVisa && !form.travel_time.trim())    e.travel_time    = 'Travel time is required';
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSaving(true);
        try {
            let payload;
            if (isVisa) {
                payload = {
                    country:          form.country.trim(),
                    country_code:     form.country_code.toUpperCase().trim(),
                    b2b_price:        parseFloat(form.b2b_price),
                    b2c_price:        parseFloat(form.b2c_price),
                    processing_time:  form.processing_time.trim(),
                    working_type:     form.working_type.trim() || null,
                    visa_type:        form.visa_type.trim()    || null,
                    status:           form.status,
                };
            } else {
                // travel & citizenship: same payload shape, different field name
                const timeKey = serviceType === 'travel' ? 'travel_time' : 'processing_time';
                payload = {
                    country:      form.country.trim(),
                    country_code: form.country_code.toUpperCase().trim(),
                    b2b_price:    parseFloat(form.b2b_price),
                    b2c_price:    parseFloat(form.b2c_price),
                    [timeKey]:    form.travel_time.trim(),
                    status:       form.status,
                };
            }

            const res = await axios.post(cfg.endpoint, payload);
            if (res.data.success) {
                onAdded(res.data.data);
                onClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Country Added!',
                    html: `<span style="color:#94a3b8;font-size:14px;"><b style="color:${cfg.accent};">${payload.country}</b> has been added to ${cfg.label}.</span>`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#0B1F3A',
                    color: '#fff',
                });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add country';
            Swal.fire({ icon: 'error', title: 'Error', text: msg, background: '#0B1F3A', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    const ErrMsg = ({ field }) => errors[field]
        ? <span className="text-xs text-red-400 font-semibold mt-0.5">{errors[field]}</span>
        : null;

    const statusOptions = cfg.statusOptions;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-[#0B1F3A] w-full max-w-2xl rounded-[28px] shadow-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className={`relative h-32 bg-gradient-to-r ${cfg.color} px-8 flex items-center gap-4 overflow-hidden opacity-90`}
                     style={{ background: `linear-gradient(135deg, ${cfg.accent}cc, ${cfg.accent}88)` }}>
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full bg-white/5" />
                    <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-black/10 hover:bg-black/25 rounded-full transition-all">
                        <X size={18} className="text-white" />
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                        <PlusCircle size={22} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight leading-tight">
                            Add New Country · {cfg.label}
                        </h2>
                        <p className="text-white/70 text-xs font-semibold mt-0.5">
                            {isVisa ? 'Visa pricing entry' : serviceType === 'travel' ? 'Travel package entry' : 'Citizenship program entry'}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto">
                    {/* Country Name */}
                    <Field label="Country Name" icon={<Globe size={12} />}>
                        <input type="text" value={form.country} placeholder="e.g. United Kingdom"
                            onChange={e => set('country', e.target.value)}
                            className={`${inputCls} ${errors.country ? 'border-red-400' : ''}`} />
                        <ErrMsg field="country" />
                    </Field>

                    {/* Country Code */}
                    <Field label="Country Code" icon={<Tag size={12} />}>
                        <input type="text" value={form.country_code} placeholder="e.g. GB" maxLength={2}
                            onChange={e => set('country_code', e.target.value.toUpperCase())}
                            className={`${inputCls} uppercase font-mono tracking-widest ${errors.country_code ? 'border-red-400' : ''}`} />
                        <ErrMsg field="country_code" />
                    </Field>

                    {/* B2B Price */}
                    <Field label="B2B Price (USD)" icon={<BarChart3 size={12} />}>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none" style={{ color: cfg.accent }}>$</span>
                            <input type="number" step="0.01" min="0" value={form.b2b_price} placeholder="0.00"
                                onChange={e => set('b2b_price', e.target.value)}
                                className={`${inputCls} pl-8 ${errors.b2b_price ? 'border-red-400' : ''}`} />
                        </div>
                        <ErrMsg field="b2b_price" />
                    </Field>

                    {/* B2C Price */}
                    <Field label="B2C Price (USD)" icon={<BarChart3 size={12} />}>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">$</span>
                            <input type="number" step="0.01" min="0" value={form.b2c_price} placeholder="0.00"
                                onChange={e => set('b2c_price', e.target.value)}
                                className={`${inputCls} pl-8 ${errors.b2c_price ? 'border-red-400' : ''}`} />
                        </div>
                        <ErrMsg field="b2c_price" />
                    </Field>

                    {/* VISA-ONLY FIELDS */}
                    {isVisa && (
                        <>
                            <Field label="Processing Time" icon={<Clock size={12} />}>
                                <input type="text" value={form.processing_time} placeholder="e.g. 3-5 days"
                                    onChange={e => set('processing_time', e.target.value)}
                                    className={`${inputCls} ${errors.processing_time ? 'border-red-400' : ''}`} />
                                <ErrMsg field="processing_time" />
                            </Field>

                            <Field label="Working Type" icon={<Briefcase size={12} />}>
                                <select value={form.working_type} onChange={e => set('working_type', e.target.value)} className={inputCls}>
                                    <option value="">Select type (optional)</option>
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </Field>

                            <Field label="Visa Type" icon={<FileText size={12} />}>
                                <input type="text" value={form.visa_type} placeholder="e.g. Work Permit, H-1B"
                                    onChange={e => set('visa_type', e.target.value)} className={inputCls} />
                            </Field>
                        </>
                    )}

                    {/* TRAVEL / CITIZENSHIP: Travel Time only */}
                    {!isVisa && (
                        <Field label="Travel Time" icon={<Clock size={12} />}>
                            <input type="text" value={form.travel_time}
                                placeholder={serviceType === 'travel' ? 'e.g. 6 hours flight' : 'e.g. 6-12 months'}
                                onChange={e => set('travel_time', e.target.value)}
                                className={`${inputCls} ${errors.travel_time ? 'border-red-400' : ''}`} />
                            <ErrMsg field="travel_time" />
                        </Field>
                    )}

                    {/* Status */}
                    <Field label="Status" icon={<CheckCircle2 size={12} />}>
                        <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                            {statusOptions.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-6">
                    <button onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-lg text-white"
                        style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}bb)` }}>
                        <PlusCircle size={15} />
                        {saving ? 'Adding...' : 'Add Country'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Edit Modal ────────────────────────────────────────────────
const EditModal = ({ row, serviceType, onClose, onSaved }) => {
    const cfg    = SERVICE_CONFIG[serviceType];
    const isVisa = serviceType === 'visa';

    const [form, setForm] = useState({
        b2b_price:       row.b2b_price,
        b2c_price:       row.b2c_price,
        processing_time: row.processing_time || '',
        working_type:    row.working_type    || '',
        visa_type:       row.visa_type       || '',
        travel_time:     row.travel_time     || row.processing_time || '',
        status:          row.status,
    });
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        const b2b = parseFloat(form.b2b_price);
        const b2c = parseFloat(form.b2c_price);
        if (isNaN(b2b) || b2b <= 0 || isNaN(b2c) || b2c <= 0) {
            Swal.fire({ icon: 'warning', title: 'Invalid Price', text: 'B2B and B2C price must be valid positive numbers.', background: '#0B1F3A', color: '#fff', timer: 2500, showConfirmButton: false });
            return;
        }
        setSaving(true);
        try {
            let payload;
            if (isVisa) {
                payload = {
                    b2b_price: b2b, b2c_price: b2c,
                    processing_time: form.processing_time,
                    working_type:    form.working_type || null,
                    visa_type:       form.visa_type    || null,
                    status:          form.status,
                };
            } else {
                const timeKey = serviceType === 'travel' ? 'travel_time' : 'processing_time';
                payload = {
                    b2b_price: b2b, b2c_price: b2c,
                    [timeKey]: form.travel_time,
                    status:    form.status,
                };
            }
            const res = await axios.put(`${cfg.endpoint}/${row.id}`, payload);
            if (res.data.success) {
                onSaved({ ...row, ...payload, travel_time: payload.travel_time || payload.processing_time });
                onClose();
                Swal.fire({ icon: 'success', title: 'Updated!', timer: 1400, showConfirmButton: false, background: '#0B1F3A', color: '#fff' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Update Failed', background: '#0B1F3A', color: '#fff' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white dark:bg-[#0B1F3A] w-full max-w-2xl rounded-[28px] shadow-2xl border border-white/10 overflow-hidden">
                <div className="relative h-28 px-8 flex items-center gap-4"
                     style={{ background: `linear-gradient(135deg, ${cfg.accent}dd, ${cfg.accent}88)` }}>
                    <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-black/10 hover:bg-black/25 rounded-full transition-all">
                        <X size={20} className="text-white" />
                    </button>
                    <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <Globe size={22} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight leading-tight">{row.country}</h2>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{row.country_code} · {cfg.label} · Edit</p>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="B2B Price (USD)" icon={<BarChart3 size={12} />}>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none" style={{ color: cfg.accent }}>$</span>
                            <input type="number" step="0.01" min="0" value={form.b2b_price}
                                onChange={e => set('b2b_price', e.target.value)} className={`${inputCls} pl-8`} />
                        </div>
                    </Field>
                    <Field label="B2C Price (USD)" icon={<BarChart3 size={12} />}>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">$</span>
                            <input type="number" step="0.01" min="0" value={form.b2c_price}
                                onChange={e => set('b2c_price', e.target.value)} className={`${inputCls} pl-8`} />
                        </div>
                    </Field>

                    {isVisa ? (
                        <>
                            <Field label="Processing Time" icon={<Clock size={12} />}>
                                <input type="text" value={form.processing_time} placeholder="e.g. 3-5 days"
                                    onChange={e => set('processing_time', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Working Type" icon={<Briefcase size={12} />}>
                                <select value={form.working_type} onChange={e => set('working_type', e.target.value)} className={inputCls}>
                                    <option value="">Select type</option>
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </Field>
                            <Field label="Visa Type" icon={<FileText size={12} />}>
                                <input type="text" value={form.visa_type} placeholder="e.g. Work Permit, Tourist Visa"
                                    onChange={e => set('visa_type', e.target.value)} className={inputCls} />
                            </Field>
                        </>
                    ) : (
                        <Field label="Travel Time" icon={<Clock size={12} />}>
                            <input type="text" value={form.travel_time}
                                placeholder={serviceType === 'travel' ? 'e.g. 6 hours flight' : 'e.g. 6-12 months'}
                                onChange={e => set('travel_time', e.target.value)} className={inputCls} />
                        </Field>
                    )}

                    <Field label="Status" icon={<CheckCircle2 size={12} />}>
                        <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                            {cfg.statusOptions.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </Field>
                </div>
                <div className="px-8 pb-8 flex justify-end gap-3">
                    <button onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 text-white"
                        style={{ background: cfg.accent }}>
                        <Save size={15} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Status Dropdown ───────────────────────────────────────────
const StatusDropdown = ({ row, serviceType, onChanged }) => {
    const cfg    = SERVICE_CONFIG[serviceType];
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = async (newStatus) => {
        setOpen(false);
        if (newStatus === row.status) return;
        const result = await Swal.fire({
            title: 'Change Status?',
            text: `Set "${row.country}" to ${newStatus.toUpperCase()}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: cfg.accent,
            cancelButtonColor: '#1e293b',
            confirmButtonText: 'Yes, Update',
            background: '#0B1F3A',
            color: '#fff',
        });
        if (!result.isConfirmed) return;
        try {
            const res = await axios.patch(`${cfg.endpoint}/${row.id}/status`, { status: newStatus });
            if (res.data.success) {
                onChanged(row.id, newStatus);
                Swal.fire({ icon: 'success', title: 'Status Updated', timer: 1400, showConfirmButton: false, background: '#0B1F3A', color: '#fff' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Failed', background: '#0B1F3A', color: '#fff' });
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition-all hover:opacity-80 ${statusStyle[row.status] || statusStyle.pending}`}
            >
                {statusIcon(row.status)}
                {row.status}
                <span className="ml-0.5 opacity-60">▾</span>
            </button>
            {open && (
                <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-[#152a47] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-1.5 z-50">
                    {cfg.statusOptions.map(s => (
                        <button
                            key={s}
                            onClick={() => handleChange(s)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black hover:bg-slate-50 dark:hover:bg-white/5 transition-all ${s === row.status ? 'opacity-40 cursor-default' : ''}`}
                        >
                            {statusIcon(s)}
                            <span className="capitalize">{s}</span>
                            {s === row.status && <span className="ml-auto text-[10px] opacity-60">current</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────
const B2BPricingTable = () => {
    const [serviceType, setServiceType]   = useState('visa');
    const [rows, setRows]                 = useState([]);
    const [loading, setLoading]           = useState(true);
    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy]             = useState('country');
    const [sortOrder, setSortOrder]       = useState('asc');
    const [page, setPage]                 = useState(1);
    const [totalPages, setTotalPages]     = useState(1);
    const [totalCount, setTotalCount]     = useState(0);
    const LIMIT = 15;

    const [editRow, setEditRow] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

    const cfg = SERVICE_CONFIG[serviceType];

    // Reset filters when switching service type
    const switchService = (type) => {
        setServiceType(type);
        setSearchTerm('');
        setStatusFilter('');
        setSortBy('country');
        setSortOrder('asc');
        setPage(1);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(cfg.endpoint, {
                params: { page, limit: LIMIT, search: searchTerm, status: statusFilter, sortBy, sortOrder }
            });
            if (res.data.success) {
                setRows(res.data.data);
                setTotalPages(res.data.pagination?.totalPages || 1);
                setTotalCount(res.data.pagination?.total || res.data.data.length);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [cfg.endpoint, page, searchTerm, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        const t = setTimeout(fetchData, 300);
        return () => clearTimeout(t);
    }, [fetchData]);

    const handleSort = (field) => {
        setSortOrder(prev => sortBy === field && prev === 'asc' ? 'desc' : 'asc');
        setSortBy(field);
        setPage(1);
    };

    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setSortBy('country');
        setSortOrder('asc');
        setPage(1);
    };

    const handleSaved = (updatedRow) => {
        setRows(prev => prev.map(r => r.id === updatedRow.id ? updatedRow : r));
    };

    const handleAdded = () => {
        fetchData();
        setTotalCount(p => p + 1);
    };

    const handleStatusChanged = (id, newStatus) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: 'Delete This Record?',
            html: `<span style="color:#94a3b8;font-size:14px;">Country: <b style="color:#fff;">${row.country}</b> will be permanently removed from ${cfg.label}.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#1e293b',
            confirmButtonText: 'Yes, Delete',
            background: '#0B1F3A',
            color: '#fff',
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`${cfg.endpoint}/${row.id}`);
            setRows(prev => prev.filter(r => r.id !== row.id));
            setTotalCount(p => p - 1);
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1400, showConfirmButton: false, background: '#0B1F3A', color: '#fff' });
        } catch {
            Swal.fire({ icon: 'error', title: 'Delete Failed', background: '#0B1F3A', color: '#fff' });
        }
    };

    const SortTh = ({ field, label }) => (
        <th
            className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-white select-none whitespace-nowrap"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1.5">
                {label}
                <ArrowUpDown size={12} className={sortBy === field ? 'opacity-100' : 'opacity-40'} style={sortBy === field ? { color: cfg.accent } : {}} />
            </div>
        </th>
    );

    const isVisa = serviceType === 'visa';
    const activeCount  = rows.filter(r => r.status === 'active').length;
    const pendingCount = rows.filter(r => r.status === (serviceType === 'visa' ? 'pending' : serviceType === 'travel' ? 'hidden' : 'closed')).length;

    // Tab icon map for display in header pill
    const serviceIcons = {
        visa:        <ShieldCheck size={11} />,
        travel:      <Plane size={11} />,
        citizenship: <Award size={11} />,
    };

    return (
        <>
            {showAdd && <AddModal serviceType={serviceType} onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
            {editRow && <EditModal row={editRow} serviceType={serviceType} onClose={() => setEditRow(null)} onSaved={handleSaved} />}

            <div className="w-full min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-10 space-y-6">

                {/* ── Header ─────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 transition-all duration-300"
                             style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}88)`, boxShadow: `0 8px 24px ${cfg.accent}33` }}>
                            {serviceType === 'visa' ? <ShieldCheck size={26} className="text-white" />
                             : serviceType === 'travel' ? <Plane size={26} className="text-white" />
                             : <Award size={26} className="text-white" />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#0B1F3A] dark:text-white tracking-tight leading-tight">
                                B2B Pricing
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">
                                Manage pricing and details per country
                            </p>
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black text-white"
                                      style={{ background: `${cfg.accent}33`, color: cfg.accent }}>
                                    <Globe size={11} /> {totalCount} Countries
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400">
                                    <CheckCircle2 size={11} /> {activeCount} Active
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400">
                                    <AlertCircle size={11} /> {pendingCount} {serviceType === 'visa' ? 'Pending' : serviceType === 'travel' ? 'Hidden' : 'Closed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add button */}
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 shrink-0 self-start lg:self-center text-white"
                        style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}bb)`, boxShadow: `0 4px 20px ${cfg.accent}44` }}
                    >
                        <PlusCircle size={18} />
                        Add New Country
                    </button>
                </div>

                {/* ── Service Type Tabs ───────────────────── */}
                <div className="flex items-center gap-2 bg-white dark:bg-[#0B1F3A] p-2 rounded-2xl shadow-lg border border-slate-100 dark:border-white/5 w-fit">
                    {Object.entries(SERVICE_CONFIG).map(([key, c]) => (
                        <button
                            key={key}
                            onClick={() => switchService(key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-200 ${
                                serviceType === key
                                    ? 'text-white shadow-md'
                                    : 'bg-transparent text-slate-400 hover:text-white dark:hover:bg-white/5'
                            }`}
                            style={serviceType === key ? { background: c.accent, boxShadow: `0 4px 12px ${c.accent}44` } : {}}
                        >
                            {c.icon}
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* ── Filters ────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-white dark:bg-[#0B1F3A] p-4 rounded-[24px] shadow-xl border border-slate-100 dark:border-white/5">
                    <div className="lg:col-span-7 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="Search by country name or code..."
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 rounded-xl outline-none focus:ring-2 dark:text-white text-sm transition-all"
                            style={{ '--tw-ring-color': `${cfg.accent}40` }}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <select
                            value={statusFilter}
                            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full bg-slate-50 dark:bg-white/5 px-4 py-3.5 rounded-xl font-bold dark:text-white text-sm border-none outline-none ring-1 ring-slate-200 dark:ring-white/10 cursor-pointer appearance-none"
                        >
                            <option value="">All Status</option>
                            {cfg.statusOptions.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl transition-all text-sm"
                        >
                            <FilterX size={16} /> Reset
                        </button>
                    </div>
                </div>

                {/* ── Table Card ─────────────────────────── */}
                <div className="w-full bg-white dark:bg-[#0B1F3A] rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-white/5 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse" style={{ minWidth: isVisa ? '1100px' : '800px' }}>
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02]">
                                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">#</th>
                                    <SortTh field="country" label="Country" />
                                    <SortTh field="b2b_price" label="B2B Price" />
                                    <SortTh field="b2c_price" label="B2C Price" />

                                    {/* VISA columns */}
                                    {isVisa && <>
                                        <SortTh field="processing_time" label="Processing Time" />
                                        <SortTh field="working_type" label="Working Type" />
                                        <SortTh field="visa_type" label="Visa Type" />
                                    </>}

                                    {/* TRAVEL columns */}
                                    {serviceType === 'travel' && (
                                        <SortTh field="travel_time" label="Travel Time" />
                                    )}

                                    {/* CITIZENSHIP columns */}
                                    {serviceType === 'citizenship' && (
                                        <SortTh field="processing_time" label="Processing Time" />
                                    )}

                                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {/* Skeleton */}
                                {loading && Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={`sk-${i}`}>
                                        {Array.from({ length: isVisa ? 9 : 7 }).map((__, j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded animate-pulse" style={{ width: j === 1 ? '120px' : '70px' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Empty */}
                                {!loading && rows.length === 0 && (
                                    <tr>
                                        <td colSpan={isVisa ? 9 : 7} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                    <Globe size={28} className="text-slate-300 dark:text-white/20" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No countries found</p>
                                                    <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or add a new country</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={handleReset} className="text-xs underline underline-offset-4 font-bold" style={{ color: cfg.accent }}>Clear filters</button>
                                                    <span className="text-slate-300 dark:text-white/10">·</span>
                                                    <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs font-bold underline underline-offset-4" style={{ color: cfg.accent }}>
                                                        <PlusCircle size={12} /> Add Country
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Data rows */}
                                {!loading && rows.map((row, idx) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors duration-150 group">
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-slate-400 font-bold">{(page - 1) * LIMIT + idx + 1}</span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                                     style={{ background: `${cfg.accent}15` }}>
                                                    <Globe size={16} style={{ color: cfg.accent }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-[#0B1F3A] dark:text-white leading-tight">{row.country}</p>
                                                    <p className="text-xs text-slate-400 leading-tight font-mono">{row.country_code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-black text-sm" style={{ color: cfg.accent }}>${parseFloat(row.b2b_price).toFixed(2)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-medium text-sm text-slate-600 dark:text-slate-300">${parseFloat(row.b2c_price).toFixed(2)}</span>
                                        </td>

                                        {/* VISA-only cells */}
                                        {isVisa && <>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{row.processing_time || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {row.working_type ? (
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap
                                                        ${row.working_type === 'Remote' ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300' :
                                                          row.working_type === 'Hybrid' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' :
                                                          'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'}`}>
                                                        {row.working_type}
                                                    </span>
                                                ) : <span className="text-slate-400 text-sm">—</span>}
                                            </td>
                                            <td className="px-5 py-4">
                                                {row.visa_type
                                                    ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 whitespace-nowrap">{row.visa_type}</span>
                                                    : <span className="text-slate-400 text-sm">—</span>}
                                            </td>
                                        </>}

                                        {/* TRAVEL travel_time */}
                                        {serviceType === 'travel' && (
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{row.travel_time || '—'}</span>
                                            </td>
                                        )}

                                        {/* CITIZENSHIP processing_time */}
                                        {serviceType === 'citizenship' && (
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">{row.processing_time || '—'}</span>
                                            </td>
                                        )}

                                        <td className="px-5 py-4">
                                            <StatusDropdown row={row} serviceType={serviceType} onChanged={handleStatusChanged} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => setEditRow(row)} title="Edit"
                                                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(row)} title="Delete"
                                                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ────────────────────── */}
                    <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-[#0B1F3A] dark:text-white">Page {page} of {totalPages}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{LIMIT} records per page · {totalCount} total</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white disabled:opacity-30 font-bold text-sm transition-all hover:text-black"
                                style={{ '--hover-bg': cfg.accent }}
                                onMouseEnter={e => { e.currentTarget.style.background = cfg.accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'transparent'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white disabled:opacity-30 font-bold text-sm transition-all"
                                onMouseEnter={e => { e.currentTarget.style.background = cfg.accent; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'transparent'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default B2BPricingTable;