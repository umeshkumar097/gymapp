"use client";

import Link from 'next/link';
import { LayoutDashboard, QrCode, Settings, Dumbbell, LogOut, Wallet, Star } from 'lucide-react';

export default function PartnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/partner/dashboard" className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter">
                        PassFit Partner
                    </Link>
                </div>

                <div className="p-4 flex-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 px-2">Menu</div>
                    <nav className="space-y-1">
                        <Link href="/partner/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-medium">
                            <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                            Dashboard
                        </Link>
                        <Link href="/partner/verify-otp" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-bold">
                            <QrCode className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                            Verify OTP
                        </Link>
                        <Link href="/partner/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-medium">
                            <Dumbbell className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                            Gym Profile
                        </Link>
                        <Link href="/partner/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-medium">
                            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                            Settings
                        </Link>
                        <Link href="/partner/financials" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-medium">
                            <Wallet className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                            Earnings & Payouts
                        </Link>
                        <Link href="/partner/reviews" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group font-medium">
                            <Star className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                            Reviews
                        </Link>
                    </nav>
                </div>

                {/* Bottom Profile Area */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 shrink-0">
                            IP
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">Iron Paradise</div>
                            <div className="text-xs text-slate-400 truncate">gym_owner@test.com</div>
                        </div>
                    </div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium text-sm">
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                    <span className="font-black text-indigo-600">PassFit Partner</span>
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-slate-50">
                        <LayoutDashboard className="w-5 h-5" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
