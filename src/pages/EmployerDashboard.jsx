import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Config ────────────────────────────────────────────────────────────────────
const API_BASE = 'http://snj-global-agency-production.up.railway.app/api';
const REFRESH_INTERVAL = 30000;

// ─── API Helper ────────────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('employer_token');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `API error ${res.status}`);
  return data;
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, sw = 2, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const HomeIcon    = () => <Ic d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />;
const UserIcon    = () => <Ic d={['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8z']} />;
const BellIcon    = () => <Ic d={['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 01-3.46 0']} />;
const FileIcon    = () => <Ic d={['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z','M14 2v6h6']} />;
const ChartIcon   = () => <Ic d={['M18 20V10','M12 20V4','M6 20v-6']} />;
const GlobeIcon   = ({ size = 18 }) => <Ic size={size} d={['M12 2a10 10 0 100 20A10 10 0 0012 2z','M2 12h20','M12 2a15.3 15.3 0 010 20']} />;
const PhoneIcon   = ({ size = 18 }) => <Ic size={size} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.11 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />;
const MailIcon    = ({ size = 18 }) => <Ic size={size} d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6']} />;
const AlertIcon   = ({ size = 18 }) => <Ic size={size} d={['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01']} />;
const UsersIcon   = () => <Ic d={['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 7a4 4 0 100 8 4 4 0 000-8z','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75']} />;
const ShieldIcon  = () => <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const StarIcon    = () => <Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const CheckIcon   = () => <Ic d={['M22 11.08V12a10 10 0 11-5.93-9.14','M22 4L12 14.01l-3-3']} />;
const EyeIcon     = () => <Ic d={['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z']} />;
const LinkIcon    = () => <Ic d={['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71','M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71']} />;
const CompassIcon = () => <Ic d={['M12 2a10 10 0 100 20A10 10 0 0012 2z','M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z']} />;
const TrendIcon   = () => <Ic d={['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6']} />;
const TargetIcon  = () => <Ic d={['M12 2a10 10 0 100 20A10 10 0 0012 2z','M12 6a6 6 0 100 12A6 6 0 0012 6z','M12 10a2 2 0 100 4 2 2 0 000-4z']} />;
const RefreshIcon = () => <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />;
const LogoutIcon  = () => <Ic d={['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4','M16 17l5-5-5-5','M21 12H9']} />;
const MenuIcon    = () => <Ic d={['M3 12h18','M3 6h18','M3 18h18']} />;
const CloseIcon   = () => <Ic d={['M18 6L6 18','M6 6l12 12']} />;
const PlusIcon    = () => <Ic d={['M12 5v14','M5 12h14']} />;
const XIcon       = () => <Ic d={['M18 6L6 18','M6 6l12 12']} size={16} />;
const ChevronIcon = () => <Ic size={12} d="M9 18l6-6-6-6" />;
const ArrowIcon   = ({ size = 12 }) => <Ic size={size} d="M5 12h14M12 5l7 7-7 7" />;

// ─── Static Data ───────────────────────────────────────────────────────────────
const OFFICES = [
  { city: 'Dhaka',        country: 'Bangladesh',     role: 'Head Office',     flag: '🇧🇩', active: true  },
  { city: 'Kuala Lumpur', country: 'Malaysia',       role: 'Asia Hub',        flag: '🇲🇾', active: true  },
  { city: 'Warsaw',       country: 'Poland',         role: 'Europe Liaison',  flag: '🇵🇱', active: true  },
  { city: 'London',       country: 'United Kingdom', role: 'UK Office',       flag: '🇬🇧', active: true  },
  { city: 'Dubai',        country: 'UAE',            role: 'Middle East Hub', flag: '🇦🇪', active: false },
  { city: 'Berlin',       country: 'Germany',        role: 'DE Operations',   flag: '🇩🇪', active: true  },
];

const COUNTRY_FLAGS = {
  'Bangladesh': 'bd', 'UAE': 'ae', 'Germany': 'de', 'Malaysia': 'my',
  'France': 'fr', 'South Korea': 'kr', 'United Kingdom': 'gb',
  'Saudi Arabia': 'sa', 'Qatar': 'qa', 'Kuwait': 'kw', 'Oman': 'om',
  'Singapore': 'sg', 'Japan': 'jp', 'Italy': 'it', 'Poland': 'pl',
  'Romania': 'ro', 'Hungary': 'hu', 'Czech Republic': 'cz', 'Portugal': 'pt',
};

const JOB_TITLES = [
  'Factory Workers', 'Construction Workers', 'Manufacturing Staff',
  'Warehouse Workers', 'Technical Staff', 'Electronics Assembly',
  'Cleaning Staff', 'Security Guards', 'Drivers', 'Hospitality Staff',
  'Agricultural Workers', 'Packaging Workers', 'Welders', 'Electricians',
  'Plumbers', 'IT Professionals', 'Healthcare Workers', 'Other',
];

const STATUS_MAP = {
  in_progress:    { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D', label: 'In Progress' },
  pending_review: { bg: '#FFEDD5', color: '#C2410C', border: '#FDBA74', label: 'Pending Review' },
  delivering:     { bg: '#CFFAFE', color: '#0E7490', border: '#67E8F9', label: 'Delivering' },
  completed:      { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC', label: 'Completed' },
  pending:        { bg: '#FFEDD5', color: '#C2410C', border: '#FDBA74', label: 'Pending' },
  cancelled:      { bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5', label: 'Cancelled' },
  approved:       { bg: '#DCFCE7', color: '#15803D', border: '#86EFAC', label: 'Approved' },
  rejected:       { bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5', label: 'Rejected' },
  blocked:        { bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5', label: 'Blocked' },
};

// ─── Global Styles ─────────────────────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --navy:#0B1F3A;--gold:#EAB308;--bg:#F0F3F8;--card:#fff;
    --border:#E2E8F0;--tp:#0B1F3A;--ts:#64748B;--tm:#94A3B8;
    --serif:"Times New Roman","IM Fell English",Georgia,serif;
  }
  body{font-family:var(--serif);background:var(--bg);color:var(--tp)}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
  .root{display:flex;height:100vh;overflow:hidden}
  .sb{width:260px;min-width:260px;background:var(--navy);display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid rgba(255,255,255,.06);transition:width .25s,min-width .25s;z-index:20}
  .sb.col{width:72px;min-width:72px}
  .sb-logo{padding:20px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:12px;background:linear-gradient(180deg,rgba(234,179,8,.06) 0%,transparent 100%)}
  .lm{width:40px;height:40px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--navy);font-size:14px;font-weight:900}
  .ln{font-size:13px;font-weight:bold;color:#fff;text-transform:uppercase;letter-spacing:.12em;line-height:1.2}
  .lt{font-size:8px;color:var(--gold);font-weight:bold;letter-spacing:.2em;text-transform:uppercase;margin-top:1px}
  .sb-user{padding:14px 12px;border-bottom:1px solid rgba(255,255,255,.07)}
  .sb-ui{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px}
  .ui{width:38px;height:38px;background:var(--gold);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:var(--navy);flex-shrink:0}
  .un{font-size:12px;font-weight:bold;color:#fff}
  .ur{font-size:8px;color:var(--gold);font-weight:bold;letter-spacing:.15em;text-transform:uppercase;margin-top:2px}
  .upill{margin:10px 12px 0;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px}
  .udot{width:7px;height:7px;background:#EF4444;border-radius:50%;animation:blink 1.4s infinite;flex-shrink:0}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .ut{font-size:9px;color:#FCA5A5;font-weight:bold;text-transform:uppercase;letter-spacing:.1em}
  .sb-nav{flex:1;padding:10px 8px;overflow-y:auto;margin-top:4px}
  .ni{width:100%;display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:11px;border:none;cursor:pointer;background:transparent;text-align:left;transition:all .15s;margin-bottom:2px;color:#94A3B8}
  .ni:hover{background:rgba(255,255,255,.05);color:#fff}
  .ni.act{background:var(--gold);color:var(--navy)!important;box-shadow:0 4px 14px rgba(234,179,8,.3)}
  .ni.act .nl{color:var(--navy)!important;font-weight:900}
  .nic{flex-shrink:0;width:18px;height:18px}
  .nl{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:.08em;flex:1;color:inherit}
  .nbadge{font-size:8px;font-weight:900;min-width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#EF4444;color:#fff}
  .ni.act .nbadge{background:var(--navy);color:var(--gold)}
  .sb-bot{padding:10px 8px;border-top:1px solid rgba(255,255,255,.07)}
  .cb,.lb{width:100%;display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;border:none;cursor:pointer;background:transparent;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:.08em}
  .cb{color:#64748B;margin-bottom:2px}
  .cb:hover{background:rgba(255,255,255,.04);color:#94A3B8}
  .lb{color:#F87171}
  .lb:hover{background:rgba(239,68,68,.08)}
  .main{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0}
  .topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
  .tt{font-size:20px;font-weight:bold;color:var(--navy);text-transform:uppercase;letter-spacing:.05em;line-height:1}
  .ts2{font-size:9px;color:var(--tm);font-weight:bold;letter-spacing:.18em;text-transform:uppercase;margin-top:3px}
  .tr{display:flex;align-items:center;gap:10px}
  .upend{display:flex;align-items:center;gap:7px;background:#FEF2F2;border:1px solid #FCA5A5;padding:6px 12px;border-radius:8px}
  .upd{width:6px;height:6px;background:#EF4444;border-radius:50%;animation:blink 1.4s infinite}
  .upt{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#DC2626}
  .bw{position:relative;cursor:pointer}
  .bb{width:40px;height:40px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--gold)}
  .bc{position:absolute;top:-5px;right:-5px;width:17px;height:17px;background:#EF4444;border-radius:50%;font-size:8px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
  .pc{padding:24px 28px;flex:1}
  .hbox{background:var(--navy);border-radius:16px;padding:28px 26px;margin-bottom:22px;position:relative;overflow:hidden}
  .hd1{position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(234,179,8,.07);border-radius:50%}
  .hd2{position:absolute;bottom:-30px;left:20px;width:120px;height:120px;background:rgba(255,255,255,.03);border-radius:50%}
  .gl{font-size:9px;color:var(--gold);font-weight:bold;letter-spacing:.18em;text-transform:uppercase}
  .nh{font-size:24px;font-weight:bold;color:#fff;text-transform:uppercase;letter-spacing:.03em;line-height:1.2}
  .is{font-size:13px;color:#94A3B8;font-style:italic;margin-top:5px;line-height:1.6}
  .wc{background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;margin-bottom:20px}
  .sl{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:.18em;color:var(--tm);margin-bottom:14px}
  .sb2{font-size:9px;font-weight:900;text-transform:uppercase;padding:5px 11px;border-radius:8px;border:1px solid;letter-spacing:.06em;white-space:nowrap}
  .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .sc{border-radius:16px;padding:22px 20px;position:relative;overflow:hidden}
  .sc::after{content:'';position:absolute;bottom:-15px;right:-15px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.06)}
  .sv{font-size:32px;font-weight:900;line-height:1}
  .slb{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:.15em;opacity:.72;margin-top:6px}
  .svgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
  .svc{border-radius:16px;padding:24px 20px;cursor:pointer;transition:transform .18s,box-shadow .18s;border:1.5px solid transparent}
  .svc:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.09)}
  .svt{font-size:14px;font-weight:bold;text-transform:uppercase;color:var(--navy);letter-spacing:.04em}
  .svs{font-size:12px;color:var(--ts);margin-top:4px;font-style:italic;line-height:1.6}
  .svc2{font-size:9px;font-weight:bold;text-transform:uppercase;color:var(--tm);margin-top:12px;letter-spacing:.12em}
  .tc{background:#fff;border-radius:16px;border:1px solid var(--border);overflow:hidden;margin-bottom:22px}
  .ch{padding:16px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .cht{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:.15em;color:var(--navy)}
  .vab{font-size:10px;font-weight:bold;color:var(--gold);text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:4px;background:none;border:none;letter-spacing:.1em}
  .br{padding:14px 22px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #F8FAFC;transition:background .12s}
  .br:last-child{border-bottom:none}
  .br:hover{background:#F8FAFC}
  .bn{font-size:14px;font-weight:bold;color:var(--navy)}
  .bs{font-size:10px;color:var(--tm);font-weight:bold;text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
  .pgb{height:8px;background:#F1F5F9;border-radius:8px;overflow:hidden}
  .pgf{height:100%;border-radius:8px;transition:width .4s}
  .dgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:22px}
  .dc{background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px;transition:all .18s;cursor:pointer}
  .dc:hover{box-shadow:0 6px 22px rgba(0,0,0,.07);border-color:rgba(234,179,8,.35);transform:translateY(-2px)}
  .wsr{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;text-align:center;padding:14px 0;border-top:1px solid #F1F5F9}
  .wsn{font-size:18px;font-weight:900;color:var(--navy)}
  .wsl{font-size:8px;font-weight:bold;text-transform:uppercase;color:var(--tm);letter-spacing:.06em;margin-top:3px}
  .psum{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
  .psc{border-radius:14px;padding:18px;text-align:center}
  .psv{font-size:28px;font-weight:900}
  .psl{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:.12em;margin-top:4px}
  .ph{background:var(--navy);border-radius:16px;overflow:hidden;margin-bottom:16px}
  .phi{padding:32px;position:relative;overflow:hidden}
  .phb1{position:absolute;top:-50px;right:-50px;width:220px;height:220px;background:rgba(234,179,8,.07);border-radius:50%}
  .phb2{position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;background:rgba(255,255,255,.03);border-radius:50%}
  .pav{width:82px;height:82px;background:var(--gold);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:var(--navy);flex-shrink:0}
  .pg{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:22px}
  .ii{display:flex;align-items:center;gap:12px;background:#F8FAFC;border:1px solid var(--border);border-radius:12px;padding:14px 16px}
  .il{font-size:9px;font-weight:bold;text-transform:uppercase;color:var(--tm);letter-spacing:.12em}
  .iv{font-size:14px;font-weight:bold;color:var(--navy);margin-top:3px}
  .nc{background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px 20px;display:flex;gap:16px;margin-bottom:10px;transition:box-shadow .15s}
  .nc:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}
  .nc.unr{border-color:rgba(234,179,8,.3)}
  .nc.urg{border-left:4px solid #EF4444}
  .nib{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ng{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
  .oc{background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;cursor:pointer;transition:all .18s}
  .oc:hover{box-shadow:0 6px 22px rgba(0,0,0,.07);border-color:rgba(234,179,8,.35);transform:translateY(-2px)}
  .wg{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:22px}
  .wcard{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px;display:flex;gap:16px;align-items:flex-start;transition:all .18s}
  .wcard:hover{box-shadow:0 6px 22px rgba(0,0,0,.07);border-color:rgba(234,179,8,.35);transform:translateY(-2px)}
  .wi{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .wt{font-size:14px;font-weight:bold;color:var(--navy);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
  .wd{font-size:13px;color:var(--ts);font-style:italic;line-height:1.7}
  .apg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
  .apc{background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;text-align:center;transition:all .18s}
  .apc:hover{box-shadow:0 6px 22px rgba(0,0,0,.07);transform:translateY(-2px)}
  .api{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:margin:0 auto 14px}
  .apt{font-size:14px;font-weight:bold;color:var(--navy);text-transform:uppercase;letter-spacing:.04em}
  .aps{font-size:12px;color:var(--ts);font-style:italic;margin-top:6px;line-height:1.7}
  .ab{background:linear-gradient(135deg,#DC2626,#B91C1C);border-radius:16px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;border:1px solid rgba(239,68,68,.3)}
  .al{display:flex;align-items:center;gap:16px}
  .ai{width:42px;height:42px;background:rgba(255,255,255,.15);border-radius:11px;display:flex;align-items:center;justify-content:center;color:#fff;animation:blink 1.4s infinite;flex-shrink:0}
  .at2{font-size:13px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:.08em}
  .as{font-size:12px;color:rgba(255,255,255,.75);margin-top:3px;font-style:italic}
  .abtn{background:#fff;color:#DC2626;font-size:10px;font-weight:900;text-transform:uppercase;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;letter-spacing:.1em;display:flex;align-items:center;gap:6px;white-space:nowrap}
  .fb{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
  .fs{padding:8px 14px;border:1px solid var(--border);border-radius:10px;font-size:12px;font-family:var(--serif);background:#fff;color:var(--navy);cursor:pointer;font-weight:bold}
  .fs:focus{outline:none;border-color:var(--gold)}
  .ft{background:var(--navy);border-radius:16px;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-top:24px;border:1px solid rgba(255,255,255,.05)}
  .fl{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:.1em;color:#64748B;text-decoration:none;display:flex;align-items:center;gap:4px;transition:color .15s}
  .fl:hover{color:var(--gold)}
  .fc{font-size:9px;color:#475569;font-weight:bold;letter-spacing:.1em;text-transform:uppercase}
  .rsp{animation:spin 1s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .rb{background:none;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:9px;font-weight:bold;text-transform:uppercase;color:var(--ts)}
  .rb:hover{background:#F8FAFC;color:var(--navy)}
  .lb2{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--tm);font-style:italic;font-size:14px}
  .eb{background:#FEF2F2;border:1px solid #FCA5A5;border-radius:12px;padding:20px 24px;color:#B91C1C;margin-bottom:20px;font-size:13px}
  .ri{display:flex;align-items:center;gap:6px;font-size:9px;color:var(--tm);font-weight:bold;text-transform:uppercase;letter-spacing:.08em}
  .ov{position:fixed;inset:0;background:rgba(11,31,58,.6);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
  .fm{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.25)}
  .fh{padding:24px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--navy);border-radius:20px 20px 0 0}
  .fb2{background:none;border:none;cursor:pointer;color:#94A3B8;padding:4px}
  .fb2:hover{color:#fff}
  .fb3{padding:24px 28px}
  .fg{margin-bottom:18px}
  .fgl{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:.12em;color:var(--ts);margin-bottom:6px;display:block}
  .fi{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-family:var(--serif);color:var(--navy);background:#fff;transition:border-color .15s;outline:none}
  .fi:focus{border-color:var(--gold)}
  .fi.er{border-color:#EF4444}
  .ftxt{font-size:11px;color:#EF4444;margin-top:4px}
  .fbtn{width:100%;padding:13px;background:var(--navy);color:var(--gold);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;border:none;border-radius:12px;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px}
  .fbtn:hover{background:#0F2D56}
  .fbtn:disabled{opacity:.6;cursor:not-allowed}
  .sbtn{background:var(--gold);color:var(--navy);font-size:11px;font-weight:900;text-transform:uppercase;padding:10px 18px;border-radius:10px;border:none;cursor:pointer;letter-spacing:.1em;display:flex;align-items:center;gap:6px}
  .sbtn:hover{background:#CA8A04}
  .toast{position:fixed;bottom:24px;right:24px;padding:14px 20px;border-radius:12px;font-size:13px;font-weight:bold;z-index:200;box-shadow:0 8px 28px rgba(0,0,0,.15);animation:slidein .25s ease}
  @keyframes slidein{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  .toast.ok{background:#059669;color:#fff}
  .toast.err{background:#DC2626;color:#fff}
  .r2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  /* ── Logout Confirm Modal ── */
  .lco{position:fixed;inset:0;background:rgba(11,31,58,.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
  .lcm{background:#fff;border-radius:20px;width:100%;max-width:380px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.3)}
  .lch{background:var(--navy);padding:24px 28px}
  .lcb{padding:24px 28px}
`;

// ─── useAutoRefresh ────────────────────────────────────────────────────────────
function useAutoRefresh(fetchFn, interval = REFRESH_INTERVAL) {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLU]        = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    setError(null);
    try {
      const r = await fetchFn();
      setData(r);
      setLU(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    load();
    const t = setInterval(() => load(true), interval);
    return () => clearInterval(t);
  }, [load, interval]);

  return { data, loading, error, lastUpdated, refreshing, refresh: () => load(false) };
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────
const Footer = () => (
  <div className="ft">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, background: '#EAB308', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B1F3A', fontWeight: 900, fontSize: 13 }}>SJ</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '.12em' }}>SNJ GlobalRoutes</div>
        <div style={{ fontSize: 8, color: '#EAB308', fontWeight: 'bold', letterSpacing: '.2em', textTransform: 'uppercase' }}>Employer Portal · Official</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
      <span className="fc">© 2026 SNJ GlobalRoutes</span>
      <a href="https://wa.me/8801348992268" target="_blank" rel="noreferrer" className="fl"><PhoneIcon size={10} /> WhatsApp</a>
      <a href="mailto:directorsnj932@gmail.com" className="fl"><MailIcon size={10} /> Email</a>
      <span className="fc" style={{ color: '#334155' }}>Engineered by JM-IT Studio</span>
    </div>
  </div>
);

const HBox = ({ tag, title, sub }) => (
  <div className="hbox">
    <div className="hd1" /><div className="hd2" />
    <div style={{ position: 'relative', zIndex: 1 }}>
      {tag && <div className="gl" style={{ marginBottom: 6 }}>{tag}</div>}
      <div className="nh">{title}</div>
      {sub && <div className="is">{sub}</div>}
    </div>
  </div>
);

const Badge = ({ status }) => {
  const s = STATUS_MAP[status] || { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD', label: status || 'Unknown' };
  return <span className="sb2" style={{ background: s.bg, color: s.color, borderColor: s.border }}>{s.label}</span>;
};

const PBar = ({ value, max, label = 'Delivery Progress' }) => {
  const p = max > 0 ? Math.round((value / max) * 100) : 0;
  const bg = p === 100 ? '#059669' : p > 50 ? '#EAB308' : '#3B82F6';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--tm)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--navy)' }}>{value}/{max} ({p}%)</span>
      </div>
      <div className="pgb"><div className="pgf" style={{ width: `${p}%`, background: bg }} /></div>
    </div>
  );
};

const Loading = ({ text = 'Loading data...' }) => (
  <div className="lb2"><span style={{ color: '#EAB308', marginRight: 10 }}><RefreshIcon /></span>{text}</div>
);

const Err = ({ message, onRetry }) => (
  <div className="eb">
    <strong>⚠ Error:</strong> {message}
    {onRetry && <button onClick={onRetry} style={{ marginLeft: 12, fontSize: 11, fontWeight: 'bold', color: '#B91C1C', background: 'none', border: '1px solid #FCA5A5', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Retry</button>}
  </div>
);

const Toast = ({ msg, type }) => msg ? <div className={`toast ${type}`}>{type === 'ok' ? '✓' : '✕'} {msg}</div> : null;

// ─── Logout Confirm Modal ──────────────────────────────────────────────────────
// ✅ onConfirm prop দিয়ে actual logout logic pass করা হয়
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="lco" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="lcm">
        <div className="lch">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(239,68,68,.15)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171' }}>
              <LogoutIcon />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#EAB308', fontWeight: 'bold', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 3 }}>Employer Portal</div>
              <div style={{ fontSize: 17, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em' }}>Sign Out?</div>
            </div>
          </div>
        </div>
        <div className="lcb">
          <p style={{ fontSize: 13, color: 'var(--ts)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 22 }}>
            Are you sure you want to sign out of the Employer Portal? You will need to log in again to access your account.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onCancel}
              style={{ flex: 1, padding: '11px 0', background: '#F1F5F9', color: 'var(--ts)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', border: 'none', borderRadius: 11, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{ flex: 1.5, padding: '11px 0', background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', border: 'none', borderRadius: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <LogoutIcon /> Sign Out Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Request Modal ──────────────────────────────────────────────────────
function SubmitRequestModal({ employerId, onClose, onSuccess }) {
  const init = { company_name: '', job_title: '', workers_requested: '', destination_country: '', country_flag: '', notes: '' };
  const [form, setForm]       = useState(init);
  const [errors, setErrors]   = useState({});
  const [submitting, setSub]  = useState(false);
  const [serverErr, setSvErr] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
    setSvErr('');
    if (k === 'destination_country' && COUNTRY_FLAGS[v]) {
      setForm(f => ({ ...f, destination_country: v, country_flag: COUNTRY_FLAGS[v] }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.company_name.trim())        e.company_name       = 'Company name is required';
    if (!form.job_title.trim())           e.job_title          = 'Job title is required';
    if (!form.workers_requested)          e.workers_requested  = 'Number of workers required';
    else if (parseInt(form.workers_requested) <= 0) e.workers_requested = 'Must be greater than 0';
    if (!form.destination_country.trim()) e.destination_country = 'Destination country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSub(true); setSvErr('');
    try {
      await apiFetch('/worker-requests', {
        method: 'POST',
        body: JSON.stringify({ ...form, employer_id: employerId, workers_requested: parseInt(form.workers_requested) }),
      });
      onSuccess('Worker request submitted! Pending admin review.');
      onClose();
    } catch (e) {
      setSvErr(e.message);
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fm">
        <div className="fh">
          <div>
            <div style={{ fontSize: 9, color: '#EAB308', fontWeight: 'bold', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 4 }}>New Request</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em' }}>Submit Worker Request</div>
          </div>
          <button className="fb2" onClick={onClose}><XIcon /></button>
        </div>
        <div className="fb3">
          {serverErr && <div className="eb" style={{ marginBottom: 16 }}><strong>⚠</strong> {serverErr}</div>}
          <div className="fg">
            <label className="fgl">Destination Company Name *</label>
            <input className={`fi${errors.company_name ? ' er' : ''}`} value={form.company_name}
              onChange={e => set('company_name', e.target.value)} placeholder="e.g. Bosch GmbH" />
            {errors.company_name && <div className="ftxt">{errors.company_name}</div>}
          </div>
          <div className="r2">
            <div className="fg">
              <label className="fgl">Job Title *</label>
              <select className={`fi${errors.job_title ? ' er' : ''}`} value={form.job_title} onChange={e => set('job_title', e.target.value)}>
                <option value="">Select job type…</option>
                {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              {errors.job_title && <div className="ftxt">{errors.job_title}</div>}
            </div>
            <div className="fg">
              <label className="fgl">Workers Required *</label>
              <input className={`fi${errors.workers_requested ? ' er' : ''}`} type="number" min="1"
                value={form.workers_requested} onChange={e => set('workers_requested', e.target.value)} placeholder="e.g. 150" />
              {errors.workers_requested && <div className="ftxt">{errors.workers_requested}</div>}
            </div>
          </div>
          <div className="r2">
            <div className="fg">
              <label className="fgl">Destination Country *</label>
              <select className={`fi${errors.destination_country ? ' er' : ''}`} value={form.destination_country}
                onChange={e => set('destination_country', e.target.value)}>
                <option value="">Select country…</option>
                {Object.keys(COUNTRY_FLAGS).map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
              </select>
              {errors.destination_country && <div className="ftxt">{errors.destination_country}</div>}
            </div>
            <div className="fg">
              <label className="fgl">Country Flag Code</label>
              <input className="fi" value={form.country_flag} onChange={e => set('country_flag', e.target.value.toLowerCase())}
                placeholder="e.g. de, ae, my (auto-filled)" />
              <div style={{ fontSize: 10, color: 'var(--tm)', marginTop: 3 }}>ISO 2-letter code — auto-fills for known countries</div>
            </div>
          </div>
          <div className="fg">
            <label className="fgl">Additional Notes</label>
            <textarea className="fi" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Skills required, work conditions, contract duration, etc." style={{ resize: 'vertical', minHeight: 80 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 13, background: '#F1F5F9', color: 'var(--ts)', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              Cancel
            </button>
            <button className="fbtn" style={{ flex: 2 }} onClick={submit} disabled={submitting}>
              {submitting ? <><span className="rsp"><RefreshIcon size={16} /></span> Submitting…</> : <><PlusIcon size={16} /> Submit Request</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────
const OverviewPage = ({ setTab, employerId, showSubmit }) => {
  const fR = useCallback(() => apiFetch(`/worker-requests?employer_id=${employerId}&limit=4`), [employerId]);
  const { data, loading, error, refresh, refreshing } = useAutoRefresh(fR);
  const reqs = data?.data || [];
  const totalReq = reqs.reduce((a, r) => a + (r.workers_requested || 0), 0);
  const totalDel = reqs.reduce((a, r) => a + (r.workers_delivered || 0), 0);
  const pending  = reqs.filter(r => r.status === 'pending_review' || r.status === 'pending').length;
  const active   = reqs.filter(r => r.status === 'in_progress' || r.status === 'delivering').length;
  return (
    <div>
      {pending > 0 && (
        <div className="ab">
          <div className="al">
            <div className="ai"><AlertIcon size={20} /></div>
            <div>
              <div className="at2">⚡ Action Required</div>
              <div className="as">{pending} worker request{pending > 1 ? 's' : ''} are pending admin review.</div>
            </div>
          </div>
          <button className="abtn" onClick={() => setTab('requests')}>View Requests <ArrowIcon size={12} /></button>
        </div>
      )}
      {error && <Err message={error} onRetry={refresh} />}
      <div className="sg">
        {[
          { label: 'Workers Requested', value: loading ? '…' : totalReq.toLocaleString(), bg: '#0B1F3A', fg: '#fff' },
          { label: 'Workers Delivered', value: loading ? '…' : totalDel.toLocaleString(), bg: '#EAB308', fg: '#0B1F3A' },
          { label: 'Pending Review',    value: loading ? '…' : pending, bg: '#DC2626', fg: '#fff' },
          { label: 'Active Contracts',  value: loading ? '…' : active,  bg: '#059669', fg: '#fff' },
        ].map((s, i) => (
          <div key={i} className="sc" style={{ background: s.bg }}>
            <div className="sv" style={{ color: s.fg }}>{s.value}</div>
            <div className="slb" style={{ color: s.fg }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="sl">Quick Actions</div>
      <div className="svgrid">
        {[
          { title: 'Submit New Request', sub: 'Request workers for a new destination', count: 'Click to submit', bg: '#FFFBEB', border: '#FDE68A', action: showSubmit },
          { title: 'Progress Dashboard', sub: 'Track delivery & pipeline status', count: `${totalReq} Workers Tracked`, bg: '#F0FDF4', border: '#BBF7D0', action: () => setTab('progress') },
          { title: 'Global Network',     sub: 'Our offices & contact channels', count: '6 Global Offices', bg: '#F5F3FF', border: '#DDD6FE', action: () => setTab('network') },
        ].map((s, i) => (
          <div key={i} className="svc" onClick={s.action} style={{ background: s.bg, borderColor: s.border }}>
            <div style={{ marginBottom: 12 }}><GlobeIcon size={24} /></div>
            <div className="svt">{s.title}</div>
            <div className="svs">{s.sub}</div>
            <div className="svc2">{s.count}</div>
          </div>
        ))}
      </div>
      <div className="tc">
        <div className="ch">
          <div className="cht">Recent Worker Requests</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {refreshing && <span style={{ color: '#EAB308' }}><RefreshIcon size={14} /></span>}
            <button className="vab" onClick={() => setTab('requests')}>View All <span style={{ marginTop: 1 }}><ChevronIcon /></span></button>
          </div>
        </div>
        {loading ? <Loading /> : reqs.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--tm)', fontStyle: 'italic', fontSize: 13 }}>
            No worker requests yet. <button onClick={showSubmit} style={{ color: '#EAB308', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--serif)' }}>Submit your first request →</button>
          </div>
        ) : reqs.map((r, i) => (
          <div key={i} className="br">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              {r.country_flag
                ? <img src={`https://flagcdn.com/w40/${r.country_flag}.png`} alt={r.destination_country} style={{ width: 38, height: 28, borderRadius: 7, objectFit: 'cover', border: '1px solid var(--border)' }} />
                : <div style={{ width: 38, height: 28, borderRadius: 7, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌍</div>
              }
              <div>
                <div className="bn">{r.company_name}</div>
                <div className="bs">{r.job_title} · {r.workers_requested} workers · {r.destination_country}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--navy)' }}>{r.workers_delivered || 0}/{r.workers_requested}</div>
                <div style={{ fontSize: 9, color: 'var(--tm)', fontWeight: 'bold', textTransform: 'uppercase' }}>Delivered</div>
              </div>
              <Badge status={r.status} />
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

const ProfilePage = ({ employerId }) => {
  const fP = useCallback(() => apiFetch(`/employer/${employerId}`), [employerId]);
  const { data, loading, error, refresh, refreshing, lastUpdated } = useAutoRefresh(fP);
  const emp = data?.data || {};
  const ini = emp.company_name ? emp.company_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '??';
  return (
    <div>
      {error && <Err message={error} onRetry={refresh} />}
      {loading ? <Loading text="Loading company profile..." /> : (
        <>
          <div className="ph">
            <div className="phi">
              <div className="phb1" /><div className="phb2" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, position: 'relative', zIndex: 1 }}>
                <div className="pav">{ini}</div>
                <div>
                  <div className="gl" style={{ marginBottom: 6 }}>{emp.industry} · {emp.country}</div>
                  <div style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em' }}>{emp.company_name}</div>
                  <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4, fontStyle: 'italic' }}>EMP-{String(emp.id || 0).padStart(7, '0')} · Employer Account</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, background: emp.status === 'approved' ? 'rgba(34,197,94,.12)' : 'rgba(234,179,8,.12)', border: `1px solid ${emp.status === 'approved' ? 'rgba(34,197,94,.25)' : 'rgba(234,179,8,.25)'}`, borderRadius: 30, padding: '5px 14px' }}>
                    <div style={{ width: 6, height: 6, background: emp.status === 'approved' ? '#22C55E' : '#EAB308', borderRadius: '50%' }} />
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.1em', color: emp.status === 'approved' ? '#86EFAC' : '#FDE68A' }}>
                      {emp.status === 'approved' ? 'Verified & Approved' : (emp.status || 'Pending').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wc" style={{ padding: 0 }}>
            <div className="pg">
              {[
                { label: 'Email Address',   value: emp.email },
                { label: 'Phone Number',    value: emp.phone },
                { label: 'Employer ID',     value: `EMP-${String(emp.id || 0).padStart(7, '0')}` },
                { label: 'Trade License',   value: emp.trade_license },
                { label: 'Business Reg.',   value: emp.business_reg },
                { label: 'Industry',        value: emp.industry },
                { label: 'Country',         value: emp.country },
                { label: 'Hiring Capacity', value: emp.hiring_capacity },
                { label: 'Account Status',  value: emp.status?.toUpperCase() },
                { label: 'Member Since',    value: emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
              ].map((item, i) => (
                <div key={i} className="ii">
                  <span style={{ color: '#EAB308', flexShrink: 0 }}><ShieldIcon /></span>
                  <div><div className="il">{item.label}</div><div className="iv">{item.value || '—'}</div></div>
                </div>
              ))}
            </div>
          </div>
          {lastUpdated && (
            <div style={{ textAlign: 'right', marginBottom: 12 }}>
              <span className="ri">
                {refreshing && <span className="rsp"><RefreshIcon size={12} /></span>}
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

const NotificationsPage = ({ employerId }) => {
  const fN = useCallback(() => apiFetch(`/notifications?employer_id=${employerId}`), [employerId]);
  const { data, loading, error, refresh, refreshing } = useAutoRefresh(fN);
  const notifs = data?.data || [];
  const unread = notifs.filter(n => !n.is_read).length;
  const markAllRead = async () => { try { await apiFetch(`/notifications/read-all?employer_id=${employerId}`, { method: 'PUT' }); refresh(); } catch {} };
  const markOne = async (id) => { try { await apiFetch(`/notifications/${id}/read`, { method: 'PUT' }); refresh(); } catch {} };
  const iBg    = { deal: '#DBEAFE', verify: '#DCFCE7', supply: '#FEF3C7', message: '#EDE9FE', info: '#F1F5F9', alert: '#FEE2E2' };
  const iColor = { deal: '#2563EB', verify: '#16A34A', supply: '#B45309', message: '#7C3AED', info: '#64748B', alert: '#DC2626' };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="sl" style={{ margin: 0 }}>{unread > 0 ? `${unread} Unread` : 'All Notifications'}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && <button className="rb" onClick={markAllRead} style={{ color: '#059669', borderColor: '#BBF7D0' }}><CheckIcon size={12} /> Mark All Read</button>}
          <button className="rb" onClick={refresh}>{refreshing ? <span className="rsp"><RefreshIcon size={12} /></span> : <RefreshIcon size={12} />} Refresh</button>
        </div>
      </div>
      {error && <Err message={error} onRetry={refresh} />}
      {loading ? <Loading text="Loading notifications..." /> : notifs.length === 0 ? (
        <div className="wc" style={{ textAlign: 'center', padding: 40, color: 'var(--tm)', fontStyle: 'italic' }}>No notifications yet.</div>
      ) : notifs.map((n, i) => (
        <div key={n.id || i} className={`nc${!n.is_read ? ' unr' : ''}${n.is_urgent ? ' urg' : ''}`}
          onClick={() => !n.is_read && markOne(n.id)} style={{ cursor: !n.is_read ? 'pointer' : 'default' }}>
          <div className="nib" style={{ background: iBg[n.type] || iBg.info }}>
            <span style={{ color: iColor[n.type] || iColor.info }}><GlobeIcon size={16} /></span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: n.is_read ? '#64748B' : 'var(--navy)' }}>{n.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {n.is_urgent ? <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20 }}>Urgent</span> : null}
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{n.created_at ? new Date(n.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                {!n.is_read && <span style={{ width: 7, height: 7, background: '#EAB308', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ts)', marginTop: 4, fontStyle: 'italic', lineHeight: 1.6 }}>{n.message}</div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
};

const RequestsPage = ({ employerId, showSubmit }) => {
  const fR = useCallback(() => apiFetch(`/worker-requests?employer_id=${employerId}`), [employerId]);
  const { data, loading, error, refresh, refreshing } = useAutoRefresh(fR);
  const reqs = data?.data || [];
  const STATUS_ORDER = ['pending_review', 'pending', 'in_progress', 'delivering', 'completed', 'cancelled'];
  const counts = {};
  STATUS_ORDER.forEach(s => { counts[s] = reqs.filter(r => r.status === s).length; });
  return (
    <div>
      <HBox tag="Worker Management" title="Worker Request System" sub="Submit and track all your hiring requirements globally." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STATUS_ORDER.filter(s => counts[s] > 0).map(s => (
            <span key={s} className="sb2" style={{ background: STATUS_MAP[s]?.bg, color: STATUS_MAP[s]?.color, borderColor: STATUS_MAP[s]?.border }}>
              {STATUS_MAP[s]?.label}: {counts[s]}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="rb" onClick={refresh}>{refreshing ? <span className="rsp"><RefreshIcon size={12} /></span> : <RefreshIcon size={12} />} Refresh</button>
          <button className="sbtn" onClick={showSubmit}><PlusIcon size={14} /> New Request</button>
        </div>
      </div>
      {error && <Err message={error} onRetry={refresh} />}
      {loading ? <Loading text="Loading worker requests..." /> : (
        <div className="tc">
          {reqs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--tm)', fontStyle: 'italic', fontSize: 13 }}>
              No worker requests yet.{' '}
              <button onClick={showSubmit} style={{ color: '#EAB308', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--serif)' }}>Submit your first request →</button>
            </div>
          ) : reqs.map((r, i) => (
            <div key={r.id || i} className="br" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {r.country_flag
                    ? <img src={`https://flagcdn.com/w40/${r.country_flag}.png`} alt={r.destination_country} style={{ width: 42, height: 30, borderRadius: 7, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    : <div style={{ width: 42, height: 30, borderRadius: 7, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌍</div>
                  }
                  <div>
                    <div className="bn">{r.company_name}</div>
                    <div className="bs">REQ-{r.id} · {r.job_title} · {r.destination_country}</div>
                    {r.notes && <div style={{ fontSize: 11, color: 'var(--ts)', fontStyle: 'italic', marginTop: 2 }}>{r.notes}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--navy)' }}>{r.workers_requested}</div>
                    <div style={{ fontSize: 8, color: 'var(--tm)', fontWeight: 'bold', textTransform: 'uppercase' }}>Requested</div>
                  </div>
                  <Badge status={r.status} />
                </div>
              </div>
              <PBar value={r.workers_delivered || 0} max={r.workers_requested} />
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

const ProgressPage = ({ employerId }) => {
  const fR = useCallback(() => apiFetch(`/worker-requests?employer_id=${employerId}`), [employerId]);
  const { data, loading, error, refresh, refreshing } = useAutoRefresh(fR);
  const all = data?.data || [];
  const [filters, setFilters] = useState({ country: 'all', job: 'all', status: 'all' });
  const countries = [...new Set(all.map(r => r.destination_country).filter(Boolean))];
  const jobs      = [...new Set(all.map(r => r.job_title).filter(Boolean))];
  const filtered  = all.filter(r => {
    const cf = filters.country === 'all' || r.destination_country === filters.country;
    const jf = filters.job    === 'all' || r.job_title            === filters.job;
    const sf = filters.status === 'all' || r.status               === filters.status;
    return cf && jf && sf;
  });
  const totReq = filtered.reduce((a, r) => a + (r.workers_requested || 0), 0);
  const totDel = filtered.reduce((a, r) => a + (r.workers_delivered || 0), 0);
  const pct    = totReq > 0 ? Math.round((totDel / totReq) * 100) : 0;
  return (
    <div>
      <HBox tag="Live Analytics" title="Progress Dashboard" sub="Filter and monitor all worker pipelines in real time." />
      <div className="fb">
        <select className="fs" value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
          <option value="all">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="fs" value={filters.job} onChange={e => setFilters(f => ({ ...f, job: e.target.value }))}>
          <option value="all">All Job Types</option>
          {jobs.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
        <select className="fs" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={() => setFilters({ country: 'all', job: 'all', status: 'all' })}
          style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, fontFamily: 'var(--serif)', background: 'var(--navy)', color: '#EAB308', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
        <button className="rb" onClick={refresh}>{refreshing ? <span className="rsp"><RefreshIcon size={12} /></span> : <RefreshIcon size={12} />} Refresh</button>
      </div>
      {error && <Err message={error} onRetry={refresh} />}
      <div className="psum">
        {[
          { val: loading ? '…' : totReq,         lbl: 'Total Requested',   bg: '#0B1F3A', fg: '#fff' },
          { val: loading ? '…' : totDel,         lbl: 'Workers Delivered', bg: '#EAB308', fg: '#0B1F3A' },
          { val: loading ? '…' : totReq - totDel, lbl: 'Remaining',        bg: '#3B82F6', fg: '#fff' },
          { val: loading ? '…' : pct + '%',      lbl: 'Completion Rate',   bg: '#059669', fg: '#fff' },
        ].map((s, i) => (
          <div key={i} className="psc" style={{ background: s.bg }}>
            <div className="psv" style={{ color: s.fg }}>{s.val}</div>
            <div className="psl" style={{ color: s.fg }}>{s.lbl}</div>
          </div>
        ))}
      </div>
      {loading ? <Loading text="Loading progress data..." /> : filtered.length === 0 ? (
        <div className="wc" style={{ textAlign: 'center', padding: 40, color: 'var(--tm)', fontStyle: 'italic' }}>No results match the selected filters.</div>
      ) : (
        <div className="dgrid">
          {filtered.map((r, i) => {
            const req = r.workers_requested || 0;
            const del = r.workers_delivered || 0;
            const sub = r.workers_submitted || Math.round(req * 0.95);
            const ver = r.workers_verified  || Math.round(req * 0.85);
            const sel = r.workers_selected  || Math.round(req * 0.82);
            const p2  = req > 0 ? Math.round((del / req) * 100) : 0;
            return (
              <div key={r.id || i} className="dc">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {r.country_flag
                    ? <img src={`https://flagcdn.com/w80/${r.country_flag}.png`} alt={r.destination_country} style={{ width: 52, height: 36, borderRadius: 7, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    : <div style={{ width: 52, height: 36, borderRadius: 7, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌍</div>
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--navy)' }}>{r.company_name}</div>
                    <div style={{ fontSize: 10, color: 'var(--tm)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{r.job_title} · {r.destination_country}</div>
                  </div>
                  <Badge status={r.status} />
                </div>
                <div className="wsr">
                  {[{ n: req, l: 'Required' }, { n: sub, l: 'Submitted' }, { n: ver, l: 'Verified' }, { n: sel, l: 'Selected' }, { n: del, l: 'Delivered' }].map((w, j) => (
                    <div key={j}><div className="wsn">{w.n}</div><div className="wsl">{w.l}</div></div>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--tm)', letterSpacing: '.06em' }}>Overall Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--navy)' }}>{p2}% Complete</span>
                  </div>
                  <div className="pgb"><div className="pgf" style={{ width: `${p2}%`, background: p2 === 100 ? '#059669' : p2 > 50 ? '#EAB308' : '#3B82F6' }} /></div>
                </div>
                {r.notes && <div style={{ fontSize: 11, color: 'var(--ts)', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>{r.notes}</div>}
              </div>
            );
          })}
        </div>
      )}
      <Footer />
    </div>
  );
};

const WhyChoosePage = () => (
  <div>
    <HBox tag="Our Commitment" title="Why Choose SNJ GlobalRoutes" sub="The trusted partner for transparent, legal, and effective global worker placement." />
    <div className="wg">
      {[
        { icon: <EyeIcon />,     c: '#EFF6FF', ic: '#2563EB', t: 'Transparent Process',      d: 'Every step of the hiring process is fully visible — from job posting to worker arrival. No hidden fees, no surprises.' },
        { icon: <ShieldIcon />,  c: '#DCFCE7', ic: '#16A34A', t: 'Fraud Prevention',          d: 'We verify every document, employer license, and worker profile. All pathways are fully compliant with international labor laws.' },
        { icon: <LinkIcon />,    c: '#F5F3FF', ic: '#7C3AED', t: 'Real Talent, Real Companies', d: 'We connect genuine job seekers with verified, reputable employers. Every employer undergoes rigorous screening.' },
        { icon: <CompassIcon />, c: '#FFF7ED', ic: '#C2410C', t: 'Legal Pathways',            d: 'Our expert team provides end-to-end guidance on visas, work permits, and legal migration in every destination country.' },
        { icon: <TrendIcon />,   c: '#F0FDF4', ic: '#059669', t: 'Global Reach',              d: "With offices in Dhaka, Dubai, London, KL, Warsaw, and Berlin — bridging talent from Bangladesh to the world's top markets." },
        { icon: <CheckIcon />,   c: '#FEF3C7', ic: '#B45309', t: 'End-to-End Support',        d: 'From initial application to successful placement, our dedicated team is with you at every stage.' },
      ].map((w, i) => (
        <div key={i} className="wcard">
          <div className="wi" style={{ background: w.c }}><span style={{ color: w.ic }}>{w.icon}</span></div>
          <div><div className="wt">{w.t}</div><div className="wd">{w.d}</div></div>
        </div>
      ))}
    </div>
    <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 32, marginBottom: 22, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(234,179,8,.07)', borderRadius: '50%' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="gl" style={{ marginBottom: 10 }}>Track Record</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 16 }}>
          {[{ v: '5,000+', l: 'Workers Placed' }, { v: '150+', l: 'Global Employers' }, { v: '12+', l: 'Countries Covered' }, { v: '99%', l: 'Legal Compliance' }].map((s, i) => (
            <div key={i}><div style={{ fontSize: 28, fontWeight: 900, color: '#EAB308' }}>{s.v}</div><div style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '.12em', marginTop: 4 }}>{s.l}</div></div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const AboutPage = () => (
  <div>
    <HBox tag="Company Overview" title="About SNJ Global Routes" sub="Connecting talent, empowering futures, building a safer world of work." />
    <div className="apg">
      {[
        { icon: <UsersIcon />, c: '#EFF6FF', ic: '#2563EB', t: 'Job Seekers',        s: 'We connect skilled workers from Bangladesh and beyond to verified opportunities across the globe — safely and legally.' },
        { icon: <EyeIcon />,   c: '#F0FDF4', ic: '#059669', t: 'Students & Graduates', s: 'We help students and fresh graduates access international internships, training programs, and entry-level positions abroad.' },
        { icon: <TrendIcon />, c: '#F5F3FF', ic: '#7C3AED', t: 'Employers',           s: 'We partner with companies worldwide to source reliable, skilled, and pre-verified talent to fill their workforce needs.' },
      ].map((p, i) => (
        <div key={i} className="apc">
          <div className="api" style={{ background: p.c, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', width: 56, height: 56, borderRadius: 16 }}><span style={{ color: p.ic }}>{p.icon}</span></div>
          <div className="apt">{p.t}</div><div className="aps">{p.s}</div>
        </div>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(234,179,8,.08)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="gl" style={{ marginBottom: 10 }}>Our Mission</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 14 }}>Making Global Hiring Transparent</div>
          {['Make global hiring transparent for workers and employers', 'Reduce illegal migration with legal pathways', 'Connect real talent with reputable companies worldwide'].map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#EAB308', flexShrink: 0 }}><CheckIcon /></span>
              <span style={{ fontSize: 12, color: '#CBD5E1', fontStyle: 'italic', lineHeight: 1.6 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'linear-gradient(135deg,#EAB308,#CA8A04)', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,.08)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 9, color: '#0B1F3A', fontWeight: 'bold', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 10 }}>Our Vision</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 14 }}>A Trusted Global Platform</div>
          {["Build the world's most trusted international recruitment platform", 'Expand to 25+ countries by 2030', 'Set the global standard for ethical worker placement'].map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#0B1F3A', flexShrink: 0 }}><TargetIcon /></span>
              <span style={{ fontSize: 12, color: '#0B1F3A', fontStyle: 'italic', lineHeight: 1.6 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const NetworkPage = () => (
  <div>
    <HBox tag="SNJ Global Presence" title="Our Network & Offices" sub="Globally connected across Europe, Middle East & Asia Pacific." />
    <div className="ng">
      {OFFICES.map((o, i) => (
        <div key={i} className="oc">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 32 }}>{o.flag}</span>
            <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20, background: o.active ? '#DCFCE7' : '#FEF3C7', color: o.active ? '#15803D' : '#B45309' }}>
              {o.active ? 'Active' : 'Expanding'}
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--navy)', marginTop: 12 }}>{o.city}</div>
          <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--tm)', letterSpacing: '.08em', marginTop: 2 }}>{o.country}</div>
          <div style={{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '.12em', marginTop: 10 }}>{o.role}</div>
        </div>
      ))}
    </div>
    <div className="wc">
      <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--navy)', marginBottom: 14 }}>Contact Your Network</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <a href="https://wa.me/8801348992268" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, color: '#15803D', fontWeight: 'bold', fontSize: 13, textDecoration: 'none', fontStyle: 'italic' }}>
          <PhoneIcon size={16} /> WhatsApp Support
        </a>
        <a href="mailto:directorsnj932@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, color: '#1D4ED8', fontWeight: 'bold', fontSize: 13, textDecoration: 'none', fontStyle: 'italic' }}>
          <MailIcon size={16} /> Email Director
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'rgba(11,31,58,.04)', border: '1px solid rgba(11,31,58,.1)', borderRadius: 12, color: 'var(--navy)', fontWeight: 'bold', fontSize: 13 }}>
          <span style={{ color: '#EAB308' }}><PhoneIcon size={16} /></span> +880 1348-992268
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// ─── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      icon: <HomeIcon />,  label: 'Overview' },
  { id: 'profile',       icon: <UserIcon />,  label: 'Company Profile' },
  { id: 'notifications', icon: <BellIcon />,  label: 'Notifications' },
  { id: 'requests',      icon: <FileIcon />,  label: 'Worker Requests' },
  { id: 'progress',      icon: <ChartIcon />, label: 'Progress Dashboard' },
  { id: 'whychoose',     icon: <StarIcon />,  label: 'Why Choose Us' },
  { id: 'about',         icon: <GlobeIcon />, label: 'About SNJ Global' },
  { id: 'network',       icon: <UsersIcon />, label: 'Global Network' },
];

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  // ✅ localStorage থেকে employer id নাও — login এর সময় save করা হয়েছে
  const employerData = JSON.parse(localStorage.getItem('employer') || '{}');
  const employerId   = employerData?.id || 1; // fallback 1

  const [tab,          setTab]    = useState('overview');
  const [sbOpen,       setSB]     = useState(true);
  const [showForm,     setForm]   = useState(false);
  const [showLogout,   setShowLogout] = useState(false); // ✅ logout confirm modal state
  const [toast,        setToast]  = useState({ msg: '', type: 'ok' });
  const [notifCnt,     setNC]     = useState(0);
  const [pendCnt,      setPC]     = useState(0);
  const navigate    = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const nd = await apiFetch(`/notifications?employer_id=${employerId}`);
        setNC(nd?.unread_count || 0);
        const rd = await apiFetch(`/worker-requests?employer_id=${employerId}&status=pending_review`);
        setPC(rd?.data?.length || 0);
      } catch {}
    };
    fetchCounts();
    const t = setInterval(fetchCounts, REFRESH_INTERVAL);
    return () => clearInterval(t);
  }, [employerId]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 4000);
  };

  // ✅ handleLogout — EmployerDashboard এর ভেতরে সঠিক জায়গায় define করা হয়েছে
  const handleLogout = () => {
    localStorage.removeItem('employer_token');
    localStorage.removeItem('employer');
    sessionStorage.clear();
        window.dispatchEvent(new Event('authChange'));
        navigate('/login', { replace: true });
    //window.location.href = '/login';
  };

  const navWithBadges = NAV.map(n => ({
    ...n,
    badge: n.id === 'notifications' ? notifCnt : n.id === 'requests' ? pendCnt : 0,
  }));

  const cur = NAV.find(n => n.id === tab);

  const renderPage = () => {
    const p = { employerId, setTab };
    switch (tab) {
      case 'overview':      return <OverviewPage  {...p} showSubmit={() => setForm(true)} />;
      case 'profile':       return <ProfilePage   {...p} />;
      case 'notifications': return <NotificationsPage {...p} />;
      case 'requests':      return <RequestsPage  {...p} showSubmit={() => setForm(true)} />;
      case 'progress':      return <ProgressPage  {...p} />;
      case 'whychoose':     return <WhyChoosePage />;
      case 'about':         return <AboutPage />;
      case 'network':       return <NetworkPage />;
      default:              return null;
    }
  };

  return (
    <>
      <style>{G}</style>
      <div className="root">
        {/* Sidebar */}
        <aside className={`sb${sbOpen ? '' : ' col'}`}>
          <div className="sb-logo">
            <div className="lm">SJ</div>
            {sbOpen && <div><div className="ln">SNJ Global</div><div className="lt">Employer Portal</div></div>}
          </div>
          {sbOpen && (
            <div className="sb-user">
              <div className="sb-ui">
                <div className="ui">{employerData?.company_name ? employerData.company_name.slice(0,2).toUpperCase() : 'EM'}</div>
                <div>
                  <div className="un" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {employerData?.company_name || 'Employer Portal'}
                  </div>
                  <div className="ur">Verified Account</div>
                </div>
              </div>
            </div>
          )}
          {sbOpen && pendCnt > 0 && (
            <div className="upill">
              <div className="udot" />
              <div className="ut">{pendCnt} Pending Review{pendCnt > 1 ? 's' : ''}</div>
            </div>
          )}
          <nav className="sb-nav">
            {navWithBadges.map(item => (
              <button key={item.id} className={`ni${tab === item.id ? ' act' : ''}`} onClick={() => setTab(item.id)}>
                <span className="nic">{item.icon}</span>
                {sbOpen && <span className="nl">{item.label}</span>}
                {item.badge > 0 && <span className="nbadge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sb-bot">
            <button className="cb" onClick={() => setSB(!sbOpen)}>
              {sbOpen ? <CloseIcon /> : <MenuIcon />}
              {sbOpen && <span style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '.08em' }}>Collapse</span>}
            </button>
            {/* ✅ Logout button — setShowLogout(true) দিয়ে confirm modal খোলে */}
            <button className="lb" onClick={() => setShowLogout(true)}>
              <LogoutIcon />
              {sbOpen && <span style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '.08em' }}>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="topbar">
            <div>
              <div className="tt">{cur?.label}</div>
              <div className="ts2">SNJ GlobalRoutes — Employer Portal · Live Data</div>
            </div>
            <div className="tr">
              {pendCnt > 0 && (
                <div className="upend">
                  <div className="upd" /><span className="upt">{pendCnt} Pending</span>
                </div>
              )}
              <div className="bw" onClick={() => setTab('notifications')}>
                <div className="bb"><BellIcon /></div>
                {notifCnt > 0 && <span className="bc">{notifCnt}</span>}
              </div>
              <button className="sbtn" onClick={() => setForm(true)} style={{ fontSize: 10 }}>
                <PlusIcon size={14} /> New Request
              </button>
            </div>
          </div>
          <div className="pc">{renderPage()}</div>
        </main>
      </div>

      {/* ✅ Logout Confirm Modal */}
      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}

      {/* Submit Modal */}
      {showForm && (
        <SubmitRequestModal
          employerId={employerId}
          onClose={() => setForm(false)}
          onSuccess={(msg) => {
            showToast(msg, 'ok');
            setTab('requests');
          }}
        />
      )}

      <Toast msg={toast.msg} type={toast.type} />
    </>
  );
}