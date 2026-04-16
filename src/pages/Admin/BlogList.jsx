import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, Edit3, Eye, Calendar, Search, Sparkles, Zap } from 'lucide-react';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/blogs');
            setBlogs(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleEdit = (blog) => {
        Swal.fire({
            title: `<span style="font-family: 'Times New Roman', serif; color: #0B1F3A; font-weight: bold; font-size: 28px;">Modify Article</span>`,
            html: `
                <div style="text-align: left; font-family: 'Times New Roman', serif; padding: 10px;">
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 14px; font-weight: bold; color: #0F172A; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Headlines</label>
                        <input id="swal-title" style="width: 100%; padding: 14px; border: 1px solid #e2e8f0; border-radius: 0px; font-size: 16px; color: #0B1F3A;" value="${blog.title}">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 14px; font-weight: bold; color: #0F172A; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Thumbnail URL</label>
                        <input id="swal-image" style="width: 100%; padding: 14px; border: 1px solid #e2e8f0; border-radius: 0px; font-size: 16px; color: #0B1F3A;" value="${blog.featured_image || ''}">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 14px; font-weight: bold; color: #0F172A; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Body Content</label>
                        <textarea id="swal-content" rows="6" style="width: 100%; padding: 14px; border: 1px solid #e2e8f0; border-radius: 0px; font-size: 16px; line-height: 1.6; color: #64748B;">${blog.content}</textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'UPDATE NOW',
            confirmButtonColor: '#0B1F3A',
            cancelButtonText: 'ABORT',
            customClass: { popup: 'rounded-none border-t-8 border-[#EAB308]' },
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    featured_image: document.getElementById('swal-image').value,
                    content: document.getElementById('swal-content').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/admin/blogs/${blog.id}`, result.value);
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        background: '#0B1F3A',
                        color: '#FFFFFF'
                    });
                    Toast.fire({ icon: 'success', title: 'Article synchronized!' });
                    fetchBlogs();
                } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
            }
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '<span style="font-family: Times New Roman, serif; font-weight: bold;">Wipe Record?</span>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'DELETE',
            customClass: { popup: 'rounded-none shadow-2xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/blogs/${id}`);
                fetchBlogs();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    };

    const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-white font-['Times_New_Roman',_serif] px-6 py-12 md:px-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16 space-y-8 flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight tracking-tight uppercase">
                        Content <span className="italic font-medium text-[#EAB308]">Vault</span>
                    </h1>
                    <p className="text-[18px] text-[#64748B] max-w-2xl leading-[1.6]">
                        Currently managing <span className="text-[#0B1F3A] font-bold italic">#{blogs.length} articles</span> within the administrative directory.
                    </p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-[#64748B]" size={18}/>
                    </div>
                    <input 
                        placeholder="FILTER BY HEADLINE..." 
                        className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none text-[13px] font-bold tracking-[2px] outline-none focus:ring-1 focus:ring-[#EAB308] text-[#0B1F3A] transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBlogs.map(blog => (
                    <div key={blog.id} className="group bg-white flex flex-col h-full border border-slate-50 hover:border-slate-200 transition-all duration-500">
                        {/* Image Container */}
                        <div className="h-64 bg-slate-100 relative overflow-hidden">
                            {blog.featured_image ? (
                                <img src={blog.featured_image} alt="" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"/>
                            ) : (
                                <div className="flex items-center justify-center h-full bg-[#0B1F3A] text-white opacity-10 font-bold italic text-2xl uppercase tracking-widest">No Media</div>
                            )}
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-[#0B1F3A] text-[#EAB308] p-2 shadow-xl">
                                    <Zap size={16} fill="currentColor"/>
                                </div>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-[14px] font-bold text-[#64748B] mb-4 uppercase letter-spacing-[1px]">
                                <Calendar size={14} className="text-[#EAB308]"/> {new Date(blog.created_at).toLocaleDateString()}
                            </div>
                            
                            <h2 className="text-[28px] md:text-[32px] font-bold text-[#0F172A] leading-[1.2] mb-5 line-clamp-2 hover:text-[#0B1F3A] transition-colors">
                                {blog.title}
                            </h2>
                            
                            <p className="text-[#64748B] text-[17px] leading-[1.6] line-clamp-3 mb-8 flex-grow">
                                {blog.content}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                <div className="flex gap-4">
                                    <button onClick={() => handleEdit(blog)} className="text-[#64748B] hover:text-[#0B1F3A] transition-all transform hover:scale-110" title="Edit">
                                        <Edit3 size={20}/>
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="text-[#64748B] hover:text-red-600 transition-all transform hover:scale-110" title="Delete">
                                        <Trash2 size={20}/>
                                    </button>
                                </div>
                                <button className="px-6 py-2 bg-[#F8FAFC] text-[#0B1F3A] text-[12px] font-bold uppercase tracking-[2px] hover:bg-[#EAB308] transition-all flex items-center gap-2 border border-slate-100">
                                    View <Eye size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
                <div className="max-w-7xl mx-auto py-32 text-center bg-[#F8FAFC] border border-slate-100">
                    <Sparkles className="mx-auto mb-4 text-[#EAB308]" size={32}/>
                    <p className="text-[24px] font-bold italic text-[#0B1F3A] uppercase tracking-[5px]">Directory Empty</p>
                    <p className="text-[#64748B] mt-2">No matches found for your current search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default BlogList;