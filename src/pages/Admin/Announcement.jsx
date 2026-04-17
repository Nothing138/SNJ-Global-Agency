import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Megaphone, Save, Power, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [content, setContent] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("https://snj-global-agency-backend.onrender.com/api/announcements/all");
            setAnnouncements(res.data.announcements);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleCreate = async () => {
        if (!content.trim()) return;
        try {
            await axios.post("https://snj-global-agency-backend.onrender.com/api/announcements/save", {
                content,
                is_active: isActive ? 1 : 0
            });
            setContent("");
            Swal.fire({ 
                title: 'Deployed!', 
                icon: 'success', 
                toast: true, 
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 2000,
                background: '#fff',
                color: '#0B1F3A'
            });
            fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await axios.put(`https://snj-global-agency-backend.onrender.com/api/announcements/toggle/${id}`, { is_active: newStatus });
            fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This announcement will be removed permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, Delete',
            background: '#fff',
            color: '#0B1F3A'
        });

        if (result.isConfirmed) {
            await axios.delete(`https://snj-global-agency-backend.onrender.com/api/announcements/${id}`);
            fetchAnnouncements();
            Swal.fire('Deleted!', 'Announcement removed.', 'success');
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white text-[#0B1F3A] font-['Times_New_Roman',_serif] text-xl font-bold italic animate-pulse">
            Loading System Broadcasts...
        </div>
    );

    return (
        <div className="p-6 md:p-10 min-h-screen bg-white font-['Times_New_Roman',_serif]">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* --- TOP: Create Section --- */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-[#F8FAFC] rounded-2xl text-[#EAB308]">
                            <Megaphone size={36} />
                        </div>
                        <div>
                            {/* Heading (H1) Style */}
                            <h1 className="text-[40px] lg:text-[48px] font-bold text-[#0B1F3A] leading-tight uppercase tracking-tight">
                                Live <span className="text-[#EAB308] italic font-light lowercase">Broadcasts.</span>
                            </h1>
                            <p className="text-[#64748B] text-[18px]">Manage scrolling <span className="italic text-[#EAB308] font-medium">Alerts & News</span> for the platform.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                        <div className="lg:col-span-2">
                            <label className="text-[14px] font-bold text-[#0F172A] uppercase tracking-widest ml-2 mb-3 block">Message Content</label>
                            <input 
                                className="w-full p-4 bg-[#F8FAFC] border-b-2 border-slate-200 text-[#0F172A] text-[18px] outline-none focus:border-[#EAB308] transition-all"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type your announcement here..."
                            />
                        </div>
                        <div className="flex gap-4 lg:col-span-2">
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`flex-1 p-4 rounded-xl font-bold uppercase text-[12px] tracking-widest flex items-center justify-center gap-2 border transition-all ${isActive ? 'bg-[#0B1F3A]/5 border-[#0B1F3A] text-[#0B1F3A]' : 'bg-slate-50 border-slate-200 text-[#64748B]'}`}
                            >
                                <Power size={18} /> {isActive ? 'Status: Active' : 'Status: Draft'}
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="flex-[1.5] py-4 bg-[#EAB308] hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] rounded-xl font-bold uppercase tracking-[0.2em] text-[12px] transition-all shadow-md flex items-center justify-center gap-3"
                            >
                                <Save size={20} /> Deploy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM: History List --- */}
                <div className="space-y-6">
                    {/* Subheading (H2) Style */}
                    <h3 className="text-[28px] font-bold text-[#0F172A] flex items-center gap-3 ml-2">
                        <Clock className="text-[#EAB308]" size={24} /> 
                        Broadcast <span className="italic font-medium text-[#EAB308]">History</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-5">
                        {announcements.map((ann) => (
                            <div key={ann.id} className={`group bg-white border border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-lg ${ann.is_active === 0 ? 'bg-slate-50/50 grayscale' : ''}`}>
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`p-3 rounded-full ${ann.is_active ? 'bg-[#EAB308]/10 text-[#EAB308]' : 'bg-slate-200 text-slate-400'}`}>
                                        {ann.is_active ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <p className="text-[#0B1F3A] font-bold italic text-lg leading-tight tracking-tight">
                                        "{ann.content}"
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => toggleStatus(ann.id, ann.is_active)}
                                        className={`px-6 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest border transition-all ${ann.is_active ? 'border-slate-200 text-[#64748B] hover:bg-[#0B1F3A] hover:text-white' : 'border-[#EAB308] text-[#EAB308] hover:bg-[#EAB308] hover:text-[#0B1F3A]'}`}
                                    >
                                        {ann.is_active ? 'Set as Draft' : 'Enable Live'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-3 text-[#64748B] hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnnouncementManager;