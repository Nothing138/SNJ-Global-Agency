import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── CONFIG ───────────────────────────────────────────────────
const API_BASE        = 'https://snj-global-agency-backend-5uzc.onrender.com/api';
const AUTO_REFRESH_MS = 15_000;

// ─── Constants ────────────────────────────────────────────────
const PROGRESS_OPTIONS = [0, 25, 50, 75, 100];

const COLUMNS = [
  {
    key: 'visit_visa', label: 'Visit Visa', icon: '🛂', color: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe',
    steps: ['Document Submission','Visa Processing','Embassy Review','Approval','Passport Dispatch'],
  },
  {
    key: 'student_visa', label: 'Student Visa', icon: '🎓', color: '#0369a1', light: '#eff6ff', border: '#bfdbfe',
    steps: ['Profile Assessment','University Application','Offer Letter Received','Tuition Fee Submission','Visa Application Processing','Biometric Appointment','Visa Approval','Pre-Departure'],
  },
  {
    key: 'tour_package', label: 'Tour Package', icon: '🗺️', color: '#b45309', light: '#fffbeb', border: '#fde68a',
    steps: ['Package Confirmation','Traveler Information Submitted','Flight & Hotel Booking','Visa Support Processing','Travel Documents Ready','Ready To Travel'],
  },
  {
    key: 'citizenship', label: 'Citizenship', icon: '🏛️', color: '#0f766e', light: '#f0fdfa', border: '#99f6e4',
    steps: ['Eligibility Assessment','Document Submission','Application Processing','Background Verification','Biometric Appointment','Interview','Citizenship Approval','Certificate Issued','Passport Application'],
  },
  {
    key: 'flight_col', label: 'Flight', icon: '✈️', color: '#dc2626', light: '#fef2f2', border: '#fecaca',
    steps: ['Flight Request Submitted','Ticket Availability Check','Booking In Process','Payment Confirmation','E-Ticket Issued','Ready To Fly'],
  },
];

const STATUS_CONFIG = {
  approved:  { label: 'Approved',  icon: '✓',  bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  pending:   { label: 'Pending',   icon: '⏳', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  suspended: { label: 'Suspended', icon: '✗',  bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const DOC_STATUS_CONFIG = {
  uploaded: { label: 'Uploaded', icon: '📤', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  verified: { label: 'Verified', icon: '✓',  bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  rejected: { label: 'Rejected', icon: '✗',  bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const DOC_TYPE_LABELS = {
  passport_main: 'Passport (Main)',
  passport_bio:  'Passport (Bio Page)',
  nid_front:     'NID (Front)',
  nid_back:      'NID (Back)',
  cv:            'CV / Resume',
  photo:         'Photo',
};

// ─── Helpers ──────────────────────────────────────────────────
const progressColor = (val) => {
  if (val === 100) return { bar: '#16a34a', text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' };
  if (val >= 75)  return { bar: '#2563eb', text: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' };
  if (val >= 50)  return { bar: '#d97706', text: '#b45309', bg: '#fffbeb', border: '#fde68a' };
  if (val >= 25)  return { bar: '#dc2626', text: '#b91c1c', bg: '#fef2f2', border: '#fecaca' };
  return             { bar: '#94a3b8', text: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
};

const authHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Step label helper ─────────────────────────────────────────
const getStepLabel = (col, value) => {
  if (value === 0) return 'Not Started';
  const steps = col.steps || [];
  const idx   = Math.round((value / 100) * steps.length) - 1;
  return steps[Math.max(0, Math.min(idx, steps.length - 1))] || `${value}%`;
};

// ─── ProgressBar ──────────────────────────────────────────────
const ProgressBar = ({ value }) => {
  const c = progressColor(value);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: c.text }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: c.bar, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
};

// ─── Progress Dropdown with step labels ───────────────────────
const ProgressSelector = ({ col, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const c = progressColor(value);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '7px 10px', borderRadius: 10, background: c.bg, border: `1px solid ${open ? col.color : c.border}`, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', opacity: disabled ? 0.5 : 1 }}
      >
        <div style={{ flex: 1 }}>
          <ProgressBar value={value} />
          {value > 0 && (
            <div style={{ fontSize: 8, color: c.text, marginTop: 2, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getStepLabel(col, value)}
            </div>
          )}
        </div>
        <span style={{ fontSize: 9, color: '#94a3b8', flexShrink: 0 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 200, background: '#fff', borderRadius: 12, boxShadow: '0 12px 40px rgba(11,31,58,0.18)', border: '1px solid #f1f5f9', overflow: 'hidden', minWidth: 200, animation: 'fadeUp 0.15s ease' }}>
          <div style={{ padding: '6px 10px 4px', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>{col.icon} {col.label}</div>
          {PROGRESS_OPTIONS.map(opt => {
            const oc = progressColor(opt);
            const isActive = opt === value;
            return (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: 'none', textAlign: 'left', background: isActive ? oc.bg : 'transparent', cursor: 'pointer', transition: 'background 0.1s', borderBottom: '1px solid #f8fafc', fontFamily: '"Times New Roman", serif' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 50, height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ width: `${opt}%`, height: '100%', background: oc.bar, borderRadius: 99 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: isActive ? oc.text : '#374151' }}>{opt}%</div>
                  <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>{getStepLabel(col, opt)}</div>
                </div>
                {isActive && <span style={{ fontSize: 10, color: oc.text }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Status Dropdown ──────────────────────────────────────────
const StatusSelector = ({ applicantId, currentStatus, onSaved, disabled }) => {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const sc = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const handleSelect = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return; }
    setOpen(false); setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/applicants/${applicantId}/status`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: newStatus }) });
      const data = await res.json();
      if (data.success) onSaved(applicantId, newStatus);
    } catch (e) { console.error('Status save failed', e); }
    finally { setSaving(false); }
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => !disabled && !saving && setOpen(!open)} disabled={disabled || saving}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, background: sc.bg, color: sc.color, border: `1px solid ${open ? sc.color : sc.border}`, cursor: (disabled || saving) ? 'not-allowed' : 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', opacity: saving ? 0.6 : 1 }}>
        {saving ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span> Saving…</> : <>{sc.icon} {sc.label} <span style={{ fontSize: 8, opacity: 0.6 }}>▼</span></>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 300, background: '#fff', borderRadius: 12, boxShadow: '0 12px 40px rgba(11,31,58,0.2)', border: '1px solid #f1f5f9', overflow: 'hidden', minWidth: 150, animation: 'fadeUp 0.15s ease' }}>
          <div style={{ padding: '6px 12px 4px', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>Change Status</div>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const isActive = key === currentStatus;
            return (
              <button key={key} onClick={() => handleSelect(key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: 'none', textAlign: 'left', background: isActive ? cfg.bg : 'transparent', cursor: isActive ? 'default' : 'pointer', transition: 'background 0.1s', borderBottom: '1px solid #f8fafc', fontFamily: '"Times New Roman", serif' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? cfg.bg : 'transparent'; }}>
                <span style={{ fontSize: 12, width: 16 }}>{cfg.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: isActive ? cfg.color : '#374151' }}>{cfg.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', fontSize: 9, color: cfg.color }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Overall badge ─────────────────────────────────────────────
const OverallBadge = ({ values }) => {
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const c   = progressColor(avg);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 9, fontWeight: 900, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {avg === 100 ? '✅' : avg >= 75 ? '🔵' : avg >= 50 ? '🟡' : avg >= 25 ? '🔴' : '⚪'} {avg}%
    </span>
  );
};

// ─── Documents Modal ──────────────────────────────────────────
const DocumentsModal = ({ applicant, onClose }) => {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/applicants/${applicant.id}/documents`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) setDocs(data.data);
        else setError(data.message || 'Failed to load documents');
      } catch (e) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [applicant.id]);

  const handleDocStatus = async (docId, newStatus) => {
    setUpdating(docId);
    try {
      const res  = await fetch(`${API_BASE}/applicants/documents/${docId}/status`, {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
      }
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const serverBase = API_BASE.replace('/api', '');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,31,58,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(11,31,58,0.25)', animation: 'fadeUp 0.2s ease' }}>
        {/* Header */}
        <div style={{ background: '#0B1F3A', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, background: '#EAB308', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0B1F3A', fontSize: 16 }}>
              {applicant.full_name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{applicant.full_name}</div>
              <div style={{ color: '#EAB308', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Documents</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 24 }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50, gap: 12 }}>
              <div style={{ width: 32, height: 32, border: '3px solid #f1f5f9', borderTop: '3px solid #EAB308', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Loading documents…</span>
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, color: '#dc2626', fontSize: 13 }}>⚠ {error}</div>
          )}
          {!loading && !error && docs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 50, color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>
              📂 No documents uploaded yet.
            </div>
          )}
          {!loading && docs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {docs.map(doc => {
                const dsc      = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.uploaded;
                const isImg    = /\.(png|jpe?g|gif|webp)$/i.test(doc.file_path);
                const fileUrl  = `${serverBase}${doc.file_path}`;
                const docLabel = DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type;
                const isUpdating = updating === doc.id;

                return (
                  <div key={doc.id} style={{ background: '#f8fafc', borderRadius: 14, border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,31,58,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                    {/* Preview */}
                    <div style={{ height: 140, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => window.open(fileUrl, '_blank')}>
                      {isImg ? (
                        <img src={fileUrl} alt={docLabel} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div style={{ fontSize: 36, display: isImg ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>📄</div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0B1F3A' }}>{docLabel}</span>
                        <span style={{ fontSize: 8, padding: '3px 8px', borderRadius: 20, background: dsc.bg, color: dsc.color, border: `1px solid ${dsc.border}`, fontWeight: 900, textTransform: 'uppercase' }}>
                          {dsc.icon} {dsc.label}
                        </span>
                      </div>
                      {doc.original_name && (
                        <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.original_name}</div>
                      )}
                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={fileUrl} target="_blank" rel="noreferrer"
                          style={{ flex: 1, padding: '6px 0', textAlign: 'center', background: '#0B1F3A', color: '#EAB308', borderRadius: 8, fontSize: 9, fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          👁 View
                        </a>
                        {doc.status !== 'verified' && (
                          <button onClick={() => handleDocStatus(doc.id, 'verified')} disabled={isUpdating}
                            style={{ flex: 1, padding: '6px 0', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                            {isUpdating ? '…' : '✓ Verify'}
                          </button>
                        )}
                        {doc.status !== 'rejected' && (
                          <button onClick={() => handleDocStatus(doc.id, 'rejected')} disabled={isUpdating}
                            style={{ flex: 1, padding: '6px 0', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontSize: 9, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                            {isUpdating ? '…' : '✕ Reject'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{docs.length} document{docs.length !== 1 ? 's' : ''} found</span>
          <button onClick={onClose} style={{ padding: '8px 20px', background: '#0B1F3A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: '"Times New Roman", serif' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ─────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { if (msg) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: type === 'ok' ? '#059669' : '#dc2626', color: '#fff', boxShadow: '0 8px 28px rgba(0,0,0,0.2)', animation: 'fadeUp 0.25s ease', fontFamily: '"Times New Roman", serif' }}>
      {type === 'ok' ? '✓' : '✕'} {msg}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────
const ApplicantList = () => {
  const [applicants,     setApplicants]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [error,          setError]          = useState(null);
  const [lastUpdated,    setLastUpdated]    = useState('');
  const [search,         setSearch]         = useState('');
  const [savingId,       setSavingId]       = useState(null);
  const [toast,          setToast]          = useState({ msg: '', type: 'ok' });
  const [pendingChanges, setPendingChanges] = useState({});
  const [docsModal,      setDocsModal]      = useState(null); // applicant object
  const intervalRef = useRef(null);

  const fetchApplicants = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else        setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/applicants`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setApplicants(data.data);
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } else setError(data.message || 'Failed to load');
    } catch (e) { setError(e.message || 'Network error'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    fetchApplicants(false);
    intervalRef.current = setInterval(() => fetchApplicants(true), AUTO_REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchApplicants]);

  const handleChange = (userId, field, value) => {
    setPendingChanges(prev => ({ ...prev, [userId]: { ...(prev[userId] || {}), [field]: value } }));
  };

  const getVal = (applicant, field) => {
    const p = pendingChanges[applicant.id];
    if (p && p[field] !== undefined) return p[field];
    return applicant[field] ?? 0;
  };

  const hasChanges = (applicant) => {
    const p = pendingChanges[applicant.id];
    if (!p) return false;
    return COLUMNS.some(c => p[c.key] !== undefined && p[c.key] !== applicant[c.key]);
  };

  const saveRow = async (applicant) => {
    const pending = pendingChanges[applicant.id];
    if (!pending) return;
    setSavingId(applicant.id);
    try {
      const res  = await fetch(`${API_BASE}/applicants/${applicant.id}/tracking`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(pending) });
      const data = await res.json();
      if (data.success) {
        setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, ...data.data } : a));
        setPendingChanges(prev => { const n = { ...prev }; delete n[applicant.id]; return n; });
        setToast({ msg: `${applicant.full_name} — tracking saved!`, type: 'ok' });
      } else setToast({ msg: data.message || 'Save failed', type: 'err' });
    } catch (e) { setToast({ msg: 'Network error — save failed', type: 'err' }); }
    finally { setSavingId(null); }
  };

  const discardRow = (userId) => {
    setPendingChanges(prev => { const n = { ...prev }; delete n[userId]; return n; });
  };

  const onStatusSaved = (userId, newStatus) => {
    setApplicants(prev => prev.map(a => a.id === userId ? { ...a, account_status: newStatus } : a));
    const name = applicants.find(a => a.id === userId)?.full_name || 'Candidate';
    setToast({ msg: `${name} — status set to "${newStatus}"`, type: 'ok' });
  };

  const filtered = applicants.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:    applicants.length,
    complete: applicants.filter(a => COLUMNS.every(c => a[c.key] === 100)).length,
    inProg:   applicants.filter(a => COLUMNS.some(c => a[c.key] > 0 && a[c.key] < 100)).length,
    notStart: applicants.filter(a => COLUMNS.every(c => !a[c.key])).length,
  };

  const fam = { fontFamily: '"Times New Roman", serif' };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', ...fam }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; }
      `}</style>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'ok' })} />

      {/* Documents Modal */}
      {docsModal && <DocumentsModal applicant={docsModal} onClose={() => setDocsModal(null)} />}

      <div style={{ padding: '24px 32px' }}>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 22 }}>
          {[
            { label: 'Total Candidates', value: stats.total,    bg: '#0B1F3A', fg: '#fff',    icon: '👥' },
            { label: 'Fully Complete',   value: stats.complete, bg: '#16a34a', fg: '#fff',    icon: '✅' },
            { label: 'In Progress',      value: stats.inProg,   bg: '#EAB308', fg: '#0B1F3A', icon: '⏳' },
            { label: 'Not Started',      value: stats.notStart, bg: '#dc2626', fg: '#fff',    icon: '⭕' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 18, opacity: 0.5, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.fg, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: s.fg, opacity: 0.7, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ background: '#0B1F3A', borderRadius: 16, padding: '16px 22px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '9px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 12, fontFamily: '"Times New Roman", serif', outline: 'none', maxWidth: 300 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {COLUMNS.map(col => (
              <div key={col.key} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 20 }}>
                <span style={{ fontSize: 12 }}>{col.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{col.label}</span>
              </div>
            ))}
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 9px', borderRadius: 20 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: cfg.color, textTransform: 'uppercase' }}>{cfg.icon} {cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '16px 20px', color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>⚠ {error}</div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 14 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #f1f5f9', borderTop: '3px solid #EAB308', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Loading candidates…</div>
          </div>
        )}

        {/* ── TABLE ── */}
        {!loading && (
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: 2 }}>Candidates ({filtered.length})</span>
              <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>Status → saves instantly &nbsp;·&nbsp; Progress → 💾 Save required</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>
                {search ? 'No candidates match your search.' : 'No candidates found.'}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Candidate</th>
                      <th style={thStyle}>Documents</th>
                      <th style={{ ...thStyle, color: '#0B1F3A' }}>Account Status</th>
                      <th style={thStyle}>Overall</th>
                      {COLUMNS.map(col => (
                        <th key={col.key} style={{ ...thStyle, color: col.color }}>{col.icon} {col.label}</th>
                      ))}
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((applicant, idx) => {
                      const saving  = savingId === applicant.id;
                      const changed = hasChanges(applicant);
                      const colVals = COLUMNS.map(c => getVal(applicant, c.key));

                      return (
                        <tr key={applicant.id}
                          style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s', background: changed ? 'rgba(234,179,8,0.03)' : 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = changed ? 'rgba(234,179,8,0.06)' : '#fafbfc'}
                          onMouseLeave={e => e.currentTarget.style.background = changed ? 'rgba(234,179,8,0.03)' : 'transparent'}
                        >
                          <td style={tdStyle}><span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{idx + 1}</span></td>

                          {/* Candidate */}
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 36, height: 36, background: 'rgba(234,179,8,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#b45309', flexShrink: 0 }}>
                                {(applicant.full_name || '?').slice(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', whiteSpace: 'nowrap' }}>{applicant.full_name}</div>
                                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{applicant.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Documents button */}
                          <td style={tdStyle}>
                            <button onClick={() => setDocsModal(applicant)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: '"Times New Roman", serif', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1d4ed8'; }}>
                              📂 Documents
                            </button>
                          </td>

                          {/* Status */}
                          <td style={tdStyle}>
                            <StatusSelector applicantId={applicant.id} currentStatus={applicant.account_status} onSaved={onStatusSaved} disabled={saving} />
                          </td>

                          {/* Overall */}
                          <td style={tdStyle}><OverallBadge values={colVals} /></td>

                          {/* Progress columns */}
                          {COLUMNS.map(col => (
                            <td key={col.key} style={{ ...tdStyle, minWidth: 160 }}>
                              <ProgressSelector col={col} value={getVal(applicant, col.key)} onChange={val => handleChange(applicant.id, col.key, val)} disabled={saving} />
                            </td>
                          ))}

                          {/* Actions */}
                          <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <button onClick={() => saveRow(applicant)} disabled={saving || !changed}
                                style={{ padding: '7px 14px', borderRadius: 9, border: 'none', background: saving ? '#94a3b8' : changed ? '#0B1F3A' : '#f1f5f9', color: saving ? '#fff' : changed ? '#EAB308' : '#94a3b8', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, cursor: (saving || !changed) ? 'not-allowed' : 'pointer', fontFamily: '"Times New Roman", serif', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
                                {saving ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span> Saving…</> : changed ? '💾 Save' : '✓ Saved'}
                              </button>
                              {changed && !saving && (
                                <button onClick={() => discardRow(applicant.id)}
                                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length > 0 && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>Showing {filtered.length} of {applicants.length} candidates</span>
                <span style={{ fontSize: 9, color: '#94a3b8', fontStyle: 'italic' }}>Auto-refreshes every {AUTO_REFRESH_MS / 1000}s</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  textAlign: 'left', padding: '10px 14px',
  fontSize: 9, fontWeight: 900, textTransform: 'uppercase',
  letterSpacing: 1.5, color: '#94a3b8', whiteSpace: 'nowrap',
  background: '#f8fafc', fontFamily: '"Times New Roman", serif',
};

const tdStyle = {
  padding: '12px 14px', verticalAlign: 'middle',
  fontFamily: '"Times New Roman", serif',
};

export default ApplicantList;