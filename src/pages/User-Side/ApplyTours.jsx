import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, CheckCircle, MapPin, Globe, Activity, Upload } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ApplyTours = () => {
  const { id } = useParams(); // Package ID
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    passport_number: '',
    passport_expiry: '',
    address: '',
    nationality: '',
    disease: '',
    passport_file: null
  });

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [expiryWarning, setExpiryWarning] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://snj-global-agency-production.up.railway.app/api/user-travel/user-info/${user.id}`);
        if (res.data.success) {
          const d = res.data.data;
          setFormData(prev => ({
            ...prev,
            passport_number: d.passport_number || '',
            passport_expiry: d.passport_expiry ? d.passport_expiry.split('T')[0] : '',
            address: d.current_location || '',
            nationality: d.nationality || '',
          }));
          checkExpiry(d.passport_expiry);
        }
      } catch (err) {
        console.error("Error auto-filling form", err);
      }
    };
    if (user) fetchUserDetails();
  }, [user.id]);

  const checkExpiry = (dateString) => {
    if (!dateString) return;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    if (expiryDate <= threeMonthsLater) {
      setExpiryWarning(true);
    } else {
      setExpiryWarning(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'passport_expiry') checkExpiry(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expiryWarning) {
      Swal.fire({
        title: 'Notice',
        text: 'Your passport expires soon. Please consult with our experts.',
        icon: 'warning',
        confirmButtonColor: '#0B1F3A'
      });
      return;
    }

    try {
      const res = await axios.post('http://snj-global-agency-production.up.railway.app/api/user-travel/apply-tour', {
        ...formData,
        user_id: user.id,
        package_id: id
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Application submitted for review!',
          icon: 'success',
          confirmButtonColor: '#0B1F3A'
        });
        navigate('/travel');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Submission failed.',
        icon: 'error',
        confirmButtonColor: '#0B1F3A'
      });
    }
  };

  return (
    <div className="font-['Times_New_Roman',_serif]">
      <Navbar />
      {/* Secondary Background: Soft White (#F8FAFC) */}
      <div className="min-h-screen bg-[#F8FAFC] py-25 px-6 pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 lg:p-16 border border-[#E5E7EB]"
        >
          <div className="mb-12 text-center">
            {/* H1 Heading: Deep Navy (#0B1F3A) */}
            <h2 className="text-[40px] lg:text-[48px] font-bold uppercase text-[#0B1F3A] leading-tight">
              Complete Your <span className="italic text-[#EAB308]">Booking</span>
            </h2>
            <p className="text-[#64748B] mt-4 text-lg leading-[1.6]">
              Please provide your travel documents for <span className="italic text-[#EAB308]">Premium Quality Services</span> verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                <FileText size={16} className="text-[#0B1F3A]"/> Full Name
              </label>
              <input 
                type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} 
                className="w-full bg-[#F8FAFC] p-4 rounded-2xl text-[#0F172A] border border-[#E5E7EB] focus:ring-2 focus:ring-[#0B1F3A] outline-none transition-all placeholder:text-[#64748B]/50" 
                required 
              />
            </div>

            {/* Passport Number */}
            <div className="space-y-3">
              <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#0B1F3A]"/> Passport Number
              </label>
              <input 
                type="text" name="passport_number" value={formData.passport_number} onChange={handleInputChange} 
                className="w-full bg-[#F8FAFC] p-4 rounded-2xl text-[#0F172A] border border-[#E5E7EB] focus:ring-2 focus:ring-[#0B1F3A] outline-none transition-all" 
                required 
              />
            </div>

            {/* Passport Expiry */}
            <div className="space-y-3">
              <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2">Passport Expiry Date</label>
              <input 
                type="date" name="passport_expiry" value={formData.passport_expiry} onChange={handleInputChange} 
                className="w-full bg-[#F8FAFC] p-4 rounded-2xl text-[#0F172A] border border-[#E5E7EB] focus:ring-2 focus:ring-[#0B1F3A] outline-none" 
                required 
              />
              {expiryWarning && (
                <p className="text-red-600 text-[12px] font-bold mt-1 italic">⚠️ Expiry within 3 months! Contact our consultant immediately.</p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-3">
              <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                <Globe size={16} className="text-[#0B1F3A]"/> Nationality
              </label>
              <input 
                type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} 
                className="w-full bg-[#F8FAFC] p-4 rounded-2xl text-[#0F172A] border border-[#E5E7EB] focus:ring-2 focus:ring-[#0B1F3A] outline-none" 
                required 
              />
            </div>

            {/* Medical Conditions */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[14px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                <Activity size={16} className="text-[#0B1F3A]"/> Medical Conditions (If any)
              </label>
              <textarea 
                name="disease" placeholder="Any special medical care needed?" value={formData.disease} onChange={handleInputChange} 
                className="w-full bg-[#F8FAFC] p-4 rounded-2xl text-[#0F172A] border border-[#E5E7EB] focus:ring-2 focus:ring-[#0B1F3A] outline-none h-32 leading-[1.6]" 
              />
            </div>

            {/* Policy Check */}
            <div className="md:col-span-2 flex items-start gap-4 p-6 bg-[#F8FAFC] rounded-3xl border border-[#E5E7EB]">
              <input 
                type="checkbox" 
                id="policy" 
                className="mt-1 w-5 h-5 accent-[#0B1F3A]"
                onChange={(e) => setPolicyAccepted(e.target.checked)}
              />
              <label htmlFor="policy" className="text-[16px] text-[#64748B] leading-[1.6]">
                I agree to the <strong className="text-[#0F172A]">Travel Policy & Rules</strong>. I confirm that all provided data is accurate and my passport is valid for travel.
              </label>
            </div>

            {/* Submit Button: Primary Deep Navy (#0B1F3A) */}
            <div className="md:col-span-2">
              <button 
                disabled={!policyAccepted}
                className={`w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm transition-all shadow-xl 
                  ${policyAccepted 
                    ? 'bg-[#0B1F3A] text-white hover:bg-[#0F172A] hover:text-[#EAB308]' 
                    : 'bg-[#E5E7EB] text-[#64748B] cursor-not-allowed'}`}
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyTours;