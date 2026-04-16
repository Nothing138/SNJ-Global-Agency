import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, Globe, Briefcase, MapPin, Plane, 
  FileText, UserPlus, Menu, X, Bell, LogOut, ChevronDown, 
  PlusCircle, List, Send, CheckCircle, Package, Bookmark,
  BarChart3, MessageSquare, Mail, Sun, Moon, Quote, ExternalLink, Sparkles,
  Users, Handshake
} from 'lucide-react';

import Footer from '../../components/Admin&Recruiter/Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); 
  const location = useLocation();
  const navigate = useNavigate();

  // Role information (Keeping it in case you need to display the label, but removing logic checks)
  const userRole = localStorage.getItem('role') || 'Administrator'; 

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Securely end your session?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0B1F3A',
      confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        // Logout করার পর replace: true ব্যবহার করা হয়েছে যাতে ব্যাক বাটন কাজ না করে
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 font-['Times_New_Roman',_serif] ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#FDFDFD]'}`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-[#0B1F3A] text-white transition-all duration-500 ease-in-out flex flex-col z-50 shadow-[10px_0_30px_rgba(0,0,0,0.1)]`}>
        <div className="h-28 flex items-center justify-center border-b border-white/5 shrink-0 px-4">
          {isSidebarOpen ? (
            <div className="flex flex-col items-center">
              <span className="text-[22px] font-black tracking-[0.15em] text-[#EAB308]">SNJ GLOBAL</span>
              <span className="text-[10px] font-light tracking-[0.5em] text-white/60 uppercase -mt-1">Routes Agency</span>
            </div>
          ) : (
            <div className="text-[#EAB308] font-bold text-xl">SNJ</div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={22}/>} label="Executive Panel" isOpen={isSidebarOpen} currentPath={location.pathname} />
          
          <SidebarItem to="/admin/analytics" icon={<BarChart3 size={22}/>} label="Strategic Insights" isOpen={isSidebarOpen} currentPath={location.pathname} />
          
          {/* Global Mobility 
          <SidebarDropdown 
            label="Global Mobility" icon={<Globe size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.visa} onClick={() => toggleMenu('visa')}
            items={[
              { label: 'Visa Classifications', to: '/admin/visa-categories' },
              { label: 'Jurisdiction List', to: '/admin/country-list' },
              { label: 'Active Applications', to: '/admin/applications' },
            ]}
          />*/}

          {/* Aviation 
          <SidebarDropdown 
            label="Aviation Dept." icon={<Plane size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.flight} onClick={() => toggleMenu('flight')}
            items={[
              { label: 'Ticketing Requests', to: '/admin/flight-requests' },
              { label: 'Revenue Analytics', to: '/admin/flight-revenue' },
            ]}
          />*/}

          {/* New Sections: Employee & B2B */}
          <SidebarDropdown 
            label="Employee Network" icon={<Users size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.Employee} onClick={() => toggleMenu('Employee')}
            items={[
              { label: 'Employee List', to: '/admin/employee-list' },
              { label: 'Worker Request', to: '/admin/worker-request' },
              //{ label: 'B2B Pricing', to: '/admin/b2b/pricing' },
            ]}
          />
          <SidebarDropdown 
            label="B2B Network" icon={<Handshake size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.b2b} onClick={() => toggleMenu('b2b')}
            items={[
              { label: 'B2B Partners', to: '/admin/b2b-partners' },
              { label: 'Assign File', to: '/admin/b2b/assign-file' },
              { label: 'B2B Pricing', to: '/admin/b2b/pricing' },
            ]}
          />
          {/* Public Relations */}
          <SidebarDropdown 
            label="Public Relations" icon={<MessageSquare size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.chat} onClick={() => toggleMenu('chat')}
            items={[
              { label: 'Corporate Inbox', to: '/admin/notifications' },
              { label: 'Testimonials', to: '/admin/testimonials' },
              { label: 'System Alerts', to: '/admin/push-alerts' },
            ]}
          />

          {/* Media Hub */}
          <SidebarDropdown 
            label="Media Hub" icon={<FileText size={22}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.blog} onClick={() => toggleMenu('blog')}
            items={[
              { label: 'Draft Editorial', to: '/admin/blogs/create' },
              { label: 'Published Content', to: '/admin/blogs' },
            ]}
          />

          <SidebarItem to="/admin/staff-management" icon={<UserPlus size={22}/>} label="Human Capital" isOpen={isSidebarOpen} currentPath={location.pathname} />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-24 bg-white dark:bg-[#0B1F3A] flex items-center justify-between px-10 border-b border-slate-100 dark:border-white/5 z-40">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#0B1F3A] dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all">
              {isSidebarOpen ? <X size={26}/> : <Menu size={26}/>}
            </button>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[11px] font-bold text-[#64748B] dark:text-white/60 uppercase tracking-widest">System Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="/" target="_blank" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A] dark:text-white hover:text-[#EAB308] transition-colors">
              Public Portal
            </a>

            <button onClick={toggleDarkMode} className="p-3 text-[#0B1F3A] dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>

            <button onClick={handleLogout} className="flex items-center gap-3 bg-[#0B1F3A] text-white px-8 py-3.5 font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-all rounded-full shadow-xl">
              <LogOut size={16}/> Sign Out
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto p-12 custom-scrollbar transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#FAFBFC]'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-16 p-10 bg-white dark:bg-[#0B1F3A] rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-50 dark:border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10">
                  <Sparkles size={200} className="text-[#EAB308]"/>
                </div>
                
                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-[#EAB308]/10 text-[#EAB308] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
                        Administrative Authority
                    </div>
                    <h2 className="text-[56px] font-bold text-[#0B1F3A] dark:text-white tracking-tighter leading-tight mb-4">
                        Master Control <span className="italic text-[#EAB308]">System</span>
                    </h2>
                    <p className="text-[20px] text-[#64748B] dark:text-white/50 max-w-2xl font-light italic leading-relaxed">
                        Orchestrating <span className="text-[#0B1F3A] dark:text-[#EAB308] font-bold not-italic">SNJ Global’s</span> international operations with precision and strategic excellence.
                    </p>
                </div>
            </div>

            <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                <Outlet context={{ userRole }} />
            </div>
          </div>
          <Footer/>
        </main>
      </div>
    </div>
  );
};

// --- Sidebar Components ---
const SidebarItem = ({ to, icon, label, isOpen, currentPath }) => {
  const isActive = currentPath === to || currentPath.startsWith(to + '/');
  return (
    <Link to={to} className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-[#EAB308] text-[#0B1F3A] font-extrabold shadow-[0_10px_30px_rgba(234,179,8,0.3)] scale-[1.02]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
      <span className={`${isActive ? 'text-[#0B1F3A]' : 'group-hover:text-[#EAB308]'} transition-colors`}>{icon}</span>
      {isOpen && <span className="ml-5 text-[14px] tracking-[0.1em] uppercase">{label}</span>}
    </Link>
  );
};

const SidebarDropdown = ({ label, icon, items, isOpen, isMenuOpen, onClick }) => (
  <div className="mb-3">
    <button onClick={onClick} className={`w-full flex items-center p-4 rounded-2xl transition-all group ${isMenuOpen ? 'bg-white/5 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
      <span className={`${isMenuOpen ? 'text-[#EAB308]' : 'group-hover:text-[#EAB308]'} transition-colors`}>{icon}</span>
      {isOpen && (
        <div className="flex-1 flex items-center justify-between ml-5">
          <span className="text-[14px] tracking-[0.1em] uppercase">{label}</span>
          <ChevronDown size={16} className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-[#EAB308]' : ''}`} />
        </div>
      )}
    </button>
    {isOpen && isMenuOpen && (
      <div className="ml-10 mt-2 space-y-1 border-l-2 border-[#EAB308]/20 pl-4">
        {items.map((sub, i) => (
          <Link key={i} to={sub.to} className="flex items-center py-2.5 text-[12px] text-white/40 hover:text-[#EAB308] transition-all font-bold uppercase tracking-widest">
             {sub.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default AdminLayout;