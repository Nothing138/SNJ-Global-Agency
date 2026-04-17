import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plane, MapPin, Clock, Trash2, Plus, Star, Zap, Image as ImageIcon, CheckCircle, ListChecks, X } from 'lucide-react';

const TourManager = () => {
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', destination: '', price: '', duration: '', 
        description: '', itinerary: '', inclusions: '', exclusions: '' 
    });

    const BASE_URL = "https://snj-global-agency-backend.onrender.com";

    const fetchPackages = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tours/packages`);
            setPackages(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            await axios.post(`${BASE_URL}/api/tours/add-package`, data);
            Swal.fire({ title: 'Success', text: 'New Premium Tour Live!', icon: 'success', confirmButtonColor: '#0B1F3A' });
            setShowForm(false);
            fetchPackages();
            setFormData({ title: '', destination: '', price: '', duration: '', description: '', itinerary: '', inclusions: '', exclusions: '' });
            setImageFile(null);
            setImagePreview(null);
        } catch (err) { 
            Swal.fire('Error', 'Failed to add package. Check database connection!', 'error'); 
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Package?',
            text: "This will remove the package permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, Delete'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${BASE_URL}/api/tours/package/${id}`);
                fetchPackages();
                Swal.fire('Deleted!', 'Package has been removed.', 'success');
            } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
        }
    };

    const handleToggleTop = async (id) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/tours/package/toggle-top/${id}`);
            Swal.fire({ 
                title: 'Status Updated', 
                text: res.data.message, 
                icon: 'success', 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 2000 
            });
            fetchPackages(); 
        } catch (err) { Swal.fire('Error', 'Update Failed', 'error'); }
    };

    // Shared Input Style
    const inputClasses = "p-4 bg-slate-50 rounded-sm border-none focus:ring-2 focus:ring-[#EAB308] outline-none font-semibold text-[#0F172A] placeholder-gray-300";

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-12 pb-20 font-['Times_New_Roman',_serif] bg-white">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-sm shadow-sm border border-slate-100 gap-6 border-t-[6px] border-[#0B1F3A]">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-[#EAB308] fill-[#EAB308]" />
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Executive Control Terminal</span>
                    </div>
                    <h1 className="text-[44px] font-bold text-[#0B1F3A] uppercase leading-none tracking-tight">
                        Tour <span className="italic text-[#EAB308]">Inventory</span>
                    </h1>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`flex items-center gap-3 px-10 py-5 rounded-sm font-bold uppercase text-[12px] tracking-[2px] transition-all shadow-xl active:scale-95 ${showForm ? "bg-[#64748B] text-white" : "bg-[#EAB308] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"}`}
                >
                    {showForm ? <X size={18}/> : <Plus size={18}/>}
                    {showForm ? "Cancel Entry" : "Create Premium Package"}
                </button>
            </div>

            {/* --- FORM SECTION --- */}
            {showForm && (
                <div className="bg-white p-10 rounded-sm shadow-2xl border border-slate-100 animate-in slide-in-from-top-10 duration-500">
                    <h2 className="text-[28px] font-bold text-[#0F172A] mb-8 border-b pb-4">New Package Specifications</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Upload Box */}
                        <div className="md:col-span-2 relative group cursor-pointer">
                            <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                            <div className={`h-56 rounded-sm border-2 border-dashed flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-[#EAB308] bg-slate-50' : 'border-slate-200 bg-slate-50 group-hover:border-[#EAB308]'}`}>
                                {imagePreview ? (
                                    <img src={imagePreview} className="h-full w-full object-cover opacity-90" alt="Preview" />
                                ) : (
                                    <>
                                        <ImageIcon size={48} className="text-slate-300 mb-3" />
                                        <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Upload Promotional Visual</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <input type="text" placeholder="Official Tour Title" className={inputClasses} value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required />
                        <input type="text" placeholder="Target Destination" className={inputClasses} value={formData.destination} onChange={(e)=>setFormData({...formData, destination: e.target.value})} required />
                        <input type="number" placeholder="Net Price ($)" className={inputClasses} value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
                        <input type="text" placeholder="Duration (e.g. 7 Days / 6 Nights)" className={inputClasses} value={formData.duration} onChange={(e)=>setFormData({...formData, duration: e.target.value})} required />
                        
                        <textarea placeholder="Executive Summary..." className={`${inputClasses} md:col-span-2 h-28 resize-none`} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})}></textarea>
                        
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Proposed Itinerary</label>
                            <textarea placeholder="Day 1, Day 2..." className={`${inputClasses} w-full h-28`} value={formData.itinerary} onChange={(e)=>setFormData({...formData, itinerary: e.target.value})}></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Service Inclusions</label>
                            <textarea placeholder="Premium Hotels, Meals..." className={`${inputClasses} w-full h-28`} value={formData.inclusions} onChange={(e)=>setFormData({...formData, inclusions: e.target.value})}></textarea>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Service Exclusions</label>
                            <textarea placeholder="Visa Fees, Personal Items..." className={`${inputClasses} w-full h-24`} value={formData.exclusions} onChange={(e)=>setFormData({...formData, exclusions: e.target.value})}></textarea>
                        </div>

                        <button className="md:col-span-2 bg-[#0B1F3A] text-white p-5 rounded-sm font-bold uppercase tracking-[4px] hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-all shadow-xl shadow-slate-200">
                            Confirm and Launch Package
                        </button>
                    </form>
                </div>
            )}

            {/* --- LIST SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-sm shadow-sm overflow-hidden border border-slate-100 group relative hover:shadow-2xl transition-all duration-500">
                        {/* Status Toggle */}
                        <button onClick={() => handleToggleTop(pkg.id)} className={`absolute top-4 right-4 z-20 p-3 rounded-sm transition-all shadow-md ${pkg.is_top === 1 ? 'bg-[#EAB308] text-white scale-110' : 'bg-white/90 text-slate-300 hover:text-[#EAB308]'}`}>
                            <Star size={20} fill={pkg.is_top === 1 ? "white" : "none"} />
                        </button>

                        <div className="h-60 bg-slate-50 relative overflow-hidden">
                            <img 
                                src={pkg.image_url ? `${BASE_URL}${pkg.image_url}` : "https://via.placeholder.com/400x300?text=No+Visual"} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" 
                                alt="" 
                            />
                            <div className="absolute bottom-5 left-5 bg-[#0B1F3A] text-white px-5 py-2 rounded-sm font-bold text-sm tracking-widest shadow-lg">
                                ${pkg.price}
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-[22px] font-bold text-[#0B1F3A] uppercase leading-tight mb-4 truncate italic">
                                {pkg.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-8">
                                <span className="flex items-center gap-2 bg-slate-50 text-[#64748B] px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wide border border-slate-100">
                                    <MapPin size={12} className="text-[#EAB308]"/> {pkg.destination}
                                </span>
                                <span className="flex items-center gap-2 bg-slate-50 text-[#64748B] px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wide border border-slate-100">
                                    <Clock size={12} className="text-[#EAB308]"/> {pkg.duration}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => handleDelete(pkg.id)} className="flex-1 flex items-center justify-center gap-2 bg-white text-[#64748B] border border-slate-200 py-3 rounded-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all font-bold uppercase text-[11px] tracking-widest">
                                    <Trash2 size={16}/> Terminate
                                </button>
                                <div className="p-3 bg-slate-50 text-slate-300 rounded-sm hover:text-[#EAB308] border border-slate-100 transition-all cursor-pointer">
                                    <CheckCircle size={22} />
                                </div>
                            </div>
                        </div>
                        {/* Fine gold line at bottom for luxury feel */}
                        <div className="h-1 bg-[#EAB308] w-0 group-hover:w-full transition-all duration-500"></div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {packages.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-sm border-2 border-dashed border-slate-200">
                    <Plane size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[#64748B] font-bold uppercase tracking-[5px] italic text-lg">No Active Packages Found</p>
                </div>
            )}
        </div>
    );
};

export default TourManager;