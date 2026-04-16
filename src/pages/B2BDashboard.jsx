import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const API_BASE        = 'http://localhost:5000';
const AUTO_REFRESH_MS = 10_000;

// ─── REGION MAPPER ────────────────────────────────────────────────────────────
const ASIAN_CODES   = new Set(['BD','IN','PK','LK','NP','MV','BT','AF','MM','TH','MY','SG','ID','PH','VN','KH','LA','BN','TL','JP','CN','KR','TW','HK','MO','MN','AE','SA','QA','KW','BH','OM','JO','LB','IL','TR','IR','IQ','YE','SY','KZ','UZ','KG','TJ','TM','AZ','GE','AM']);
const EUROPE_CODES  = new Set(['GB','DE','FR','IT','ES','NL','BE','SE','NO','DK','FI','CH','AT','PL','CZ','HU','RO','GR','PT','IE','UA','RU','AL','RS','ME','MK','MD','BY','CY']);
const OCEANIA_CODES = new Set(['AU','NZ','PG','FJ']);
const AFRICA_CODES  = new Set(['ZA','NG','KE','GH','ET','EG','MA','TZ','UG','SN','CI','CM','AO','MZ','ZM','ZW','TN','DZ','LY','SD']);

const getRegion = (code = '') => {
    const c = code.toUpperCase();
    if (ASIAN_CODES.has(c))   return 'Asia';
    if (EUROPE_CODES.has(c))  return 'Europe';
    if (OCEANIA_CODES.has(c)) return 'Oceania';
    if (AFRICA_CODES.has(c))  return 'Africa';
    return 'Americas';
};

const mapPricingRow = (row) => ({
    id:      row.id,
    region:  getRegion(row.country_code),
    country: row.country,
    flag:    (row.country_code || '').toLowerCase(),
    type:    row.visa_type       || '—',
    time:    row.processing_time || '—',
    b2b:     row.b2b_price != null ? `$${parseFloat(row.b2b_price).toFixed(2)} USD` : '—',
    b2c:     row.b2c_price != null ? `$${parseFloat(row.b2c_price).toFixed(2)} USD` : '—',
    working: row.working_type    || '—',
    status:  row.status,
});

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusConfig = {
    pending:    { label: 'Pending',    icon: '⏳' },
    processing: { label: 'Processing', icon: '🔄' },
    confirmed:  { label: 'Confirmed',  icon: '⭐' },
    completed:  { label: 'Completed',  icon: '✅' },
    rejected:   { label: 'Rejected',   icon: '✗'  },
};

const fileStatusColors = {
    pending:    { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    confirmed:  { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe' },
    completed:  { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    rejected:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const networkOffices = [
    { city: 'Dhaka',        country: 'Bangladesh',     role: 'Head Office',    flag: '🇧🇩', active: true  },
    { city: 'Kuala Lumpur', country: 'Malaysia',       role: 'Asia Hub',       flag: '🇲🇾', active: true  },
    { city: 'Warsaw',       country: 'Poland',         role: 'Europe Liaison', flag: '🇵🇱', active: true  },
    { city: 'London',       country: 'United Kingdom', role: 'UK Office',      flag: '🇬🇧', active: true  },
    { city: 'Dubai',        country: 'UAE',            role: 'Middle East',    flag: '🇦🇪', active: false },
    { city: 'Berlin',       country: 'Germany',        role: 'DE Operations',  flag: '🇩🇪', active: true  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Footer = () => (
    <footer style={{ background: '#0B1F3A', borderRadius: 18, padding: '22px 28px', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: '#EAB308', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0B1F3A', fontSize: 11 }}>SG</div>
                <div>
                    <div style={{ color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>SNJ GlobalRoutes</div>
                    <div style={{ color: '#EAB308', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>B2B Partner Portal · Official</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', flexWrap: 'wrap' }}>
                <span>© 2026 SNJ GlobalRoutes</span>
                <a href="https://wa.me/8801348992268" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>WhatsApp</a>
                <a href="mailto:partners@snjglobal.com" style={{ color: '#64748b', textDecoration: 'none' }}>Email</a>
                <span style={{ color: '#374151' }}>Engineered by JM-IT Studio</span>
            </div>
        </div>
    </footer>
);

const StatusBadge = ({ status }) => {
    const s = statusConfig[status] || { label: status, icon: '•' };
    const c = fileStatusColors[status] || { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 10, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, border: `1px solid ${c.border}`, background: c.bg, color: c.color }}>
            {s.icon} {s.label}
        </span>
    );
};

const LoadingSpinner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #f1f5f9', borderTop: '3px solid #EAB308', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Loading from server…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const ErrorBox = ({ message }) => (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '18px 22px', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
        ⚠ Could not load data: {message}
    </div>
);

const RefreshBadge = ({ time, refreshing }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: refreshing ? '#EAB308' : '#22c55e', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        {refreshing ? 'Refreshing…' : `Updated ${time}`}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

// ─── FILE DETAILS MODAL ───────────────────────────────────────────────────────
const FileDetailsModal = ({ file, onClose }) => {
    if (!file) return null;

    const sc = fileStatusColors[file.status] || { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    const st = statusConfig[file.status]     || { label: file.status, icon: '•' };

    const details = [
        { icon: '👤', label: 'Client Name',     value: file.client_name    },
        { icon: '🛂', label: 'Passport No.',    value: file.passport_number },
        { icon: '📞', label: 'Contact Number',  value: file.contact_number  },
        { icon: '✉️', label: 'Email',           value: file.email           },
        { icon: '🌍', label: 'Nationality',     value: file.nationality     },
        { icon: '🏠', label: 'Address',         value: file.address         },
        { icon: '🎯', label: 'Service Type',    value: file.service         },
        { icon: '📅', label: 'Submitted At',    value: file.submitted_date  },
        { icon: '🔁', label: 'Last Updated',    value: file.updated_at      },
    ];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(11,31,58,0.65)',
                backdropFilter: 'blur(4px)', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 22, width: '100%', maxWidth: 520,
                    boxShadow: '0 32px 80px rgba(11,31,58,0.35)',
                    overflow: 'hidden', animation: 'modalIn 0.22s ease',
                }}
            >
                {/* Modal Header */}
                <div style={{ background: '#0B1F3A', padding: '22px 26px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, background: 'rgba(234,179,8,0.08)', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                        <div>
                            <div style={{ color: '#EAB308', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>File Details</div>
                            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>{file.client_name}</div>
                            <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 3 }}>ID: #{file.id} · {file.service}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                            <button
                                onClick={onClose}
                                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >✕</button>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 10, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', border: `1px solid ${sc.border}`, background: sc.bg, color: sc.color }}>
                                {st.icon} {st.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '20px 26px 26px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {details.map((d, i) => (
                            <div key={i} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{d.icon}</span>
                                <div>
                                    <div style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8' }}>{d.label}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A', marginTop: 2, wordBreak: 'break-word' }}>{d.value || '—'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
        </div>
    );
};

// ─── STATUS CHANGE DROPDOWN ───────────────────────────────────────────────────
const StatusChanger = ({ file, onUpdate, updating }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const options = ['pending', 'processing', 'confirmed', 'completed', 'rejected'];

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                disabled={updating}
                title="Change Status"
                style={{
                    width: 34, height: 34, borderRadius: 9,
                    border: '1px solid #e2e8f0',
                    background: open ? '#0B1F3A' : '#f8fafc',
                    color: open ? '#EAB308' : '#64748b',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    opacity: updating ? 0.5 : 1,
                }}
            >
                {updating ? '⏳' : '✏️'}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', right: 0, top: 40, zIndex: 100,
                    background: '#fff', borderRadius: 14, boxShadow: '0 12px 40px rgba(11,31,58,0.18)',
                    border: '1px solid #f1f5f9', overflow: 'hidden', minWidth: 160,
                    animation: 'modalIn 0.15s ease',
                }}>
                    <div style={{ padding: '8px 12px 6px', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                        Change Status
                    </div>
                    {options.map((opt) => {
                        const c  = fileStatusColors[opt] || {};
                        const st = statusConfig[opt]     || {};
                        const isActive = opt === file.status;
                        return (
                            <button
                                key={opt}
                                onClick={() => { onUpdate(file.id, opt); setOpen(false); }}
                                disabled={isActive}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '9px 12px', border: 'none', cursor: isActive ? 'default' : 'pointer',
                                    background: isActive ? c.bg : 'transparent',
                                    fontFamily: '"Times New Roman", serif', textAlign: 'left',
                                    transition: 'background 0.1s',
                                    borderBottom: '1px solid #f8fafc',
                                }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span style={{ fontSize: 11 }}>{st.icon}</span>
                                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: isActive ? c.color : '#374151' }}>
                                    {st.label}
                                </span>
                                {isActive && (
                                    <span style={{ marginLeft: 'auto', fontSize: 9, color: c.color }}>✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const B2BDashboard = () => {
    const [activeTab,    setActiveTab]    = useState('overview');
    const [searchTerm,   setSearchTerm]   = useState('');
    const [filterRegion, setFilterRegion] = useState('All');

    // ── Data state ────────────────────────────────────────────────────────────
    const [partner,     setPartner]     = useState(null);
    const [pricingData, setPricingData] = useState([]);
    const [clientFiles, setClientFiles] = useState([]);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [loading,      setLoading]      = useState(true);
    const [refreshing,   setRefreshing]   = useState(false);
    const [error,        setError]        = useState(null);
    const [lastUpdated,  setLastUpdated]  = useState('');
    const [selectedFile, setSelectedFile] = useState(null);   // details modal
    const [updatingId,   setUpdatingId]   = useState(null);   // status update spinner

    const navigate    = useNavigate();
    const intervalRef = useRef(null);

    // ── Fetch all dashboard data ───────────────────────────────────────────────
    const fetchAll = async (isBackground = false) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login', { replace: true }); return; }

        if (isBackground) setRefreshing(true);
        else              setLoading(true);

        const headers = {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const [profileRes, pricingRes, filesRes] = await Promise.all([
                fetch(`${API_BASE}/api/b2b/dashboard/profile`, { headers }).then(r => r.json()),
                fetch(`${API_BASE}/api/b2b/dashboard/pricing`,  { headers }).then(r => r.json()),
                fetch(`${API_BASE}/api/b2b/dashboard/files`,    { headers }).then(r => r.json()),
            ]);

            if (profileRes.success && profileRes.data) {
                setPartner(profileRes.data);
                setError(null);
            } else {
                if (profileRes.message?.toLowerCase().includes('token')) {
                    localStorage.removeItem('token');
                    navigate('/login', { replace: true });
                    return;
                }
                setError(profileRes.message || 'Failed to load profile');
            }

            if (pricingRes.success && Array.isArray(pricingRes.data)) {
                setPricingData(pricingRes.data.map(mapPricingRow));
            }

            if (filesRes.success && Array.isArray(filesRes.data)) {
                setClientFiles(filesRes.data);
            }

            const now = new Date();
            setLastUpdated(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

        } catch (err) {
            if (!isBackground) setError(err.message || 'Network error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchAll(false); }, []);
    useEffect(() => {
        intervalRef.current = setInterval(() => fetchAll(true), AUTO_REFRESH_MS);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleRefresh = () => fetchAll(true);

    const handleLogout = () => {
        clearInterval(intervalRef.current);
        ['token', 'role', 'source', 'user'].forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
        window.dispatchEvent(new Event('authChange'));
        navigate('/login', { replace: true });
    };

    // ── Status update ─────────────────────────────────────────────────────────
    const handleStatusChange = async (taskId, newStatus) => {
        setUpdatingId(taskId);
        try {
            const response = await fetch(`${API_BASE}/api/b2b/dashboard/files/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ taskId, newStatus }),
            });
            const resData = await response.json();
            if (resData.success) {
                // Optimistic UI update
                setClientFiles(prev =>
                    prev.map(f => f.id === taskId ? { ...f, status: newStatus, stage: newStatus } : f)
                );
                // Also refresh in background for trigger side-effects (num_files, total_completed)
                fetchAll(true);
            } else {
                alert(resData.message || 'Status update failed');
            }
        } catch (err) {
            console.error('Update failed', err);
            alert('Network error. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    // ── Pricing filter ────────────────────────────────────────────────────────
    const regions = ['All', 'Asia', 'Europe', 'Oceania', 'Americas', 'Africa'];
    const filteredPricing = pricingData.filter(p =>
        (filterRegion === 'All' || p.region === filterRegion) &&
        (
            p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type.toLowerCase().includes(searchTerm.toLowerCase())    ||
            p.region.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // ── Safe partner values ───────────────────────────────────────────────────
    const partnerName     = partner?.name          || '…';
    const partnerContact  = partner?.contact       || '…';
    const partnerEmail    = partner?.email         || '…';
    const partnerCompany  = partner?.company       || '…';
    const partnerCountry  = partner?.country       || '…';
    const partnerTier     = partner?.tier          || '—';
    const partnerValid    = partner?.validUntil    || '—';
    const totalFiles      = partner?.totalFiles    ?? 0;
    const activeFiles     = partner?.activeFiles   ?? 0;
    const completedFiles  = partner?.completedFiles ?? 0;
    const successRate     = partner?.successRate   ?? 0;

    // ── File status counts (from live clientFiles array) ──────────────────────
    const fileStats = Object.keys(statusConfig).reduce((acc, k) => {
        acc[k] = clientFiles.filter(f => f.status === k).length;
        return acc;
    }, {});

    const navItems = [
        { id: 'overview', icon: '🏠', label: 'Overview'        },
        { id: 'profile',  icon: '🏢', label: 'Company Profile' },
        { id: 'pricing',  icon: '🌐', label: 'B2B Pricing'     },
        { id: 'files',    icon: '📄', label: 'My Files'        },
        { id: 'why',      icon: '⭐', label: 'Why Choose Us'   },
        { id: 'payment',  icon: '💳', label: 'Payment'         },
        { id: 'network',  icon: '👥', label: 'Network'         },
        { id: 'support',  icon: '🎧', label: 'Support'         },
    ];

    const s = { fontFamily: '"Times New Roman", serif' };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#F0F4F8', overflow: 'hidden', ...s }}>

            {/* ── FILE DETAILS MODAL ────────────────────────────────────────── */}
            <FileDetailsModal file={selectedFile} onClose={() => setSelectedFile(null)} />

            {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
            <aside style={{ width: 240, background: '#0B1F3A', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, background: '#EAB308', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0B1F3A', fontSize: 13, flexShrink: 0 }}>SG</div>
                    <div>
                        <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>SNJ Global</div>
                        <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>B2B Partner</div>
                    </div>
                </div>

                <div style={{ margin: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
                    <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{partnerName}</div>
                    <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 2 }}>{partnerContact} · {partnerCountry}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <span style={{ background: '#EAB308', color: '#0B1F3A', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20, letterSpacing: 1 }}>{partnerTier}</span>
                        {partner?.is_verified === 1 && (
                            <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 20 }}>✓</span>
                        )}
                    </div>
                </div>

                <nav style={{ flex: 1, padding: 8, overflowY: 'auto' }}>
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontFamily: '"Times New Roman", serif', fontSize: 10, fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2, textAlign: 'left',
                                transition: 'all 0.15s',
                                background: activeTab === item.id ? '#EAB308' : 'transparent',
                                color:      activeTab === item.id ? '#0B1F3A' : '#94a3b8',
                            }}
                        >
                            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#f87171', fontFamily: '"Times New Roman", serif', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* ── MAIN ─────────────────────────────────────────────────────── */}
            <main style={{ flex: 1, overflowY: 'auto', background: '#F0F4F8' }}>

                {/* TOPBAR */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 1 }}>
                            {navItems.find(n => n.id === activeTab)?.label}
                        </div>
                        <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>
                            SNJ GlobalRoutes — B2B Partner Portal
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {lastUpdated && <RefreshBadge time={lastUpdated} refreshing={refreshing} />}
                        <button onClick={handleRefresh} disabled={refreshing}
                            style={{ width: 36, height: 36, background: refreshing ? '#f1f5f9' : '#fffbeb', border: '1px solid #fef3c7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: refreshing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                            title="Refresh data">🔄</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', padding: '5px 12px', borderRadius: 10 }}>
                            <div style={{ width: 7, height: 7, background: '#EAB308', borderRadius: '50%' }} />
                            <span style={{ color: '#0B1F3A', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, fontFamily: '"Times New Roman", serif' }}>{partnerTier}</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '24px 28px' }}>

                    {loading && <LoadingSpinner />}
                    {!loading && error && <ErrorBox message={error} />}

                    {/* ── OVERVIEW ─────────────────────────────────────────── */}
                    {!loading && !error && activeTab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Banner */}
                            <div style={{ background: '#0B1F3A', borderRadius: 18, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(234,179,8,0.08)', borderRadius: '50%' }} />
                                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Welcome Back</div>
                                        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{partnerName}</div>
                                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{partnerContact} · {partnerCountry}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                                            <span style={{ background: '#EAB308', color: '#0B1F3A', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20, letterSpacing: 1 }}>{partnerTier}</span>
                                            <span style={{ color: '#94a3b8', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Valid Until: {partnerValid}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        {[{ label: 'Total', value: totalFiles }, { label: 'Active', value: activeFiles }, { label: 'Done', value: completedFiles }].map((st, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 18px', textAlign: 'center', minWidth: 70 }}>
                                                <div style={{ color: '#EAB308', fontSize: 22, fontWeight: 900 }}>{st.value}</div>
                                                <div style={{ color: '#94a3b8', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{st.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Stats — dynamic from assigned_tasks */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                                {[
                                    { label: 'Total Files',  value: totalFiles,          icon: '📦', bg: '#0B1F3A', tc: '#fff',    sc: 'rgba(255,255,255,0.65)' },
                                    { label: 'Active Files', value: activeFiles,          icon: '⏱',  bg: '#EAB308', tc: '#0B1F3A', sc: 'rgba(11,31,58,0.65)'    },
                                    { label: 'Completed',    value: completedFiles,       icon: '✅', bg: '#22c55e', tc: '#fff',    sc: 'rgba(255,255,255,0.65)' },
                                    { label: 'Success Rate', value: `${successRate}%`,    icon: '📈', bg: '#7c3aed', tc: '#fff',    sc: 'rgba(255,255,255,0.65)' },
                                ].map((st, i) => (
                                    <div key={i} style={{ background: st.bg, borderRadius: 16, padding: 20 }}>
                                        <div style={{ fontSize: 18, opacity: 0.6, marginBottom: 8 }}>{st.icon}</div>
                                        <div style={{ fontSize: 28, fontWeight: 900, color: st.tc }}>{st.value}</div>
                                        <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: st.sc, marginTop: 2 }}>{st.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Why trust */}
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Why Partners Trust SNJ</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                                    {[
                                        { icon: '💰', title: 'Exclusive B2B Rates', sub: 'Up to 30% savings'   },
                                        { icon: '⚡', title: 'Priority Processing',  sub: 'Front of the queue'  },
                                        { icon: '🛡', title: '99% Success Rate',     sub: 'Expert handling'     },
                                        { icon: '👤', title: 'Dedicated Support',    sub: 'Your account manager'},
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 16 }}>
                                            <div style={{ width: 38, height: 38, background: 'rgba(234,179,8,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 10 }}>{item.icon}</div>
                                            <div style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.title}</div>
                                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{item.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Files */}
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2 }}>Recent Files</span>
                                    <button onClick={() => setActiveTab('files')} style={{ color: '#EAB308', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Times New Roman", serif', letterSpacing: 1 }}>View All →</button>
                                </div>
                                {clientFiles.length === 0 ? (
                                    <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No files yet</div>
                                ) : clientFiles.slice(0, 4).map((f, i) => (
                                    <div key={f.id || i} style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A' }}>{f.client_name}</div>
                                            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{f.service} · #{f.id}</div>
                                        </div>
                                        <StatusBadge status={f.status} />
                                    </div>
                                ))}
                            </div>

                            <Footer />
                        </div>
                    )}

                    {/* ── PROFILE ──────────────────────────────────────────── */}
                    {!loading && !error && activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, overflow: 'hidden' }}>
                                <div style={{ background: '#0B1F3A', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(234,179,8,0.08)', borderRadius: '50%' }} />
                                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 18 }}>
                                        <div style={{ width: 80, height: 80, background: '#EAB308', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#0B1F3A', border: '3px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
                                            {partnerName.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>B2B Partner Account</div>
                                            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>{partnerName}</div>
                                            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{partnerContact}</div>
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                <span style={{ background: '#EAB308', color: '#0B1F3A', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20 }}>{partnerTier}</span>
                                                {partner?.is_verified === 1 && (
                                                    <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20 }}>✓ Verified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {[
                                        { label: 'Company Name',       value: partnerCompany,           icon: '🏢' },
                                        { label: 'Contact Person',      value: partnerName,              icon: '👤' },
                                        { label: 'Phone Number',        value: partnerContact,           icon: '📞' },
                                        { label: 'Email Address',       value: partnerEmail,             icon: '✉️' },
                                        { label: 'Country',             value: partnerCountry,           icon: '🌐' },
                                        { label: 'Purpose',             value: partner?.purpose || '—',  icon: '🎯' },
                                        { label: 'Account Valid Until', value: partnerValid,             icon: '🏅' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 14, color: '#EAB308', flexShrink: 0 }}>{item.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8' }}>{item.label}</div>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A', marginTop: 2 }}>{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                                {[
                                    { label: 'Total Files',  value: totalFiles,          sub: 'All time'               },
                                    { label: 'Active Files', value: activeFiles,          sub: 'In progress'            },
                                    { label: 'Completed',    value: completedFiles,       sub: 'Successfully processed' },
                                ].map((st, i) => (
                                    <div key={i} style={{ background: '#0B1F3A', borderRadius: 18, padding: 28, textAlign: 'center' }}>
                                        <div style={{ color: '#EAB308', fontSize: 36, fontWeight: 900 }}>{st.value}</div>
                                        <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{st.label}</div>
                                        <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4 }}>{st.sub}</div>
                                    </div>
                                ))}
                            </div>
                            <Footer />
                        </div>
                    )}

                    {/* ── B2B PRICING ──────────────────────────────────────── */}
                    {activeTab === 'pricing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ background: '#0B1F3A', borderRadius: 18, padding: '22px 26px' }}>
                                <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 5 }}>Exclusive Partner Rates</div>
                                <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>B2B Pricing Table</div>
                                <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 16 }}>
                                    Confidential rates for authorized partners only.
                                    {pricingData.length > 0 && <span style={{ color: '#EAB308', marginLeft: 8 }}>({pricingData.length} countries loaded)</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                                    {regions.map(r => (
                                        <button key={r} onClick={() => setFilterRegion(r)}
                                            style={{
                                                padding: '5px 14px', borderRadius: 20, fontSize: 9, fontWeight: 900,
                                                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                                                fontFamily: '"Times New Roman", serif', transition: 'all 0.1s',
                                                background: filterRegion === r ? '#EAB308' : 'transparent',
                                                color:      filterRegion === r ? '#0B1F3A' : '#fff',
                                                border:     filterRegion === r ? '1px solid #EAB308' : '1px solid rgba(255,255,255,0.2)',
                                            }}
                                        >{r}</button>
                                    ))}
                                </div>
                                <input type="text" placeholder="Search country, visa type or region..."
                                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', maxWidth: 320, padding: '9px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 12, fontFamily: '"Times New Roman", serif', outline: 'none' }}
                                />
                            </div>

                            {loading ? <LoadingSpinner /> : (
                                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, overflow: 'hidden' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                                    {['Country','Visa Type','Working Type','B2B Price','B2C Price','Processing Time','Region','Status'].map(h => (
                                                        <th key={h} style={{ textAlign: 'left', padding: '14px 14px', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPricing.length === 0 ? (
                                                    <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No results found.</td></tr>
                                                ) : filteredPricing.map((row, i) => (
                                                    <tr key={row.id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                        <td style={{ padding: '12px 14px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                <img src={`https://flagcdn.com/w40/${row.flag}.png`} alt={row.country}
                                                                    style={{ width: 28, height: 18, objectFit: 'cover', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                                                                    onError={e => e.target.style.display = 'none'} />
                                                                <span style={{ fontWeight: 700, color: '#0B1F3A', fontSize: 12, whiteSpace: 'nowrap' }}>{row.country}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px 14px', fontSize: 11, color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.type}</td>
                                                        <td style={{ padding: '12px 14px', fontSize: 10, color: '#64748b', fontStyle: 'italic' }}>{row.working}</td>
                                                        <td style={{ padding: '12px 14px', fontWeight: 900, color: '#0B1F3A', fontSize: 12, whiteSpace: 'nowrap' }}>{row.b2b}</td>
                                                        <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: 11, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{row.b2c}</td>
                                                        <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>⏱ {row.time}</td>
                                                        <td style={{ padding: '12px 14px' }}>
                                                            <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 20 }}>{row.region}</span>
                                                        </td>
                                                        <td style={{ padding: '12px 14px' }}>
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                                                background: row.status === 'active' ? '#f0fdf4' : row.status === 'inactive' ? '#fef2f2' : '#fffbeb',
                                                                color: row.status === 'active' ? '#15803d' : row.status === 'inactive' ? '#dc2626' : '#b45309',
                                                                border: `1px solid ${row.status === 'active' ? '#bbf7d0' : row.status === 'inactive' ? '#fecaca' : '#fde68a'}`,
                                                                fontSize: 9, fontWeight: 900, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 20,
                                                            }}>
                                                                {row.status === 'active' ? '✓' : row.status === 'inactive' ? '✗' : '⏳'} {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '4px 0' }}>
                                Note: VFSGlobal Charge + Slot Appointment fee (1 lac BDT) applies if applicant has real documents.
                            </div>
                            <Footer />
                        </div>
                    )}

                    {/* ── MY FILES ─────────────────────────────────────────── */}
                    {activeTab === 'files' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Status summary pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {Object.entries(statusConfig).map(([k, v]) => {
                                    const c = fileStatusColors[k];
                                    return (
                                        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 10, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', border: `1px solid ${c.border}`, background: c.bg, color: c.color }}>
                                            {v.icon} {v.label}: {fileStats[k] || 0}
                                        </span>
                                    );
                                })}
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 10, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151' }}>
                                    📦 Total: {clientFiles.length}
                                </span>
                            </div>

                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, overflow: 'hidden' }}>
                                {/* Table header */}
                                <div style={{ padding: '14px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                                    <span style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2 }}>All Client Files & Status Tracker</span>
                                    <div style={{ display: 'flex', gap: 6, fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        <span>👁 = View Details</span>
                                        <span style={{ color: '#e2e8f0' }}>|</span>
                                        <span>✏️ = Change Status</span>
                                    </div>
                                </div>

                                {clientFiles.length === 0 ? (
                                    <div style={{ padding: '48px 22px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 56, height: 56, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
                                        <div style={{ color: '#0B1F3A', fontWeight: 700, fontSize: 14 }}>No files submitted yet</div>
                                        <div style={{ color: '#94a3b8', fontSize: 12 }}>Files assigned to you will appear here with real-time status updates</div>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                                    {['#', 'Client Name', 'Service', 'Passport No.', 'Submitted', 'Status', 'Actions'].map(h => (
                                                        <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clientFiles.map((f, i) => (
                                                    <tr key={f.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {/* Row number */}
                                                        <td style={{ padding: '14px 16px', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{i + 1}</td>

                                                        {/* Client name */}
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                <div style={{ width: 32, height: 32, background: 'rgba(234,179,8,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, color: '#b45309', fontWeight: 900 }}>
                                                                    {(f.client_name || '?').slice(0, 1).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A', whiteSpace: 'nowrap' }}>{f.client_name}</div>
                                                                    <div style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginTop: 1 }}>#{f.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Service */}
                                                        <td style={{ padding: '14px 16px', fontSize: 11, color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>{f.service}</td>

                                                        {/* Passport */}
                                                        <td style={{ padding: '14px 16px', fontSize: 11, color: '#64748b', fontFamily: 'monospace', letterSpacing: 0.5 }}>{f.passport_number}</td>

                                                        {/* Submitted date */}
                                                        <td style={{ padding: '14px 16px', fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{f.submitted_date}</td>

                                                        {/* Status badge */}
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <StatusBadge status={f.status} />
                                                        </td>

                                                        {/* Actions: view + status change */}
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                {/* View Details Button */}
                                                                <button
                                                                    onClick={() => setSelectedFile(f)}
                                                                    title="View Details"
                                                                    style={{
                                                                        width: 34, height: 34, borderRadius: 9,
                                                                        border: '1px solid #e2e8f0', background: '#f8fafc',
                                                                        color: '#64748b', cursor: 'pointer', fontSize: 14,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        transition: 'all 0.15s',
                                                                    }}
                                                                    onMouseEnter={e => { e.currentTarget.style.background = '#0B1F3A'; e.currentTarget.style.color = '#EAB308'; e.currentTarget.style.borderColor = '#0B1F3A'; }}
                                                                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                                >👁</button>

                                                                {/* Status Changer */}
                                                                <StatusChanger
                                                                    file={f}
                                                                    onUpdate={handleStatusChange}
                                                                    updating={updatingId === f.id}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <Footer />
                        </div>
                    )}

                    {/* ── WHY CHOOSE US ────────────────────────────────────── */}
                    {activeTab === 'why' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ background: '#0B1F3A', borderRadius: 18, padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: -40, left: -40, width: 180, height: 180, background: 'rgba(234,179,8,0.08)', borderRadius: '50%' }} />
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Partner Benefits</div>
                                    <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>Why Partner With <em style={{ color: '#EAB308' }}>SNJ GlobalRoutes?</em></div>
                                    <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 8, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>Join 200+ agencies worldwide who trust SNJ GlobalRoutes for their clients' immigration and visa needs.</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                                {[
                                    { icon: '💰', title: 'Exclusive B2B Rates',  desc: 'Up to 30% lower than retail pricing for all partner agencies.' },
                                    { icon: '⚡', title: 'Priority Processing',   desc: "Your clients' files go to the front of the queue every time."  },
                                    { icon: '🛡', title: '99% Success Rate',      desc: 'Backed by a decade of professional immigration expertise.'      },
                                    { icon: '👤', title: 'Dedicated Support',     desc: 'A dedicated account manager assigned to your agency.'          },
                                    { icon: '🌐', title: '40+ Countries',         desc: 'Comprehensive coverage across Europe, Asia and beyond.'        },
                                    { icon: '📊', title: 'Real-time Tracking',    desc: 'Live status updates for every file you submit.'                },
                                ].map((item, i) => (
                                    <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, padding: 22 }}>
                                        <div style={{ width: 44, height: 44, background: 'rgba(234,179,8,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>{item.icon}</div>
                                        <div style={{ fontSize: 11, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{item.title}</div>
                                        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                                {[{ value: '10K+', label: 'Clients Processed', sub: 'Globally' }, { value: '200+', label: 'Partner Agencies', sub: 'Worldwide' }, { value: '40+', label: 'Countries Covered', sub: 'Europe & Asia' }].map((st, i) => (
                                    <div key={i} style={{ background: '#0B1F3A', borderRadius: 18, padding: 28, textAlign: 'center' }}>
                                        <div style={{ color: '#EAB308', fontSize: 36, fontWeight: 900 }}>{st.value}</div>
                                        <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{st.label}</div>
                                        <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4 }}>{st.sub}</div>
                                    </div>
                                ))}
                            </div>
                            <Footer />
                        </div>
                    )}

                    {/* ── PAYMENT ──────────────────────────────────────────── */}
                    {activeTab === 'payment' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                                {[
                                    { label: 'Total Paid',      value: '$0', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
                                    { label: 'Pending Payment', value: '$0', bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
                                    { label: 'Credit Balance',  value: '$0', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
                                ].map((st, i) => (
                                    <div key={i} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: 16, padding: 20 }}>
                                        <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b' }}>{st.label}</div>
                                        <div style={{ fontSize: 26, fontWeight: 900, color: st.color, marginTop: 6 }}>{st.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, padding: 22 }}>
                                <div style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Make a Payment</div>
                                <div style={{ maxWidth: 520 }}>
                                    {[{ label: 'Payment Amount (USD)', type: 'number', placeholder: 'Enter amount' }, { label: 'Payment Reference (File ID)', type: 'text', placeholder: 'e.g. SNJ-2024-001' }].map((f, i) => (
                                        <div key={i} style={{ marginBottom: 14 }}>
                                            <label style={{ display: 'block', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0B1F3A', marginBottom: 6, fontFamily: '"Times New Roman", serif' }}>{f.label}</label>
                                            <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontFamily: '"Times New Roman", serif', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                    ))}
                                    <div style={{ background: '#0B1F3A', borderRadius: 16, padding: 22, marginTop: 8 }}>
                                        <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Payment Gateway — Stripe</div>
                                        <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>Stripe payment gateway will be integrated here. Contact SNJ admin to activate.</div>
                                        <button style={{ width: '100%', background: '#EAB308', color: '#0B1F3A', border: 'none', padding: 13, borderRadius: 12, fontWeight: 900, textTransform: 'uppercase', fontSize: 12, fontFamily: '"Times New Roman", serif', letterSpacing: 1, cursor: 'pointer', marginTop: 14 }}>
                                            💳 Proceed to Stripe Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    )}

                    {/* ── NETWORK ──────────────────────────────────────────── */}
                    {activeTab === 'network' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ background: '#0B1F3A', borderRadius: 18, padding: '28px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(234,179,8,0.08)', borderRadius: '50%' }} />
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>SNJ Global Network</div>
                                    <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>Our Global Presence</div>
                                    <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Offices across Europe, Middle East & Asia Pacific.</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                                {networkOffices.map((o, i) => (
                                    <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, padding: 22 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <span style={{ fontSize: 28 }}>{o.flag}</span>
                                            <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, background: o.active ? '#f0fdf4' : '#fffbeb', color: o.active ? '#15803d' : '#b45309' }}>{o.active ? 'Active' : 'Expanding'}</span>
                                        </div>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase' }}>{o.city}</div>
                                        <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1, marginTop: 2 }}>{o.country}</div>
                                        <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{o.role}</div>
                                    </div>
                                ))}
                            </div>
                            <Footer />
                        </div>
                    )}

                    {/* ── SUPPORT ──────────────────────────────────────────── */}
                    {activeTab === 'support' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 18, padding: 22 }}>
                                    <div style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 18 }}>Direct Contact</div>
                                    {[
                                        { href: 'https://wa.me/8801348992268', icon: '📱', label: 'WhatsApp — Instant Support', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
                                        { href: 'tel:+8801348992268',           icon: '📞', label: '+880 1348-992268',          bg: 'rgba(11,31,58,0.05)', border: 'rgba(11,31,58,0.1)', color: '#0B1F3A' },
                                        { href: 'mailto:partners@snjglobal.com', icon: '✉️', label: 'partners@snjglobal.com',  bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
                                    ].map((c, i) => (
                                        <a key={i} href={c.href} target={c.href.startsWith('https') ? '_blank' : undefined} rel="noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: 'none', marginBottom: 8, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontFamily: '"Times New Roman", serif' }}>
                                            {c.icon} {c.label}
                                        </a>
                                    ))}
                                </div>
                                <div style={{ background: '#0B1F3A', borderRadius: 18, padding: 22 }}>
                                    <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Office Hours</div>
                                    {[
                                        { day: 'Sunday – Thursday', hours: '9:00 AM – 6:00 PM', closed: false },
                                        { day: 'Friday',            hours: '9:00 AM – 1:00 PM', closed: false },
                                        { day: 'Saturday',          hours: 'Closed',             closed: true  },
                                    ].map((h, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none', fontSize: 13 }}>
                                            <span style={{ color: '#94a3b8' }}>{h.day}</span>
                                            <span style={{ color: h.closed ? '#f87171' : '#fff', fontWeight: 700 }}>{h.hours}</span>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 14, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 12, padding: 12 }}>
                                        <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Emergency WhatsApp Support Available 24/7</div>
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default B2BDashboard;