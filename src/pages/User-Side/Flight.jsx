// Flight.jsx - Full Featured: One Way | Round Trip | Multi City
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
    Plane, Calendar, Users, MapPin, Phone, Mail,
    User, ShieldCheck, ArrowRight, Star, Clock, Globe,
    CheckCircle, MessageSquare, Briefcase, Zap, Plus, Trash2, ArrowLeftRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import planePhoto from '../../assets/planephoto.jpg';
import FloatingButton from './FloatingButton';

const API_BASE = 'https://snj-global-agency-backend-nhxq.onrender.com/api';

const TRIP_TABS = [
    { key: 'oneway', label: 'One Way', icon: Plane },
    { key: 'roundtrip', label: 'Round Trip', icon: ArrowLeftRight },
    { key: 'multicity', label: 'Multi City', icon: Globe },
];

const emptyLeg = () => ({ departure_city: '', destination_city: '', travel_date: '' });

const Flight = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        email: '',
        contact_number: '',
        address: '',
        passport_number: '',
        departure_city: '',
        destination_city: '',
        travel_date: '',
        return_date: '',
        passenger_count: 1,
        trip_type: 'oneway',
        policy_accepted: false,
        // multi-city legs
        legs: [emptyLeg(), emptyLeg()],
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            axios.get(`${API_BASE}/user-details/${storedUser.id}`)
                .then(res => {
                    const d = res.data;
                    setFormData(prev => ({
                        ...prev,
                        full_name: `${d.first_name || ''} ${d.surname || ''}`.trim() || storedUser.full_name || '',
                        email: d.email || storedUser.email || '',
                        contact_number: d.phone_number || '',
                        passport_number: d.passport_number || '',
                        address: d.address || ''
                    }));
                })
                .catch(() => {
                    setFormData(prev => ({
                        ...prev,
                        full_name: storedUser.full_name || '',
                        email: storedUser.email || ''
                    }));
                });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleLegChange = (index, field, value) => {
        setFormData(prev => {
            const legs = [...prev.legs];
            legs[index] = { ...legs[index], [field]: value };
            return { ...prev, legs };
        });
    };

    const addLeg = () => {
        if (formData.legs.length >= 5) return;
        setFormData(prev => ({ ...prev, legs: [...prev.legs, emptyLeg()] }));
    };

    const removeLeg = (index) => {
        if (formData.legs.length <= 2) return;
        setFormData(prev => ({ ...prev, legs: prev.legs.filter((_, i) => i !== index) }));
    };

    const validateForm = () => {
        const required = ['full_name', 'email', 'contact_number', 'passport_number'];
        for (const f of required) {
            if (!formData[f]?.trim()) {
                Swal.fire({ title: 'Missing Field', text: `Please fill in ${f.replace('_', ' ')}.`, icon: 'warning', confirmButtonColor: '#0B1F3A' });
                return false;
            }
        }
        if (formData.trip_type === 'multicity') {
            for (let i = 0; i < formData.legs.length; i++) {
                const l = formData.legs[i];
                if (!l.departure_city || !l.destination_city || !l.travel_date) {
                    Swal.fire({ title: 'Incomplete Flight', text: `Please complete all details for Flight ${i + 1}.`, icon: 'warning', confirmButtonColor: '#0B1F3A' });
                    return false;
                }
            }
        } else {
            if (!formData.departure_city || !formData.destination_city || !formData.travel_date) {
                Swal.fire({ title: 'Missing Route', text: 'Please fill departure, destination and travel date.', icon: 'warning', confirmButtonColor: '#0B1F3A' });
                return false;
            }
            if (formData.trip_type === 'roundtrip' && !formData.return_date) {
                Swal.fire({ title: 'Return Date Required', text: 'Please select return date for round trip.', icon: 'warning', confirmButtonColor: '#0B1F3A' });
                return false;
            }
        }
        if (!formData.policy_accepted) {
            Swal.fire({ title: 'Agreement Required', text: 'Please accept the booking policy.', icon: 'warning', confirmButtonColor: '#0B1F3A' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const payload = {
            user_id: user?.id,
            full_name: formData.full_name,
            age: formData.age || null,
            email: formData.email,
            contact_number: formData.contact_number,
            address: formData.address,
            passport_number: formData.passport_number,
            passenger_count: formData.passenger_count || 1,
            trip_type: formData.trip_type,
            policy_accepted: formData.policy_accepted,
            // route data
            departure_city: formData.trip_type !== 'multicity' ? formData.departure_city : formData.legs[0]?.departure_city,
            destination_city: formData.trip_type !== 'multicity' ? formData.destination_city : formData.legs[formData.legs.length - 1]?.destination_city,
            travel_date: formData.trip_type !== 'multicity' ? formData.travel_date : formData.legs[0]?.travel_date,
            return_date: formData.trip_type === 'roundtrip' ? formData.return_date : null,
            // full multi-city legs JSON
            multi_city_legs: formData.trip_type === 'multicity' ? JSON.stringify(formData.legs) : null,
        };

        try {
            const response = await axios.post(`${API_BASE}/flight-request`, payload, { timeout: 15000 });
            if (response.data?.success) {
                Swal.fire({
                    title: '✈️ Request Submitted!',
                    html: `<p>Your flight request has been received.</p><p style="font-size:12px;color:#64748B;margin-top:8px;">A confirmation email has been sent to <b>${formData.email}</b></p>`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    confirmButtonColor: '#0B1F3A'
                });
                setTimeout(() => navigate('/'), 3000);
            }
        } catch (error) {
            // If timeout/network error but request might have gone through
            if (error.code === 'ECONNABORTED' || !error.response) {
                Swal.fire({
                    title: 'Request Sent',
                    text: 'Your request may have been submitted. We will contact you shortly.',
                    icon: 'info',
                    confirmButtonColor: '#0B1F3A'
                });
                setTimeout(() => navigate('/'), 3000);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#0B1F3A'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Times_New_Roman',_serif]">
            <Navbar />
            <FloatingButton />

            <main className="relative pt-36 pb-24 overflow-hidden">
                {/* Hero Background */}
                <div className="absolute top-0 left-0 w-full h-[700px] overflow-hidden z-0">
                    <div className="absolute inset-0 bg-[#0B1F3A]">
                        <img src={planePhoto} className="w-full h-full object-cover opacity-40 scale-105" alt="Luxury Flight" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFC]/60 to-[#F8FAFC]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">

                        {/* Left Info */}
                        <div className="lg:col-span-5 pt-12 text-[#0F172A]">
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] text-xs font-bold uppercase tracking-[0.2em] mb-8">
                                    <Globe size={14} className="animate-pulse text-[#EAB308]" /> World Class Travel
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 text-[#0B1F3A]">
                                    Travel Beyond <br />
                                    <span className="italic text-[#EAB308]">Expectations.</span>
                                </h1>
                                <p className="text-[#64748B] text-lg leading-relaxed mb-10 max-w-md">
                                    Experience <span className="italic text-[#EAB308]">Premium Quality Services</span> of air travel. We handle the details while you enjoy the journey.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { icon: Star, text: "VIP Priority Lounge Access", color: "text-[#EAB308]" },
                                        { icon: ShieldCheck, text: "Fully Insured Travel Guarantee", color: "text-[#0B1F3A]" },
                                        { icon: Clock, text: "24/7 Dedicated Travel Concierge", color: "text-[#0B1F3A]" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-all border border-[#E5E7EB]">
                                                <item.icon className={item.color} size={24} />
                                            </div>
                                            <p className="font-bold text-[#0F172A]">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white rounded-[2.5rem] shadow-2xl border border-[#E5E7EB] overflow-hidden"
                            >
                                <div className="p-8 pb-0 flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Request a Flight</h2>
                                        <p className="text-[#64748B] text-xs mt-1">All fields marked * are required</p>
                                    </div>
                                    <Plane size={40} className="text-[#E5E7EB] -rotate-12 mb-2" />
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
                                    {/* Trip Type Tabs */}
                                    <div className="flex p-1 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] w-full">
                                        {TRIP_TABS.map(({ key, label, icon: Icon }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, trip_type: key }))}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.trip_type === key ? 'bg-[#0B1F3A] text-white shadow-md' : 'text-[#64748B] hover:text-[#0B1F3A]'}`}
                                            >
                                                <Icon size={13} /> {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Passenger Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <FormInput label="Full Name *" name="full_name" value={formData.full_name} icon={User} onChange={handleChange} placeholder="As per Passport" required />
                                        <FormInput label="Age *" name="age" type="number" min="1" max="120" value={formData.age} icon={Calendar} onChange={handleChange} placeholder="Years" required />
                                        <FormInput label="Email Address *" name="email" type="email" value={formData.email} icon={Mail} onChange={handleChange} placeholder="your@email.com" required />
                                        <FormInput label="Contact Number *" name="contact_number" value={formData.contact_number} icon={Phone} onChange={handleChange} placeholder="+880" required />
                                        <FormInput label="Passport Number *" name="passport_number" value={formData.passport_number} icon={ShieldCheck} onChange={handleChange} placeholder="Mandatory for flight" required />
                                        <FormInput label="Passengers" name="passenger_count" type="number" min="1" max="50" value={formData.passenger_count} icon={Users} onChange={handleChange} />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[#64748B] ml-2 tracking-widest block">Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-4 text-[#E5E7EB] group-focus-within:text-[#EAB308] transition-colors" size={18} />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Permanent address..."
                                                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-sm text-[#0F172A] focus:ring-4 focus:ring-[#0B1F3A]/5 focus:border-[#0B1F3A] outline-none transition-all min-h-[60px] resize-none placeholder:text-[#CBD5E1]"
                                            />
                                        </div>
                                    </div>

                                    {/* Route Section */}
                                    <AnimatePresence mode="wait">
                                        {formData.trip_type === 'multicity' ? (
                                            <motion.div key="multicity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">Flight Legs</h3>
                                                    <button
                                                        type="button"
                                                        onClick={addLeg}
                                                        disabled={formData.legs.length >= 5}
                                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#EAB308] border border-[#EAB308] px-4 py-2 rounded-xl hover:bg-[#EAB308] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus size={13} /> Add Flight
                                                    </button>
                                                </div>

                                                {formData.legs.map((leg, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.97 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-5 space-y-4"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A] flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[9px]">{index + 1}</span>
                                                                Flight {index + 1}
                                                            </span>
                                                            {formData.legs.length > 2 && (
                                                                <button type="button" onClick={() => removeLeg(index)} className="text-red-400 hover:text-red-600 transition-colors">
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <FormInput
                                                                label="From *" name={`leg_dep_${index}`}
                                                                value={leg.departure_city} icon={MapPin}
                                                                onChange={e => handleLegChange(index, 'departure_city', e.target.value)}
                                                                placeholder="Departure city" required
                                                            />
                                                            <FormInput
                                                                label="To *" name={`leg_dest_${index}`}
                                                                value={leg.destination_city} icon={MapPin}
                                                                onChange={e => handleLegChange(index, 'destination_city', e.target.value)}
                                                                placeholder="Arrival city" required
                                                            />
                                                            <FormInput
                                                                label="Date *" name={`leg_date_${index}`}
                                                                type="date" min={today}
                                                                value={leg.travel_date} icon={Calendar}
                                                                onChange={e => handleLegChange(index, 'travel_date', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div key="simple" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <FormInput label="Departure From *" name="departure_city" value={formData.departure_city} icon={MapPin} onChange={handleChange} placeholder="Origin City" required />
                                                    <FormInput label="Arrival To *" name="destination_city" value={formData.destination_city} icon={MapPin} onChange={handleChange} placeholder="Destination City" required />
                                                    <FormInput label="Travel Date *" name="travel_date" type="date" min={today} value={formData.travel_date} icon={Calendar} onChange={handleChange} required />
                                                    {formData.trip_type === 'roundtrip' && (
                                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                                            <FormInput label="Return Date *" name="return_date" type="date" min={formData.travel_date || today} value={formData.return_date} icon={Calendar} onChange={handleChange} required />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Policy */}
                                    <label className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] cursor-pointer transition-all hover:border-[#EAB308]">
                                        <input
                                            type="checkbox"
                                            name="policy_accepted"
                                            checked={formData.policy_accepted}
                                            onChange={handleChange}
                                            className="mt-1 h-5 w-5 cursor-pointer rounded border-[#E5E7EB] text-[#0B1F3A] focus:ring-[#0B1F3A]"
                                        />
                                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight leading-relaxed">
                                            I certify all information is accurate and I agree to the{' '}
                                            <span className="text-[#0B1F3A] underline italic">Booking Policy</span>. *
                                        </span>
                                    </label>

                                    {/* Submit */}
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className={`w-full py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.97] ${isSubmitting ? 'bg-[#E5E7EB] text-[#64748B] cursor-not-allowed' : 'bg-[#0B1F3A] hover:bg-[#0F172A] text-white shadow-[#0B1F3A]/20'}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-3">
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Securing Request...
                                            </span>
                                        ) : (
                                            <>Request Exclusive Booking <ArrowRight size={18} className="text-[#EAB308]" /></>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mt-32 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-[#0B1F3A] mb-6 uppercase tracking-tight">
                                Why Choose <span className="text-[#EAB308]">SNJ GlobalRoutes?</span>
                            </h2>
                            <p className="text-[#64748B] text-lg italic mb-10">
                                As a premier luxury travel facilitator, we don't just book trips — we engineer memories. Our 2026 collection represents the pinnacle of global exploration.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { icon: CheckCircle, text: 'Certified Excellence' },
                                    { icon: Globe, text: '15+ Global Hubs' },
                                    { icon: ShieldCheck, text: 'Secure Logistics' },
                                    { icon: Zap, text: 'Rapid Processing' },
                                ].map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Icon className="text-[#EAB308]" size={20} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0B1F3A] p-8 rounded-3xl text-white flex items-center justify-center text-center shadow-xl border-b-4 border-[#EAB308]">
                                <p className="text-xl italic font-bold">"99% Client Satisfaction Record"</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070" alt="Resort" className="rounded-3xl h-48 w-full object-cover shadow-lg" />
                            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070" alt="Travel" className="rounded-3xl h-48 w-full object-cover shadow-lg" />
                            <div className="bg-white p-8 rounded-3xl border border-[#EAB308] flex flex-col justify-center items-center text-center shadow-xl">
                                <h3 className="text-4xl font-bold text-[#0B1F3A]">10K+</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Annual Travelers</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Strip */}
                    <div className="mt-32 bg-[#0B1F3A] rounded-[3rem] p-12 text-white">
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            {[
                                { icon: ShieldCheck, title: 'Secure Trip', sub: 'Premium Coverage' },
                                { icon: Users, title: 'VIP Access', sub: 'Skip-The-Line' },
                                { icon: Calendar, title: 'Flexible', sub: 'Easy Rescheduling' },
                                { icon: Mail, title: '24/7 Support', sub: 'Global Concierge' },
                            ].map(({ icon: Icon, title, sub }, i) => (
                                <div key={i} className="space-y-2">
                                    <Icon className="mx-auto text-[#EAB308]" size={28} />
                                    <h4 className="text-sm font-bold uppercase tracking-widest italic">{title}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase">{sub}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <h2 className="text-3xl font-bold italic tracking-widest mb-10">START YOUR JOURNEY TODAY</h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button className="flex items-center justify-center gap-3 bg-[#25D366] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                    <MessageSquare size={18} /> Whatsapp Booking
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-[#1E293B] border border-gray-700 px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                    <Mail size={18} /> Email Reservation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const FormInput = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-bold uppercase text-[#64748B] ml-2 block tracking-widest group-focus-within:text-[#0B1F3A] transition-colors">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] group-focus-within:text-[#EAB308] transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <input
                {...props}
                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-sm text-[#0F172A] focus:ring-4 focus:ring-[#0B1F3A]/5 focus:border-[#0B1F3A] outline-none transition-all placeholder:text-[#CBD5E1]"
            />
        </div>
    </div>
);

export default Flight;