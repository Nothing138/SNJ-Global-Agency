import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Briefcase, MapPin, Users, AlertCircle, ChevronRight, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
  const [statsData, setStatsData] = useState({
    visaRequests: 0,
    activeJobs: 0,
    tourPackages: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://snj-global-agency-production.up.railway.app/api/admin/dashboard-stats');
        setStatsData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Visa Requests', value: statsData.visaRequests, icon: <Globe size={24}/> },
    { title: 'Open Jobs', value: statsData.activeJobs, icon: <Briefcase size={24}/> },
    { title: 'Tour Packages', value: statsData.tourPackages, icon: <MapPin size={24}/> },
    { title: 'Total Clients', value: statsData.totalClients, icon: <Users size={24}/> },
  ];

  return (
    <div className="space-y-12 p-2 bg-white min-h-screen font-['Times_New_Roman',_serif]">
      
      {/* 🏛️ Welcome Banner - Authoritative Look */}
      <div className="bg-white p-12 border border-slate-100 shadow-[0_20px_50px_rgba(11,31,58,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
            <Globe size={200} className="text-[#0B1F3A]" />
        </div>
        <div className="relative z-10 border-l-4 border-[#EAB308] pl-8">
            <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight uppercase tracking-tight">
              Welcome to <span className="italic font-medium text-[#EAB308]">Game Routes Agency.</span>
            </h1>
            <p className="text-[18px] text-[#64748B] mt-3 italic leading-[1.6]">
              Strategic command center for global travel and professional career pathways.
            </p>
        </div>
      </div>

      {/* 📊 Stats Grid - Premium Minimalist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#EAB308]/30 group transition-all duration-500 cursor-default relative overflow-hidden">
            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0B1F3A] group-hover:bg-[#EAB308] transition-colors"></div>
            
            <div className="text-[#EAB308] mb-6 group-hover:scale-110 transition-transform duration-500">
              {stat.icon}
            </div>
            <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-[2px] group-hover:text-[#0B1F3A] transition-colors">
              {stat.title}
            </p>
            <h3 className="text-[34px] font-bold text-[#0F172A] mt-2 italic group-hover:not-italic transition-all">
                {loading ? "..." : stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 📋 Recent Activity Table */}
        <div className="lg:col-span-2 bg-white p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-end mb-10 border-b border-slate-50 pb-6">
            <div>
                <h3 className="text-[28px] font-bold text-[#0F172A] uppercase tracking-tight">Recent Activity</h3>
                <p className="text-[16px] text-[#64748B] italic mt-1">Real-time ledger of system operations</p>
            </div>
            <button className="text-[14px] font-bold uppercase text-[#EAB308] hover:text-[#0B1F3A] tracking-[2px] transition-colors border-b border-[#EAB308]">
              Archive View
            </button>
          </div>
          
          <div className="space-y-6">
             <div className="group bg-[#F8FAFC] p-6 border-l-4 border-[#0B1F3A] flex items-center justify-between hover:bg-[#0B1F3A] transition-all duration-300">
                <div>
                    <p className="text-[16px] font-bold text-[#0F172A] uppercase group-hover:text-[#EAB308]">New Visa Application</p>
                    <p className="text-[14px] text-[#64748B] italic group-hover:text-white/70">Client: Abir Rahman — Destination: Poland</p>
                </div>
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest group-hover:text-white/50">2 Mins Ago</span>
             </div>
             
             <div className="group bg-[#F8FAFC] p-6 border-l-4 border-[#EAB308] flex items-center justify-between hover:bg-[#0B1F3A] transition-all duration-300">
                <div>
                    <p className="text-[16px] font-bold text-[#0F172A] uppercase group-hover:text-[#EAB308]">Job Circular Posted</p>
                    <p className="text-[14px] text-[#64748B] italic group-hover:text-white/70">Title: IT Support Specialist — Canada</p>
                </div>
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest group-hover:text-white/50">1 Hour Ago</span>
             </div>
          </div>
        </div>

        {/* 🔔 Notifications Sidebar - High Contrast */}
        <div className="bg-[#0B1F3A] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-10 -right-10 opacity-[0.03]">
              <TrendingUp size={250} />
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-12 h-12 bg-[#EAB308] text-[#0B1F3A] flex items-center justify-center shadow-lg">
                <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-[24px] font-bold uppercase leading-none tracking-tight text-white">Live</h3>
              <h3 className="text-[20px] font-light italic uppercase tracking-[3px] text-[#EAB308]">Inquiries</h3>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
              {[1, 2, 3].map(i => (
               <div key={i} className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-between">
                 <div>
                    <div className="text-[15px] font-bold italic text-[#EAB308] uppercase tracking-wide group-hover:not-italic transition-all">Poland Work Visa</div>
                    <div className="text-[12px] text-slate-400 uppercase tracking-[1px] mt-1">Subject: S. Hasan</div>
                 </div>
                 <ChevronRight size={18} className="text-[#EAB308] group-hover:translate-x-2 transition-transform" />
               </div>
              ))}
          </div>
          
          <button className="w-full mt-10 py-5 bg-[#EAB308] text-[#0B1F3A] font-bold text-[14px] uppercase tracking-[3px] hover:bg-white transition-all shadow-xl active:scale-95 relative z-10">
            Access Full Inbox
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;