"use client";

import { Users, Building2, TrendingUp, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

// Mock Data
const revenueData = [
    { name: 'Mon', revenue: 4000, commission: 600 },
    { name: 'Tue', revenue: 3000, commission: 450 },
    { name: 'Wed', revenue: 2000, commission: 300 },
    { name: 'Thu', revenue: 2780, commission: 417 },
    { name: 'Fri', revenue: 1890, commission: 283 },
    { name: 'Sat', revenue: 5390, commission: 808 },
    { name: 'Sun', revenue: 6490, commission: 973 },
];

const gymSignupsData = [
    { name: 'Week 1', signups: 12 },
    { name: 'Week 2', signups: 19 },
    { name: 'Week 3', signups: 15 },
    { name: 'Week 4', signups: 28 },
];

export default function AdminDashboardPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Master Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Platform-wide analytics and key performance indicators.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3" /> +12.5%
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Total Gross Revenue (30d)</div>
                    <div className="text-3xl font-black text-slate-900">₹8,45,290</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3" /> +15.2%
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Net Platform Commission</div>
                    <div className="text-3xl font-black text-slate-900">₹1,26,793</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3" /> +4 this week
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Total Active Gyms</div>
                    <div className="text-3xl font-black text-slate-900">148</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3" /> +892 this month
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Total App Users</div>
                    <div className="text-3xl font-black text-slate-900">12,543</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - Spans 2 columns */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Revenue & Commission Trend</h2>
                        <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none">
                            <option>Past 7 Days</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`₹${value}`, undefined]}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" name="Gross Revenue" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" name="Net Commission" dataKey="commission" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gym Onboarding Trend - 1 column */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-900">New Gym Approvals</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Partner acquisition (This Month)</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gymSignupsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="signups" name="New Gyms" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Alerts */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Activity className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Action Required</h3>
                        <p className="text-slate-300 font-medium mt-1">There are 12 new Gym Partner applications pending KYC review and approval.</p>
                    </div>
                </div>
                <button className="whitespace-nowrap bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20">
                    Review Applications
                </button>
            </div>

        </div>
    );
}
