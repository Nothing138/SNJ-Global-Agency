import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, User, Mail, Phone, Lock, Globe,
  Briefcase, ShieldCheck, ArrowRight, Loader2, MailQuestion, Hash
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

// input field focus loss solve korar jonno eitike main component er baire nite hobe
const InputField = ({ label, icon, type = 'text', placeholder, field, value, onChange, required = true, children }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-[#0B1F3A] tracking-widest">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      {children || (
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#EAB308] text-sm"
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}
    </div>
  </div>
);

const B2BRegister = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    purpose: '',
    num_files: '',
    country: '',
    password: '',
    otp: '',
  });
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const theme = { navy: '#0B1F3A', gold: '#EAB308' };

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSendOtp = async () => {
    if (!formData.email || !formData.full_name || !formData.company_name) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Missing Details', 
        text: 'Please fill your name, company and email first.', 
        confirmButtonColor: theme.navy 
      });
    }
    setLoading(true);
    try {
      const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/b2b/send-otp', { email: formData.email });
      if (res.data.success) {
        setIsOtpSent(true);
        setTimer(60);
        Swal.fire({ icon: 'success', title: 'Code Sent', text: 'Verification code sent to your email.', confirmButtonColor: theme.gold });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpSent) return;
    setLoading(true);
    try {
      const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/b2b/register', formData);
      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'B2B Partner Registered!', text: 'Welcome to SNJ GlobalRoutes Partner Network.', timer: 2000, showConfirmButton: false });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.response?.data?.message || 'Please try again.', confirmButtonColor: theme.navy });
    } finally {
      setLoading(false);
    }
  };

  const purposes = ['Visa Referral', 'Travel Packages', 'Citizenship Programs', 'Multiple Services'];// 'Student Visa', 'Work Permit',

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 py-40" style={{ fontFamily: '"Times New Roman", serif' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
      >
        {/* Left Panel */}
        <div className="md:w-[38%] bg-[#0B1F3A] p-12 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Building2 size={32} className="text-[#EAB308]" />
            </div>
            <h2 className="text-4xl font-bold uppercase leading-tight">
              B2B <br />
              <span className="italic text-[#EAB308]">Partner</span> Portal
            </h2>
            <p className="mt-6 text-slate-300 text-lg leading-relaxed">
              Join our exclusive business network and unlock premium partner rates, dedicated support and bulk client management.
            </p>

            <div className="mt-10 space-y-4">
              {['Exclusive B2B Pricing', 'Dedicated Account Manager', 'Bulk File Management', 'Priority Processing', 'Real-time Status Tracking'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <ShieldCheck size={14} className="text-[#EAB308] shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 mt-8">
            <ShieldCheck className="text-[#EAB308]" size={20} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure B2B Registration</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-[62%] p-8 md:p-12 overflow-y-auto">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#EAB308] mb-2">Partner Registration</p>
            <h1 className="text-[34px] font-bold text-[#0B1F3A] uppercase leading-tight">
              Create <span className="italic text-[#EAB308]">B2B</span> Account
            </h1>
            <p className="text-[#64748B]">Register your company to access our partner network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <InputField label="Full Name" icon={<User size={18} />} placeholder="John Smith" field="full_name" value={formData.full_name} onChange={update} />
              <InputField label="Company Name" icon={<Building2 size={18} />} placeholder="Your Company Ltd." field="company_name" value={formData.company_name} onChange={update} />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <InputField label="Email Address" readOnly={isOtpSent} icon={<Mail size={18} />} type="email" placeholder="partner@company.com" field="email" value={formData.email} onChange={update} />
              <InputField label="Phone Number" icon={<Phone size={18} />} type="tel" placeholder="+880 1XXXXXXXXX" field="phone" value={formData.phone} onChange={update} />
            </div>

            <InputField label="Purpose / Service Type" icon={<Briefcase size={18} />} field="purpose">
              <select
                required
                value={formData.purpose}
                onChange={(e) => update('purpose', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#EAB308] text-sm appearance-none"
              >
                <option value="">Select your service purpose</option>
                {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </InputField>

            <div className="grid md:grid-cols-2 gap-5">
              {/*/<InputField label="Expected Number of Files" icon={<Hash size={18} />} type="number" placeholder="e.g. 50" field="num_files" value={formData.num_files} onChange={update} />*/}
              <InputField label="Primary Country of Operation" icon={<Globe size={18} />} placeholder="e.g. Bangladesh" field="country" value={formData.country} onChange={update} />
            </div>

            <InputField label="Secure Password" icon={<Lock size={18} />} type="password" placeholder="••••••••" field="password" value={formData.password} onChange={update} />

            <AnimatePresence>
              {isOtpSent && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2">
                  <label className="text-[10px] font-bold text-[#EAB308] uppercase tracking-widest">Enter 6-Digit Verification Code</label>
                  <div className="relative">
                    <MailQuestion className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308]" size={18} />
                    <input
                      required
                      type="text"
                      maxLength="6"
                      placeholder="000000"
                      value={formData.otp} // এই লাইনটি যোগ করুন, নাহলে ভ্যালু স্টেট-এ আপডেট হবে না
                      className="w-full pl-12 py-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center font-bold tracking-[0.5em] text-xl"
                      onChange={(e) => update('otp', e.target.value)}
                    />
                  </div>
                  {timer > 0 && (
                    <p className="text-xs text-slate-400 text-center">Resend code in {timer}s</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 space-y-3">
              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-[#EAB308] text-[#0B1F3A] py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#d4a017] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Get Verification Code'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1F3A] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-[#162d54] transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete B2B Registration <ArrowRight size={18} /></>}
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-6">
            <span>Already registered? <Link to="/login" className="text-[#0B1F3A] hover:underline ml-1">B2B Login</Link></span>
            <span>Regular user? <Link to="/register" className="text-[#0B1F3A] hover:underline ml-1">User Register</Link></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BRegister;