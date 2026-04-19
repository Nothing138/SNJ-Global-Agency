//blog
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ArrowRight, Sparkles, Clock, Hash, Zap, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('https://snj-global-agency-backend.onrender.com/api/admin/blogs');
                setBlogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#0B1F3A]/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#EAB308] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] font-['Times_New_Roman',_serif] selection:bg-[#0B1F3A] selection:text-white pb-32 transition-colors duration-500">
            
            {/* --- Hero Header --- */}
            <header className="pt-32 pb-16 px-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0B1F3A]/5 blur-[120px] rounded-full -z-0 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-bold uppercase tracking-[4px] text-[#64748B]">
                        <Monitor size={12} className="text-[#EAB308]"/> Digital Transmissions
                    </div>
                    {/* H1 Style: Deep Navy #0B1F3A */}
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight uppercase leading-none text-[#0B1F3A]">
                        The <span className="italic text-[#EAB308] underline decoration-[#E5E7EB] underline-offset-8">Blog</span>
                    </h1>
                    {/* Body Text Style: #64748B */}
                    <p className="text-[#64748B] font-medium text-sm md:text-base max-w-xl mx-auto tracking-[0.1em] leading-[1.6]">
                        Curating the future of <span className="italic text-[#EAB308]">Premium Quality Services</span> & agency intelligence.
                    </p>
                </div>
            </header>

            {/* --- Slider Section --- */}
            <main className="max-w-7xl mx-auto px-6 relative group">
                <Swiper
                    spaceBetween={40}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={{
                        nextEl: '.next-btn',
                        prevEl: '.prev-btn',
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1280: { slidesPerView: 3 },
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="pb-24 !overflow-visible"
                >
                    {blogs.map((blog) => (
                        <SwiperSlide key={blog.id}>
                            <div className="group/card relative bg-white border border-[#E5E7EB] rounded-[45px] p-1 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(11,31,58,0.1)] hover:-translate-y-4 hover:border-[#EAB308]/50 h-[520px]">
                                
                                <div className="p-10 h-full flex flex-col justify-between relative z-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="w-14 h-14 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[22px] flex items-center justify-center shadow-sm group-hover/card:bg-[#0B1F3A] group-hover/card:text-white transition-all duration-500 group-hover/card:rotate-[15deg]">
                                                <Hash size={24} className="text-[#0B1F3A] group-hover/card:text-[#EAB308] transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] group-hover/card:border-[#EAB308]/30 transition-all">
                                                <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse"></span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Insights</span>
                                            </div>
                                        </div>

                                        {/* Subheading Style: #0F172A */}
                                        <h3 className="text-2xl font-bold tracking-tight text-[#0F172A] leading-[1.2] group-hover/card:text-[#0B1F3A] transition-colors duration-300">
                                            {blog.title}
                                        </h3>

                                        <p className="text-[#64748B] text-sm leading-[1.6] line-clamp-4 font-medium italic">
                                            {blog.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-[#E5E7EB] flex flex-col gap-6">
                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-[#EAB308]"/> {new Date(blog.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                            <span className="flex items-center gap-2"><Clock size={14} className="text-[#EAB308]"/> 4 MINS READ</span>
                                        </div>

                                        <Link 
                                            to={`/blogs/${blog.slug}`}
                                            className="group/btn relative inline-flex items-center justify-between overflow-hidden px-8 py-4 bg-[#0B1F3A] rounded-2xl transition-all duration-500 hover:bg-[#0F172A]"
                                        >
                                            <span className="relative z-10 text-xs font-bold uppercase italic tracking-widest text-white group-hover/btn:text-[#EAB308] transition-colors">Dive into Story</span>
                                            <ArrowRight size={20} className="relative z-10 text-[#EAB308] group-hover/btn:translate-x-2 transition-all duration-500" />
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Pattern on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-5 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:20px_20px] rounded-[45px]"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- Custom Controls --- */}
                <div className="flex justify-center items-center gap-8 mt-4">
                    <button className="prev-btn w-14 h-14 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#0B1F3A] hover:border-[#EAB308] hover:text-[#EAB308] transition-all active:scale-90 bg-white">
                        <ChevronLeft size={28} />
                    </button>
                    <button className="next-btn w-14 h-14 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#0B1F3A] hover:border-[#EAB308] hover:text-[#EAB308] transition-all active:scale-90 bg-white">
                        <ChevronRight size={28} />
                    </button>
                </div>
            </main>

            {/* Custom Swiper Styles to match Gold/Navy Theme */}
            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-pagination-bullet { background: #0B1F3A !important; opacity: 0.2; width: 8px; height: 8px; transition: all 0.3s; }
                .swiper-pagination-bullet-active { background: #EAB308 !important; width: 32px !important; border-radius: 4px !important; opacity: 1; }
                .swiper-slide { transition: transform 0.5s ease; opacity: 0.5; }
                .swiper-slide-active { opacity: 1; transform: scale(1.02); }
            `}} />
        </div>
    );
};

export default BlogPage;