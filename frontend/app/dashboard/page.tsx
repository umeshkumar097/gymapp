"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
    MapPin, Calendar, QrCode, Clock, Star, PauseCircle,
    X, Download, Navigation, Share2, Wallet, User as UserIcon, Heart, Copy, ShieldCheck, Ticket, CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    // Pause Membership State (Phase 11 Logic)
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [pausingBooking, setPausingBooking] = useState<any>(null);
    const [pauseDays, setPauseDays] = useState("5");
    const [isPausing, setIsPausing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch("https://passfit.in/api/v1/users/me/dashboard", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyReferral = () => {
        if (dashboardData?.user_profile?.referral_code) {
            navigator.clipboard.writeText(dashboardData.user_profile.referral_code);
            setToastMessage("Referral Code Copied!");
            setTimeout(() => setToastMessage(""), 3000);
        }
    };

    const handleDownloadPDF = async (bookingId: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://passfit.in/api/v1/bookings/${bookingId}/voucher`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to download");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PASSFIT-${bookingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert("Could not download the PDF voucher at this time.");
        }
    };

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
            alert(`Membership successfully paused for ${pauseDays} days!`);
        }, 1200);
    };

    if (isLoading || !dashboardData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-bold animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    const { user_profile, active_pass, history } = dashboardData;

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Custom Toast */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">{toastMessage}</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
                    <Link href="/search" className="text-xl font-black text-indigo-600">PassFit</Link>
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                            <Wallet className="w-3.5 h-3.5" />
                            {user_profile.fitcoins} FitCoins
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user_profile.name.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Nav */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6 px-4">My Account</h1>

                        {[
                            { id: 'dashboard', icon: Ticket, label: 'Active Pass & Overview' },
                            { id: 'history', icon: Calendar, label: 'Booking History' },
                            { id: 'wallet', icon: Wallet, label: 'My Wallet (FitCoins)' },
                            { id: 'favorites', icon: Heart, label: 'Saved Gyms' },
                            { id: 'settings', icon: UserIcon, label: 'Profile Settings' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
                            >
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-200' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        ))}

                        <div className="pt-8 px-5">
                            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full text-left py-3 text-rose-600 font-bold hover:text-rose-700 flex items-center gap-3 transition-colors">
                                <X className="w-5 h-5" /> Log Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Pane */}
                    <div className="flex-1">

                        {/* TAB: DASHBOARD (HERO + ACTIVE PASS) */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {active_pass ? (
                                    <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden relative group">
                                        {/* Animated premium background glow */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 blur-xl transition duration-1000 group-hover:duration-200"></div>

                                        <div className="bg-slate-900 rounded-[22px] relative p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center border border-slate-800">

                                            {/* Left side info */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/30 mb-4">
                                                    🟢 Live Active Pass
                                                </div>
                                                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                                                    {active_pass.gym_name}
                                                </h2>
                                                <div className="text-slate-400 font-medium mb-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center md:justify-start">
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {active_pass.gym_location}</span>
                                                    <span className="hidden sm:inline text-slate-600">•</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Until: <span className="text-white font-bold">{active_pass.valid_until}</span></span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                                    <Button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(active_pass.gym_name + " " + active_pass.gym_location)}`, "_blank")} className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                        <Navigation className="w-4 h-4 mr-2" /> Get Directions
                                                    </Button>
                                                    <Button onClick={() => handleDownloadPDF(active_pass.id)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-bold rounded-xl h-12">
                                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Right side OTP */}
                                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full md:w-auto text-center relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Entry PIN</p>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-[0.2em] font-mono mb-1 relative z-10">
                                                    {active_pass.otp}
                                                </div>
                                                <p className="text-xs text-slate-500 relative z-10">Show at gym reception</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Passes</h3>
                                        <p className="text-slate-500 font-medium mb-6 max-w-sm mx-auto">You don't have any bookings for today. Time to crush those goals?</p>
                                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 px-8 font-black text-lg shadow-lg shadow-indigo-200">
                                            <Link href="/search">Find a Gym Now</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Workouts</p>
                                        <p className="text-2xl font-black text-slate-900">{history.length + (active_pass ? 1 : 0)}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">FitCoins Earned</p>
                                        <p className="text-2xl font-black text-emerald-600">{user_profile.fitcoins}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: HISTORY */}
                        {activeTab === 'history' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Past Bookings</h2>

                                {history.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-500 font-medium">Your history is empty.</p>
                                    </div>
                                ) : history.map((booking: any) => (
                                    <div key={booking.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-900 text-lg">{booking.gym_name}</h3>
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500">{booking.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Booked on {booking.date_str}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1 inline-block bg-slate-50 px-2 py-1 rounded">{booking.pass_type}</p>
                                        </div>
                                        <Button asChild variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold shrink-0">
                                            <Link href={`/gym/${booking.gym_id}`}>Book Again</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB: WALLET */}
                        {activeTab === 'wallet' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                                    <h2 className="text-indigo-200 font-bold text-sm tracking-wider uppercase mb-2 relative z-10">Available Balance</h2>
                                    <div className="flex items-end gap-3 mb-6 relative z-10">
                                        <span className="text-6xl font-black">{user_profile.fitcoins}</span>
                                        <span className="text-xl text-indigo-300 font-bold pb-1.5">FitCoins</span>
                                    </div>
                                    <p className="text-indigo-200/80 text-sm max-w-sm relative z-10">1 FitCoin = ₹1. You can use your FitCoins on your next checkout to get a direct discount.</p>
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg mb-4">Refer & Earn Engine</h3>
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                    <div>
                                        <div className="inline-flex bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-amber-700" /> Earn 200 FitCoins
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">Invite your Workout Buddy</h4>
                                        <p className="text-slate-500 text-sm max-w-md">When a friend signs up using your code and completes their first booking, you instantly get 200 FitCoins in your wallet.</p>
                                    </div>
                                    <div className="shrink-0">
                                        <p className="text-xs font-bold text-slate-400 mb-1.5">YOUR REFERRAL CODE</p>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-mono text-lg font-black text-slate-800 tracking-wider">
                                                {user_profile.referral_code}
                                            </div>
                                            <Button onClick={handleCopyReferral} className="bg-slate-900 text-white rounded-xl h-12 w-12 p-0 flex items-center justify-center hover:bg-slate-800">
                                                <Copy className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: FAVORITES */}
                        {activeTab === 'favorites' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Saved Gyms</h2>
                                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                                    <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">No Favorites Yet</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6">Explore the map and tap the heart icon on gyms you'd like to visit later.</p>
                                    <Button asChild className="bg-indigo-600 text-white font-bold rounded-xl shadow-md">
                                        <Link href="/search">Browse Gyms</Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* TAB: SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="animate-in fade-in duration-300 max-w-2xl">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Profile Settings</h2>

                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-inner">
                                            {user_profile.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900">{user_profile.name} <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-wider relative -top-0.5">Customer</span></h3>
                                            <p className="text-slate-500 text-sm">{user_profile.email}</p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Communication</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium text-sm flex justify-between items-center cursor-not-allowed">
                                            <span>WhatsApp: {user_profile.whatsapp_number || "Not Linked"}</span>
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">To change your primary WhatsApp or Email, please contact support for security verification.</p>
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg mb-4">Help & Support</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left hover:border-indigo-300 transition-colors group">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Share2 className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">WhatsApp Live Chat</h4>
                                        <p className="text-xs text-slate-500 font-medium">Get instant help regarding access issues or billing.</p>
                                    </button>
                                    <button className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left hover:border-indigo-300 transition-colors group">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">Pass Dispute</h4>
                                        <p className="text-xs text-slate-500 font-medium">Gym was closed? Request a 100% money-back refund.</p>
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Support Modal logic would go here */}

        </main>
    );
}
