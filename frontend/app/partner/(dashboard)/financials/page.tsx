"use client";

import { CreditCard, ArrowUpRight, ArrowDownRight, Building2, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PartnerFinancialsPage() {
    // Mock Data
    const metrics = {
        grossRevenue: 84500,
        commissionRate: 15,
        takeHome: 71825,
        pendingPayout: 12400
    };

    const payouts = [
        { id: "PO-092", date: "01 Mar 2026", period: "15 Feb - 28 Feb", amount: 24500, status: "processing" },
        { id: "PO-091", date: "15 Feb 2026", period: "01 Feb - 14 Feb", amount: 22100, status: "paid" },
        { id: "PO-090", date: "01 Feb 2026", period: "15 Jan - 31 Jan", amount: 25225, status: "paid" },
    ];

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings & Payouts</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your revenue, commissions, and bank settlements.</p>
                </div>
                <Button variant="outline" className="font-bold border-slate-200 shadow-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Tax Report
                </Button>
            </div>

            {/* Financial Ledger Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</div>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +15%
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">₹{metrics.grossRevenue.toLocaleString()}</div>
                    <div className="text-xs font-medium text-slate-400">Total sales this month before fees</div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            Platform Fee <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{metrics.commissionRate}%</span>
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md mt-1">
                            <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">₹{(metrics.grossRevenue * (metrics.commissionRate / 100)).toLocaleString()}</div>
                    <div className="text-xs font-medium text-slate-400">PassFit commission withheld</div>
                </div>

                <div className="bg-indigo-600 p-6 md:p-8 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-2 z-10 relative">
                        <div className="text-sm font-bold text-indigo-200 uppercase tracking-wider">Net Take-Home</div>
                        <CreditCard className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1 z-10 relative">₹{metrics.takeHome.toLocaleString()}</div>
                    <div className="text-xs font-medium text-indigo-200 z-10 relative">Actual earnings deposited to bank</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payouts Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900">Settlement History</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {payouts.map(payout => (
                                <div key={payout.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="font-bold text-slate-900">{payout.date}</div>
                                            {payout.status === 'paid' ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    <CheckCircle2 className="w-3 h-3" /> Paid
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                    <Clock className="w-3 h-3" /> Processing
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium">Sales Period: {payout.period}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-900">₹{payout.amount.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400 font-mono">{payout.id}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bank Details Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-slate-900">Bank Details</h3>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="text-xs font-bold text-slate-500 mb-0.5">Account Name</div>
                                <div className="text-sm font-bold text-slate-900">Iron Paradise Fitness Pvt Ltd</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 mb-0.5">Bank Name</div>
                                <div className="text-sm font-bold text-slate-900">HDFC Bank</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 mb-0.5">Account Number</div>
                                <div className="text-sm font-mono text-slate-900">XXXX XXXX 4012</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 mb-0.5">IFSC Code</div>
                                <div className="text-sm font-mono text-slate-900">HDFC0001234</div>
                            </div>
                        </div>
                        <Button className="w-full font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-sm">
                            Update Details
                        </Button>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">Payout Schedule</h4>
                            <p className="text-xs font-medium text-amber-800/80 mt-1">Payouts are processed bi-weekly (1st and 15th of every month) for the previous 15-day sales cycle. Settlements typically hit your bank within 2-3 business days.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
