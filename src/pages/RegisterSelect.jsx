import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCheck, User, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterSelect = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const options = [
    {
      id: 'b2b',
      icon: <Building2 size={36} />,
      title: 'B2B Partner',
      subtitle: 'Register as a Business Partner',
      description: 'For agencies, companies and organizations looking to refer clients or establish business partnerships with SNJ GlobalRoutes.',
      features: ['Company Dashboard', 'Bulk Client Management', 'B2B Pricing Access', 'Partnership Support'],
      path: '/register/b2b',
      accent: '#EAB308',
    },
    {
      id: 'employer',
      icon: <UserCheck size={36} />,
      title: 'Employer / Staff',
      subtitle: 'Register as an Employee',
      description: 'For SNJ GlobalRoutes staff members, consultants and authorized agents managing client cases and applications.',
      features: ['Case Management', 'Client Notifications', 'Work Reports', 'Internal Dashboard'],
      path: '/register/employer',
      accent: '#0B1F3A',
    },
    {
      id: 'user',
      icon: <User size={36} />,
      title: 'Regular User',
      subtitle: 'Register as a Client',
      description: 'For individuals seeking visa, travel, citizenship or immigration services from SNJ GlobalRoutes.',
      features: ['Visa Applications', 'Travel Booking', 'Application Tracking', 'Document Upload'],
      path: '/register',
      accent: '#64748B',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4" style={{ fontFamily: '"Times New Roman", serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#0B1F3A] rounded-2xl flex items-center justify-center border-b-4 border-[#EAB308]">
              <Compass size={32} className="text-[#EAB308]" />
            </div>
          </div>
          <h1 className="text-[42px] font-bold text-[#0B1F3A] uppercase leading-tight">
            Join <span className="italic text-[#EAB308]">SNJ</span> GlobalRoutes
          </h1>
          <p className="text-[#64748B] text-lg mt-3 max-w-xl mx-auto">
            Select your registration type to get started with the right account for your needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(opt.path)}
              className="relative cursor-pointer rounded-[2rem] border-2 overflow-hidden transition-all duration-300 group"
              style={{
                borderColor: hovered === opt.id ? opt.accent : '#E2E8F0',
                boxShadow: hovered === opt.id ? `0 20px 60px ${opt.accent}20` : '0 2px 20px rgba(0,0,0,0.05)',
              }}
            >
              {/* Top accent */}
              <div
                className="h-1.5 w-full transition-all duration-300"
                style={{ background: hovered === opt.id ? opt.accent : '#E2E8F0' }}
              />

              <div className="p-8">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    background: hovered === opt.id ? opt.accent : '#F8FAFC',
                    color: hovered === opt.id ? (opt.id === 'employer' ? '#EAB308' : '#0B1F3A') : opt.accent,
                  }}
                >
                  {opt.icon}
                </div>

                <h3 className="text-2xl font-bold text-[#0B1F3A] uppercase mb-1">{opt.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#EAB308] mb-4">{opt.subtitle}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{opt.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {opt.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={12} className="text-[#EAB308]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: hovered === opt.id ? opt.accent : '#F8FAFC',
                    color: hovered === opt.id ? (opt.id === 'employer' ? '#EAB308' : '#0B1F3A') : '#64748B',
                    border: `1.5px solid ${hovered === opt.id ? opt.accent : '#E2E8F0'}`,
                  }}
                >
                  Register Now <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Already a member?{' '}
          <span onClick={() => navigate('/login')} className="text-[#0B1F3A] cursor-pointer hover:underline ml-1">
            Sign In
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterSelect;