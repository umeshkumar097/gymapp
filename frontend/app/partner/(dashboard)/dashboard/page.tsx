"use client";

import { CreditCard, Users, Ticket, ArrowUpRight, Search, QrCode, CalendarClock, Activity, X, AlertTriangle, CheckCircle2, ShieldCheck, Rocket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function PartnerDashboard() {
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);

    // Cancellation Modal State
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);

    // Schedule Modal State
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduling, setScheduling] = useState(false);

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 4) return;
        setVerifying(true);
        // Mock verification
        setTimeout(() => {
            setVerifying(false);
            setOtp("");
            alert(`Verified OTP: ${otp}. Customer checked in successfully!`);
        }, 800);
    };

    const handleCancelBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setCancelling(true);
        // Mock cancellation, refund trigger, and WhatsApp notification
        setTimeout(() => {
            setCancelling(false);
            setCancelModalOpen(false);
            setCancelReason("");
            alert("Booking Cancelled. A full refund has been initiated to the user's original payment method and a WhatsApp notification has been sent.");
        }, 1200);
    };

    // Mock Onboarding Status (In real app, fetched from user.onboarding_status)
    const onboardingStatus: string = "FeePaid";

    const handleScheduleVisit = () => {
        setScheduleModalOpen(true);
    };

    const confirmScheduleVisit = (e: React.FormEvent) => {
        e.preventDefault();
        setScheduling(true);
        setTimeout(() => {
            setScheduling(false);
            setScheduleModalOpen(false);
            alert(`Inspection Scheduled for ${scheduleDate}. Our team will contact you.`);
        }, 1000);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Iron Paradise Fitness - Bandra West</p>
                </div>
            </div>

            {/* Onboarding Tracker (Only visible if not fully verified) */}
            {onboardingStatus !== "Verified" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-amber-50">
                        <h2 className="font-bold text-amber-900 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> Application Tracker (Action Required)
                        </h2>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-[28px] left-[10%] w-[80%] h-1 bg-slate-100 z-0 rounded-full"></div>

                            {/* Step 1: Registered */}
                            <div className="relative z-10 flex flex-col items-center flex-1 text-center w-full md:w-auto">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm mb-3">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Registered</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 w-32">Account created.</p>
                            </div>

                            {/* Step 2: Payment */}
                            <div className="relative z-10 flex flex-col items-center flex-1 text-center w-full md:w-auto mt-4 md:mt-0">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3 ${onboardingStatus === 'FeePaid' || onboardingStatus === 'InspectionScheduled' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {onboardingStatus === 'FeePaid' || onboardingStatus === 'InspectionScheduled' ? <CheckCircle2 className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Fee Paid</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 w-32">Trial activated.</p>
                            </div>

                            {/* Step 3: Inspection */}
                            <div className="relative z-10 flex flex-col items-center flex-1 text-center w-full md:w-auto mt-4 md:mt-0">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3 ${onboardingStatus === 'InspectionScheduled' ? 'bg-amber-100 text-amber-600' : onboardingStatus === 'FeePaid' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                                    <ShieldCheck className="w-6 h-6 border-white" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Physical Inspection</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 w-32">Pending venue verification.</p>
                            </div>

                            {/* Step 4: Live */}
                            <div className="relative z-10 flex flex-col items-center flex-1 text-center w-full md:w-auto mt-4 md:mt-0">
                                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-4 border-white shadow-sm mb-3">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-400 text-sm">Live</h3>
                                <p className="text-xs text-slate-400 font-medium mt-1 w-32">Ready for bookings.</p>
                            </div>
                        </div>

                        {onboardingStatus === "FeePaid" && (
                            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-indigo-900">Schedule your physical inspection</h4>
                                    <p className="text-sm font-medium text-indigo-700/80 mt-1">Our team needs to verify your amenities to protect customers.</p>
                                </div>
                                <Button onClick={handleScheduleVisit} className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-200 w-full sm:w-auto whitespace-nowrap">
                                    <CalendarClock className="w-4 h-4 mr-2" /> Schedule Visit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Action Bar (Highest Priority) */}
            <div className={`bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${onboardingStatus !== 'Verified' ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="z-10 w-full md:w-auto">
                    <h2 className="text-white text-lg font-bold mb-1">Quick Check-in</h2>
                    <p className="text-indigo-200 text-sm font-medium">Verify customer access passes instantly.</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-3 z-10 flex-col sm:flex-row">
                    <form onSubmit={handleVerifyOtp} className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter 4-6 Digit PIN..."
                            className="w-full bg-white/10 text-white placeholder:text-indigo-200/70 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all uppercase tracking-widest"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />

                        {otp.length >= 4 && (
                            <button type="submit" disabled={verifying} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                                {verifying ? 'Verifying...' : 'Verify'}
                            </button>
                        )}
                    </form>

                    <div className="text-indigo-300 font-bold text-sm hidden sm:block">OR</div>

                    <Button variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold backdrop-blur-sm">
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan QR
                    </Button>
                </div>
            </div>

            {/* Analytics Overview (The Hooks) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${onboardingStatus !== 'Verified' ? 'opacity-50 pointer-events-none select-none grayscale-[0.2]' : ''}`}>
                {/* 1. Today's Walk-ins */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Today's Walk-ins</div>
                        <div className="text-3xl font-black text-slate-900">42</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">App bookings verified today</div>
                    </div>
                </div>

                {/* 2. Live Active Sessions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 relative">
                            <Activity className="w-5 h-5 relative z-10" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Live Active Sessions</div>
                        <div className="text-3xl font-black text-slate-900">18</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Users currently in gym</div>
                    </div>
                </div>

                {/* 3. Total Revenue (This Month) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +15%
                        </span>
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                        <div className="text-3xl font-black text-slate-900">₹84,500</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Gross earnings this month</div>
                    </div>
                </div>

                {/* 4. Upcoming Bookings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <CalendarClock className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Upcoming Bookings</div>
                        <div className="text-3xl font-black text-slate-900">12</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Future dates booked in advance</div>
                    </div>
                </div>
            </div>

            {/* Booking & User Management Table */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${onboardingStatus !== 'Verified' ? 'opacity-50 pointer-events-none select-none grayscale-[0.2]' : ''}`}>
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-indigo-500" />
                        Booking Management
                    </h2>
                    <div className="flex items-center gap-2">
                        <select className="bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                            <option>All Statuses</option>
                            <option>Pending</option>
                            <option>Verified (Active)</option>
                            <option>Expired</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Pass Type</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {/* Pending/Upcoming Booking */}
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">Aarav Sharma</div>
                                    <div className="text-xs text-slate-400 font-mono">BK-9021A</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">+91 ***** *4892</td>
                                <td className="px-6 py-4">1 Day Pass</td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900">Today, 2nd Mar</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
                                        Pending (OTP)
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold mr-2">Details</Button>
                                    <Button onClick={() => setCancelModalOpen(true)} variant="outline" size="sm" className="h-8 text-xs font-bold border-red-200 text-red-600 hover:bg-red-50">Cancel</Button>
                                </td>
                            </tr>

                            {/* Verified/Active Booking */}
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">Priya Patel</div>
                                    <div className="text-xs text-slate-400 font-mono">BK-4412C</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">+91 ***** *1102</td>
                                <td className="px-6 py-4">Monthly Membership</td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900">Valid till 2nd Apr</div>
                                    <div className="text-xs text-emerald-600 font-bold">Checked in 10m ago</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold">Details</Button>
                                </td>
                            </tr>

                            {/* Expired/No-Show Booking */}
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">Rohan Desai</div>
                                    <div className="text-xs text-slate-400 font-mono">BK-1122Z</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">+91 ***** *9988</td>
                                <td className="px-6 py-4">1 Day Pass</td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900 text-slate-400 line-through">1st Mar (Yesterday)</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200">
                                        Expired / No-Show
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" disabled className="h-8 text-xs font-bold opacity-50">Details</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Schedule Visit Modal */}
            {scheduleModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                <CalendarClock className="w-5 h-5" /> Schedule Inspection
                            </h3>
                            <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={confirmScheduleVisit} className="p-6">
                            <p className="text-sm font-medium text-slate-600 mb-5">
                                Pick a date that works best for you. Our verification team visits between 10 AM to 5 PM to verify gym amenities.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" onClick={() => setScheduleModalOpen(false)} variant="outline" className="font-bold border-slate-200">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!scheduleDate || scheduling} className="font-bold bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-md shadow-indigo-200 text-white">
                                    {scheduling ? 'Scheduling...' : 'Confirm Date'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Booking Modal */}
            {cancelModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
                            <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Cancel Booking
                            </h3>
                            <button onClick={() => setCancelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCancelBooking} className="p-6">
                            <p className="text-sm font-medium text-slate-600 mb-5">
                                You are about to cancel booking <strong className="text-slate-900">BK-9021A</strong> for <strong>Aarav Sharma</strong>. Keep in mind that frequent cancellations negatively impact your PassFit ranking.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Cancellation <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none"
                                >
                                    <option value="" disabled>Select a valid reason...</option>
                                    <option value="closed">Gym Closed Today</option>
                                    <option value="capacity">Overcrowded / At Capacity</option>
                                    <option value="maintenance">Equipment Maintenance</option>
                                    <option value="invalid">Invalid User Booking</option>
                                </select>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                                <p className="text-xs font-bold text-indigo-800 leading-relaxed mb-1">Automated Actions on Cancel:</p>
                                <ul className="text-xs font-medium text-indigo-700/80 list-disc list-inside space-y-0.5">
                                    <li>100% Refund automatically triggered via Razorpay.</li>
                                    <li>Instant WhatsApp/SMS alert sent to the customer.</li>
                                    <li>Booking status changed to "Cancelled by Gym".</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" onClick={() => setCancelModalOpen(false)} variant="outline" className="font-bold border-slate-200">
                                    Keep Booking
                                </Button>
                                <Button type="submit" disabled={!cancelReason || cancelling} className="font-bold bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-md shadow-red-200 text-white">
                                    {cancelling ? 'Initiating Refund...' : 'Confirm Cancellation'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
