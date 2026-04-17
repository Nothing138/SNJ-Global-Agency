import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Sparkles } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/admin/blogs/${slug}`);
                setBlog(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setLoading(false);
            }
        };
        fetchBlogDetails();
        window.scrollTo(0, 0); 
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center italic font-bold uppercase tracking-widest text-[#0B1F3A] animate-pulse font-['Times_New_Roman',_serif]">
            Loading Story...
        </div>
    );
    
    if (!blog) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] font-['Times_New_Roman',_serif]">
            Story Not Found.
        </div>
    );

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] font-['Times_New_Roman',_serif] pb-32 transition-colors duration-500">
            {/* --- Progress Bar --- */}
            <div className="fixed top-0 left-0 w-full h-1 bg-[#E5E7EB] z-50">
                <div className="h-full bg-[#EAB308] animate-progress" style={{ width: '100%' }}></div>
            </div>

            {/* --- Navigation & Actions --- */}
            <nav className="max-w-4xl mx-auto px-6 pt-24 pb-12 flex items-center justify-between">
                <Link to="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#64748B] hover:text-[#EAB308] transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#0B1F3A]"/> Back to Home
                </Link>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#0B1F3A] hover:text-white transition-all text-[#64748B]">
                        <Share2 size={16}/>
                    </button>
                    <button className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#0B1F3A] hover:text-white transition-all text-[#64748B]">
                        <Bookmark size={16}/>
                    </button>
                </div>
            </nav>

            {/* --- Article Header --- */}
            <header className="max-w-4xl mx-auto px-6 space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0B1F3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[3px]">
                    <Sparkles size={12} className="text-[#EAB308]"/> Editorial
                </div>
                
                {/* Heading (H1) Style: #0B1F3A, Bold, 40-48px */}
                <h1 className="text-4xl md:text-[48px] font-bold tracking-tight text-[#0B1F3A] leading-tight">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start text-[11px] font-bold uppercase tracking-widest text-[#64748B] border-y border-[#E5E7EB] py-6">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-[#EAB308]"/> {new Date(blog.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-[#EAB308]"/> 6 Minute Read</span>
                    <span className="text-[#E5E7EB]">|</span>
                    <span className="text-[#0B1F3A]">By Admin</span>
                </div>
            </header>

            {/* --- Featured Image --- */}
            {blog.featured_image && (
                <div className="max-w-6xl mx-auto px-6 my-16">
                    <div className="aspect-video rounded-[40px] overflow-hidden border border-[#E5E7EB] shadow-sm">
                        <img src={blog.featured_image} className="w-full h-full object-cover" alt={blog.title} />
                    </div>
                </div>
            )}

            {/* --- Article Content --- */}
            <article className="max-w-3xl mx-auto px-6">
                <div 
                    className="prose prose-zinc prose-lg max-w-none 
                    prose-headings:text-[#0F172A] prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-[#64748B] prose-p:leading-[1.6] prose-p:text-[18px]
                    prose-strong:text-[#0B1F3A] 
                    prose-em:text-[#EAB308] prose-em:italic
                    prose-blockquote:border-l-4 prose-blockquote:border-[#EAB308] 
                    prose-blockquote:italic prose-img:rounded-[30px]"
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
            </article>

            {/* --- Footer Signature --- */}
            <footer className="max-w-3xl mx-auto px-6 mt-20 pt-10 border-t border-[#E5E7EB] text-center">
                <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-[4px] text-[#64748B]">End of Transmission</p>
                    <div className="w-12 h-1 bg-[#EAB308] mx-auto rounded-full"></div>
                </div>
            </footer>
        </div>
    );
};

export default BlogDetail;