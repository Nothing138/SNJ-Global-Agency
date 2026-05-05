import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Trash2, X, CheckCircle, Edit2,
    Briefcase, User, Mail, Globe, DollarSign, MapPin, ChevronDown
} from 'lucide-react';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL || 'https://snj-global-agency-backend.onrender.com';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
    pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    processing: 'bg-blue-500/20   text-blue-400   border-blue-500/30',
    confirmed:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
    completed:  'bg-green-500/20  text-green-400  border-green-500/30',
    rejected:   'bg-red-500/20    text-red-400    border-red-500/30',
};

const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[status] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
        {status}
    </span>
);

// ─── Reusable Input Field ─────────────────────────────────────────────────────
const Field = ({ label, fieldKey, icon: Icon, type = 'text', required = true, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
                type={type}
                required={required}
                value={value}
                onChange={e => onChange(fieldKey, e.target.value)}
                className="w-full bg-slate-800/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/60 transition-colors placeholder:text-slate-600"
            />
        </div>
    </div>
);

// ─── Select Field ─────────────────────────────────────────────────────────────
const SelectField = ({ label, value, onChange, disabled, children }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full appearance-none bg-slate-800/60 border border-white/10 rounded-xl py-3 px-4 pr-9 text-sm outline-none focus:border-blue-500/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={15} />
        </div>
    </div>
);

// ─── Empty Form ───────────────────────────────────────────────────────────────
const EMPTY = {
    user_name: '', address: '', passport_number: '', contact_number: '',
    id_number: '', nationality: '', passport_validity_month: '',
    email: '', service_type: '', partner_id: '',
    destination_country: '', destination_country_code: '',
    selected_price: '', price_type: 'b2b_price',
};

// ═══════════════════════════════════════════════════════════════════════════════
const AssignTask = () => {
    const [tasks, setTasks]                             = useState([]);
    const [partners, setPartners]                       = useState([]);
    const [filteredPartners, setFilteredPartners]       = useState([]);
    const [serviceCountries, setServiceCountries]       = useState([]);
    const [selectedCountryData, setSelectedCountryData] = useState(null);

    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [editingId, setEditingId]       = useState(null); // null = create, number = edit
    const [loading, setLoading]           = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [countryLoading, setCountryLoading] = useState(false);

    const [searchTerm, setSearchTerm]       = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [formData, setFormData]           = useState(EMPTY);

    // ── Initial load ──────────────────────────────────────────────────────────
    useEffect(() => { fetchTasks(); fetchPartners(); }, []);

    // ── When service_type changes → filter partners + load countries ──────────
    useEffect(() => {
        if (!formData.service_type) {
            setFilteredPartners([]);
            setServiceCountries([]);
            setSelectedCountryData(null);
            return;
        }
        const fp = partners.filter(
            p => p.purpose === formData.service_type || p.purpose === 'Multiple Services'
        );
        setFilteredPartners(fp);
        loadCountries(formData.service_type);

        setFormData(prev => ({
            ...prev,
            partner_id: '', destination_country: '',
            destination_country_code: '', selected_price: '',
        }));
        setSelectedCountryData(null);
    }, [formData.service_type, partners]);

    // ── API calls ─────────────────────────────────────────────────────────────
    const fetchTasks = async () => {
        setTableLoading(true);
        try {
            const { data } = await axios.get(`${API}/api/admin/assigned-tasks`);
            setTasks(data || []);
        } catch (e) { console.error(e); }
        finally { setTableLoading(false); }
    };

    const fetchPartners = async () => {
        try {
            const { data } = await axios.get(`${API}/api/admin/active-partners`);
            setPartners(data || []);
        } catch (e) { console.error(e); }
    };

    const loadCountries = async (serviceType) => {
        setCountryLoading(true);
        setServiceCountries([]);
        try {
            const { data } = await axios.get(`${API}/api/admin/service-countries`, {
                params: { service_type: serviceType }
            });
            setServiceCountries(data?.data || []);
        } catch (e) { console.error(e); setServiceCountries([]); }
        finally { setCountryLoading(false); }
    };

    // ── Form helpers ──────────────────────────────────────────────────────────
    const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const handleCountrySelect = (e) => {
        const name  = e.target.value;
        const found = serviceCountries.find(c => c.country === name);
        if (found) {
            setSelectedCountryData(found);
            const price = formData.price_type === 'b2b_price' ? found.b2b_price : found.b2c_price;
            setFormData(prev => ({
                ...prev,
                destination_country:      found.country,
                destination_country_code: found.country_code || '',
                selected_price:           price || '',
            }));
        } else {
            setSelectedCountryData(null);
            setFormData(prev => ({ ...prev, destination_country: '', destination_country_code: '', selected_price: '' }));
        }
    };

    const handlePriceType = (pt) => {
        const price = selectedCountryData
            ? (pt === 'b2b_price' ? selectedCountryData.b2b_price : selectedCountryData.b2c_price)
            : '';
        setFormData(prev => ({ ...prev, price_type: pt, selected_price: price || '' }));
    };

    // ── Open modal for CREATE ─────────────────────────────────────────────────
    const openCreate = () => {
        setEditingId(null);
        setFormData(EMPTY);
        setSelectedCountryData(null);
        setServiceCountries([]);
        setIsModalOpen(true);
    };

    // ── Open modal for EDIT ───────────────────────────────────────────────────
    const openEdit = async (task) => {
        setEditingId(task.id);
        setFormData({
            user_name:                task.user_name || '',
            address:                  task.address   || '',
            passport_number:          task.passport_number || '',
            contact_number:           task.contact_number  || '',
            id_number:                task.id_number   || '',
            nationality:              task.nationality  || '',
            passport_validity_month:  task.passport_validity_month || '',
            email:                    task.email        || '',
            service_type:             task.service_type || '',
            partner_id:               String(task.partner_id || ''),
            destination_country:      task.destination_country      || '',
            destination_country_code: task.destination_country_code || '',
            selected_price:           task.selected_price || '',
            price_type:               task.price_type || 'b2b_price',
        });
        setSelectedCountryData(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(EMPTY);
        setSelectedCountryData(null);
        setServiceCountries([]);
    };

    // ── Submit (create or update) ─────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.partner_id) {
            return Swal.fire({ icon: 'warning', title: 'Partner Required', text: 'Please select a B2B partner.', background: '#1e293b', color: '#fff', confirmButtonColor: '#3b82f6' });
        }

        setLoading(true);

        const payload = {
            user_name:                formData.user_name,
            address:                  formData.address || '',
            passport_number:          formData.passport_number,
            contact_number:           formData.contact_number,
            id_number:                formData.id_number || '',
            nationality:              formData.nationality || '',
            passport_validity_month:  formData.passport_validity_month || '',
            email:                    formData.email,
            service_type:             formData.service_type,
            partner_id:               formData.partner_id,
            destination_country:      formData.destination_country || '',
            destination_country_code: formData.destination_country_code || '',
            selected_price:           formData.selected_price || '',
            price_type:               formData.price_type || 'b2b_price',
        };

        try {
            if (editingId) {
                await axios.put(`${API}/api/admin/assigned-tasks/${editingId}`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
                Swal.fire({ icon: 'success', title: 'Task Updated!', background: '#1e293b', color: '#fff', confirmButtonColor: '#3b82f6' });
            } else {
                const { data } = await axios.post(`${API}/api/admin/assign-task`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
                Swal.fire({ icon: 'success', title: 'Task Assigned!', text: `Task #${data.task_id} created.`, background: '#1e293b', color: '#fff', confirmButtonColor: '#3b82f6' });
            }
            closeModal();
            fetchTasks();
        } catch (err) {
            console.error(err.response?.data || err.message);
            Swal.fire({ icon: 'error', title: 'Failed!', text: err.response?.data?.message || 'Something went wrong.', background: '#1e293b', color: '#fff' });
        } finally { setLoading(false); }
    };

    // ── Status update (inline) ────────────────────────────────────────────────
    const handleStatusChange = async (id, status) => {
        try {
            await axios.patch(`${API}/api/admin/task-status/${id}`, { status });
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        } catch { Swal.fire('Error', 'Status update failed', 'error'); }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: 'Delete this task?', icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#ef4444', cancelButtonColor: '#475569',
            background: '#1e293b', color: '#fff',
        });
        if (!res.isConfirmed) return;
        try {
            await axios.delete(`${API}/api/admin/assigned-tasks/${id}`);
            fetchTasks();
            Swal.fire({ icon: 'success', title: 'Deleted!', background: '#1e293b', color: '#fff', timer: 1500, showConfirmButton: false });
        } catch { Swal.fire('Error', 'Delete failed', 'error'); }
    };

    // ── Filter display tasks ──────────────────────────────────────────────────
    const displayed = tasks.filter(t =>
        ((t.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
         (t.passport_number || '').includes(searchTerm)) &&
        (!serviceFilter || t.service_type === serviceFilter)
    );

    // ════════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-6 text-white font-sans">
            <div className="max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Briefcase className="text-blue-500" size={28} />
                            Assign <span className="text-blue-500">Tasks</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage and distribute tasks to B2B Partners</p>
                    </div>
                    <button onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-sm">
                        <Plus size={18} /> New Task
                    </button>
                </div>

                {/* ── Filters ── */}
                <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl mb-6 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text" placeholder="Search name or passport..."
                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50 transition-colors"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-3 text-sm outline-none min-w-[180px]"
                        value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                        <option value="">All Services</option>
                        <option>Visa Referral</option>
                        <option>Travel Packages</option>
                        <option>Citizenship Programs</option>
                        <option>Multiple Services</option>
                    </select>
                    <span className="text-xs text-slate-500 font-bold ml-auto">{displayed.length} tasks</span>
                </div>

                {/* ── Table ── */}
                <div className="bg-slate-800/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    {tableLoading ? (
                        <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Loading tasks...
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                            <Briefcase size={40} className="text-slate-700" />
                            <p className="text-sm">No tasks found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-white/5">
                                    <tr>
                                        {['#','Client','Destination','Service','Price','Partner','Status','Actions'].map(h => (
                                            <th key={h} className="px-5 py-3.5">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {displayed.map((task, i) => (
                                        <tr key={task.id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-5 py-4 text-xs text-slate-500 font-bold">{i + 1}</td>

                                            {/* Client */}
                                            <td className="px-5 py-4">
                                                <div className="font-bold">{task.user_name}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">{task.passport_number}</div>
                                                <div className="text-[11px] text-slate-600">{task.email}</div>
                                            </td>

                                            {/* Destination */}
                                            <td className="px-5 py-4">
                                                {task.destination_country ? (
                                                    <div className="flex items-center gap-2">
                                                        {task.destination_country_code && (
                                                            <img
                                                                src={`https://flagcdn.com/w20/${task.destination_country_code.toLowerCase()}.png`}
                                                                alt="" className="w-5 rounded-sm"
                                                                onError={e => e.target.style.display = 'none'}
                                                            />
                                                        )}
                                                        <span>{task.destination_country}</span>
                                                    </div>
                                                ) : <span className="text-slate-600">—</span>}
                                            </td>

                                            {/* Service */}
                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[11px] font-bold border border-blue-500/20 whitespace-nowrap">
                                                    {task.service_type}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-5 py-4">
                                                {task.selected_price ? (
                                                    <>
                                                        <div className="font-black text-green-400">${fmt(task.selected_price)}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase">{task.price_type === 'b2b_price' ? 'B2B' : 'B2C'}</div>
                                                    </>
                                                ) : <span className="text-slate-600">—</span>}
                                            </td>

                                            {/* Partner */}
                                            <td className="px-5 py-4">
                                                <div className="font-semibold">{task.company_name}</div>
                                                <div className="text-[10px] text-slate-500">{task.partner_country}</div>
                                            </td>

                                            {/* Status — inline dropdown */}
                                            <td className="px-5 py-4">
                                                <select
                                                    value={task.status}
                                                    onChange={e => handleStatusChange(task.id, e.target.value)}
                                                    className={`text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-1 border outline-none cursor-pointer bg-transparent ${STATUS_STYLE[task.status]}`}>
                                                    {['pending','processing','confirmed','completed','rejected'].map(s => (
                                                        <option key={s} value={s} className="bg-slate-800 text-white normal-case">{s}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(task)}
                                                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Edit">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(task.id)}
                                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ MODAL ═══════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1,    opacity: 1 }}
                            exit={{    scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl overflow-y-auto max-h-[94vh]">

                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 px-7 py-5 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur-md">
                                <h2 className="text-lg font-black uppercase tracking-tight">
                                    {editingId ? '✏️ Edit' : '➕ New'} <span className="text-blue-500">Assignment</span>
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-7 space-y-7">

                                {/* ── Section 1: Client Info ── */}
                                <section>
                                    <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-4">
                                        <User size={13} /> Client Information
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Full Name"                  fieldKey="user_name"               icon={User}   value={formData.user_name}               onChange={setField} />
                                        <Field label="Email"                      fieldKey="email"                   icon={Mail}   value={formData.email}                   onChange={setField} type="email" />
                                        <Field label="Contact Number"             fieldKey="contact_number"          icon={User}   value={formData.contact_number}          onChange={setField} />
                                        <Field label="Nationality"                fieldKey="nationality"             icon={Globe}  value={formData.nationality}             onChange={setField} required={false} />
                                        <Field label="Passport Number"            fieldKey="passport_number"         icon={Globe}  value={formData.passport_number}         onChange={setField} />
                                        <Field label="Passport Validity (months)" fieldKey="passport_validity_month" icon={Globe}  value={formData.passport_validity_month} onChange={setField} type="number" required={false} />
                                        <Field label="NID / ID Number"            fieldKey="id_number"               icon={User}   value={formData.id_number}               onChange={setField} required={false} />
                                        <Field label="Address"                    fieldKey="address"                 icon={MapPin} value={formData.address}                 onChange={setField} required={false} />
                                    </div>
                                </section>

                                {/* ── Section 2: Service & Country ── */}
                                <section>
                                    <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-4">
                                        <Globe size={13} /> Service & Destination
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SelectField
                                            label="Service Type"
                                            value={formData.service_type}
                                            onChange={e => setField('service_type', e.target.value)}>
                                            <option value="">Select Service Type</option>
                                            <option>Visa Referral</option>
                                            <option>Travel Packages</option>
                                            <option>Citizenship Programs</option>
                                            <option>Multiple Services</option>
                                        </SelectField>

                                        <SelectField
                                            label={`Destination Country${countryLoading ? ' (loading…)' : ''}`}
                                            value={formData.destination_country}
                                            onChange={handleCountrySelect}
                                            disabled={!formData.service_type || countryLoading}>
                                            <option value="">
                                                {!formData.service_type ? 'Select service first'
                                                    : countryLoading ? 'Loading…'
                                                    : serviceCountries.length === 0 ? 'No countries available'
                                                    : 'Choose Destination'}
                                            </option>
                                            {serviceCountries.map((c, i) => (
                                                <option key={i} value={c.country}>
                                                    {c.country}{c.service_source ? ` (${c.service_source})` : ''} — B2B: ${fmt(c.b2b_price)} | B2C: ${fmt(c.b2c_price)}
                                                </option>
                                            ))}
                                        </SelectField>
                                    </div>

                                    {/* Country info card */}
                                    <AnimatePresence>
                                        {selectedCountryData && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-4 bg-slate-800/60 border border-blue-500/20 rounded-2xl p-4 space-y-3">

                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {selectedCountryData.country_code && (
                                                        <img src={`https://flagcdn.com/w40/${selectedCountryData.country_code.toLowerCase()}.png`}
                                                            alt="" className="w-8 h-5 object-cover rounded"
                                                            onError={e => e.target.style.display = 'none'} />
                                                    )}
                                                    <span className="font-black">{selectedCountryData.country}</span>
                                                    {selectedCountryData.processing_time && (
                                                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">⏱ {selectedCountryData.processing_time}</span>
                                                    )}
                                                    {selectedCountryData.visa_type && (
                                                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">{selectedCountryData.visa_type}</span>
                                                    )}
                                                </div>

                                                {/* Price toggle */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price Type:</span>
                                                    <div className="flex bg-slate-900/60 rounded-lg p-0.5 gap-0.5">
                                                        {['b2b_price', 'b2c_price'].map(pt => (
                                                            <button key={pt} type="button" onClick={() => handlePriceType(pt)}
                                                                className={`px-4 py-1.5 rounded-md text-xs font-black uppercase transition-all ${formData.price_type === pt ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                                                {pt === 'b2b_price' ? 'B2B' : 'B2C'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Price cards */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[{ label: 'B2B', key: 'b2b_price', color: 'text-blue-400' }, { label: 'B2C', key: 'b2c_price', color: 'text-green-400' }].map(p => (
                                                        <div key={p.key} onClick={() => handlePriceType(p.key)}
                                                            className={`p-3 rounded-xl border cursor-pointer transition-all ${formData.price_type === p.key ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                                                            <div className="text-[10px] text-slate-500 uppercase">{p.label} Price</div>
                                                            <div className={`text-lg font-black mt-1 ${p.color}`}>${fmt(selectedCountryData[p.key])}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                                        <DollarSign size={12} /> Selected ({formData.price_type === 'b2b_price' ? 'B2B' : 'B2C'})
                                                    </span>
                                                    <span className="text-base font-black text-green-400">${fmt(formData.selected_price)}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>

                                {/* ── Section 3: Partner ── */}
                                <section>
                                    <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-4">
                                        <Briefcase size={13} /> Assign to Partner
                                    </div>
                                    <SelectField
                                        label="B2B Company"
                                        value={formData.partner_id}
                                        onChange={e => setField('partner_id', e.target.value)}
                                        disabled={!formData.service_type}>
                                        <option value="">{!formData.service_type ? 'Select service type first' : 'Choose Partner Company'}</option>
                                        {filteredPartners.map(p => (
                                            <option key={p.id} value={p.id}>{p.company_name} ({p.country})</option>
                                        ))}
                                    </SelectField>
                                    {formData.service_type && filteredPartners.length === 0 && (
                                        <p className="text-xs text-amber-400 mt-2 ml-1">⚠ No approved partners for "{formData.service_type}"</p>
                                    )}
                                </section>

                                {/* ── Submit ── */}
                                <button type="submit" disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-3.5 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 text-sm">
                                    {loading
                                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                                        : <><CheckCircle size={18} /> {editingId ? 'Update Task' : 'Assign Task Now'}</>
                                    }
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssignTask;