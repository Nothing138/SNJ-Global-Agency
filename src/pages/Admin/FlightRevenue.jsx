import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Plane, CheckCircle, Users, ArrowUpRight, TrendingUp, ClipboardList, Phone } from 'lucide-react';

const FlightRevenue = () => {
    const [data, setData] = useState(null);
    const [range, setRange] = useState('monthly');
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/admin/flight-analytics?range=${range}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [range]);

    if (loading || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] font-['Times_New_Roman',_serif]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#0B1F3A] mb-4"></div>
            <p className="text-[#64748B] italic tracking-widest text-lg">Consulting Financial Ledgers...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-6 lg:p-12 space-y-12 font-['Times_New_Roman',_serif]">
            
            {/* 🧭 Navbar Style Toggle Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
                <div>
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-none uppercase tracking-tight">
                        Revenue <span className="italic font-medium text-[#EAB308]">Insights</span>
                    </h1>
                    <p className="text-[18px] text-[#64748B] mt-3 max-w-2xl leading-[1.6]">
                        Real-time financial performance tracking and <span className="italic text-[#EAB308] font-bold">Premium Quality Services</span> auditing statistics.
                    </p>
                </div>
                
                <div className="flex bg-[#0B1F3A] p-1 rounded-sm shadow-md">
                    <button 
                        onClick={() => setRange('weekly')} 
                        className={`px-8 py-2 text-[14px] font-bold uppercase tracking-widest transition-all ${range === 'weekly' ? 'bg-[#EAB308] text-[#0B1F3A]' : 'text-white hover:text-[#EAB308]'}`}
                    >
                        Weekly
                    </button>
                    <button 
                        onClick={() => setRange('monthly')} 
                        className={`px-8 py-2 text-[14px] font-bold uppercase tracking-widest transition-all ${range === 'monthly' ? 'bg-[#EAB308] text-[#0B1F3A]' : 'text-white hover:text-[#EAB308]'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* 📊 High-End Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Gross Revenue" value={`$${data.stats.total_revenue || 0}`} icon={<DollarSign/>} />
                <StatCard title="Total Flights" value={data.stats.total_flights || 0} icon={<Plane/>} />
                <StatCard title="Confirmed" value={data.stats.confirmed_bookings || 0} icon={<CheckCircle/>} />
                <StatCard title="Pending" value={data.stats.pending_requests || 0} icon={<Users/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* 📈 Chart Area */}
                <div className="lg:col-span-2 bg-white border border-slate-100 p-8 shadow-sm">
                    <div className="mb-10">
                        <h2 className="text-[28px] md:text-[34px] font-bold text-[#0F172A] flex items-center gap-3">
                            <TrendingUp className="text-[#EAB308]" /> Revenue Trajectory
                        </h2>
                        <p className="text-[#64748B] italic text-[16px]">Monthly performance analytics and trends</p>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.graphData}>
                                <defs>
                                    <linearGradient id="colorNavy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontFamily: 'serif'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontFamily: 'serif'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0B1F3A', border: 'none', borderRadius: '4px', color: '#fff', fontFamily: 'serif'}}
                                    itemStyle={{color: '#EAB308'}}
                                />
                                <Area type="monotone" dataKey="value" stroke="#0B1F3A" strokeWidth={3} fill="url(#colorNavy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 🏆 Recent List - Dark Mode Sidebar */}
                <div className="bg-[#0B1F3A] p-8 text-white flex flex-col shadow-2xl">
                    <h3 className="text-[24px] font-bold uppercase italic text-[#EAB308] border-b border-white/10 pb-4 mb-8 flex items-center gap-2">
                        <ArrowUpRight size={20} /> Recent Settlements
                    </h3>
                    <div className="space-y-8 flex-grow">
                        {data.recentList?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 border border-[#EAB308] flex items-center justify-center text-[#EAB308] font-bold">
                                        {item.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[16px] group-hover:text-[#EAB308] transition-colors">{item.full_name}</p>
                                        <p className="text-[12px] text-slate-400 italic tracking-widest">{item.destination_city}</p>
                                    </div>
                                </div>
                                <p className="text-[18px] font-bold italic text-[#EAB308]">${item.total_cost}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-transparent border border-[#EAB308] text-[#EAB308] font-bold uppercase tracking-widest hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-all">
                        View Full History
                    </button>
                </div>
            </div>

            {/* 📋 Data Table Section */}
            <div className="bg-white border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-10 border-l-4 border-[#0B1F3A] pl-6">
                    <h3 className="text-[34px] font-bold text-[#0B1F3A] uppercase tracking-tighter">Flight Audit <span className="italic text-[#EAB308]">Log</span></h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-[#0B1F3A]">
                                <th className="p-4 text-[14px] font-bold uppercase text-[#0B1F3A]">Candidate</th>
                                <th className="p-4 text-[14px] font-bold uppercase text-[#0B1F3A]">Credentials</th>
                                <th className="p-4 text-[14px] font-bold uppercase text-[#0B1F3A]">Route</th>
                                <th className="p-4 text-[14px] font-bold uppercase text-[#0B1F3A] text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-[16px] text-[#64748B]">
                            {data.recentList.map((item, i) => (
                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-[#0F172A]">{item.full_name}</p>
                                        <p className="text-[13px] italic flex items-center gap-1"><Phone size={12}/> {item.contact_number}</p>
                                    </td>
                                    <td className="p-4 uppercase text-[13px] tracking-tighter">Passport: {item.passport_number}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                                            <span>{item.departure_city}</span>
                                            <Plane size={14} className="text-[#EAB308]" />
                                            <span className="text-[#EAB308]">{item.destination_city}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-[#0F172A] text-xl italic">${item.total_cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="border border-slate-100 p-8 bg-white hover:border-[#EAB308] transition-all group shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#f8fafc] text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-[#EAB308] transition-all">
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[2px]">{title}</p>
        </div>
        <h4 className="text-[34px] font-bold text-[#0B1F3A] italic leading-none">{value}</h4>
    </div>
);

export default FlightRevenue;