"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Building2, Megaphone, Settings, LogOut, Radio, HeadphonesIcon } from 'lucide-react';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/godeye/login';

    if (isLoginPage) {
        return <main className="min-h-screen bg-slate-50">{children}</main>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-800">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/godeye/dashboard" className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center font-black text-white shrink-0">
                            A
                        </div>
                        <span className="font-extrabold text-xl tracking-tight">PassFit Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/godeye/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/dashboard' ? 'bg-indigo-500/10 text-indigo-400' : ''}`}>
                        <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                        <span className="font-semibold">Master Overview</span>
                    </Link>

                    <Link href="/godeye/gyms" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/gyms' ? 'bg-amber-500/10 text-amber-400' : ''}`}>
                        <Building2 className="w-5 h-5 text-amber-400" />
                        <span className="font-semibold">Gyms & Approvals</span>
                    </Link>

                    <Link href="/godeye/live" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/live' ? 'bg-red-500/10 text-red-500' : ''}`}>
                        <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="font-semibold">Live Operations</span>
                    </Link>

                    <Link href="/godeye/payouts" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/payouts' ? 'bg-emerald-500/10 text-emerald-400' : ''}`}>
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold">Financials & Payouts</span>
                    </Link>

                    <Link href="/godeye/marketing" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/marketing' ? 'bg-pink-500/10 text-pink-400' : ''}`}>
                        <Megaphone className="w-5 h-5 text-pink-400" />
                        <span className="font-semibold">Growth Engine</span>
                    </Link>

                    <Link href="/godeye/support" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/support' ? 'bg-orange-500/10 text-orange-400' : ''}`}>
                        <HeadphonesIcon className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold">Support & Disputes</span>
                    </Link>

                    <Link href="/godeye/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/godeye/users' ? 'bg-blue-500/10 text-blue-400' : ''}`}>
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Users & Moderation</span>
                    </Link>

                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/godeye/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
                        <Settings className="w-5 h-5 text-slate-500" />
                        <span className="font-semibold">Global Settings</span>
                    </Link>
                    <button
                        onClick={() => {
                            document.cookie = "user_role=; path=/; max-age=0";
                            window.location.href = "/";
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-500"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Simplified) */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
                <Link href="/godeye/dashboard" className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center font-black text-white shrink-0">
                        A
                    </div>
                    <span className="font-extrabold text-lg tracking-tight">PassFit Admin</span>
                </Link>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[100vw] md:max-w-none overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
