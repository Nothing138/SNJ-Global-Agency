import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle, X, Clock, Mail, Phone, Calendar, Shield } from 'lucide-react';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tours/bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/tours/update-booking/${id}`, { status });
            Swal.fire({ 
                title: `<span style="font-family: Times New Roman, serif;">Booking ${status}</span>`, 
                icon: 'success', 
                timer: 1000, 
                showConfirmButton: false,
                background: '#fff',
                color: '#0B1F3A'
            });
            fetchBookings();
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    return (
        <div className="space-y-12 p-2 bg-white min-h-screen font-['Times_New_Roman',_serif]">
            
            {/* Header Section */}
            <div className="bg-white p-10 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex justify-between items-end">
                <div>
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-none uppercase tracking-tight">
                        Booking <span className="italic font-medium text-[#EAB308]">Vault.</span>
                    </h1>
                    <p className="text-[18px] text-[#64748B] mt-2 italic">Refining global travel requests with authority.</p>
                </div>
                <div className="bg-[#0B1F3A] text-[#EAB308] px-8 py-4 font-bold text-[14px] uppercase tracking-[2px]">
                    Total Assets: {bookings.length}
                </div>
            </div>

            {/* Bookings Table Container */}
            <div className="bg-white border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0B1F3A] text-white uppercase text-[12px] font-bold tracking-[2px]">
                            <th className="p-6 border-b border-slate-800">Customer Profile</th>
                            <th className="p-6 border-b border-slate-800">Service Package</th>
                            <th className="p-6 border-b border-slate-800">Registry Date</th>
                            <th className="p-6 border-b border-slate-800 text-center">Current Status</th>
                            <th className="p-6 border-b border-slate-800 text-center">Authorization</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((book) => (
                            <tr key={book.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <p className="text-[20px] font-bold text-[#0F172A] uppercase leading-tight">{book.client_name}</p>
                                        <div className="flex flex-col text-[14px] text-[#64748B] italic">
                                            <span className="flex items-center gap-2"><Mail size={14} className="text-[#EAB308]"/> {book.client_email}</span>
                                            <span className="flex items-center gap-2"><Phone size={14} className="text-[#EAB308]"/> {book.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="inline-block border-l-2 border-[#EAB308] pl-3">
                                        <p className="text-[16px] font-bold text-[#0B1F3A] uppercase tracking-wide">{book.package_name}</p>
                                        <p className="text-[12px] text-[#64748B] uppercase">Premium Tier</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="text-[16px] text-[#0F172A] font-medium flex items-center gap-2">
                                        <Calendar size={16} className="text-[#64748B]"/> 
                                        {new Date(book.booking_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-5 py-1 text-[11px] font-bold uppercase tracking-widest border
                                        ${book.status === 'confirmed' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                                          book.status === 'cancelled' ? 'border-red-200 text-red-700 bg-red-50' : 
                                          'border-[#EAB308] text-[#0B1F3A] bg-[#FEFCE8]'}`}>
                                        {book.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-4">
                                        <button 
                                            onClick={() => handleStatus(book.id, 'confirmed')}
                                            className="group relative p-3 bg-white border border-slate-200 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#EAB308] transition-all duration-300"
                                            title="Confirm Booking"
                                        >
                                            <CheckCircle size={20}/>
                                        </button>
                                        <button 
                                            onClick={() => handleStatus(book.id, 'cancelled')}
                                            className="p-3 bg-white border border-slate-200 text-slate-300 hover:text-red-600 hover:border-red-100 transition-all duration-300"
                                            title="Decline Request"
                                        >
                                            <X size={20}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="p-20 text-center bg-[#F8FAFC]">
                        <Shield size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-[18px] text-[#64748B] italic">No pending requests in the vault.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingManager;