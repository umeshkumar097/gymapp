"use client";

import { Building2, Wallet, Users, Receipt, ArrowUpRight, TrendingUp, Search, Plus, ShieldCheck, Download, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CorporateDashboard() {
    const [rechargeModal, setRechargeModal] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState("50000");
    const [isRecharging, setIsRecharging] = useState(false);

    const handleRecharge = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRecharging(true);
        setTimeout(() => {
            setIsRecharging(false);
            setRechargeModal(false);
            alert(`Successfully recharged corporate wallet with ₹${rechargeAmount}! Employee limits updated.`);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Acme Corp Wellness</h1>
                            <p className="text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Enterprise Partner
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="w-full md:w-auto font-bold border-slate-300 shadow-sm bg-white">
                            <Download className="w-4 h-4 mr-2" /> Tax Invoice
                        </Button>
                        <Button onClick={() => setRechargeModal(true)} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200">
                            <Wallet className="w-4 h-4 mr-2" /> Top-Up Wallet
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                Low Warning
                            </span>
                        </div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Available Balance</div>
                        <div className="text-3xl font-black text-slate-900">₹14,500</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Shared among 150 employees</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Enrolled Staff</div>
                        <div className="text-3xl font-black text-slate-900">142</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">8 pending invites</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +22%
                            </span>
                        </div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Savings</div>
                        <div className="text-3xl font-black text-slate-900">₹8,400</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Via B2B Corporate Rates</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Receipt className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Credits Spent MTD</div>
                        <div className="text-3xl font-black text-slate-900">₹35,500</div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Current month consumption</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Employee Management */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50">
                                <h2 className="text-lg font-bold text-slate-900">Employee Directory</h2>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-48">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name/dept..."
                                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <Button size="sm" className="bg-slate-900 text-white font-bold h-9">
                                        <Plus className="w-4 h-4 mr-1.5" /> Invite
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-white border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                                        <tr>
                                            <th className="px-6 py-4">Employee Details</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Monthly Cap</th>
                                            <th className="px-6 py-4">Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                        {[
                                            { name: "Sarah Jennings", email: "sarah.j@acmecorp.com", dept: "Engineering", status: "Active", cap: 2000, spent: 1450 },
                                            { name: "Michael Chang", email: "m.chang@acmecorp.com", dept: "Sales", status: "Active", cap: 2000, spent: 2000 },
                                            { name: "Priya Desai", email: "priya.d@acmecorp.com", dept: "Marketing", status: "Invited", cap: 2000, spent: 0 },
                                            { name: "Robert Fox", email: "robert.f@acmecorp.com", dept: "Product", status: "Active", cap: 4000, spent: 3200 }, // Exec tier
                                        ].map((emp, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{emp.name}</div>
                                                    <div className="text-xs text-slate-500">{emp.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{emp.dept}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${emp.status === 'Active' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'}`}>
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-900 font-mono">₹{emp.cap}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${emp.spent >= emp.cap ? 'bg-red-500' : 'bg-indigo-500'}`}
                                                                style={{ width: `${(emp.spent / emp.cap) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-mono w-10 text-right">₹{emp.spent}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-bold text-lg mb-2">Automated Rules</h3>
                            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                                Control how your corporate wallet drains. Set monthly limits per role to ensure fair budget distribution.
                            </p>

                            <div className="space-y-3">
                                <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-200">Standard Tier</div>
                                        <div className="font-medium text-sm">₹2,000 / month / user</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10">Edit</Button>
                                </div>
                                <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-amber-200">Executive Tier</div>
                                        <div className="font-medium text-sm">₹4,000 / month / user</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 text-white hover:bg-white/10">Edit</Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-slate-400" /> Recent Top-Ups
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { date: "01 Mar 2026", amount: 50000, tx: "TX_ACME_9912", status: "Success" },
                                    { date: "15 Feb 2026", amount: 25000, tx: "TX_ACME_8841", status: "Success" },
                                ].map((tx, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">₹{tx.amount.toLocaleString()}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{tx.tx}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-emerald-600 mb-0.5">{tx.status}</div>
                                            <div className="text-xs text-slate-400">{tx.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Recharge Modal */}
            {rechargeModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Add Wallet Funds</h3>
                            <button onClick={() => setRechargeModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRecharge} className="p-6">
                            <div className="mb-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Recharge Amount (INR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={rechargeAmount}
                                            onChange={e => setRechargeAmount(e.target.value)}
                                            required
                                            min="5000"
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-black text-xl rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-2">+ 18% GST will be applied at checkout.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {["10000", "25000", "50000"].map(amt => (
                                        <div
                                            key={amt}
                                            onClick={() => setRechargeAmount(amt)}
                                            className={`cursor-pointer text-center py-2 rounded-lg text-sm font-bold border ${rechargeAmount === amt ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            ₹{(parseInt(amt) / 1000).toFixed(0)}k
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" disabled={isRecharging} className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 shadow-xl shadow-slate-200">
                                {isRecharging ? 'Processing...' : `Proceed to Pay ₹${parseInt(rechargeAmount) * 1.18}`}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
