import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, DollarSign, Clock, TrendingUp } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [filter, setFilter] = useState('month');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/stats?filter=${filter}`);
            if (res.data.success) setData(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filter]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white text-[#0B1F3A] font-['Times_New_Roman',_serif] text-2xl font-bold animate-pulse italic">
            Loading Premium System Analytics...
        </div>
    );

    return (
        <div className="p-6 md:p-10 min-h-screen bg-white font-['Times_New_Roman',_serif]">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    {/* Heading (H1) Style */}
                    <h1 className="text-[40px] lg:text-[48px] font-bold text-[#0B1F3A] leading-tight tracking-tight uppercase">
                        Analytics <span className="text-[#EAB308] italic font-light lowercase">Performance.</span>
                    </h1>
                    {/* Body Text Style */}
                    <p className="text-[#64748B] text-[18px] mt-2 leading-[1.6]">
                        Real-time tracking of <span className="italic text-[#EAB308] font-medium">Business Operations</span> and performance.
                    </p>
                </div>

                {/* Filter Switcher - Styled with Navy & Gold */}
                <div className="flex p-1 bg-[#F8FAFC] border border-slate-100 rounded-xl shadow-sm">
                    {['week', 'month'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-8 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                filter === type 
                                ? 'bg-[#0B1F3A] text-white shadow-md' 
                                : 'text-[#64748B] hover:text-[#0B1F3A]'
                            }`}
                        >
                            {type === 'week' ? 'Weekly' : 'Monthly'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <StatCard label="Total Revenue" val={`€${data?.stats?.totalRevenue || 0}`} icon={<DollarSign size={24}/>} />
                <StatCard label="Candidates" val={data?.stats?.totalUsers || 0} icon={<Users size={24}/>} />
                <StatCard label="Open Positions" val={data?.stats?.totalJobs || 0} icon={<Briefcase size={24}/>} />
                <StatCard label="Total Apps" val={data?.stats?.totalApps || 0} icon={<FileText size={24}/>} />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative">
                    <div className="flex justify-between items-center mb-10">
                        {/* Subheading Style */}
                        <h3 className="text-[28px] font-bold text-[#0F172A] flex items-center gap-3">
                            <TrendingUp size={24} className="text-[#EAB308]"/> 
                            Income <span className="italic font-medium text-[#EAB308]">Growth</span>
                        </h3>
                    </div>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis 
                                    dataKey="label" 
                                    stroke="#64748B" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tick={{fill: '#64748B', fontWeight: 'bold'}} 
                                />
                                <YAxis 
                                    stroke="#64748B" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0B1F3A', 
                                        border: 'none', 
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontFamily: 'Times New Roman'
                                    }}
                                    itemStyle={{ color: '#EAB308', fontWeight: 'bold' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#EAB308" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorIncome)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Activity List */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                    <div className="p-6 bg-[#0B1F3A] font-bold uppercase text-[14px] tracking-widest text-white flex items-center gap-3">
                        <Clock className="text-[#EAB308]" size={18} /> Recent Activity
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[450px]">
                        {(data?.recentBookings || []).map((b) => (
                            <div key={b.id} className="p-5 border-b border-slate-50 hover:bg-[#F8FAFC] transition-all flex justify-between items-center">
                                <div>
                                    <p className="text-[#0B1F3A] text-[15px] font-bold">{b.client_name}</p>
                                    <p className="text-[#64748B] text-[12px] italic">{b.package}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#0B1F3A] text-[14px] font-bold">${b.price}</p>
                                    <span className="text-[10px] font-bold uppercase text-[#EAB308] tracking-widest px-2 py-1 rounded-md bg-[#EAB308]/10">
                                        {b.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// StatCard Styled with Navy and Gold accents
const StatCard = ({ label, val, icon }) => (
    <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
        <div className="mb-6 bg-[#F8FAFC] w-fit p-4 rounded-xl text-[#0B1F3A] group-hover:bg-[#EAB308] group-hover:text-[#0B1F3A] transition-colors">
            {icon}
        </div>
        <h4 className="text-[34px] font-bold text-[#0B1F3A] tracking-tight mb-1">{val}</h4>
        <p className="text-[13px] uppercase text-[#64748B] font-bold tracking-[0.15em]">{label}</p>
    </div>
);

export default Analytics;