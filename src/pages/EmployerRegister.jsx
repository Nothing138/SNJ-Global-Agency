import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Factory, Globe, Mail, Phone, Lock, CreditCard,
  Hash, ShieldCheck, ArrowRight, Loader2, MailQuestion, Users,
  FileText, CheckCircle2, Eye, EyeOff, ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

// ─── Config ───────────────────────────────────────────────────────────────────
const API = 'http://snj-global-agency-production.up.railway.app/api';

const INDUSTRIES = [
  'Manufacturing', 'Construction', 'Food & Beverage', 'Oil & Gas',
  'Technology', 'Healthcare', 'Agriculture', 'Logistics', 'Retail', 'Finance',
];
const COUNTRIES = [
  'Bangladesh', 'Malaysia', 'Germany', 'UAE', 'France', 'United Kingdom',
  'Poland', 'Singapore', 'Saudi Arabia', 'Qatar', 'Japan', 'South Korea',
  'China', 'Australia', 'Italy', 'Spain', 'Netherlands', 'Turkey',
];
const HIRING_RANGES = [
  '1–50 workers/year', '51–200 workers/year',
  '201–500 workers/year', '500+ workers/year',
];
const STEPS = ['Company Info', 'Verification', 'Contact & Security', 'Email OTP'];

const STEP_FIELDS = [
  ['company_name', 'industry', 'country', 'hiring_capacity', 'description'],
  ['trade_license', 'business_reg', 'owner_id'],
  ['email', 'phone', 'password', 'confirm_password'],
];

// ─── Validators ───────────────────────────────────────────────────────────────
const validators = {
  company_name:     v => !v.trim() ? 'Company name is required' : v.trim().length < 3 ? 'Must be at least 3 characters' : '',
  industry:         v => !v ? 'Please select an industry' : '',
  country:          v => !v ? 'Please select a country' : '',
  hiring_capacity:  v => !v ? 'Please select hiring capacity' : '',
  description:      v => !v.trim() ? 'Description is required' : v.trim().length < 20 ? 'Please write at least 20 characters' : '',
  trade_license:    v => !v.trim() ? 'Trade license number is required' : v.trim().length < 5 ? 'Enter a valid license number' : '',
  business_reg:     v => !v.trim() ? 'Business registration ID is required' : '',
  owner_id:         v => !v.trim() ? 'Owner/Manager ID is required' : v.trim().length < 6 ? 'Enter a valid ID number' : '',
  email:            v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email' : '',
  phone:            v => !v.trim() ? 'Phone number is required' : !/^\+?[\d\s\-()\\.]{8,16}$/.test(v) ? 'Enter a valid phone number' : '',
  password:         v => !v ? 'Password is required' : v.length < 8 ? 'At least 8 characters' : !/[A-Z]/.test(v) ? 'Include an uppercase letter' : !/[0-9]/.test(v) ? 'Include a number' : !/[!@#$%^&*]/.test(v) ? 'Include a special character (!@#$%^&*)' : '',
  confirm_password: (v, all) => !v ? 'Please confirm your password' : v !== all.password ? 'Passwords do not match' : '',
};

const validateField = (name, value, allData) => {
  const fn = validators[name];
  return fn ? fn(value, allData) : '';
};

// ─────────────────────────────────────────────────────────────────────────────
// ✅ KEY FIX: Field component defined OUTSIDE the main component
//    এটা inside এ থাকলে প্রতি keystroke এ re-create হয় → focus হারায়
// ─────────────────────────────────────────────────────────────────────────────
const Field = ({ name, label, type = 'text', placeholder, icon: Icon,
                 value, error, touched: isTouched, onChange, onBlur,
                 children, extra }) => {
  const err = isTouched && error;
  const ok  = isTouched && !error && value;

  const borderCls = err ? 'border-red-400 bg-red-50 focus-within:ring-red-100'
                  : ok  ? 'border-green-400 bg-green-50 focus-within:ring-green-100'
                        : 'border-slate-200 bg-slate-50 focus-within:border-[#EAB308] focus-within:ring-[#EAB308]/20';

  const inputCls = `flex-1 ${Icon ? 'pl-2.5' : 'pl-4'} pr-3 py-3 bg-transparent outline-none text-sm text-[#0B1F3A] font-medium placeholder:text-slate-300`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={`field-${name}`}
        className="block text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>
      <div className={`flex items-center border-2 rounded-xl transition-all focus-within:ring-2 ${borderCls}`}>
        {Icon && <Icon className="ml-3.5 shrink-0 text-slate-400" size={15} />}
        {children
          ? React.cloneElement(children, {
              id: `field-${name}`,
              value,
              onChange: e => onChange(name, e.target.value),
              onBlur:   () => onBlur(name),
              className: inputCls,
            })
          : <input
              id={`field-${name}`}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(name, e.target.value)}
              onBlur={() => onBlur(name)}
              className={inputCls}
              autoComplete="off"
            />
        }
        {extra}
      </div>
      <AnimatePresence>
        {err && (
          <motion.p key="err" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[10px] font-bold text-red-500 flex items-center gap-1 pl-1">
            ✕ {error}
          </motion.p>
        )}
        {ok && !err && (
          <motion.p key="ok" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[10px] font-bold text-green-600 flex items-center gap-1 pl-1">
            <CheckCircle2 size={10} /> Looks good
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Step Indicator (also outside) ───────────────────────────────────────────
const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-1.5 mb-8">
    {STEPS.map((s, i) => (
      <React.Fragment key={i}>
        {i > 0 && (
          <div className={`flex-1 h-px transition-all duration-500 ${i <= step ? 'bg-[#EAB308]' : 'bg-slate-200'}`} />
        )}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all duration-300
            ${i < step  ? 'bg-[#EAB308] border-[#EAB308] text-[#0B1F3A]'
            : i === step ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white'
                         : 'bg-white border-slate-200 text-slate-400'}`}>
            {i < step ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-[8px] font-black uppercase tracking-wider hidden sm:block transition-colors
            ${i === step ? 'text-[#0B1F3A]' : 'text-slate-400'}`}>{s}</span>
        </div>
      </React.Fragment>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployerRegister = () => {
  const [step, setStep]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer]       = useState(0);
  const [registered, setRegistered] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '', industry: '', country: '', hiring_capacity: '',
    description: '', trade_license: '', business_reg: '', owner_id: '',
    email: '', phone: '', password: '', confirm_password: '',
  });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const update = (name, value) => {
    setFormData(p => {
      const next = { ...p, [name]: value };
      if (touched[name]) {
        setErrors(e => ({ ...e, [name]: validateField(name, value, next) }));
      }
      return next;
    });
  };

  const blur = (name) => {
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validateField(name, formData[name], formData) }));
  };

  const validateStep = () => {
    const fields = STEP_FIELDS[step] || [];
    const newErr = {}, newTouch = {};
    let valid = true;
    fields.forEach(f => {
      const e = validateField(f, formData[f], formData);
      newErr[f] = e; newTouch[f] = true;
      if (e) valid = false;
    });
    setErrors(p => ({ ...p, ...newErr }));
    setTouched(p => ({ ...p, ...newTouch }));
    return valid;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  // ── OTP ───────────────────────────────────────────────────────────────────────
  const sendOtp = async (isResend = false) => {
    if (!isResend && !validateStep()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/employer/send-otp`, { email: formData.email });
      setTimer(60);
      setOtpValues(['', '', '', '', '', '']);
      setOtpError('');
      if (!isResend) setStep(3);
      Swal.fire({
        icon: 'success',
        title: isResend ? 'Code Resent' : 'OTP Sent!',
        text: `Verification code sent to ${formData.email}`,
        timer: 2500, showConfirmButton: false,
        background: '#0B1F3A', color: '#fff',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error', title: 'Failed to Send OTP',
        text: err.response?.data?.message || 'Please check your email and try again.',
        background: '#0B1F3A', color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);
    setOtpError('');
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  // ── Final Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, otp: enteredOtp };
      delete payload.confirm_password;
      const res = await axios.post(`${API}/employer/register`, payload);
      if (res.data.success) setRegistered(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code')) {
        setOtpError(msg);
      } else {
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: msg, background: '#0B1F3A', color: '#fff' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Shorthand for Field props ─────────────────────────────────────────────────
  // এই helper দিয়ে প্রতিটা Field এ props বারবার লিখতে হবে না
  const fp = (name) => ({
    name,
    value:   formData[name],
    error:   errors[name],
    touched: touched[name],
    onChange: update,
    onBlur:   blur,
  });

  // ─── Step 0: Company Info ─────────────────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-5">
      <div>
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full mb-3">
          Step 1 of 4 · Company Details
        </span>
        <h1 className="text-[26px] font-bold text-[#0B1F3A] uppercase leading-tight">
          Company <em className="text-[#EAB308]">Info</em>
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">Start with your company's basic information.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field {...fp('company_name')} label="Company Name" placeholder="e.g. Coca-Cola BD Ltd." icon={Building2} />

        <Field {...fp('industry')} label="Industry Type" icon={Factory}>
          <select><option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>

        <Field {...fp('country')} label="Country of Operation" icon={Globe}>
          <select><option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field {...fp('hiring_capacity')} label="Annual Hiring Capacity" icon={Users}>
          <select><option value="">Select range</option>
            {HIRING_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <Field {...fp('description')} label="Company Description" icon={FileText}>
        <textarea
          placeholder="Describe your company, products/services, and typical worker requirements..."
          rows={3} style={{ resize: 'vertical' }}
        />
      </Field>

      <button type="button" onClick={nextStep}
        className="w-full bg-[#0B1F3A] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-[#162d54] active:scale-[0.99] transition-all">
        Continue to Verification <ArrowRight size={15} />
      </button>
      <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest">
        Already registered?{' '}
        <Link to="/login" className="text-[#0B1F3A] hover:text-[#EAB308] transition-colors">Login here</Link>
      </p>
    </div>
  );

  // ─── Step 1: Verification Docs ────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-5">
      <div>
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full mb-3">
          Step 2 of 4 · Verification Documents
        </span>
        <h1 className="text-[26px] font-bold text-[#0B1F3A] uppercase leading-tight">
          Company <em className="text-[#EAB308]">Verification</em>
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">Official documents to verify your company's legitimacy.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field {...fp('trade_license')} label="Trade License Number" placeholder="RJSC-2024-TL-XXXXX" icon={FileText} />
        <Field {...fp('business_reg')}  label="Business Registration ID" placeholder="BIN-XXXXXXX" icon={Hash} />
      </div>
      <Field {...fp('owner_id')} label="Owner / Manager National ID" placeholder="National ID or Passport Number" icon={CreditCard} />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1.5">📎 Document Uploads</p>
        <p className="text-xs text-amber-700 leading-relaxed font-medium">
          Physical copies of your trade license, business registration, and owner ID will be requested via email after registration.
          Admin verification is required before account activation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={prevStep}
          className="border-2 border-slate-200 text-[#0B1F3A] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all">
          ← Back
        </button>
        <button type="button" onClick={nextStep}
          className="bg-[#0B1F3A] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-[#162d54] transition-all">
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );

  // ─── Step 2: Contact & Security ───────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-5">
      <div>
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full mb-3">
          Step 3 of 4 · Contact & Security
        </span>
        <h1 className="text-[26px] font-bold text-[#0B1F3A] uppercase leading-tight">
          Contact <em className="text-[#EAB308]">Details</em>
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">Your official contact info and a secure password.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field {...fp('email')} label="Email Address" type="email" placeholder="company@example.com" icon={Mail} />
        <Field {...fp('phone')} label="Phone Number"  type="tel"   placeholder="+880 1XXXXXXXXX" icon={Phone} />

        {/* Password — custom input inside Field to support show/hide */}
        <Field {...fp('password')} label="Password" icon={Lock}
          extra={
            <button type="button" tabIndex={-1} onClick={() => setShowPass(p => !p)}
              className="mr-3 text-slate-400 hover:text-slate-600 shrink-0 transition-colors">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Min 8 chars, A-Z, 0-9, !@#"
            autoComplete="new-password"
          />
        </Field>

        {/* Confirm Password */}
        <Field {...fp('confirm_password')} label="Confirm Password" icon={Lock}
          extra={
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(p => !p)}
              className="mr-3 text-slate-400 hover:text-slate-600 shrink-0 transition-colors">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </Field>
      </div>

      {/* Password checklist */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">Password Requirements</p>
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: 'At least 8 characters', test: v => v.length >= 8 },
            { label: 'One uppercase letter',  test: v => /[A-Z]/.test(v) },
            { label: 'One number (0–9)',       test: v => /[0-9]/.test(v) },
            { label: 'One special character', test: v => /[!@#$%^&*]/.test(v) },
          ].map((r, i) => {
            const passed = formData.password && r.test(formData.password);
            return (
              <div key={i} className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors ${passed ? 'text-green-600' : 'text-blue-400'}`}>
                {passed
                  ? <CheckCircle2 size={10} />
                  : <span className="w-2.5 h-2.5 rounded-full border border-blue-300 inline-block shrink-0" />}
                {r.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={prevStep}
          className="border-2 border-slate-200 text-[#0B1F3A] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all">
          ← Back
        </button>
        <button type="button" onClick={() => sendOtp(false)} disabled={loading}
          className="bg-[#EAB308] text-[#0B1F3A] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-[#d4a017] transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={15} /> : <>Send OTP Code <ArrowRight size={15} /></>}
        </button>
      </div>
    </div>
  );

  // ─── Step 3: OTP ─────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full mb-3">
          Step 4 of 4 · Email Verification
        </span>
        <h1 className="text-[26px] font-bold text-[#0B1F3A] uppercase leading-tight">
          Verify <em className="text-[#EAB308]">Email</em>
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">
          Enter the 6-digit code sent to <strong className="text-[#0B1F3A]">{formData.email}</strong>
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <MailQuestion className="text-[#EAB308] shrink-0 mt-0.5" size={22} />
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Check your inbox (and spam folder). The code may take up to 2 minutes to arrive.
        </p>
      </div>

      <div>
        <label className="block text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 text-center mb-3">
          Enter 6-Digit Code
        </label>
        <div className="flex gap-2 justify-center">
          {otpValues.map((val, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text" inputMode="numeric" maxLength={1}
              value={val}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className={`w-11 h-14 text-center text-xl font-black rounded-xl outline-none transition-all border-2
                ${otpError ? 'border-red-400 bg-red-50'
                : val      ? 'border-[#EAB308] bg-amber-50 text-[#0B1F3A]'
                           : 'border-slate-200 bg-slate-50 focus:border-[#EAB308] focus:bg-amber-50/40'}`}
            />
          ))}
        </div>
        <AnimatePresence>
          {otpError && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-red-500 text-center mt-2.5 flex items-center justify-center gap-1">
              ✕ {otpError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-400 font-medium">
          {timer > 0 ? <span>Resend in <strong className="text-[#0B1F3A]">{timer}s</strong></span> : 'Code expired?'}
        </span>
        <button type="button" onClick={() => sendOtp(true)} disabled={timer > 0 || loading}
          className="text-[11px] font-black uppercase tracking-wider text-[#EAB308] disabled:text-slate-300 hover:underline transition-all">
          {loading ? 'Sending...' : 'Resend Code'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={prevStep}
          className="border-2 border-slate-200 text-[#0B1F3A] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all">
          ← Back
        </button>
        <button type="submit" disabled={loading || otpValues.join('').length < 6}
          className="bg-[#0B1F3A] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-[#162d54] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {loading
            ? <><Loader2 className="animate-spin" size={15} /> Submitting...</>
            : <>Complete Registration <ArrowRight size={15} /></>}
        </button>
      </div>
    </form>
  );

  // ─── Success ──────────────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4 space-y-5">
      <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={36} className="text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#0B1F3A] uppercase tracking-tight">Registration Complete!</h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-sm mx-auto">
          Your employer account for <strong className="text-[#0B1F3A]">{formData.company_name}</strong> has been submitted.
          Admin review typically takes <strong>24–48 hours</strong>.
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2.5 max-w-sm mx-auto">
        {[
          { l: 'Company',  v: formData.company_name },
          { l: 'Industry', v: formData.industry },
          { l: 'Country',  v: formData.country },
          { l: 'Email',    v: formData.email },
          { l: 'Status',   v: '⏳ Pending Admin Approval' },
        ].map((r, i) => (
          <div key={i} className="flex justify-between items-center border-b border-amber-100 pb-2 last:border-0 last:pb-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">{r.l}</span>
            <span className="text-xs font-bold text-[#0B1F3A] text-right max-w-[60%] truncate">{r.v}</span>
          </div>
        ))}
      </div>
      <Link to="/login"
        className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto bg-[#0B1F3A] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-[#162d54] transition-all">
        Go to Employer Login <ChevronRight size={15} />
      </Link>
    </motion.div>
  );

  const stepRenders = [renderStep0, renderStep1, renderStep2, renderStep3];

  // ─── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-38"
      style={{ fontFamily: '"Georgia", serif' }}>
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

        {/* Left Panel */}
        <div className="md:w-[38%] bg-[#0B1F3A] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#EAB308]/6 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/3 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-[#EAB308]/4 rounded-full translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldCheck size={26} className="text-[#EAB308]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase leading-tight">
                Employer<br /><span className="italic text-[#EAB308]">Portal</span>
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed font-light">
                Register your company to access SNJ GlobalRoutes' verified global workforce supply network.
              </p>
            </div>
            <div className="space-y-2.5">
              {['Submit worker requirements globally', 'Real-time supply & delivery tracking',
                'Verified worker pipelines only', 'Legal immigration pathways',
                'Dedicated B2B account manager'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shrink-0" />{f}
                </div>
              ))}
            </div>
            <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4">
              <p className="text-[#EAB308] text-[9px] font-black uppercase tracking-widest mb-1.5">Important Notice</p>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                Employer accounts require admin approval. You will be notified via email once verified and activated.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <ShieldCheck className="text-[#EAB308] shrink-0" size={16} />
            <span className="text-[9px] uppercase tracking-widest font-black text-slate-300">
              Official B2B Employer Registration
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-[62%] p-8 md:p-10 overflow-y-auto max-h-screen">
          {!registered && <StepIndicator step={step} />}
          <AnimatePresence mode="wait">
            <motion.div
              key={registered ? 'success' : step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {registered ? renderSuccess() : stepRenders[step]?.()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;