import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Globe, Plus, Trash2, Edit3, Power, Star, Upload, 
  Image as ImageIcon, Clock, FileText, Gift, ListOrdered, Briefcase 
} from 'lucide-react';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '', categoryId: '', charge: '', 
        duration: '2 Years', process_time: '3 Months',
        description: '', requirements: '', benefits: '', procedures: ''
    });

    const fetchData = async () => {
        try {
            const countryRes = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/visa-countries');
            const categoryRes = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/visa-categories');
            setCountries(countryRes.data);
            setCategories(categoryRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddCountry = async (e) => {
        e.preventDefault();
        if(!formData.categoryId) return Swal.fire('Error', 'Please select a category', 'error');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key === 'name' ? 'country_name' : key === 'categoryId' ? 'category_id' : key === 'charge' ? 'application_charge' : key, formData[key]));
        if (file) data.append('image', file);

        try {
            await axios.post('http://snj-global-agency-production.up.railway.app/api/admin/visa-countries', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({ 
                icon: 'success', 
                title: '<span style="font-family: Times New Roman, serif;">Visa Route Created!</span>', 
                timer: 1500, 
                showConfirmButton: false,
                background: '#0B1F3A',
                color: '#fff'
            });
            setFormData({ name: '', categoryId: '', charge: '', duration: '2 Years', process_time: '3 Months', description: '', requirements: '', benefits: '', procedures: '' });
            setFile(null);
            fetchData();
        } catch (err) { Swal.fire('Error', 'Failed to add country', 'error'); }
    };

    const handleToggleTop = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await axios.put(`http://snj-global-agency-production.up.railway.app/api/admin/visa-countries/toggle-top/${id}`, { is_top: newStatus });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const toggleStatus = async (country) => {
        const newStatus = country.status === 'active' ? 'inactive' : 'active';
        try {
            await axios.put(`http://snj-global-agency-production.up.railway.app/api/admin/visa-countries/status/${country.id}`, { status: newStatus });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        Swal.fire({ 
            title: '<span style="font-family: Times New Roman, serif;">Wipe Record?</span>', 
            text: "This action cannot be undone.", 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#0B1F3A', 
            cancelButtonColor: '#64748B',
            confirmButtonText: 'CONFIRM'
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axios.delete(`http://snj-global-agency-production.up.railway.app/api/admin/visa-countries/${id}`);
                fetchData();
            }
        });
    };

    return (
        <div className="space-y-16 p-8 bg-white min-h-screen font-['Times_New_Roman',_serif]">
            
            {/* 🏗️ PREMIUM ADD FORM */}
            <div className="bg-white p-12 border border-slate-100 shadow-[0_20px_50px_rgba(11,31,58,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Globe size={250} />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-slate-50 pb-8">
                    <div className="p-5 bg-[#0B1F3A] text-[#EAB308] shadow-xl"><Plus size={28}/></div>
                    <div>
                        <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight tracking-tight uppercase">
                            Create Premium <span className="italic font-medium text-[#EAB308]">Visa Route.</span>
                        </h1>
                        <p className="text-[18px] text-[#64748B] italic mt-1">Establishing professional pathways for global destinations.</p>
                    </div>
                </div>
                
                <form onSubmit={handleAddCountry} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        
                        {/* LEFT COLUMN: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-[28px] font-bold text-[#0F172A] border-l-4 border-[#EAB308] pl-4 mb-8">General Information</h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Country Name</label>
                                    <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="e.g. United Kingdom" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] focus:border-[#EAB308] outline-none transition-all" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Visa Category</label>
                                    <select value={formData.categoryId} onChange={(e)=>setFormData({...formData, categoryId:e.target.value})} className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] appearance-none focus:border-[#EAB308] outline-none" required>
                                        <option value="">Select Type</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Charge ($)</label>
                                    <input value={formData.charge} onChange={(e)=>setFormData({...formData, charge:e.target.value})} placeholder="2500" type="number" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px]" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Duration</label>
                                    <input value={formData.duration} onChange={(e)=>setFormData({...formData, duration:e.target.value})} placeholder="2 Years" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Process Time</label>
                                    <input value={formData.process_time} onChange={(e)=>setFormData({...formData, process_time:e.target.value})} placeholder="3 Months" className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Banner Image</label>
                                <label className="flex items-center justify-between p-4 bg-white text-[#0B1F3A] border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#EAB308] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Upload size={20} className="text-[#EAB308]"/>
                                        <span className="text-[14px] font-bold italic">{file ? file.name : 'Upload High-Resolution Asset'}</span>
                                    </div>
                                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A]">Executive Summary</label>
                                <textarea rows="3" value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} placeholder="Brief overview..." className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] leading-[1.6] resize-none" />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details & Lists */}
                        <div className="space-y-6">
                            <h3 className="text-[28px] font-bold text-[#0F172A] border-l-4 border-[#EAB308] pl-4 mb-8">Service Specifications</h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2"><FileText size={16} className="text-[#EAB308]"/> Essential Requirements</label>
                                    <textarea value={formData.requirements} onChange={(e)=>setFormData({...formData, requirements:e.target.value})} placeholder="Passport, Medical, Photo..." className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] resize-none h-24" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2"><Gift size={16} className="text-[#EAB308]"/> Exclusive Benefits</label>
                                    <textarea value={formData.benefits} onChange={(e)=>setFormData({...formData, benefits:e.target.value})} placeholder="Insurance, Accommodation..." className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] resize-none h-24" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2"><Clock size={16} className="text-[#EAB308]"/> Procedural Timeline</label>
                                    <textarea value={formData.procedures} onChange={(e)=>setFormData({...formData, procedures:e.target.value})} placeholder="Registration, Verification..." className="w-full p-4 bg-[#F8FAFC] border border-slate-200 text-[16px] resize-none h-24" />
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-[#0B1F3A] text-[#EAB308] p-6 hover:bg-[#0F172A] transition-all font-bold text-[16px] uppercase tracking-[3px] shadow-xl active:scale-95">
                                AUTHORIZE & PUBLISH ROUTE
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* 🌍 COUNTRIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {countries.map((country) => (
                    <div key={country.id} className="bg-white group border border-slate-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full relative overflow-hidden">
                        {/* Gold Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#0B1F3A] group-hover:bg-[#EAB308] transition-colors z-20"></div>

                        <div className="h-64 w-full relative overflow-hidden shrink-0">
                            {country.image_url ? (
                                <img src={`http://snj-global-agency-production.up.railway.app${country.image_url}`} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={country.country_name} />
                            ) : (
                                <div className="w-full h-full bg-[#0B1F3A] flex items-center justify-center text-white italic opacity-20 text-xl tracking-widest">NO ASSET</div>
                            )}
                            
                            <button onClick={() => handleToggleTop(country.id, country.is_top)} className={`absolute top-6 right-6 p-3 shadow-2xl transition-all ${country.is_top ? 'bg-[#EAB308] text-[#0B1F3A]' : 'bg-[#0B1F3A]/80 text-white hover:bg-[#EAB308] hover:text-[#0B1F3A]'}`}>
                                <Star size={18} fill={country.is_top ? "currentColor" : "none"} />
                            </button>
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0B1F3A] to-transparent">
                                <span className="px-3 py-1 bg-[#EAB308] text-[#0B1F3A] text-[10px] font-bold uppercase tracking-widest italic">{country.category_name}</span>
                                <h3 className="text-[32px] font-bold uppercase text-white leading-tight tracking-tight mt-2">{country.country_name}</h3>
                            </div>
                        </div>

                        <div className="p-8 flex-grow flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-[#F8FAFC] border border-slate-100">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Process</p>
                                    <p className="text-[14px] font-bold text-[#0B1F3A] italic">{country.process_time}</p>
                                </div>
                                <div className="p-4 bg-[#F8FAFC] border border-slate-100">
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Duration</p>
                                    <p className="text-[14px] font-bold text-[#0B1F3A] italic">{country.duration}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[2px]">Application Fee</span>
                                    <div className="text-[36px] font-bold text-[#0B1F3A] leading-none mt-1">
                                        <span className="text-[18px] text-[#EAB308] mr-1">$</span>{country.application_charge}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => toggleStatus(country)} className={`p-4 transition-all ${country.status === 'active' ? 'bg-[#F8FAFC] text-green-600 border border-green-100' : 'bg-red-50 text-red-400'}`}><Power size={20}/></button>
                                    <button onClick={() => handleDelete(country.id)} className="p-4 bg-[#F8FAFC] text-slate-300 hover:text-red-600 border border-slate-100 hover:border-red-100 transition-all"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryList;