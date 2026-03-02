"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, QrCode, Clock, Star, PauseCircle, X } from "lucide-react";

export default function DashboardPage() {
    // Mock data for the MVP dashboard
    const [activeTab, setActiveTab] = useState("active");

    // Pause Membership State
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [pausingBooking, setPausingBooking] = useState<any>(null);
    const [pauseDays, setPauseDays] = useState("5");
    const [isPausing, setIsPausing] = useState(false);

    const handlePause = (booking: any) => {
        setPausingBooking(booking);
        setPauseModalOpen(true);
    };

    const confirmPause = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPausing(true);
        setTimeout(() => {
            setIsPausing(false);
            setPauseModalOpen(false);
            alert(`Membership successfully paused for ${pauseDays} days! Validity extended.`);
        }, 1200);
    };

    const mockBookings = [
        {
            id: "BK-9021A",
            gymName: "Iron Paradise Fitness",
            location: "Bandra West, Mumbai",
            type: "Day Pass",
            validUntil: "Today, 10:00 PM",
            status: "Active",
            otp: "9021"
        },
        {
            id: "BK-8812B",
            gymName: "Zenith Wellness Club",
            location: "Andheri East, Mumbai",
            type: "Monthly Membership",
            validUntil: "Oct 24, 2026",
            status: "Active",
            otp: "8812"
        },
        {
            id: "BK-1109C",
            gymName: "The Spartan Yard",
            location: "Koramangala, Bangalore",
            type: "Day Pass",
            validUntil: "Aug 15, 2025",
            status: "Used",
            otp: null
        }
    ];

    const filteredBookings = mockBookings.filter(b =>
        activeTab === "active" ? b.status === "Active" : b.status === "Used"
    );

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/search" className="text-xl font-black text-indigo-600">PassFit</Link>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">JS</div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your passes and booking history.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-2">
                        <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl transition-colors">
                            My Passes
                        </button>
                        <button className="w-full text-left px-4 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">
                            Account Settings
                        </button>
                        <button className="w-full text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors mt-8">
                            Log Out
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-6">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Active Passes
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Past Bookings
                            </button>
                        </div>

                        {/* Pass Cards */}
                        <div className="space-y-6">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500 font-medium">No {activeTab} passes found.</p>
                                    {activeTab === 'active' && (
                                        <Button className="mt-4 bg-indigo-600 text-white" asChild>
                                            <Link href="/search">Find a Gym</Link>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">

                                        {/* OTP PIN Section (Only for active) */}
                                        {booking.status === "Active" ? (
                                            <div className="w-full sm:w-48 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col items-center justify-center p-6 text-white relative">
                                                {/* Ticket cutouts */}
                                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2 xs:hidden sm:block"></div>
                                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2 xs:hidden sm:block"></div>

                                                <div className="bg-slate-800 px-6 py-4 rounded-xl mb-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-slate-700 w-full text-center">
                                                    <span className="text-4xl font-black text-indigo-400 tracking-[0.2em]">{booking.otp}</span>
                                                </div>

                                                <span className="font-mono text-xs text-slate-400 mb-1">{booking.id}</span>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 text-center leading-tight">Share PIN at reception</span>
                                            </div>
                                        ) : (
                                            <div className="w-full sm:w-32 bg-slate-100 shrink-0 flex items-center justify-center p-6">
                                                <Star className="w-8 h-8 text-slate-300" />
                                            </div>
                                        )}

                                        {/* Details Section */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
                                                        {booking.type}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{booking.gymName}</h3>
                                                </div>
                                                {booking.status === "Active" ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Valid
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                                        Used
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center text-slate-500 text-sm mb-4">
                                                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                                                <span className="truncate">{booking.location}</span>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600 font-medium">Valid until: <span className="text-slate-900 font-bold">{booking.validUntil}</span></span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {booking.status === "Used" && (
                                                        <Button variant="outline" size="sm" className="hidden sm:inline-flex border-slate-200">Leave a Review</Button>
                                                    )}
                                                    {booking.status === "Active" && booking.type.includes("Month") && (
                                                        <Button onClick={() => handlePause(booking)} variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold hidden sm:inline-flex">
                                                            <PauseCircle className="w-4 h-4 mr-1.5" /> Pause Plan
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>

            </div>

            {/* Pause Membership Modal */}
            {pauseModalOpen && pausingBooking && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                <PauseCircle className="w-5 h-5" /> Pause Membership
                            </h3>
                            <button onClick={() => setPauseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={confirmPause} className="p-6">
                            <p className="text-sm font-medium text-slate-600 mb-5 leading-relaxed">
                                Going out of town or taking a break? You can pause your <strong className="text-slate-900">{pausingBooking.gymName}</strong> membership to save your days.
                            </p>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                                <p className="text-xs font-bold text-amber-800 mb-1">How Pausing Works:</p>
                                <ul className="text-xs font-medium text-amber-700/80 list-disc list-inside space-y-1">
                                    <li>Max 5 days pause allowed per month.</li>
                                    <li>Your expiry date will auto-extend.</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Pause Duration (Days)</label>
                                <select
                                    required
                                    value={pauseDays}
                                    onChange={(e) => setPauseDays(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    <option value="1">1 Day</option>
                                    <option value="2">2 Days</option>
                                    <option value="3">3 Days</option>
                                    <option value="4">4 Days</option>
                                    <option value="5">5 Days (Max)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" onClick={() => setPauseModalOpen(false)} variant="outline" className="font-bold border-slate-200">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPausing} className="font-bold bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-md shadow-indigo-200 text-white">
                                    {isPausing ? 'Processing...' : 'Confirm Pause'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
