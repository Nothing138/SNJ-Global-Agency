import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    User, Briefcase, Plane, Map, Send, ShieldCheck, Lock, Eye, Ticket,
    Phone, UserCircle, PlusCircle, Bell, FileText, Upload, CheckCircle,
    XCircle, Clock, AlertCircle, ChevronRight, Download, Globe,
    CreditCard, RefreshCw, MessageSquare, Star, Shield, Activity,
    MoreHorizontal, EyeOff, Loader, ArrowRight, Info, Calendar,
    Edit2, Save, X, Mail, MapPin, Hash, Fingerprint
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import io from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

const BASE_URL = "http://localhost:5000";

const getUserId = (user) => {
    if (user?.id) return user.id;
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        }
    } catch(e) {}
    return null;
};

// ─── Tracking Progress Config ──────────────────────────────────────────────────
const getTrackingStatus = (value) => {
    if (value === 0 || value === null || value === undefined) return { label: 'Pending',    color: '#94A3B8', bg: 'bg-slate-100',   text: 'text-slate-500',   ring: 'ring-slate-200',   pct: 0   };
    if (value <= 25)  return { label: 'Accepted',   color: '#3B82F6', bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-200',    pct: 25  };
    if (value <= 50)  return { label: 'Processing', color: '#F59E0B', bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-200',   pct: 50  };
    if (value <= 75)  return { label: 'Confirmed',  color: '#8B5CF6', bg: 'bg-purple-50',  text: 'text-purple-600',  ring: 'ring-purple-200',  pct: 75  };
    return             { label: 'Completed',  color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', pct: 100 };
};

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    submitted:          { color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Submitted' },
    under_review:       { color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-400',   label: 'Under Review' },
    processing:         { color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-200', dot: 'bg-indigo-400', label: 'Processing' },
    embassy_review:     { color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-200', dot: 'bg-purple-400', label: 'Embassy Review' },
    approved:           { color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200',  dot: 'bg-green-500',  label: 'Approved' },
    accept:             { color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200',  dot: 'bg-green-500',  label: 'Accepted' },
    rejected:           { color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    dot: 'bg-red-500',    label: 'Rejected' },
    reject:             { color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    dot: 'bg-red-500',    label: 'Rejected' },
    on_hold:            { color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-400', label: 'On Hold' },
    hold:               { color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-400', label: 'On Hold' },
    requested:          { color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Requested' },
    documents_verified: { color: 'text-cyan-600',   bg: 'bg-cyan-50',    border: 'border-cyan-200',   dot: 'bg-cyan-400',   label: 'Docs Verified' },
    decision:           { color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200',  dot: 'bg-slate-400',  label: 'Decision' },
};

const getStatus = (s) => STATUS_CONFIG[s?.toLowerCase()?.replace(/ /g, '_')] || STATUS_CONFIG['requested'];

// ─── Timeline Steps ─────────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
    { key: 'submitted',      label: 'Submitted',            icon: FileText },
    { key: 'under_review',   label: 'Docs Verified',        icon: CheckCircle },
    { key: 'processing',     label: 'Processing',           icon: Activity },
    { key: 'embassy_review', label: 'Embassy / Co. Review', icon: Globe },
    { key: 'approved',       label: 'Decision',             icon: Star },
];

const getStepIndex = (status) => {
    const s = status?.toLowerCase()?.replace(/ /g, '_');
    if (s === 'rejected' || s === 'reject') return 4;
    if (s === 'approved' || s === 'accept') return 4;
    if (s === 'embassy_review') return 3;
    if (s === 'processing') return 2;
    if (s === 'under_review' || s === 'documents_verified') return 1;
    return 0;
};

let socket = null;
const getSocket = () => {
    if (!socket) {
        socket = io(BASE_URL, { transports: ['websocket', 'polling'] });
    }
    return socket;
};

// ─── Circular Progress Ring ────────────────────────────────────────────────────
const CircularProgress = ({ value, color, size = 72 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={6} />
            <circle
                cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={color} strokeWidth={6}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
            />
        </svg>
    );
};

// ─── Tracking Card Component ───────────────────────────────────────────────────
const TrackingCard = ({ icon: Icon, label, value, colorClass }) => {
    // Only render if value > 0
    if (!value || value === 0) return null;

    const st = getTrackingStatus(value);
    const [animated, setAnimated] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    const stages = [
        { pct: 0,   label: 'Pending',    active: value >= 0 },
        { pct: 25,  label: 'Accepted',   active: value >= 25 },
        { pct: 50,  label: 'Processing', active: value >= 50 },
        { pct: 75,  label: 'Confirmed',  active: value >= 75 },
        { pct: 100, label: 'Completed',  active: value >= 100 },
    ];

    return (
        <div className="glass border border-white/60 rounded-[2rem] p-6 shadow-sm card-hover overflow-hidden relative">
            {/* Ambient glow */}
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: st.color }}
            />

            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#0B1F3A] rounded-xl flex items-center justify-center shadow">
                        <Icon size={18} className="text-[#EAB308]" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest font-body">Application</p>
                        <p className="text-sm font-bold text-[#0B1F3A] font-body">{label}</p>
                    </div>
                </div>

                {/* Circular Progress */}
                <div className="relative flex items-center justify-center">
                    <CircularProgress value={animated} color={st.color} size={68} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[13px] font-bold text-[#0B1F3A] font-body leading-none">{value}%</span>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${st.bg} mb-4`}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: st.color }} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${st.text} font-body`}>{st.label}</span>
            </div>

            {/* Stage Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center gap-0.5">
                    {stages.slice(1).map((stage, i) => (
                        <div key={i} className="flex-1 flex items-center gap-0.5">
                            <div
                                className="h-1.5 flex-1 rounded-full transition-all duration-700"
                                style={{
                                    background: stage.active ? st.color : '#E5E7EB',
                                    transitionDelay: `${i * 100}ms`
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between">
                    {stages.map((s, i) => (
                        <div key={i} className="flex flex-col items-center" style={{ width: i === 0 || i === stages.length - 1 ? 'auto' : '1fr' }}>
                            <div
                                className="w-2 h-2 rounded-full mb-1 transition-all duration-500"
                                style={{ background: s.active ? st.color : '#E5E7EB', transitionDelay: `${i * 80}ms` }}
                            />
                            <span
                                className="text-[8px] font-semibold font-body"
                                style={{ color: s.active ? st.color : '#CBD5E1' }}
                            >
                                {i === 0 ? '0%' : `${s.pct}%`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const UserProfile = () => {
    const [data, setData]             = useState(null);
    const [tracking, setTracking]     = useState(null);
    const [loading, setLoading]       = useState(true);
    const [activeTab, setActiveTab]   = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = getUserId(user);
    const sock = getSocket();

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchTracking();
            sock.emit('join_chat', { room: String(user.id) });

            sock.on('status_update', (update) => {
                addNotification({
                    id: Date.now(), type: 'status',
                    message: `Your ${update.type} application status updated to "${update.status}"`,
                    time: new Date(), read: false,
                });
                fetchProfile();
                fetchTracking();
                toast.success(`Status Updated: ${update.status}`);
            });

            sock.on('document_update', (update) => {
                addNotification({
                    id: Date.now(), type: 'document',
                    message: `Document "${update.name}" was ${update.status}`,
                    time: new Date(), read: false,
                });
                fetchProfile();
            });
        }
        return () => {
            sock.off('status_update');
            sock.off('document_update');
        };
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/profile/${user.id}`);
            setData(res.data);
        } catch (err) {
            console.error('Error fetching profile', err);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchTracking = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/users/tracking/${user.id}`);
            setTracking(res.data || null);
        } catch (err) {
            console.error('Error fetching tracking', err);
        }
    };

    const addNotification = (notif) => {
        setNotifications(prev => [notif, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + 1);
    };

    const calcCompletion = () => {
        if (!data?.profile) return 0;
        const fields = ['full_name', 'email', 'phone_number', 'passport_number', 'nid_number', 'nationality', 'address'];
        const filled = fields.filter(f => data.profile[f]).length;
        return Math.round((filled / fields.length) * 100);
    };

    const TABS = [
        { id: 'overview',  label: 'Command Center', icon: ShieldCheck },
        { id: 'documents', label: 'Documents',      icon: FileText },
        { id: 'chat',      label: 'Direct Support', icon: MessageSquare },
        { id: 'security',  label: 'Security',       icon: Lock },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F0F4F8] text-[#0F172A] font-['Georgia',_serif]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
                .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
                .font-body    { font-family: 'Inter', system-ui, sans-serif; }
                .glass { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); }
                .gold-line::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background: linear-gradient(180deg,#EAB308,#F59E0B); border-radius:999px; }
                .shimmer { background: linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .notif-dot { animation: pulse 2s infinite; }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                .card-hover { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
                .card-hover:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(11,31,58,0.1); }
                .progress-bar { transition: width 1s cubic-bezier(.4,0,.2,1); }
                .fade-up { animation: fadeUp 0.5s ease both; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .skeleton { border-radius:8px; }
                .edit-input { width:100%; background:#F8FAFC; border:1.5px solid #E5E7EB; border-radius:12px; padding:8px 14px; font-size:13px; outline:none; color:#0F172A; transition:border-color 0.2s; font-family:'Inter',sans-serif; }
                .edit-input:focus { border-color:#0B1F3A; }
            `}</style>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{
                style: { fontFamily: 'Inter,sans-serif', fontSize: '13px', background: '#0B1F3A', color: '#EAB308' }
            }} />
            <Navbar />

            <main className="flex-grow pt-36 px-4 md:px-6 pb-12">
                <div className="max-w-7xl mx-auto">

                    {/* ── Top Bar ─────────────────────────────────────── */}
                    <div className="flex items-center justify-between mb-8 font-body">
                        <div>
                            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.25em]">SNJ GlobalRoutes</p>
                            <h1 className="font-display text-3xl font-bold text-[#0B1F3A]">
                                Welcome back, {loading ? '...' : (data?.profile?.full_name?.split(' ')[0] || 'Traveler')}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => { setShowNotifs(!showNotifs); setUnreadCount(0); }}
                                    className="relative w-11 h-11 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center hover:border-[#0B1F3A] transition-colors shadow-sm"
                                >
                                    <Bell size={18} className="text-[#0B1F3A]" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center notif-dot">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                {showNotifs && (
                                    <div className="absolute right-0 top-14 w-80 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl z-50 overflow-hidden">
                                        <div className="p-5 border-b border-[#F0F4F8] flex items-center justify-between">
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">Notifications</p>
                                            <span className="text-[10px] text-[#64748B]">{notifications.length} total</span>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-[#64748B] text-xs font-body">All clear — no new updates</div>
                                            ) : notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-[#F8FAFC] hover:bg-[#F8FAFC] font-body">
                                                    <p className="text-xs text-[#0F172A] font-semibold">{n.message}</p>
                                                    <p className="text-[10px] text-[#64748B] mt-1">{new Date(n.time).toLocaleTimeString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-11 h-11 bg-[#0B1F3A] rounded-2xl flex items-center justify-center">
                                <User size={18} className="text-[#EAB308]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* ── Sidebar ────────────────────────────────── */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="glass border border-white/60 p-6 rounded-[2rem] text-center shadow-sm sticky top-24">
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    <div className="w-full h-full bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-[1.5rem] flex items-center justify-center shadow-xl">
                                        <User size={40} className="text-[#EAB308]" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="space-y-2 mb-4">
                                        <div className="h-5 shimmer skeleton mx-auto w-32" />
                                        <div className="h-3 shimmer skeleton mx-auto w-20" />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="font-display text-xl font-bold text-[#0B1F3A] leading-tight">
                                            {data?.profile?.full_name || 'Your Name'}
                                        </h2>
                                        <p className="text-[9px] font-body font-semibold text-[#64748B] tracking-[0.2em] uppercase mb-1">
                                            {data?.profile?.nationality || 'Global Traveler'}
                                        </p>
                                        <p className="text-[9px] font-body text-[#EAB308] font-bold tracking-widest uppercase mb-4">
                                            {data?.profile?.role || 'Client'}
                                        </p>
                                    </>
                                )}

                                {/* Profile Strength */}
                                <div className="mb-5 text-left">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[9px] font-body font-bold text-[#64748B] uppercase tracking-widest">Profile Strength</span>
                                        <span className="text-[10px] font-body font-bold text-[#0B1F3A]">{calcCompletion()}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] rounded-full progress-bar"
                                            style={{ width: `${calcCompletion()}%` }}
                                        />
                                    </div>
                                </div>

                                <nav className="space-y-1.5">
                                    {TABS.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full py-3 px-4 rounded-xl text-[10px] font-body font-semibold uppercase tracking-widest transition-all flex items-center gap-3 ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#0B1F3A] text-[#EAB308] shadow-lg'
                                                        : 'text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0B1F3A]'
                                                }`}
                                            >
                                                <Icon size={13} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Quick Stats — only non-zero */}
                            {tracking && (
                                <div className="glass border border-white/60 p-4 rounded-[1.5rem] shadow-sm font-body">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-3">Applications</p>
                                    <div className="space-y-2">
                                        {[
                                            { icon: Plane,     label: 'Visas',   value: tracking.visa,   color: 'text-blue-500' },
                                            { icon: Briefcase, label: 'Jobs',    value: tracking.job,    color: 'text-purple-500' },
                                            { icon: Map,       label: 'Trips',   value: tracking.trip,   color: 'text-green-500' },
                                            { icon: Ticket,    label: 'Flights', value: tracking.flight, color: 'text-amber-500' },
                                        ].filter(s => s.value > 0).map(s => {
                                            const st = getTrackingStatus(s.value);
                                            return (
                                                <div key={s.label} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <s.icon size={12} className={s.color} />
                                                        <span className="text-[10px] text-[#64748B]">{s.label}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                                                </div>
                                            );
                                        })}
                                        {[tracking.visa, tracking.job, tracking.trip, tracking.flight].every(v => !v || v === 0) && (
                                            <p className="text-[10px] text-[#94A3B8] text-center py-2">No active applications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Main Content ────────────────────────────── */}
                        <div className="lg:col-span-3">
                            {loading ? <SkeletonLoader /> : (
                                <>
                                    {activeTab === 'overview' && (
                                        <Overview
                                            data={data}
                                            user={user}
                                            tracking={tracking}
                                            completion={calcCompletion()}
                                            onRefresh={fetchProfile}
                                        />
                                    )}
                                    {activeTab === 'documents' && (
                                        <DocumentManager user={user} data={data} />
                                    )}
                                    {activeTab === 'chat' && (
                                        <SupportChat user={user} addNotification={addNotification} socket={sock} />
                                    )}
                                    {activeTab === 'security' && (
                                        <SecuritySettings user={user} data={data} onRefresh={fetchProfile} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ─── Skeleton Loader ────────────────────────────────────────────────────────────
const SkeletonLoader = () => (
    <div className="space-y-6 fade-up">
        <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-48 shimmer skeleton rounded-[1.5rem]" />)}
        </div>
        <div className="h-64 shimmer skeleton rounded-[2rem]" />
        <div className="h-48 shimmer skeleton rounded-[2rem]" />
    </div>
);

// ─── Overview / Command Center ──────────────────────────────────────────────────
const Overview = ({ data, user, tracking, completion, onRefresh }) => {
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving]     = useState(false);
    const [form, setForm]         = useState({
        full_name:       data?.profile?.full_name || '',
        phone_number:    data?.profile?.phone_number || '',
        nationality:     data?.profile?.nationality || '',
        passport_number: data?.profile?.passport_number || '',
        nid_number:      data?.profile?.nid_number || '',
        address:         data?.profile?.address || '',
    });

    const maskPassport = (num) => {
        if (!num) return 'N/A';
        return num.slice(0, 2) + '•'.repeat(Math.max(num.length - 4, 0)) + num.slice(-2);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${BASE_URL}/api/users/profile/update`, {
                userId: user.id,
                ...form,
                contact_number: form.phone_number,
            });
            toast.success('Profile updated successfully!');
            setEditMode(false);
            onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Tracking cards config — only show if value > 0
    const trackingCards = tracking ? [
        { icon: Plane,     label: 'Visa Application',   value: tracking.visa,   key: 'visa' },
        { icon: Briefcase, label: 'Job Application',    value: tracking.job,    key: 'job' },
        { icon: Map,       label: 'Trip Booking',       value: tracking.trip,   key: 'trip' },
        { icon: Ticket,    label: 'Flight Booking',     value: tracking.flight, key: 'flight' },
    ].filter(c => c.value > 0) : [];

    const allApps = [
        ...(data?.stats?.visas || []).map(v => ({ ...v, appType: 'Visa',   icon: Plane,     title: v.destination_country, sub: v.visa_type })),
        ...(data?.stats?.jobs  || []).map(j => ({ ...j, appType: 'Job',    icon: Briefcase, title: j.job_title,           sub: j.company_name })),
    ].slice(0, 3);

    return (
        <div className="space-y-6 fade-up font-body">

            {/* ── Application Tracking Cards (only shown if value > 0) ── */}
            {trackingCards.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Application Progress</p>
                            <h3 className="font-display text-xl font-bold text-[#0B1F3A]">Your Journey</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                            <RefreshCw size={10} />
                            <span>Live tracking</span>
                        </div>
                    </div>
                    <div className={`grid gap-4 ${trackingCards.length === 1 ? 'grid-cols-1 max-w-sm' : trackingCards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {trackingCards.map((card) => (
                            <TrackingCard
                                key={card.key}
                                icon={card.icon}
                                label={card.label}
                                value={card.value}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Applications */}
            {allApps.length > 0 && (
                <div className="glass border border-white/60 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-[#F0F4F8] flex items-center justify-between">
                        <h3 className="font-display text-xl font-bold text-[#0B1F3A]">Recent Applications</h3>
                        <span className="text-[9px] font-semibold text-[#EAB308] uppercase tracking-widest">Live Status</span>
                    </div>
                    {allApps.map((app, i) => {
                        const st = getStatus(app.application_status || app.status);
                        const Icon = app.icon;
                        return (
                            <div key={i} className="px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#0B1F3A]/5 rounded-xl flex items-center justify-center">
                                            <Icon size={14} className="text-[#0B1F3A]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#0B1F3A]">{app.title}</p>
                                            <p className="text-[10px] text-[#64748B]">{app.appType} · {app.sub}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                                        <span className={`text-[10px] font-bold ${st.color}`}>{st.label}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1">
                                    {TIMELINE_STEPS.map((step, idx) => {
                                        const current = getStepIndex(app.application_status || app.status);
                                        const done = idx <= current;
                                        return (
                                            <div key={idx} className="flex items-center gap-1 flex-1">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? 'bg-[#EAB308]' : 'bg-[#E2E8F0]'}`} />
                                                {idx < TIMELINE_STEPS.length - 1 && (
                                                    <div className={`h-0.5 flex-1 ${done ? 'bg-[#EAB308]' : 'bg-[#E2E8F0]'}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Personnel Identity (Editable) */}
            <div className="glass border border-white/60 p-8 rounded-[2rem] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-[#0B1F3A] flex items-center gap-3">
                        <ShieldCheck className="text-[#EAB308]" size={24} /> Personnel Identity
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-widest">Verified</span>
                        </div>
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A] bg-[#F0F4F8] hover:bg-[#EAB308]/10 border border-[#E5E7EB] hover:border-[#EAB308] px-3 py-2 rounded-xl transition-all"
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-2 rounded-xl bg-[#F0F4F8] text-[#64748B] hover:bg-red-50 hover:text-red-600 border border-[#E5E7EB] transition-all"
                                >
                                    <X size={12} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-4 py-2 rounded-xl bg-[#0B1F3A] text-[#EAB308] hover:opacity-90 transition-all disabled:opacity-60"
                                >
                                    {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableInfoItem icon={<UserCircle size={13} />} label="Legal Full Name" value={form.full_name} field="full_name" editMode={editMode} onChange={(val) => setForm(p => ({ ...p, full_name: val }))} />
                    <EditableInfoItem icon={<Globe size={13} />} label="Nationality" value={form.nationality} field="nationality" editMode={editMode} onChange={(val) => setForm(p => ({ ...p, nationality: val }))} />
                    <EditableInfoItem icon={<CreditCard size={13} />} label="Passport Number" value={editMode ? form.passport_number : maskPassport(form.passport_number)} field="passport_number" editMode={editMode} secure={!editMode} onChange={(val) => setForm(p => ({ ...p, passport_number: val }))} />
                    <EditableInfoItem icon={<Fingerprint size={13} />} label="National ID" value={editMode ? form.nid_number : (form.nid_number ? '••••' + form.nid_number.slice(-4) : 'N/A')} field="nid_number" editMode={editMode} secure={!editMode} onChange={(val) => setForm(p => ({ ...p, nid_number: val }))} />
                    <EditableInfoItem icon={<Phone size={13} />} label="Primary Contact" value={form.phone_number} field="phone_number" editMode={editMode} placeholder="Add contact number" onChange={(val) => setForm(p => ({ ...p, phone_number: val }))} />
                    <div>
                        <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Mail size={13} /> Email Identity
                        </p>
                        <p className="text-sm font-bold text-[#0F172A]">{data?.profile?.email || 'Not specified'}</p>
                        <p className="text-[9px] text-[#94A3B8] mt-0.5">Email cannot be changed here</p>
                    </div>
                    <div className="md:col-span-2">
                        <EditableInfoItem icon={<MapPin size={13} />} label="Address" value={form.address} field="address" editMode={editMode} placeholder="Your address" onChange={(val) => setForm(p => ({ ...p, address: val }))} />
                    </div>
                </div>

                {completion < 100 && !editMode && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-amber-700">Complete Your Profile</p>
                            <p className="text-[11px] text-amber-600 mt-0.5">
                                A complete profile speeds up application processing. {100 - completion}% remaining.{' '}
                                <button onClick={() => setEditMode(true)} className="underline font-bold">Edit now</button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Editable Info Item ─────────────────────────────────────────────────────────
const EditableInfoItem = ({ icon, label, value, field, editMode, onChange, secure, placeholder }) => (
    <div>
        <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-body">
            {icon} {label}
        </p>
        {editMode ? (
            <input
                className="edit-input"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            />
        ) : (
            <p className={`text-sm font-bold text-[#0F172A] font-body ${secure ? 'font-mono tracking-wider' : ''}`}>
                {value || 'Not specified'}
            </p>
        )}
    </div>
);

// ─── Application Detail ─────────────────────────────────────────────────────────
const ApplicationDetail = ({ app, onBack }) => {
    const stepIdx = getStepIndex(app.status);
    return (
        <div className="fade-up space-y-5 font-body">
            <button onClick={onBack} className="flex items-center gap-2 text-[11px] font-semibold text-[#64748B] hover:text-[#0B1F3A] transition-colors uppercase tracking-wider">
                <ChevronRight size={14} className="rotate-180" /> Back to Applications
            </button>
            <div className="glass border border-white/60 p-7 rounded-[2rem] shadow-sm">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1">{app.type} Application</p>
                        <h2 className="font-display text-3xl font-bold text-[#0B1F3A]">{app.title}</h2>
                        <p className="text-sm text-[#64748B] mt-1">{app.sub}</p>
                    </div>
                    <StatusBadge status={app.status} large />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <DetailMeta label="Type"         value={app.type} />
                    <DetailMeta label="Country"      value={app.country || 'N/A'} />
                    <DetailMeta label="Submitted"    value={app.date ? new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} />
                    <DetailMeta label="Handled by"   value="SNJ Admin Team" highlight />
                    <DetailMeta label="Last Updated" value={new Date().toLocaleDateString()} />
                    <DetailMeta label="Next Step"    value={TIMELINE_STEPS[Math.min(stepIdx + 1, TIMELINE_STEPS.length - 1)]?.label || 'Awaiting Decision'} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-5">Application Timeline</p>
                    <div className="space-y-0">
                        {TIMELINE_STEPS.map((step, idx) => {
                            const StepIcon = step.icon;
                            const done    = idx <= stepIdx;
                            const current = idx === stepIdx;
                            const isLast  = idx === TIMELINE_STEPS.length - 1;
                            return (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${current ? 'bg-[#EAB308] border-[#EAB308] shadow-lg shadow-[#EAB308]/40' : done ? 'bg-[#0B1F3A] border-[#0B1F3A]' : 'bg-white border-[#E2E8F0]'}`}>
                                            <StepIcon size={14} className={done ? 'text-white' : 'text-[#CBD5E1]'} />
                                        </div>
                                        {!isLast && <div className={`w-0.5 h-8 mt-1 ${done ? 'bg-[#0B1F3A]' : 'bg-[#E2E8F0]'}`} />}
                                    </div>
                                    <div className="pb-6">
                                        <p className={`text-sm font-bold ${done ? 'text-[#0B1F3A]' : 'text-[#CBD5E1]'}`}>{step.label}</p>
                                        {current && <p className="text-[10px] text-[#EAB308] font-semibold mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#EAB308] rounded-full animate-pulse" /> Current Stage</p>}
                                        {done && !current && <p className="text-[10px] text-green-600 font-semibold mt-0.5">Completed</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {app.note && (
                    <div className="mt-4 p-5 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-2xl relative gold-line pl-6">
                        <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-1">Admin Note</p>
                        <p className="text-sm text-[#0F172A] font-medium">{app.note}</p>
                    </div>
                )}
                <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                    <ArrowRight size={16} className="text-blue-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-blue-700">Next Step</p>
                        <p className="text-[11px] text-blue-600 mt-0.5">
                            {stepIdx < TIMELINE_STEPS.length - 1
                                ? `Awaiting: ${TIMELINE_STEPS[stepIdx + 1]?.label}. You will be notified when your status updates.`
                                : 'Your application has reached its final stage. Please contact support for further assistance.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Document Manager ───────────────────────────────────────────────────────────
const DocumentManager = ({ user, data }) => {
    const [uploading, setUploading] = useState({});
    const [docs, setDocs]           = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);

    useEffect(() => { fetchDocuments(); }, []);

    const fetchDocuments = async () => {
        setLoadingDocs(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/users/documents/${user.id}`);
            setDocs(res.data || []);
        } catch (err) {
            // endpoint may not exist yet
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleUpload = async (docType, file) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowed.includes(file.type)) return toast.error('Only JPG, PNG or PDF allowed');
        if (file.size > 5 * 1024 * 1024) return toast.error('Max file size: 5MB');

        setUploading(prev => ({ ...prev, [docType]: true }));
        const formData = new FormData();
        formData.append('document', file);
        formData.append('doc_type', docType);
        formData.append('user_id', user.id);
        try {
            await axios.post(`${BASE_URL}/api/users/documents/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(`${docType} uploaded successfully!`);
            fetchDocuments();
        } catch (err) {
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(prev => ({ ...prev, [docType]: false }));
        }
    };

    const DOC_CATEGORIES = [
        {
            title: 'Passport',
            icon: Globe,
            items: [
                { key: 'passport_main', label: 'Passport Scan (Main Page)', accept: '.jpg,.jpeg,.png,.pdf' },
                { key: 'passport_bio',  label: 'Bio Data Page',             accept: '.jpg,.jpeg,.png,.pdf' },
            ],
            meta: [
                { label: 'Passport Number', value: data?.profile?.passport_number ? '••' + data.profile.passport_number.slice(-4) : 'N/A' },
                { label: 'Country',         value: data?.profile?.nationality || 'N/A' },
            ]
        },
        {
            title: 'National ID (NID)',
            icon: CreditCard,
            items: [
                { key: 'nid_front', label: 'NID Front Side', accept: '.jpg,.jpeg,.png' },
                { key: 'nid_back',  label: 'NID Back Side',  accept: '.jpg,.jpeg,.png' },
            ],
            meta: [
                { label: 'ID Number', value: data?.profile?.nid_number ? '••••' + data.profile.nid_number.slice(-4) : 'N/A' },
            ]
        },
        {
            title: 'Supporting Documents',
            icon: FileText,
            items: [
                { key: 'cv',             label: 'CV / Resume',            accept: '.pdf,.doc,.docx' },
                { key: 'bank_statement', label: 'Bank Statement',         accept: '.pdf' },
                { key: 'certificate',    label: 'Certificates / Degrees', accept: '.pdf,.jpg,.png' },
                { key: 'photo',          label: 'Passport Size Photo',    accept: '.jpg,.jpeg,.png' },
            ],
            meta: []
        }
    ];

    const getDoc = (key) => docs.find(d => d.doc_type === key);

    const DocStatusBadge = ({ status }) => {
        const cfg = {
            verified: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Verified' },
            rejected: { color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   icon: XCircle,     label: 'Rejected' },
            uploaded: { color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200',  icon: Clock,       label: 'Pending Review' },
        }[status] || null;
        if (!cfg) return null;
        const Icon = cfg.icon;
        return (
            <span className={`flex items-center gap-1 text-[9px] font-bold uppercase border px-2 py-1 rounded-full ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                <Icon size={9} /> {cfg.label}
            </span>
        );
    };

    return (
        <div className="space-y-5 fade-up font-body">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#0B1F3A]">Identity & Documents</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                    <Shield size={11} /> Secure Storage
                </div>
            </div>

            {DOC_CATEGORIES.map((cat, ci) => {
                const CatIcon = cat.icon;
                return (
                    <div key={ci} className="glass border border-white/60 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-[#F0F4F8] flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                                <CatIcon size={14} className="text-[#EAB308]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-[#0B1F3A] uppercase tracking-wide">{cat.title}</h3>
                                <p className="text-[10px] text-[#64748B]">{cat.items.filter(i => getDoc(i.key)).length}/{cat.items.length} uploaded</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {cat.meta.length > 0 && (
                                <div className="flex flex-wrap gap-4 pb-4 border-b border-[#F0F4F8]">
                                    {cat.meta.map((m, mi) => (
                                        <div key={mi}>
                                            <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest">{m.label}</p>
                                            <p className="text-sm font-bold text-[#0B1F3A]">{m.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {cat.items.map((item, ii) => {
                                const doc = getDoc(item.key);
                                return (
                                    <div key={ii} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${doc ? 'bg-green-50 border border-green-200' : 'bg-[#E5E7EB]'}`}>
                                                <FileText size={12} className={doc ? 'text-green-500' : 'text-[#64748B]'} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-[#0B1F3A]">{item.label}</p>
                                                <p className="text-[9px] text-[#94A3B8]">Max 5MB · PDF, JPG, PNG</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc && <DocStatusBadge status={doc.status} />}
                                            <label className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-2 rounded-xl cursor-pointer transition-all ${uploading[item.key] ? 'bg-[#E5E7EB] text-[#94A3B8] cursor-not-allowed' : 'bg-[#0B1F3A] text-[#EAB308] hover:opacity-90'}`}>
                                                {uploading[item.key]
                                                    ? <><Loader size={11} className="animate-spin" /> Uploading</>
                                                    : <><Upload size={11} /> {doc ? 'Replace' : 'Upload'}</>
                                                }
                                                <input type="file" accept={item.accept} className="hidden" onChange={(e) => handleUpload(item.key, e.target.files[0])} disabled={uploading[item.key]} />
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <div className="p-4 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-2xl flex items-center gap-3">
                <AlertCircle size={14} className="text-[#0B1F3A] flex-shrink-0" />
                <p className="text-[11px] text-[#0B1F3A] font-medium">
                    Documents are reviewed by admin. Rejected documents will show a note explaining the issue.
                    Verified documents are securely stored and used for your applications.
                </p>
            </div>
        </div>
    );
};

// ─── Support Chat ───────────────────────────────────────────────────────────────
const SupportChat = ({ user, addNotification, socket }) => {
    const [msg, setMsg]           = useState('');
    const [history, setHistory]   = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sending, setSending]   = useState(false);
    const scrollRef = useRef();

    const ROOM = `chat_${Math.min(user.id, 1)}_${Math.max(user.id, 1)}`;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/users/messages/${user.id}`);
                setHistory(res.data || []);
            } catch (err) {
                console.error('Could not load messages', err);
            }
        };
        fetchMessages();

        socket.emit('join_chat', { room: ROOM });

        socket.on('receive_message', (incomingData) => {
            setHistory(prev => {
                if (prev.some(m => m.id && m.id === incomingData.id)) return prev;
                return [...prev, incomingData];
            });
            setIsTyping(false);
            if (incomingData.sender_id !== user.id) {
                addNotification?.({
                    id: Date.now(), type: 'message',
                    message: 'New message from Admin Support',
                    time: new Date(), read: false,
                });
            }
        });

        socket.on('admin_typing', () => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        });

        return () => {
            socket.off('receive_message');
            socket.off('admin_typing');
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    const handleSend = async () => {
        if (!msg.trim() || sending) return;
        const msgText = msg.trim();
        setMsg('');
        setSending(true);

        const optimistic = { sender_id: user.id, receiver_id: 1, message: msgText, created_at: new Date() };
        setHistory(prev => [...prev, optimistic]);

        try {
            await axios.post(`${BASE_URL}/api/users/messages/send`, {
                sender_id: user.id, receiver_id: 1, message: msgText
            });
            socket.emit('send_message', { room: ROOM, sender_id: user.id, receiver_id: 1, message: msgText });
        } catch (err) {
            toast.error('Message failed to send');
            setHistory(prev => prev.filter(m => m !== optimistic));
            setMsg(msgText);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const groupedHistory = history.reduce((acc, m) => {
        const date = new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(m);
        return acc;
    }, {});

    return (
        <div className="fade-up font-body">
            <div className="glass border border-white/60 rounded-[2rem] h-[620px] flex flex-col overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#0B1F3A] flex items-center gap-3 flex-shrink-0">
                    <div className="relative">
                        <div className="w-10 h-10 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-bold text-xs">AD</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-[#0B1F3A] rounded-full" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Admin Support</p>
                        <p className="text-[10px] text-[#EAB308]">SNJ GlobalRoutes</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-[10px] text-green-300 font-semibold">Online</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
                    {history.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-14 h-14 bg-[#0B1F3A]/10 rounded-2xl flex items-center justify-center mb-3">
                                <MessageSquare size={22} className="text-[#0B1F3A]" />
                            </div>
                            <p className="text-sm font-bold text-[#64748B]">Start a conversation</p>
                            <p className="text-xs text-[#94A3B8] mt-1">Our support team typically replies within minutes</p>
                        </div>
                    )}

                    {Object.entries(groupedHistory).map(([date, msgs]) => (
                        <div key={date}>
                            <div className="flex items-center gap-3 my-3">
                                <div className="flex-1 h-px bg-[#E5E7EB]" />
                                <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">{date}</span>
                                <div className="flex-1 h-px bg-[#E5E7EB]" />
                            </div>
                            <div className="space-y-2">
                                {msgs.map((m, i) => {
                                    const isUser = m.sender_id === user.id || m.sender_id === String(user.id);
                                    return (
                                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                            {!isUser && (
                                                <div className="w-7 h-7 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-bold text-[9px] mr-2 flex-shrink-0 self-end mb-1">AD</div>
                                            )}
                                            <div className={`max-w-[72%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${isUser ? 'bg-[#0B1F3A] text-[#EAB308] rounded-tr-none font-semibold' : 'bg-white text-[#0F172A] rounded-tl-none border border-[#E5E7EB] shadow-sm'}`}>
                                                {m.message}
                                                <div className={`text-[9px] mt-1 ${isUser ? 'text-[#EAB308]/60 text-right' : 'text-[#94A3B8]'}`}>
                                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start items-end gap-2">
                            <div className="w-7 h-7 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-bold text-[9px] flex-shrink-0">AD</div>
                            <div className="bg-white border border-[#E5E7EB] px-5 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                <div className="flex gap-1 items-center">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                <div className="p-4 border-t border-[#E5E7EB] flex gap-3 bg-white flex-shrink-0">
                    <input
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full px-5 py-3 text-xs text-[#0F172A] outline-none focus:border-[#0B1F3A] transition-colors"
                        placeholder="Type a message... (Enter to send)"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!msg.trim() || sending}
                        className="bg-[#0B1F3A] text-[#EAB308] p-3.5 rounded-full hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                        {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Security Settings ──────────────────────────────────────────────────────────
const SecuritySettings = ({ user, data, onRefresh }) => {
    const [tab, setTab]             = useState('password');
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [nameForm, setNameForm]   = useState({ full_name: data?.profile?.full_name || '' });
    const [loading, setLoading]     = useState(false);
    const [showPass, setShowPass]   = useState(false);
    const [strength, setStrength]   = useState(0);

    const calcStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        setStrength(score);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match!');
        if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/api/users/change-password`, {
                userId: user.id, oldPassword: passwords.old, newPassword: passwords.new
            });
            toast.success('Password updated successfully!');
            setPasswords({ old: '', new: '', confirm: '' });
            setStrength(0);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally { setLoading(false); }
    };

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        if (!nameForm.full_name.trim()) return toast.error('Name cannot be empty');
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/api/users/profile/update`, {
                userId: user.id,
                full_name: nameForm.full_name,
            });
            toast.success('Name updated!');
            onRefresh();
        } catch (err) {
            toast.error('Failed to update name');
        } finally { setLoading(false); }
    };

    const strengthConfig = [
        { label: 'Weak',   color: 'bg-red-400',   text: 'text-red-500' },
        { label: 'Fair',   color: 'bg-orange-400', text: 'text-orange-500' },
        { label: 'Good',   color: 'bg-amber-400',  text: 'text-amber-500' },
        { label: 'Strong', color: 'bg-green-400',  text: 'text-green-500' },
    ];

    const secTabs = [
        { id: 'password', label: 'Password',    icon: Lock },
        { id: 'name',     label: 'Update Name', icon: UserCircle },
    ];

    return (
        <div className="fade-up font-body space-y-5">
            <div className="glass border border-white/60 p-1.5 rounded-[1.5rem] shadow-sm flex gap-1.5">
                {secTabs.map(t => {
                    const Icon = t.icon;
                    return (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tab === t.id ? 'bg-[#0B1F3A] text-[#EAB308] shadow-md' : 'text-[#64748B] hover:bg-[#F0F4F8]'}`}>
                            <Icon size={12} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {tab === 'password' && (
                <div className="glass border border-white/60 p-8 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                            <Lock size={16} className="text-[#EAB308]" />
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-bold text-[#0B1F3A]">Change Password</h3>
                            <p className="text-[11px] text-[#64748B]">Keep your account secure</p>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
                        <PasswordField label="Current Password" value={passwords.old} show={showPass} onChange={(val) => setPasswords({ ...passwords, old: val })} />
                        <PasswordField label="New Password" value={passwords.new} show={showPass} onChange={(val) => { setPasswords({ ...passwords, new: val }); calcStrength(val); }} />
                        {passwords.new && (
                            <div>
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthConfig[strength - 1]?.color : 'bg-[#E5E7EB]'}`} />
                                    ))}
                                </div>
                                {strength > 0 && <p className={`text-[10px] font-semibold ${strengthConfig[strength - 1]?.text}`}>Password strength: {strengthConfig[strength - 1]?.label}</p>}
                            </div>
                        )}
                        <PasswordField label="Confirm New Password" value={passwords.confirm} show={showPass} onChange={(val) => setPasswords({ ...passwords, confirm: val })} />
                        {passwords.confirm && passwords.new !== passwords.confirm && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><XCircle size={11} /> Passwords do not match</p>}
                        {passwords.confirm && passwords.new === passwords.confirm && passwords.new && <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1"><CheckCircle size={11} /> Passwords match</p>}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-[#0B1F3A] hover:border-[#0B1F3A] transition-colors">
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button type="submit" disabled={loading}
                                className="flex-1 bg-[#0B1F3A] text-[#EAB308] py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
                                {loading ? <><Loader size={14} className="animate-spin" /> Updating...</> : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {tab === 'name' && (
                <div className="glass border border-white/60 p-8 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                            <UserCircle size={16} className="text-[#EAB308]" />
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-bold text-[#0B1F3A]">Update Name</h3>
                            <p className="text-[11px] text-[#64748B]">Change your display name</p>
                        </div>
                    </div>
                    <form onSubmit={handleNameUpdate} className="max-w-md space-y-4">
                        <div>
                            <label className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-2 block">Full Name</label>
                            <input type="text" value={nameForm.full_name} onChange={(e) => setNameForm({ full_name: e.target.value })} required
                                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm focus:border-[#0B1F3A] outline-none text-[#0F172A] transition-colors font-body"
                                placeholder="Your full name" />
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-[10px] text-blue-600 font-semibold">Current name: <span className="text-blue-800">{data?.profile?.full_name || 'Not set'}</span></p>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-[#0B1F3A] text-[#EAB308] py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? <><Loader size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Name</>}
                        </button>
                    </form>
                </div>
            )}

            <div className="glass border border-white/60 p-6 rounded-[2rem] shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-4">Security Tips</p>
                <div className="space-y-3">
                    {[
                        'Use a strong password with uppercase letters, numbers & symbols',
                        'Never share your account credentials with anyone',
                        'Contact support immediately if you notice any suspicious activity',
                        'Update your password regularly for better security',
                    ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle size={11} className="text-green-500" />
                            </div>
                            <p className="text-xs text-[#64748B]">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Reusable UI Components ─────────────────────────────────────────────────────
const StatusBadge = ({ status, large }) => {
    const st = getStatus(status);
    return (
        <span className={`inline-flex items-center gap-1.5 font-body font-bold uppercase border rounded-full ${large ? 'px-4 py-2 text-[11px]' : 'px-3 py-1 text-[9px]'} ${st.color} ${st.bg} ${st.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
        </span>
    );
};

const DetailMeta = ({ label, value, highlight }) => (
    <div className="p-3 bg-[#F8FAFC] rounded-xl font-body">
        <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-bold mt-0.5 ${highlight ? 'text-[#EAB308]' : 'text-[#0B1F3A]'}`}>{value}</p>
    </div>
);

const PasswordField = ({ label, value, onChange, show }) => (
    <div className="font-body">
        <label className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-2 block">{label}</label>
        <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm focus:border-[#0B1F3A] outline-none text-[#0F172A] transition-colors"
        />
    </div>
);

export default UserProfile;