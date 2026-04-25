//flighgt
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
    Plane, Calendar, Users, MapPin, Phone, Mail, 
    User, ShieldCheck, ArrowRight, Star, Clock, Globe,
    CheckCircle, MessageSquare, Briefcase, Zap, Headphones
} from 'lucide-react';
import Navbar from '../../components/Navbar'; 
import planePhoto from '../../assets/planephoto.jpg';
import FloatingButton from './FloatingButton';

const Flight = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        passenger_count: 1,
        trip_type: 'oneway',
        policy_accepted: false
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser);
            
            axios.get(`https://snj-global-agency-backend.onrender.com/api/user-details/${storedUser.id}`)
                .then(res => {
                    const data = res.data;
                    setFormData(prev => ({
                        ...prev,
                        full_name: `${data.first_name || ''} ${data.surname || ''}`.trim() || storedUser.full_name,
                        email: data.email || storedUser.email,
                        contact_number: data.phone_number || '',
                        passport_number: data.passport_number || '',
                        address: data.address || ''
                    }));
                })
                .catch(err => {
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
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.policy_accepted) {
            return Swal.fire({
                title: 'Agreement Required',
                text: 'Please accept the flight policy.',
                icon: 'warning',
                confirmButtonColor: '#0B1F3A'
            });
        }

        setIsSubmitting(true);
        try {
            const response = await axios({
                method: 'post',
                url: 'https://snj-global-agency-backend.onrender.com/api/flight-request',
                data: { ...formData, user_id: user?.id },
                timeout: 5000 
            });

            if (response.data) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Flight request submitted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => { navigate("/"); }, 2000);
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' || !error.response) {
                navigate("/");
            } else {
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Connection error!',
                    icon: 'error',
                    confirmButtonColor: '#0B1F3A'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Times_New_Roman',_serif] transition-colors duration-300">
            <FloatingButton />
            
            <main className="relative pt-36 pb-24 overflow-hidden">
                {/* Background Decoration with Image Overlay */}
                <div className="absolute top-0 left-0 w-full h-[650px] overflow-hidden z-0">
                    <div className="absolute inset-0 bg-[#0B1F3A]">
                        {/* Luxury Plane Background Image */}
                        <img 
                            src={planePhoto} // Eikhane change kora hoyeche
                            className="w-full h-full object-cover opacity-40 scale-105" 
                            alt="Luxury Flight Background"
                        />
                    </div>
                    {/* Gradient Fade for smooth transition */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFC]/60 to-[#F8FAFC]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* Left Info Section */}
                        <div className="lg:col-span-5 pt-12 text-[#0F172A]">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }} 
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-[#0B1F3A] text-xs font-bold uppercase tracking-[0.2em] mb-8">
                                    <Globe size={14} className="animate-pulse text-[#EAB308]" /> World Class Travel
                                </div>
                                
                                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 text-[#0B1F3A]">
                                    Travel Beyond <br /> 
                                    <span className="italic text-[#EAB308]">Expectations.</span>
                                </h1>

                                <p className="text-[#64748B] text-lg leading-[1.6] mb-10 max-w-md">
                                    Experience the <span className="italic text-[#EAB308]">Premium Quality Services</span> of air travel. We handle the details while you enjoy the journey.
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

                        {/* Form Section */}
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
                                    </div>
                                    <Plane size={40} className="text-[#E5E7EB] -rotate-12 mb-2" />
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
                                    <div className="flex p-1 bg-[#F8FAFC] rounded-2xl w-fit border border-[#E5E7EB]">
                                        {['oneway', 'roundtrip'].map((type) => (
                                            <button 
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, trip_type: type})}
                                                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.trip_type === type ? 'bg-[#0B1F3A] text-white shadow-md' : 'text-[#64748B] hover:text-[#0B1F3A]'}`}
                                            >
                                                {type === 'oneway' ? 'One Way' : 'Round Trip'}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <FormInput label="Full Name *" name="full_name" value={formData.full_name} icon={User} onChange={handleChange} placeholder="As per Passport" />
                                        <FormInput label="Age *" name="age" type="number" value={formData.age} icon={Calendar} onChange={handleChange} placeholder="Years" />
                                        <FormInput label="Email Address *" name="email" type="email" value={formData.email} icon={Mail} onChange={handleChange} placeholder="Enter your email" />
                                        <FormInput label="Contact Number *" name="contact_number" value={formData.contact_number} icon={Phone} onChange={handleChange} placeholder="+880" />
                                        <FormInput label="Passport Number *" name="passport_number" value={formData.passport_number} icon={ShieldCheck} onChange={handleChange} placeholder="Mandatory for flight" />
                                        <FormInput label="Passengers Count" name="passenger_count" type="number" value={formData.passenger_count} icon={Users} onChange={handleChange} />
                                        <FormInput label="Departure From *" name="departure_city" value={formData.departure_city} icon={MapPin} onChange={handleChange} placeholder="Origin City" />
                                        <FormInput label="Arrival To *" name="destination_city" value={formData.destination_city} icon={MapPin} onChange={handleChange} placeholder="Destination City" />
                                        <FormInput label="Preferred Flight Date *" name="travel_date" type="date" min={today} value={formData.travel_date} icon={Calendar} onChange={handleChange} />
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-[#64748B] ml-2 tracking-widest">Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 text-[#E5E7EB] group-focus-within:text-[#EAB308] transition-colors" size={18} />
                                                <textarea 
                                                    name="address" 
                                                    value={formData.address} 
                                                    onChange={handleChange}
                                                    placeholder="Permanent address..."
                                                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-sm text-[#0F172A] focus:ring-4 focus:ring-[#0B1F3A]/5 focus:border-[#0B1F3A] outline-none transition-all min-h-[54px] resize-none placeholder:text-[#E5E7EB]"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <label className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] cursor-pointer transition-all hover:border-[#EAB308]">
                                                <input 
                                                    type="checkbox" 
                                                    name="policy_accepted" 
                                                    checked={formData.policy_accepted} 
                                                    onChange={handleChange}
                                                    className="mt-1 h-5 w-5 cursor-pointer rounded border-[#E5E7EB] text-[#0B1F3A] focus:ring-[#0B1F3A]" 
                                                />
                                                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight">
                                                    I certify that all information is accurate and I agree to the <span className="text-[#0B1F3A] underline italic">Booking Policy</span>. *
                                                </span>
                                            </label>
                                        </div>

                                        <button 
                                            disabled={isSubmitting}
                                            type="submit"
                                            className={`md:col-span-2 w-full py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.97] ${isSubmitting ? 'bg-[#E5E7EB] text-[#64748B] cursor-not-allowed' : 'bg-[#0B1F3A] hover:bg-[#0F172A] text-white shadow-[#0B1F3A]/20'}`}
                                        >
                                            {isSubmitting ? 'Securing Request...' : <>Request Exclusive Booking <ArrowRight size={18} className="text-[#EAB308]" /></>}
                                        </button>
                                    </div>
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
                                As a premier luxury travel facilitator, we don't just book trips—we engineer memories. Our 2026 collection represents the pinnacle of global exploration.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-[#EAB308]" size={20}/>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">Certified Excellence</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="text-[#EAB308]" size={20}/>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">15+ Global Hubs</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-[#EAB308]" size={20}/>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">Secure Logistics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap className="text-[#EAB308]" size={20}/>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#0B1F3A]">Rapid Processing</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0B1F3A] p-8 rounded-3xl text-white flex flex-col justify-center items-center text-center shadow-xl border-b-4 border-[#EAB308]">
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
                    </div>

                    {/* CTA Strip */}
                    <div className="mt-32 bg-[#0B1F3A] rounded-[3rem] p-12 text-white relative overflow-hidden">
                        <div className="grid md:grid-cols-4 gap-8 text-center relative z-10">
                            {[
                                { icon: ShieldCheck, title: "Secure Trip", sub: "Premium Coverage" },
                                { icon: Users, title: "VIP Access", sub: "Skip-The-Line" },
                                { icon: Calendar, title: "Flexible", sub: "Easy Rescheduling" },
                                { icon: Mail, title: "24/7 Support", sub: "Global Concierge" }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <item.icon className="mx-auto text-[#EAB308]" size={28} />
                                    <h4 className="text-sm font-bold uppercase tracking-widest italic">{item.title}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 text-center relative z-10">
                            <h2 className="text-3xl font-bold italic tracking-widest mb-10">START YOUR JOURNEY TODAY</h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button className="flex items-center justify-center gap-3 bg-[#25D366] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                    <MessageSquare size={18}/> Whatsapp Booking
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-[#1E293B] border border-gray-700 px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                    <Mail size={18}/> Email Reservation
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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E5E7EB] group-focus-within:text-[#EAB308] transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <input 
                {...props}
                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-sm text-[#0F172A] focus:ring-4 focus:ring-[#0B1F3A]/5 focus:border-[#0B1F3A] outline-none transition-all placeholder:text-[#E5E7EB]"
            />
        </div>
    </div>
);

export default Flight;