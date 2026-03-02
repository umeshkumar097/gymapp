"use client";

import { useState } from "react";
import { CheckCircle2, Download, Search, X, Check, Wallet, Landmark, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Payout Data
const payoutLedger = [
    {
        id: "PY-10042",
        gymName: "Iron Core Fitness",
        gymId: "G-102",
        period: "Oct 1 - Oct 31, 2023",
        bookingsCount: 142,
        grossAmount: 42600,
        platformFeePercent: 15,
        status: "Pending", // Pending, Settled
        bankDetails: {
            account: "HDFC Bank (****4012)",
            ifsc: "HDFC0001234",
            holderName: "Iron Core LLC"
        }
    },
    {
        id: "PY-10041",
        gymName: "Zenith Wellness Club",
        gymId: "G-089",
        period: "Oct 1 - Oct 31, 2023",
        bookingsCount: 89,
        grossAmount: 65000,
        platformFeePercent: 15,
        status: "Pending",
        bankDetails: {
            account: "ICICI Bank (****8890)",
            ifsc: "ICIC0005678",
            holderName: "Priya Desai"
        }
    },
    {
        id: "PY-10038",
        gymName: "Gold's Gym Indiranagar",
        gymId: "G-005",
        period: "Sep 1 - Sep 30, 2023",
        bookingsCount: 312,
        grossAmount: 185000,
        platformFeePercent: 12, // Custom negotiated rate
        status: "Settled",
        transactionId: "TRX-998827361",
        bankDetails: {
            account: "SBI (****1122)",
            ifsc: "SBIN0004321",
            holderName: "Golds Fitness Pvt Ltd"
        }
    }
];

export default function AdminPayoutsPage() {
    const [ledgers, setLedgers] = useState(payoutLedger);
    const [selectedPayout, setSelectedPayout] = useState<any>(null);
    const [transactionId, setTransactionId] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleSettleSubmit = () => {
        if (!transactionId) return;

        setLedgers(ledgers.map(l =>
            l.id === selectedPayout.id
                ? { ...l, status: "Settled", transactionId }
                : l
        ));

        showToast(`Payout ${selectedPayout.id} settled successfully!`);
        setSelectedPayout(null);
        setTransactionId("");
    };

    // Derived Metrics
    const totalPending = ledgers.filter(l => l.status === "Pending").reduce((acc, l) => acc + (l.grossAmount * (1 - l.platformFeePercent / 100)), 0);
    const totalSettled = ledgers.filter(l => l.status === "Settled").reduce((acc, l) => acc + (l.grossAmount * (1 - l.platformFeePercent / 100)), 0);
    const platformRevenue = ledgers.reduce((acc, l) => acc + (l.grossAmount * (l.platformFeePercent / 100)), 0);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 relative">

            {/* Custom Toast */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">{toastMessage}</span>
                    <button onClick={() => setToastMessage("")} className="ml-2 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Settle Payout Modal */}
            {selectedPayout && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">Settle Payout</h3>
                            <button onClick={() => { setSelectedPayout(null); setTransactionId(""); }} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">

                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                                <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">Amount to Transfer</div>
                                <div className="text-3xl font-black text-indigo-600">
                                    ₹{(selectedPayout.grossAmount * (1 - selectedPayout.platformFeePercent / 100)).toLocaleString()}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Beneficiary Details</h4>
                                <div className="text-sm flex justify-between">
                                    <span className="text-slate-500 font-medium">Account Name</span>
                                    <span className="text-slate-900 font-bold">{selectedPayout.bankDetails.holderName}</span>
                                </div>
                                <div className="text-sm flex justify-between">
                                    <span className="text-slate-500 font-medium">Bank / Acct</span>
                                    <span className="text-slate-900 font-bold">{selectedPayout.bankDetails.account}</span>
                                </div>
                                <div className="text-sm flex justify-between">
                                    <span className="text-slate-500 font-medium">IFSC Code</span>
                                    <span className="text-slate-900 font-bold">{selectedPayout.bankDetails.ifsc}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Transaction Reference ID</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="e.g. UTR-BANK123456789"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <Button onClick={handleSettleSubmit} className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 h-12 shadow-md shadow-emerald-200">
                                Mark as Settled
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financials & Payouts</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage PassFit commission splits and initiate gym partner settlements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="font-bold border-slate-200 bg-white shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Micro Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <Wallet className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Pending Payouts</span>
                    </div>
                    <div className="text-3xl font-black text-amber-900">₹{totalPending.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Landmark className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Disbursed (YTD)</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-900">₹{totalSettled.toLocaleString()}</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Platform Earnings</span>
                    </div>
                    <div className="text-3xl font-black text-indigo-900">₹{platformRevenue.toLocaleString()}</div>
                </div>
            </div>

            {/* Payouts Ledger Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-bold text-slate-900 text-lg">Settlement Ledger</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search Gym / ID..."
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID & Period</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Partner</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Volume</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gross & Fees</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Net Payout</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ledgers.map((ledger) => {
                                const feeAmount = ledger.grossAmount * (ledger.platformFeePercent / 100);
                                const netAmount = ledger.grossAmount - feeAmount;

                                return (
                                    <tr key={ledger.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm whitespace-nowrap">{ledger.id}</div>
                                            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{ledger.period}</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm whitespace-nowrap">{ledger.gymName}</div>
                                            <div className="text-xs text-slate-500 font-medium">{ledger.gymId}</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-700 text-sm">{ledger.bookingsCount}</div>
                                            <div className="text-xs text-slate-400">Bookings</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm whitespace-nowrap">₹{ledger.grossAmount.toLocaleString()}</div>
                                            <div className="text-xs text-pink-600 font-bold whitespace-nowrap">- ₹{feeAmount.toLocaleString()} ({ledger.platformFeePercent}%)</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-black text-indigo-600 text-[15px] whitespace-nowrap">₹{netAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            {ledger.status === "Pending" ? (
                                                <Button onClick={() => setSelectedPayout(ledger)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs shadow-sm whitespace-nowrap w-full">
                                                    Settle Now
                                                </Button>
                                            ) : (
                                                <div>
                                                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-1 whitespace-nowrap">
                                                        <Check className="w-3 h-3" /> Settled
                                                    </span>
                                                    <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap" title={ledger.transactionId}>{ledger.transactionId}</div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
