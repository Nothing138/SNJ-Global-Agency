import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, MapPin, CreditCard, Briefcase, Phone, Calendar, ArrowLeft, Send, Camera, FileText, Globe, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ApplyVisa = () => {
    const { visaId } = useParams();
    const navigate = useNavigate();
    const [visaInfo, setVisaInfo] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [passportFile, setPassportFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '', surname: '', nationality: '', country: '', gender: 'Male',
        dob: '', id_number: '', passport: '', passport_expiry: '',
        location: '', profession: '', phone: ''
    });

    useEffect(() => {
        axios.get(`https://snj-global-agency-backend.onrender.com/api/visas`).then(res => {
            setVisaInfo(res.data.find(v => v.id == visaId));
        });
    }, [visaId]);

    const checkPassportExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = Math.abs(expiry - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 90;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let userId = null;

        if (userString) {
            const userData = JSON.parse(userString);
            userId = userData.id;
        }

        if (!token || !userId) {
            setLoading(false);
            return Swal.fire({
                title: 'Error',
                text: 'Session expired! Please login again.',
                icon: 'error',
                confirmButtonColor: '#0B1F3A'
            });
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('user_id', userId);
        data.append('visa_id', visaId);
        
        if (photo) data.append('photo', photo);
        if (passportFile) data.append('passport_file', passportFile);

        try {
            const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/visas/apply', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Application Submitted.',
                    icon: 'success',
                    confirmButtonColor: '#0B1F3A'
                });
                navigate('/');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.details || "Database error!";
            Swal.fire({
                title: 'Error',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#0B1F3A'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Times_New_Roman',_serif]">
            <Navbar />
            <div className="max-w-6xl mx-auto pt-40 pb-20 px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Info Card (Deep Navy Theme) */}
                    <div className="space-y-6">
                        <div className="p-8 bg-[#0B1F3A] rounded-[3rem] shadow-2xl shadow-[#0B1F3A]/20 relative overflow-hidden group text-white">
                            <Globe size={150} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform text-[#EAB308]" />
                            <h2 className="text-4xl font-bold uppercase leading-none">{visaInfo?.country_name}</h2>
                            <p className="mt-2 font-bold text-[#F8FAFC]/70 uppercase tracking-widest text-xs">
                                <span className="italic text-[#EAB308]">Premium</span> {visaInfo?.type} VISA PORTAL
                            </p>
                            <div className="mt-10 py-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 inline-block font-bold text-2xl">
                                FEE: <span className="text-[#EAB308]">${visaInfo?.application_charge}</span>
                            </div>
                        </div>
                        <div className="p-6 bg-white border border-[#E5E7EB] rounded-[2rem] flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-[#EAB308]/10 rounded-full flex items-center justify-center text-[#EAB308]"><CheckCircle /></div>
                            <p className="text-[12px] font-bold uppercase text-[#64748B] leading-[1.6]">Secure 256-bit encrypted application processing</p>
                        </div>
                    </div>

                    {/* Right: Form Area */}
                    <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-8 md:p-12 rounded-[4rem] shadow-xl shadow-[#0B1F3A]/5">
                        <h1 className="text-[40px] font-bold text-[#0B1F3A] mb-8 leading-tight">Apply for Visa</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Given Name</label>
                                    <input required placeholder="First Name" className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Surname</label>
                                    <input required placeholder="Last Name" className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" onChange={e => setFormData({...formData, surname: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Nationality</label>
                                    <input required placeholder="Your Country" className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" onChange={e => setFormData({...formData, nationality: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Gender</label>
                                    <select className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all appearance-none text-[#0F172A]" onChange={e => setFormData({...formData, gender: e.target.value})}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB]">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Passport Number</label>
                                    <input required placeholder="Ex: A0123456" className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" onChange={e => setFormData({...formData, passport: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest ml-2">Passport Expiry</label>
                                    <input required type="date" className="w-full p-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#EAB308] transition-all text-[#0F172A]" onChange={e => setFormData({...formData, passport_expiry: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                                <div className="relative group">
                                    <div className="p-8 border-2 border-dashed border-[#E5E7EB] rounded-3xl group-hover:border-[#EAB308] transition-colors text-center cursor-pointer overflow-hidden bg-[#F8FAFC]">
                                        <Camera className="mx-auto text-[#0B1F3A] mb-2" />
                                        <p className="text-[10px] font-bold uppercase text-[#64748B]">Photo (JPEG)</p>
                                        <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPhoto(e.target.files[0])} />
                                        {photo && <p className="text-[9px] text-[#EAB308] mt-2 font-bold uppercase italic">{photo.name}</p>}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="p-8 border-2 border-dashed border-[#E5E7EB] rounded-3xl group-hover:border-[#EAB308] transition-colors text-center cursor-pointer overflow-hidden bg-[#F8FAFC]">
                                        <FileText className="mx-auto text-[#0B1F3A] mb-2" />
                                        <p className="text-[10px] font-bold uppercase text-[#64748B]">Passport Copy (PDF/JPG)</p>
                                        <input type="file" required accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPassportFile(e.target.files[0])} />
                                        {passportFile && <p className="text-[9px] text-[#EAB308] mt-2 font-bold uppercase italic">{passportFile.name}</p>}
                                    </div>
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className={`w-full py-6 rounded-[2rem] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 text-white ${loading ? 'bg-[#64748B] cursor-not-allowed' : 'bg-[#0B1F3A] hover:bg-[#0F172A] hover:shadow-2xl shadow-[#0B1F3A]/20 active:scale-95 group'}`}>
                                {loading ? 'Processing...' : (
                                    <>
                                        Submit Application 
                                        <Send size={20} className="group-hover:text-[#EAB308] transition-colors" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ApplyVisa;