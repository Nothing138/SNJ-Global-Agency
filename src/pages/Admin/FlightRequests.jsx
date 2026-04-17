import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plane, Calendar, User, CheckCircle, XCircle, Clock, MapPin, ShieldCheck } from 'lucide-react';

const FlightRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('https://snj-global-agency-backend.onrender.com/api/admin/flight-requests');
            setRequests(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (id, action) => {
        if (action === 'accept') {
            const { value: cost } = await Swal.fire({
                title: '<span style="font-family: serif; font-weight: bold; color: #0B1F3A;">Confirm Acceptance</span>',
                input: 'number',
                inputLabel: 'Enter Total Ticket Cost (USD/BDT)',
                inputPlaceholder: 'e.g. 55000',
                showCancelButton: true,
                confirmButtonText: 'Accept & Save',
                confirmButtonColor: '#0B1F3A',
                inputValidator: (value) => {
                    if (!value || value <= 0) return 'You must provide a valid cost!';
                }
            });

            if (cost) {
                updateStatus(id, 'accept', cost);
            }
        } else {
            Swal.fire({
                title: `<span style="font-family: serif;">Are you sure to ${action}?</span>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed',
                confirmButtonColor: '#0B1F3A',
            }).then((result) => {
                if (result.isConfirmed) updateStatus(id, action, 0);
            });
        }
    };

    const updateStatus = async (id, status, cost) => {
        try {
            await axios.patch(`https://snj-global-agency-backend.onrender.com/api/admin/flight-requests/${id}/status`, { status, total_cost: cost });
            Swal.fire({
                title: 'Success',
                text: `Flight request ${status}ed`,
                icon: 'success',
                confirmButtonColor: '#0B1F3A'
            });
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Action failed', 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'accept': return 'border-emerald-200 text-emerald-700 bg-emerald-50';
            case 'reject': return 'border-red-200 text-red-700 bg-red-50';
            case 'hold': return 'border-amber-200 text-amber-700 bg-amber-50';
            default: return 'border-blue-200 text-blue-700 bg-blue-50';
        }
    };

    if (loading) return (
        <div className="p-20 text-center font-['Times_New_Roman',_serif] text-[#0B1F3A] animate-pulse italic text-xl">
            Synchronizing Flight Data...
        </div>
    );

    return (
        <div className="space-y-10 p-2 bg-white min-h-screen font-['Times_New_Roman',_serif]">
            
            {/* Header Section */}
            <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-[40px] md:text-[48px] font-bold text-[#0B1F3A] leading-tight uppercase tracking-tight">
                        Flight <span className="italic font-medium text-[#EAB308]">Registry.</span>
                    </h1>
                    <p className="text-[18px] text-[#64748B] mt-2 italic">Official verification and processing of travel inquiries.</p>
                </div>
                <div className="bg-[#0B1F3A] text-[#EAB308] px-6 py-3 font-bold text-[14px] uppercase tracking-[2px] shadow-lg">
                    Total Records: {requests.length}
                </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative group">
                        {/* Status Sidebar Indicator */}
                        <div className={`absolute left-0 top-0 w-1.5 h-full ${
                            req.status === 'accept' ? 'bg-emerald-500' : 
                            req.status === 'reject' ? 'bg-red-500' : 'bg-[#0B1F3A]'
                        }`}></div>

                        <div className="p-8">
                            {/* Card Top */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-[#F8FAFC] text-[#0B1F3A] border border-slate-100 flex items-center justify-center group-hover:bg-[#0B1F3A] group-hover:text-[#EAB308] transition-colors duration-500">
                                        <Plane size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-bold text-[#0F172A] uppercase leading-none">{req.full_name}</h3>
                                        <p className="text-[14px] text-[#64748B] mt-1 font-medium tracking-wide">
                                            Passport: <span className="text-[#0B1F3A]">{req.passport_number}</span> • {req.contact_number}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 text-[11px] font-bold uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                                    {req.status}
                                </span>
                            </div>

                            {/* Journey Details - Clean Table Style */}
                            <div className="grid grid-cols-2 gap-y-6 bg-[#F8FAFC] p-6 mb-8 border border-slate-50">
                                <div>
                                    <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Origin</span>
                                    <p className="text-[16px] font-bold text-[#0B1F3A] flex items-center gap-2 uppercase tracking-tight">
                                        <MapPin size={14} className="text-[#EAB308]"/> {req.departure_city}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Destination</span>
                                    <p className="text-[16px] font-bold text-[#0B1F3A] flex items-center gap-2 uppercase tracking-tight">
                                        <MapPin size={14} className="text-[#EAB308]"/> {req.destination_city}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Departure Schedule</span>
                                    <p className="text-[16px] font-medium text-[#0F172A] flex items-center gap-2">
                                        <Calendar size={16} className="text-[#64748B]"/> 
                                        {new Date(req.travel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">Pax Count</span>
                                    <p className="text-[16px] font-medium text-[#0F172A] flex items-center gap-2 uppercase">
                                        <User size={16} className="text-[#64748B]"/> {req.passenger_count} Certified
                                    </p>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div>
                                    <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest block">Valuation</span>
                                    <h4 className="text-[28px] font-bold text-[#0B1F3A] tracking-tighter">
                                        {req.total_cost > 0 ? (
                                            <span className="italic text-[#EAB308]">${req.total_cost}</span>
                                        ) : (
                                            <span className="text-slate-300 font-light italic text-xl uppercase tracking-widest">Pending</span>
                                        )}
                                    </h4>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleAction(req.id, 'hold')} className="p-3 bg-white border border-slate-200 text-amber-600 hover:bg-amber-50 transition-all shadow-sm" title="Hold"><Clock size={20}/></button>
                                    <button onClick={() => handleAction(req.id, 'reject')} className="p-3 bg-white border border-slate-200 text-red-300 hover:text-red-600 transition-all shadow-sm" title="Reject"><XCircle size={20}/></button>
                                    <button 
                                        onClick={() => handleAction(req.id, 'accept')} 
                                        className="flex items-center gap-3 px-6 py-3 bg-[#EAB308] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-[#EAB308] transition-all duration-300 font-bold text-[13px] uppercase tracking-[2px]"
                                    >
                                        <CheckCircle size={18}/> Verify & Issue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="py-20 text-center">
                    <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[18px] text-[#64748B] italic">No active flight requests found in the registry.</p>
                </div>
            )}
        </div>
    );
};

export default FlightRequests;