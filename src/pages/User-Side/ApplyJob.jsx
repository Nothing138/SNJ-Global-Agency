import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  User, MapPin, GraduationCap, Code, FileText, 
  Send, ArrowLeft, Camera, DollarSign, Globe, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    full_name: user?.name || '', 
    address: '',
    nationality: '',
    current_location: '',
    qualification: '',
    skills: '',
    demand: '',
    cv: null,
    photo: null
  });

  const [loading, setLoading] = useState(false);

  const isFormValid = formData.full_name && formData.demand && formData.cv;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('job_id', jobId);
    data.append('candidate_id', user.id);

    try {
      const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/user-jobs/apply', data);
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your application has been submitted successfully.',
          confirmButtonColor: '#0B1F3A',
          background: '#F8FAFC',
          color: '#0F172A',
        });
        navigate('/');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
        confirmButtonColor: '#0B1F3A',
        background: '#F8FAFC',
        color: '#0F172A',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-['Times_New_Roman',_serif]">
      <Navbar />
      {/* Secondary Background: Soft White (#F8FAFC) */}
      <div className="min-h-screen bg-[#F8FAFC] pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[#64748B] hover:text-[#EAB308] transition-colors mb-8 font-bold uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} /> Back to job list
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#0B1F3A]/5"
          >
            {/* Header Section: Primary Deep Navy (#0B1F3A) */}
            <div className="bg-[#0B1F3A] p-10 text-white">
              <h2 className="text-4xl font-bold uppercase tracking-tight">Submit Application</h2>
              <p className="text-[#F8FAFC]/70 text-sm font-bold uppercase tracking-widest mt-2">
                Providing <span className="italic text-[#EAB308]">Premium Quality Services</span> for Job ID: {jobId}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E5E7EB]" size={18} />
                    <input 
                      required name="full_name" value={formData.full_name} onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                      placeholder="Enter your full name" 
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Nationality</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E5E7EB]" size={18} />
                    <input 
                      name="nationality" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                      placeholder="e.g. Bangladeshi" 
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Latest Qualification</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E5E7EB]" size={18} />
                    <input 
                      name="qualification" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                      placeholder="e.g. MBA or BSc" 
                    />
                  </div>
                </div>

                {/* Current Location */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Current Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E5E7EB]" size={18} />
                    <input 
                      name="current_location" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                      placeholder="e.g. Dhaka, Bangladesh" 
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Professional Skills</label>
                <div className="relative">
                  <Code className="absolute left-5 top-6 text-[#E5E7EB]" size={18} />
                  <textarea 
                    name="skills" rows="3" onChange={handleChange}
                    className="w-full pl-14 pr-6 py-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-3xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                    placeholder="e.g. React.js, Node.js, Project Management" 
                  />
                </div>
              </div>

              {/* Demand (Salary) */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] ml-2">Your Demand / Expected Salary *</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-6 text-[#E5E7EB]" size={18} />
                  <textarea 
                    required name="demand" rows="3" onChange={handleChange}
                    className="w-full pl-14 pr-6 py-5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-3xl outline-none focus:ring-2 focus:ring-[#0B1F3A] text-[#0F172A] transition-all font-bold placeholder:text-[#64748B]/40" 
                    placeholder="What is your demand or expectation for this role?" 
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-8 border-2 border-dashed border-[#E5E7EB] rounded-[2rem] text-center hover:border-[#EAB308] transition-all bg-[#F8FAFC]">
                  <FileText className="mx-auto text-[#0B1F3A] mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Upload CV (PDF only) *</p>
                  <input 
                    required type="file" name="cv" accept=".pdf" onChange={handleFileChange}
                    className="mt-4 text-[10px] text-[#64748B] cursor-pointer block w-full" 
                  />
                </div>

                <div className="group p-8 border-2 border-dashed border-[#E5E7EB] rounded-[2rem] text-center hover:border-[#EAB308] transition-all bg-[#F8FAFC]">
                  <Camera className="mx-auto text-[#0B1F3A] mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Profile Photo (Optional)</p>
                  <input 
                    type="file" name="photo" accept="image/*" onChange={handleFileChange}
                    className="mt-4 text-[10px] text-[#64748B] cursor-pointer block w-full" 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all
                  ${isFormValid 
                    ? 'bg-[#0B1F3A] text-white hover:bg-[#0F172A] shadow-xl shadow-[#0B1F3A]/20 active:scale-95' 
                    : 'bg-[#E5E7EB] text-[#64748B] cursor-not-allowed'}
                `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Submit Application <Send size={16} className="text-[#EAB308]" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Apply;