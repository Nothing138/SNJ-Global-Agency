import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Upload, User, Briefcase, FileText, Trash2, 
  Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight, 
  Image as ImageIcon, CheckCircle, Plus
} from 'lucide-react';

const API_BASE = "http://snj-global-agency-production.up.railway.app";

const TestimonyManagement = () => {
  // --- States ---
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', designation: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Table States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  // --- Fetch Data ---
  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/testimonials`);
      setStories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  // --- Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return Swal.fire('Error', 'Please select an image', 'error');

    setUploading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('designation', formData.designation);
    data.append('description', formData.description);
    data.append('image', image);

    try {
      await axios.post(`${API_BASE}/api/testimonials`, data);
      Swal.fire({
        title: 'Success',
        text: 'Testimony uploaded!',
        icon: 'success',
        confirmButtonColor: '#0B1F3A'
      });
      setFormData({ name: '', designation: '', description: '' });
      setImage(null);
      setPreview(null);
      fetchStories(); 
    } catch (err) {
      Swal.fire('Error', 'Failed to upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B1F3A',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/testimonials/${id}`);
        Swal.fire('Deleted!', 'Record removed.', 'success');
        fetchStories();
      } catch (err) { console.error(err); }
    }
  };

  // --- Filtering & Sorting Logic ---
  const processedData = useMemo(() => {
    let filtered = stories.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [stories, searchTerm, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // --- Styled Input Classes ---
  const inputClasses = "w-full pl-12 pr-4 py-4 rounded-sm bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-[#EAB308] transition-all font-semibold text-[#0F172A] placeholder:text-slate-300";

  return (
    <div className="space-y-12 font-['Times_New_Roman',_serif] bg-white p-4">
      
      {/* 🚀 TOP SECTION: UPLOAD FORM */}
      <div className="bg-white rounded-sm p-10 shadow-sm border border-slate-100 border-t-[6px] border-[#0B1F3A]">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-[#0B1F3A] rounded-sm text-white shadow-lg">
            <Plus size={24} />
          </div>
          <h1 className="text-[40px] font-bold text-[#0B1F3A] uppercase tracking-tight">
            Register <span className="italic text-[#EAB308]">Testimony</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1F3A]" size={18} />
                <input 
                  type="text" placeholder="Official Full Name" required
                  className={inputClasses}
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1F3A]" size={18} />
                <input 
                  type="text" placeholder="Professional Designation"
                  className={inputClasses}
                  value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})}
                />
              </div>
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-5 text-[#0B1F3A]" size={18} />
              <textarea 
                placeholder="Detailed account of the client's success story..." required rows="4"
                className={`${inputClasses} pl-12 resize-none leading-[1.6]`}
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-6">
            <div className="relative group h-[195px] rounded-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 hover:bg-white transition-all overflow-hidden group">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-slate-300 mb-2" />
                  <p className="text-[11px] font-bold uppercase text-[#64748B] tracking-widest">Select Client Image</p>
                </>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            </div>
            <button 
              type="submit" disabled={uploading}
              className="w-full py-5 bg-[#EAB308] hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white rounded-sm font-bold uppercase tracking-[4px] text-[12px] transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-3"
            >
              {uploading ? "Processing..." : <><CheckCircle size={18}/> Commit Testimony</>}
            </button>
          </div>
        </form>
      </div>

      {/* 📊 BOTTOM SECTION: DATA TABLE */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-[28px] font-bold text-[#0F172A] uppercase">
            Archived <span className="text-[#64748B] italic">Records</span>
          </h2>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Locate by name or role..."
              className="pl-12 pr-4 py-3 rounded-sm bg-slate-50 border border-slate-200 outline-none focus:ring-1 focus:ring-[#0B1F3A] w-full md:w-80 text-sm font-medium"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[2px] text-[#0B1F3A]">
              <tr>
                <th className="px-8 py-6 border-b">Client Identity</th>
                <th className="px-8 py-6 border-b">Narrative Summary</th>
                <th className="px-8 py-6 border-b cursor-pointer hover:text-[#EAB308] transition-colors" onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                    Archived Date <ArrowUpDown size={12} className="inline ml-1"/>
                </th>
                <th className="px-8 py-6 border-b text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={`${API_BASE}${item.image_url}`} className="w-14 h-14 rounded-sm object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      <div>
                        <p className="font-bold text-[#0B1F3A] text-[16px]">{item.name}</p>
                        <p className="text-[11px] text-[#EAB308] font-bold uppercase tracking-widest">{item.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-[350px]">
                    <p className="text-[#64748B] text-[14px] leading-[1.6] line-clamp-2 italic">
                      "{item.description}"
                    </p>
                  </td>
                  <td className="px-8 py-6 text-[12px] text-slate-400 font-bold uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-8 bg-white flex items-center justify-between border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-[#0B1F3A]">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedData.length)}</span> of {processedData.length}
          </p>
          <div className="flex gap-3">
            <button 
              disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-3 rounded-sm bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={20}/>
            </button>
            <button 
              disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-3 rounded-sm bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      </div>
      
      {/* Diversity Mandate: Empty State */}
      {stories.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-sm">
           <FileText size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 italic">No professional testimonies found in the archives.</p>
        </div>
      )}
    </div>
  );
};

export default TestimonyManagement;