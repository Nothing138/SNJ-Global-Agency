import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Send, Image as ImageIcon, Type, AlignLeft, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

const UploadBlog = () => {
    const [formData, setFormData] = useState({ 
        title: '', 
        content: '', 
        featured_image: '',
        author_id: 1 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/blogs', formData, {
                headers: { 
                    'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2024' 
                }
            });

            if(res.data.success) {
                Swal.fire({
                    title: '<span style="font-family: serif; font-weight: bold; color: #0B1F3A;">Story Deployed!</span>',
                    text: 'Your article has been broadcasted to the world.',
                    icon: 'success',
                    confirmButtonColor: '#0B1F3A',
                    confirmButtonText: 'AWESOME',
                });
                setFormData({ title: '', content: '', featured_image: '', author_id: 1 });
            }
        } catch (err) {
            console.error("Upload Error:", err.response?.data || err.message);
            Swal.fire('Error', err.response?.data?.message || 'Failed to publish blog', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 font-['Times_New_Roman',_serif] bg-white">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-5 py-1 bg-slate-50 text-[#EAB308] border border-slate-100 rounded-sm text-[11px] font-bold uppercase tracking-[4px] mb-2 italic">
                    <Sparkles size={14}/> Professional Editor
                </div>
                <h1 className="text-[48px] font-bold text-[#0B1F3A] leading-tight tracking-tight">
                    Publish Your <span className="italic text-[#EAB308]">Manuscript</span>
                </h1>
                <p className="text-[#64748B] text-[18px] leading-[1.6]">Craft stories that move the industry with authority</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-8 md:p-12 rounded-sm shadow-sm border border-slate-100 space-y-10 relative border-t-[6px] border-[#0B1F3A]">
                    
                    {/* Title Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[12px] font-bold uppercase text-[#0F172A] flex items-center gap-2 tracking-widest">
                            <Type size={16} className="text-[#EAB308]"/> Document Headline
                        </label>
                        <input 
                            placeholder="Enter a formal title..." 
                            className="w-full p-5 bg-slate-50 border-b-2 border-transparent rounded-sm font-bold text-[24px] text-[#0B1F3A] outline-none focus:border-[#EAB308] focus:bg-white transition-all duration-300 placeholder:text-gray-200"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    {/* Image URL Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[12px] font-bold uppercase text-[#0F172A] flex items-center gap-2 tracking-widest">
                            <ImageIcon size={16} className="text-[#EAB308]"/> Featured Media Link
                        </label>
                        <input 
                            placeholder="Image URL (CDN preferred)" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-sm font-medium text-[16px] text-[#64748B] outline-none focus:border-[#0B1F3A] transition-all"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        />
                    </div>

                    {/* Content Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[12px] font-bold uppercase text-[#0F172A] flex items-center gap-2 tracking-widest">
                            <AlignLeft size={16} className="text-[#EAB308]"/> Body Narrative
                        </label>
                        <textarea 
                            placeholder="Begin your professional article here..." 
                            rows="10"
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-sm text-[17px] text-[#64748B] outline-none focus:border-[#0B1F3A] focus:bg-white transition-all leading-[1.6]"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-[#EAB308] text-[#0B1F3A] p-6 rounded-sm font-bold uppercase tracking-[5px] text-[13px] transition-all duration-300 hover:bg-[#0B1F3A] hover:text-white shadow-lg active:scale-95">
                        <span className="flex items-center justify-center gap-4">
                            <Send size={18}/> Deploy Article
                        </span>
                    </button>
                </form>

                {/* Live Preview Section */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-10">
                    <h3 className="text-[12px] font-bold uppercase text-[#64748B] tracking-[4px] flex items-center gap-2 italic">
                        <Eye size={16}/> Proofreading View
                    </h3>
                    
                    <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-slate-100">
                        <div className="h-64 bg-slate-100 relative overflow-hidden">
                            {formData.featured_image ? (
                                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100"/>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                    <ImageIcon size={48} className="mb-2 opacity-20"/>
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Media Placeholder</span>
                                </div>
                            )}
                            <div className="absolute top-0 right-0 bg-[#0B1F3A] text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">
                                Preview
                            </div>
                        </div>
                        
                        <div className="p-10 space-y-6">
                            <h2 className="text-[#0B1F3A] text-[32px] font-bold leading-tight min-h-[60px]">
                                {formData.title || "Untitled Document"}
                            </h2>
                            <div className="w-20 h-[3px] bg-[#EAB308]"></div>
                            <p className="text-[#64748B] text-[16px] leading-[1.6] line-clamp-[12]">
                                {formData.content || "Content preview will appear here once you begin writing. Ensure the narrative maintains a professional tone."}
                            </p>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className={formData.content.length > 100 ? "text-[#EAB308]" : "text-slate-200"}/>
                                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Draft Verification</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#0B1F3A] italic">Premium Quality</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadBlog;