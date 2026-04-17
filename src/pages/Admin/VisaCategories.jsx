import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit3, Search, Hash, Globe } from 'lucide-react';

const VisaCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCats = async () => {
        try {
            const res = await axios.get('https://snj-global-agency-backend.onrender.com/api/admin/visa-categories');
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCats(); }, []);

    // --- ADD FUNCTION ---
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            const res = await axios.post('https://snj-global-agency-backend.onrender.com/api/admin/visa-categories', { category_name: name });
            if (res.data.success) {
                Swal.fire({ 
                    icon: 'success', 
                    title: '<span style="font-family: serif; color: #0B1F3A;">Entry Recorded</span>', 
                    showConfirmButton: false, 
                    timer: 1500,
                    background: '#ffffff'
                });
                setName("");
                fetchCats();
            }
        } catch (err) { Swal.fire('Error', 'Failed to add', 'error'); }
    };

    // --- DELETE FUNCTION ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: '<span style="font-family: serif;">Terminate Record?</span>',
            text: "This category will be permanently archived and removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0B1F3A',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, Proceed',
            background: '#ffffff',
            customClass: { popup: 'rounded-sm border-t-4 border-[#0B1F3A]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`https://snj-global-agency-backend.onrender.com/api/admin/visa-categories/${id}`);
                    if (res.data.success) {
                        Swal.fire('Deleted!', 'Category has been removed.', 'success');
                        fetchCats();
                    }
                } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
            }
        });
    };

    // --- EDIT FUNCTION ---
    const handleEdit = async (cat) => {
        Swal.fire({
            title: '<span style="font-family: serif;">Modify Identity</span>',
            input: 'text',
            inputValue: cat.category_name,
            showCancelButton: true,
            confirmButtonText: 'Update Record',
            confirmButtonColor: '#EAB308',
            customClass: { popup: 'rounded-sm border-t-4 border-[#0B1F3A]' },
            inputValidator: (value) => {
                if (!value) return 'A valid name is required.';
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`https://snj-global-agency-backend.onrender.com/api/admin/visa-categories/${cat.id}`, { 
                        category_name: result.value 
                    });
                    if (res.data.success) {
                        Swal.fire('Updated!', 'Entry successfully modified.', 'success');
                        fetchCats();
                    }
                } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
            }
        });
    };

    const filteredCats = categories.filter(c => 
        c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 font-['Times_New_Roman',_serif] bg-white p-2">
            
            {/* Header Section */}
            <div className="bg-white p-10 rounded-sm shadow-sm border border-slate-100 border-t-[6px] border-[#0B1F3A] flex flex-col lg:flex-row justify-between items-center gap-8">
                <div>
                    <h1 className="text-[40px] font-bold text-[#0B1F3A] uppercase tracking-tight">
                        Visa <span className="italic text-[#EAB308]">Classifications</span>
                    </h1>
                    <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-[4px] mt-2">
                        Official Archive: <span className="text-[#0B1F3A]">{categories.length} Types</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search Field */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1F3A]" size={18} />
                        <input 
                            type="text" 
                            placeholder="Locate classification..." 
                            className="pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-sm text-[14px] w-full sm:w-64 focus:ring-1 focus:ring-[#0B1F3A] outline-none font-semibold text-[#0B1F3A]"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            placeholder="New Type Identity..." 
                            className="p-4 bg-slate-50 border border-slate-100 rounded-sm text-[14px] font-semibold text-[#0B1F3A] outline-none focus:ring-1 focus:ring-[#EAB308] w-full lg:w-60" 
                            required 
                        />
                        <button className="bg-[#EAB308] text-[#0B1F3A] p-4 rounded-sm hover:bg-[#0B1F3A] hover:text-white transition-all shadow-md group">
                            <Plus size={24} className="group-hover:rotate-90 transition-transform"/>
                        </button>
                    </form>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-8 text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest italic">
                                    <div className="flex items-center gap-2"><Hash size={14}/> Index</div>
                                </th>
                                <th className="p-8 text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest italic">
                                    <div className="flex items-center gap-2"><Globe size={14}/> Category Identity</div>
                                </th>
                                <th className="p-8 text-[12px] font-bold uppercase text-[#0B1F3A] tracking-widest italic text-right">
                                    Administrative Control
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCats.map((cat, i) => (
                                <tr key={cat.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="p-8">
                                        <span className="w-10 h-10 rounded-sm bg-[#0B1F3A] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="p-8 font-bold uppercase italic text-[#0F172A] tracking-tight text-[18px]">
                                        {cat.category_name}
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-end gap-4">
                                            <button 
                                                onClick={() => handleEdit(cat)}
                                                className="p-3 text-slate-400 hover:text-[#EAB308] hover:bg-[#EAB308]/5 rounded-sm transition-all"
                                                title="Modify"
                                            >
                                                <Edit3 size={20}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={20}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredCats.length === 0 && (
                        <div className="p-24 text-center">
                            <p className="text-[14px] font-bold uppercase tracking-[6px] text-slate-300 italic">
                                No Records Identified in Database
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisaCategories;