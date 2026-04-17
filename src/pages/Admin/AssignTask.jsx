import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Trash2, X, CheckCircle,
    Briefcase, User, Mail, Globe, DollarSign, MapPin
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE = import.meta.env.VITE_API_URL || 'https://snj-global-agency-backend.onrender.com';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

const StatusBadge = ({ status }) => {
    const map = {
        pending:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        processing: 'bg-blue-500/20   text-blue-400   border-blue-500/30',
        confirmed:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
        completed:  'bg-green-500/20  text-green-400  border-green-500/30',
        rejected:   'bg-red-500/20    text-red-400    border-red-500/30',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${map[status] || 'bg-slate-700 text-slate-400'}`}>
            {status}
        </span>
    );
};

// ✅ Field MUST be outside AssignTask — ভেতরে রাখলে প্রতি render-এ
// নতুন component তৈরি হয় এবং input focus হারায়
const Field = ({ label, fieldKey, icon: Icon, type = 'text', required = true, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
                type={type}
                required={required}
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                value={value}
                onChange={e => onChange(fieldKey, e.target.value)}
            />
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AssignTask = () => {
    const [tasks, setTasks]                       = useState([]);
    const [partners, setPartners]                 = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [serviceCountries, setServiceCountries] = useState([]);
    const [isModalOpen, setIsModalOpen]           = useState(false);
    const [loading, setLoading]                   = useState(false);
    const [tableLoading, setTableLoading]         = useState(true);
    const [countryLoading, setCountryLoading]     = useState(false);
    const [selectedCountryData, setSelectedCountryData] = useState(null);

    const [searchTerm, setSearchTerm]       = useState('');
    const [serviceFilter, setServiceFilter] = useState('');

    const emptyForm = {
        user_name: '', address: '', passport_number: '', contact_number: '',
        id_number: '', nationality: '', passport_validity_month: '',
        email: '', service_type: '', partner_id: '',
        destination_country: '', destination_country_code: '',
        selected_price: '', price_type: 'b2b_price'
    };
    const [formData, setFormData] = useState(emptyForm);

    // ✅ Stable single-field updater — prevents full re-render
    const handleFieldChange = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        fetchTasks();
        fetchPartners();
    }, []);

    useEffect(() => {
        if (formData.service_type) {
            const fp = partners.filter(
                p => p.purpose === formData.service_type || p.purpose === 'Multiple Services'
            );
            setFilteredPartners(fp);
            loadServiceCountries(formData.service_type);
        } else {
            setFilteredPartners([]);
            setServiceCountries([]);
        }
        setFormData(prev => ({ ...prev, destination_country: '', destination_country_code: '', selected_price: '' }));
        setSelectedCountryData(null);
    }, [formData.service_type, partners]);

    const fetchTasks = async () => {
        setTableLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/admin/assigned-tasks`);
            setTasks(res.data || []);
        } catch (err) { console.error(err); }
        setTableLoading(false);
    };

    const fetchPartners = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/active-partners`);
            setPartners(res.data || []);
        } catch (err) { console.error(err); }
    };

    const loadServiceCountries = async (serviceType) => {
        setCountryLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/admin/service-countries`, {
                params: { service_type: serviceType }
            });
            setServiceCountries(res.data.data || []);
        } catch (err) {
            console.error(err);
            setServiceCountries([]);
        }
        setCountryLoading(false);
    };

    const handleCountrySelect = (e) => {
        const countryName = e.target.value;
        const found = serviceCountries.find(c => c.country === countryName);
        if (found) {
            setSelectedCountryData(found);
            const price = formData.price_type === 'b2b_price' ? found.b2b_price : found.b2c_price;
            setFormData(prev => ({
                ...prev,
                destination_country: found.country,
                destination_country_code: found.country_code || '',
                selected_price: price
            }));
        } else {
            setSelectedCountryData(null);
            setFormData(prev => ({ ...prev, destination_country: '', destination_country_code: '', selected_price: '' }));
        }
    };

    const handlePriceTypeChange = (priceType) => {
        const price = selectedCountryData
            ? (priceType === 'b2b_price' ? selectedCountryData.b2b_price : selectedCountryData.b2c_price)
            : '';
        setFormData(prev => ({ ...prev, price_type: priceType, selected_price: price }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/api/admin/assign-task`, formData);
            Swal.fire({ icon: 'success', title: 'Task Assigned!', text: 'Assigned to partner successfully.', background: '#1e293b', color: '#fff', confirmButtonColor: '#3b82f6' });
            setIsModalOpen(false);
            setFormData(emptyForm);
            setSelectedCountryData(null);
            setServiceCountries([]);
            fetchTasks();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to assign task', 'error');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?', text: "This cannot be undone!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#475569',
            background: '#1e293b', color: '#fff'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_BASE}/api/admin/assigned-tasks/${id}`);
                fetchTasks();
                Swal.fire({ icon: 'success', title: 'Deleted!', background: '#1e293b', color: '#fff' });
            } catch { Swal.fire('Error', 'Delete failed', 'error'); }
        }
    };

    const displayTasks = tasks.filter(t =>
        ((t.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
         (t.passport_number || '').includes(searchTerm)) &&
        (serviceFilter === '' || t.service_type === serviceFilter)
    );

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 text-white font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Briefcase className="text-blue-500" size={30} />
                            Assign <span className="text-blue-500">Tasks</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage and distribute tasks to B2B Partners</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                        <Plus size={20} /> Add New Task
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-4 rounded-3xl mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input type="text" placeholder="Search by name or passport..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 outline-none text-sm min-w-[200px]"
                        value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                        <option value="">All Services</option>
                        <option value="Visa Referral">Visa Referral</option>
                        <option value="Travel Packages">Travel Packages</option>
                        <option value="Citizenship Programs">Citizenship Programs</option>
                        <option value="Multiple Services">Multiple Services</option>
                    </select>
                    <span className="text-xs text-slate-500 font-bold">{displayTasks.length} tasks</span>
                </div>

                {/* Table */}
                <div className="bg-slate-800/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    {tableLoading ? (
                        <div className="flex items-center justify-center py-16 text-slate-500 text-sm">Loading tasks...</div>
                    ) : displayTasks.length === 0 ? (
                        <div className="flex items-center justify-center py-16 text-slate-500 text-sm">No tasks found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Client Details</th>
                                        <th className="px-6 py-4">Destination</th>
                                        <th className="px-6 py-4">Service</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Partner</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {displayTasks.map((task, i) => (
                                        <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-xs text-slate-500 font-bold">{i + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm">{task.user_name}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">{task.passport_number} · {task.email}</div>
                                                {task.nationality && <div className="text-[10px] text-blue-400 mt-0.5">🌍 {task.nationality}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.destination_country ? (
                                                    <div className="flex items-center gap-2">
                                                        {task.destination_country_code && (
                                                            <img src={`https://flagcdn.com/w20/${task.destination_country_code.toLowerCase()}.png`}
                                                                alt="" className="w-5 rounded-sm" onError={e => e.target.style.display = 'none'} />
                                                        )}
                                                        <span className="text-sm font-semibold">{task.destination_country}</span>
                                                    </div>
                                                ) : <span className="text-slate-600 text-xs">—</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                                                    {task.service_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.selected_price ? (
                                                    <div>
                                                        <div className="text-sm font-black text-green-400">${fmt(task.selected_price)}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase">{task.price_type === 'b2b_price' ? 'B2B' : 'B2C'}</div>
                                                    </div>
                                                ) : <span className="text-slate-600 text-xs">—</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold">{task.company_name}</div>
                                                <div className="text-[10px] text-slate-500">ID: {task.partner_id}</div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDelete(task.id)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[92vh]">

                            <div className="sticky top-0 z-10 p-7 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur-sm">
                                <h2 className="text-xl font-black uppercase tracking-tighter">Create New <span className="text-blue-500">Assignment</span></h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">

                                {/* Section 1: Client Info */}
                                <div>
                                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <User size={14} /> Client Information
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field label="Client Name"                fieldKey="user_name"               icon={User}   value={formData.user_name}               onChange={handleFieldChange} />
                                        <Field label="Email Address"              fieldKey="email"                   icon={Mail}   value={formData.email}                   onChange={handleFieldChange} type="email" />
                                        <Field label="Contact Number"             fieldKey="contact_number"          icon={User}   value={formData.contact_number}          onChange={handleFieldChange} />
                                        <Field label="Nationality"                fieldKey="nationality"             icon={Globe}  value={formData.nationality}             onChange={handleFieldChange} required={false} />
                                        <Field label="Passport Number"            fieldKey="passport_number"         icon={Globe}  value={formData.passport_number}         onChange={handleFieldChange} />
                                        <Field label="Passport Validity (Months)" fieldKey="passport_validity_month" icon={Globe}  value={formData.passport_validity_month} onChange={handleFieldChange} type="number" required={false} />
                                        <Field label="ID / NID Number"            fieldKey="id_number"               icon={User}   value={formData.id_number}               onChange={handleFieldChange} required={false} />
                                        <Field label="Address"                    fieldKey="address"                 icon={MapPin} value={formData.address}                 onChange={handleFieldChange} required={false} />
                                    </div>
                                </div>

                                {/* Section 2: Service & Country */}
                                <div>
                                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Globe size={14} /> Service & Destination
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Type</label>
                                            <select required
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-blue-500 transition-all text-sm"
                                                value={formData.service_type}
                                                onChange={e => setFormData(prev => ({ ...prev, service_type: e.target.value }))}>
                                                <option value="">Select Service Type</option>
                                                <option value="Visa Referral">Visa Referral</option>
                                                <option value="Travel Packages">Travel Packages</option>
                                                <option value="Citizenship Programs">Citizenship Programs</option>
                                                <option value="Multiple Services">Multiple Services</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                Destination Country
                                                {countryLoading && <span className="ml-2 text-blue-400 font-normal text-[10px]">Loading...</span>}
                                            </label>
                                            <select required disabled={!formData.service_type || countryLoading}
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-blue-500 transition-all text-sm disabled:opacity-40"
                                                value={formData.destination_country} onChange={handleCountrySelect}>
                                                <option value="">
                                                    {!formData.service_type ? 'Select service first' :
                                                     countryLoading ? 'Loading...' :
                                                     serviceCountries.length === 0 ? 'No countries available' : 'Choose Destination'}
                                                </option>
                                                {serviceCountries.map((c, idx) => (
                                                    <option key={idx} value={c.country}>
                                                        {c.country}{c.service_source ? ` (${c.service_source})` : ''} — B2B: ${fmt(c.b2b_price)} | B2C: ${fmt(c.b2c_price)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {selectedCountryData && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 bg-slate-800/60 border border-blue-500/20 rounded-2xl p-5">
                                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                {selectedCountryData.country_code && (
                                                    <img src={`https://flagcdn.com/w40/${selectedCountryData.country_code.toLowerCase()}.png`}
                                                        alt="" className="w-8 h-5 object-cover rounded" onError={e => e.target.style.display = 'none'} />
                                                )}
                                                <span className="font-black text-white">{selectedCountryData.country}</span>
                                                {selectedCountryData.processing_time && (
                                                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">⏱ {selectedCountryData.processing_time}</span>
                                                )}
                                                {selectedCountryData.visa_type && (
                                                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">{selectedCountryData.visa_type}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price Type:</span>
                                                <div className="flex bg-slate-900/60 rounded-xl p-1 gap-1">
                                                    {['b2b_price', 'b2c_price'].map(pt => (
                                                        <button key={pt} type="button" onClick={() => handlePriceTypeChange(pt)}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${formData.price_type === pt ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                                                            {pt === 'b2b_price' ? 'B2B' : 'B2C'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[{ label: 'B2B Price', key: 'b2b_price', color: 'text-blue-400' }, { label: 'B2C Price', key: 'b2c_price', color: 'text-green-400' }].map(p => (
                                                    <div key={p.key} onClick={() => handlePriceTypeChange(p.key)} className={`p-3 rounded-xl border transition-all cursor-pointer ${formData.price_type === p.key ? 'border-blue-500/40 bg-blue-500/10' : 'border-white/5 bg-white/5'}`}>
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{p.label}</div>
                                                        <div className={`text-xl font-black mt-1 ${p.color}`}>${fmt(selectedCountryData[p.key])}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                                                <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
                                                    <DollarSign size={12} /> Selected ({formData.price_type === 'b2b_price' ? 'B2B' : 'B2C'})
                                                </span>
                                                <span className="text-lg font-black text-green-400">${fmt(formData.selected_price)}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Section 3: Partner */}
                                <div>
                                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Briefcase size={14} /> Assign to Partner
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">B2B Company</label>
                                        <select required disabled={!formData.service_type}
                                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:border-blue-500 transition-all text-sm disabled:opacity-40"
                                            value={formData.partner_id}
                                            onChange={e => setFormData(prev => ({ ...prev, partner_id: e.target.value }))}>
                                            <option value="">{!formData.service_type ? 'Select service type first' : 'Choose Partner Company'}</option>
                                            {filteredPartners.map(p => (
                                                <option key={p.id} value={p.id}>{p.company_name} ({p.country})</option>
                                            ))}
                                        </select>
                                        {formData.service_type && filteredPartners.length === 0 && (
                                            <p className="text-xs text-amber-400 ml-1">⚠ No approved partners found for "{formData.service_type}"</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                                    {loading ? <span className="animate-pulse">Processing...</span> : <><CheckCircle size={20} /> Assign Task Now</>}
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