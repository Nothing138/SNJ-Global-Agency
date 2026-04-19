//userpeofile
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Briefcase, Plane, Map, Send, ShieldCheck, Lock, Eye, Ticket, Phone, UserCircle, PlusCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import io from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

const socket = io.connect("https://snj-global-agency-backend.onrender.com");

const UserProfile = () => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [newContact, setNewContact] = useState("");
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            fetchProfile();
            socket.emit("join_chat", user.id);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/users/profile/${user.id}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        if (!newContact) return toast.error("Please enter a number");
        
        setIsSubmittingContact(true);
        try {
            await axios.put(`https://snj-global-agency-backend.onrender.com/api/users/profile/update`, {
                userId: user.id,
                contact_number: newContact,
                full_name: data?.profile?.full_name 
            });
            toast.success("Contact number updated!");
            setNewContact("");
            fetchProfile(); 
        } catch (err) {
            toast.error("Failed to update contact");
        } finally {
            setIsSubmittingContact(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Times_New_Roman',_serif]">
            <Toaster position="top-right" reverseOrder={false} />
            <Navbar />
            
            <main className="flex-grow pt-40 px-6 pb-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- Sidebar --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-[#E5E7EB] p-8 rounded-[2.5rem] text-center shadow-sm sticky top-28">
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                <div className="w-full h-full bg-[#0B1F3A] rounded-3xl flex items-center justify-center shadow-xl shadow-[#0B1F3A]/10">
                                    <User size={48} className="text-[#EAB308]" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-bold uppercase text-[#0B1F3A] tracking-tight">
                                {data?.profile?.full_name || "Loading..."}
                            </h2>
                            <p className="text-[#64748B] text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                                {data?.profile?.role || "Global Traveler"}
                            </p>
                            
                            <div className="space-y-2">
                                <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Command Center" />
                                <TabBtn active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} label="My Journey" />
                                <TabBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="Direct Support" />
                                <TabBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Security" />
                            </div>
                        </div>
                    </div>

                    {/* --- Main Content --- */}
                    <div className="lg:col-span-3 space-y-8">
                        {activeTab === 'overview' && (
                            <Overview 
                                data={data} 
                                onContactSubmit={handleUpdateContact}
                                contactVal={newContact}
                                setContactVal={setNewContact}
                                isSubmitting={isSubmittingContact}
                            />
                        )}
                        {activeTab === 'applications' && <Applications data={data} />}
                        {activeTab === 'chat' && <SupportChat user={user} />}
                        {activeTab === 'security' && <SecuritySettings user={user} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Command Center Component ---
const Overview = ({ data, onContactSubmit, contactVal, setContactVal, isSubmitting }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<Plane size={20} />} title="Visas" count={data?.stats?.visas?.length || 0} />
            <StatCard icon={<Briefcase size={20} />} title="Job Phases" count={data?.stats?.jobs?.length || 0} />
            <StatCard icon={<Ticket size={20} />} title="Flight Requests" count={data?.stats?.flights?.length || 0} />
        </div>
        
        <div className="bg-white border border-[#E5E7EB] p-10 rounded-[3.5rem] shadow-sm">
            <div className="mb-10">
                <h3 className="text-2xl font-bold uppercase flex items-center gap-4 text-[#0B1F3A]">
                    <ShieldCheck className="text-[#EAB308]" size={28} /> Personnel Identity
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InfoItem icon={<UserCircle size={16} />} label="Legal Full Name" value={data?.profile?.full_name} />
                
                <div>
                    <p className="text-[10px] font-bold text-[#EAB308] uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Phone size={14} /> Primary Contact
                    </p>
                    {data?.profile?.phone_number ? (
                        <p className="text-lg font-bold text-[#0F172A]">{data.profile.phone_number}</p>
                    ) : (
                        <form onSubmit={onContactSubmit} className="mt-2 flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Add Contact Number" 
                                value={contactVal}
                                onChange={(e) => setContactVal(e.target.value)}
                                className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs outline-none focus:border-[#0B1F3A] w-full text-[#0F172A]"
                            />
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-[#0B1F3A] text-[#EAB308] p-2 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                <PlusCircle size={18} />
                            </button>
                        </form>
                    )}
                </div>

                <InfoItem label="Email Identity" value={data?.profile?.email} />
                <InfoItem label="Passport Number" value={data?.profile?.passport_number || 'N/A'} />
            </div>
        </div>
    </div>
);

// --- My Journey Component ---
const Applications = ({ data }) => {
    const [subTab, setSubTab] = useState('visa');

    const renderContent = () => {
        switch (subTab) {
            case 'visa':
                return (
                    <div className="space-y-2">
                        {data?.stats?.visas?.length > 0 ? data.stats.visas.map(v => (
                            <JourneyCard key={v.id} icon={<Plane className="text-[#0B1F3A]" />} title={v.destination_country} sub={v.visa_type} status={v.application_status} />
                        )) : <EmptyState message="No Visa Records Found" />}
                    </div>
                );
            case 'job':
                return (
                    <div className="space-y-2">
                        {data?.stats?.jobs?.length > 0 ? data.stats.jobs.map(j => (
                            <JourneyCard key={j.id} icon={<Briefcase className="text-[#0B1F3A]" />} title={j.job_title} sub={j.company_name} status={j.status} />
                        )) : <EmptyState message="No Job Applications Found" />}
                    </div>
                );
            case 'tour':
                return (
                    <div className="space-y-2">
                        {data?.stats?.tours?.length > 0 ? data.stats.tours.map(t => (
                            <JourneyCard key={t.id} icon={<Map className="text-[#0B1F3A]" />} title={t.tour_name} sub={t.destination} status={t.status} />
                        )) : <EmptyState message="No Tour Bookings Found" />}
                    </div>
                );
            case 'flight':
                return (
                    <div className="space-y-2">
                        {data?.stats?.flights?.length > 0 ? data.stats.flights.map(f => (
                            <JourneyCard 
                                key={f.id} 
                                icon={<Ticket className="text-[#0B1F3A]" />} 
                                title={`${f.departure_city} to ${f.destination_city}`} 
                                sub={`Date: ${new Date(f.travel_date).toLocaleDateString()} | Bill: $${f.total_cost || '0.00'}`} 
                                status={f.status} 
                            />
                        )) : <EmptyState message="No Flight Requests Found" />}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-3 bg-white p-2 rounded-[2rem] border border-[#E5E7EB] shadow-sm">
                {['visa', 'job', 'tour', 'flight'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${subTab === tab ? 'bg-[#0B1F3A] text-[#EAB308] shadow-md' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}
                    >
                        {tab} Status
                    </button>
                ))}
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[2.5rem] overflow-hidden min-h-[300px] shadow-sm">
                <div className="p-2">{renderContent()}</div>
            </div>
        </div>
    );
};

// --- Reusable UI Helpers ---
const JourneyCard = ({ icon, title, sub, status }) => (
    <div className="p-6 flex items-center justify-between border-b border-[#E5E7EB] last:border-0 hover:bg-[#F8FAFC] transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">{icon}</div>
            <div>
                <p className="font-bold text-sm uppercase text-[#0B1F3A] tracking-tight">{title}</p>
                <p className="text-[10px] text-[#64748B] font-bold uppercase">{sub}</p>
            </div>
        </div>
        <StatusBadge status={status} />
    </div>
);

const TabBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-[#0B1F3A] text-[#EAB308] shadow-lg shadow-[#0B1F3A]/10' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}>
        {label}
    </button>
);

const StatCard = ({ icon, title, count }) => (
    <div className="p-8 bg-white border border-[#E5E7EB] rounded-[2.5rem] flex items-center gap-6 shadow-sm">
        <div className="w-14 h-14 bg-[#0B1F3A] rounded-2xl flex items-center justify-center text-[#EAB308]">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-bold text-[#0B1F3A]">{count}</p>
        </div>
    </div>
);

const InfoItem = ({ label, value, icon }) => (
    <div>
        <p className="text-[10px] font-bold text-[#EAB308] uppercase tracking-widest mb-1 flex items-center gap-2">
            {icon} {label}
        </p>
        <p className="text-lg font-bold text-[#0F172A]">{value || 'Not Specified'}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase();
    const colors = { 
        approved: 'text-green-600 border-green-200 bg-green-50', 
        accept: 'text-green-600 border-green-200 bg-green-50', 
        hold: 'text-blue-600 border-blue-200 bg-blue-50',
        requested: 'text-amber-600 border-amber-200 bg-amber-50',
        reject: 'text-red-600 border-red-200 bg-red-50'
    };
    return <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase border ${colors[s] || 'text-[#64748B] border-[#E5E7EB] bg-[#F8FAFC]'}`}>{status || 'Requested'}</span>;
};

const EmptyState = ({ message }) => <div className="p-20 text-center text-[#64748B] font-bold uppercase text-[10px] tracking-widest">{message}</div>;

const SecuritySettings = ({ user }) => {
    const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error("Passwords mismatch!");
        setLoading(true);
        try {
            await axios.put(`https://snj-global-agency-backend.onrender.com/api/users/change-password`, {
                userId: user.id, oldPassword: passwords.old, newPassword: passwords.new
            });
            toast.success("Security updated!");
            setPasswords({ old: "", new: "", confirm: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white border border-[#E5E7EB] p-10 rounded-[3.5rem] shadow-sm animate-in fade-in">
             <div className="mb-10">
                <h3 className="text-2xl font-bold uppercase flex items-center gap-4 text-[#0B1F3A]"><Lock className="text-[#EAB308]" size={28} /> Security Guard</h3>
            </div>
            <form onSubmit={handleUpdate} className="max-w-md space-y-4">
                <PasswordField label="Current Password" value={passwords.old} show={showPass} onChange={(val) => setPasswords({...passwords, old: val})} />
                <PasswordField label="New Password" value={passwords.new} show={showPass} onChange={(val) => setPasswords({...passwords, new: val})} />
                <PasswordField label="Confirm Password" value={passwords.confirm} show={showPass} onChange={(val) => setPasswords({...passwords, confirm: val})} />
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowPass(!showPass)} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-[#0B1F3A]"><Eye size={20} /></button>
                    <button className="flex-1 bg-[#0B1F3A] text-[#EAB308] py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:opacity-95">{loading ? "Updating..." : "Update Credentials"}</button>
                </div>
            </form>
        </div>
    );
};

const PasswordField = ({ label, value, onChange, show }) => (
    <div>
        <label className="text-[10px] font-bold text-[#EAB308] uppercase tracking-widest mb-2 block">{label}</label>
        <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} required className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm focus:border-[#0B1F3A] outline-none text-[#0F172A]" />
    </div>
);

const SupportChat = ({ user }) => {
    const [msg, setMsg] = useState("");
    const [history, setHistory] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`https://snj-global-agency-backend.onrender.com/api/users/messages/${user.id}`);
                setHistory(res.data);
            } catch (err) {}
        };
        fetchMessages();
    }, [user.id]);

    useEffect(() => {
        socket.on("receive_message", (incomingData) => {
            setHistory(prev => [...prev, incomingData]);
        });
        return () => socket.off("receive_message");
    }, []);

    const handleSend = async () => {
        if (!msg.trim()) return;
        const chatData = { sender_id: user.id, receiver_id: 1, message: msg };
        try {
            await axios.post('https://snj-global-agency-backend.onrender.com/api/users/messages/send', chatData);
            socket.emit("send_message", chatData);
            setHistory(prev => [...prev, { ...chatData, created_at: new Date() }]);
            setMsg("");
        } catch (err) {}
    };

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-[3rem] h-[600px] flex flex-col overflow-hidden relative shadow-sm">
            <div className="p-6 bg-[#0B1F3A] border-b border-[#0B1F3A] flex items-center gap-4">
                <div className="w-10 h-10 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-bold text-xs">AD</div>
                <p className="text-sm font-bold uppercase text-white">Admin Support</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
                {history.map((m, i) => (
                    <div key={i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-bold ${m.sender_id === user.id ? 'bg-[#0B1F3A] text-[#EAB308] rounded-tr-none' : 'bg-white text-[#64748B] rounded-tl-none border border-[#E5E7EB]'}`}>
                            {m.message}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
            <div className="p-6 border-t border-[#E5E7EB] flex gap-3 bg-white">
                <input value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full px-6 outline-none text-xs text-[#0F172A]" placeholder="Message..." />
                <button onClick={handleSend} className="bg-[#0B1F3A] text-[#EAB308] p-4 rounded-full hover:opacity-90"><Send size={18} /></button>
            </div>
        </div>
    );
};

export default UserProfile;