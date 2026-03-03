"use client";

import { useEffect, useState } from "react";
import { HeadphonesIcon, AlertCircle, CheckCircle2, IndianRupee, MessageSquare, Loader2, Activity } from "lucide-react";
import { toast } from "react-hot-toast";

type Ticket = {
    id: number;
    user_name: string;
    gym_name: string | null;
    issue_type: string;
    description: string;
    status: string;
    resolution_notes: string | null;
    created_at: string;
};

export default function SupportDisputesPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<number | null>(null);

    // Modal state
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [resolveAction, setResolveAction] = useState<"refund" | "grant_fitcoins" | "none">("none");
    const [fitcoinsAmount, setFitcoinsAmount] = useState<number>(0);
    const [resolutionNotes, setResolutionNotes] = useState("");

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://passfit.in/api/v1/godeye/tickets", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Error fetching tickets", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleResolve = async () => {
        if (!selectedTicket) return;
        if (!resolutionNotes.trim()) {
            toast.error("Please provide resolution notes.");
            return;
        }

        setResolvingId(selectedTicket.id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://passfit.in/api/v1/godeye/tickets/${selectedTicket.id}/resolve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    resolution_notes: resolutionNotes,
                    action: resolveAction,
                    fitcoins_amount: fitcoinsAmount
                })
            });

            if (res.ok) {
                toast.success("Ticket resolved successfully!");
                setSelectedTicket(null);
                fetchTickets(); // Refresh list
            } else {
                const err = await res.json();
                toast.error(err.detail || "Failed to resolve ticket");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setResolvingId(null);
        }
    };

    if (isLoading && tickets.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <div className="text-slate-500 font-bold animate-pulse">Loading Support Operations...</div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <HeadphonesIcon className="w-8 h-8 text-orange-500" />
                    Support & Disputes
                </h1>
                <p className="text-slate-500 font-medium mt-1">Resolve customer grievances, issue FitCoins, or trigger refunds.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="p-4 pl-6">Ticket ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Issue Type</th>
                                <th className="p-4">Facility</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-900 font-mono divide-y divide-slate-100">
                            {tickets.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-slate-500">#{t.id}</td>
                                    <td className="p-4 font-sans font-bold">{t.user_name}</td>
                                    <td className="p-4 font-sans">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-500" />
                                            {t.issue_type}
                                        </div>
                                    </td>
                                    <td className="p-4 font-sans">{t.gym_name || "General"}</td>
                                    <td className="p-4 font-sans">
                                        {t.status === "Open" ? (
                                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">Open</span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase">Resolved</span>
                                        )}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        {t.status === "Open" ? (
                                            <button
                                                onClick={() => {
                                                    setSelectedTicket(t);
                                                    setResolveAction("none");
                                                    setFitcoinsAmount(0);
                                                    setResolutionNotes("");
                                                }}
                                                className="bg-slate-900 text-white font-sans font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-800 transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 font-sans text-xs flex items-center justify-end gap-1">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Closed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">No tickets found. You're fully caught up!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Resolve Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Resolve Ticket #{selectedTicket.id}</h2>
                                <p className="text-sm text-slate-500 font-medium">Customer: <b>{selectedTicket.user_name}</b></p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* User Grievance */}
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Issue Reported</div>
                                <div className="font-bold text-rose-900 mb-2">{selectedTicket.issue_type}</div>
                                <p className="text-rose-800 text-sm">{selectedTicket.description}</p>
                            </div>

                            {/* Resolution Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Compensation Action</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setResolveAction("none")}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-colors ${resolveAction === 'none' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Just Reply
                                        </button>
                                        <button
                                            onClick={() => setResolveAction("grant_fitcoins")}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-colors ${resolveAction === 'grant_fitcoins' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            <Activity className="w-5 h-5" />
                                            FitCoins
                                        </button>
                                        <button
                                            onClick={() => setResolveAction("refund")}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-colors ${resolveAction === 'refund' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            <IndianRupee className="w-5 h-5" />
                                            Full Refund
                                        </button>
                                    </div>
                                </div>

                                {resolveAction === "grant_fitcoins" && (
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">FitCoins to Issue</label>
                                        <input
                                            type="number"
                                            value={fitcoinsAmount}
                                            onChange={(e) => setFitcoinsAmount(parseInt(e.target.value) || 0)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Resolution Notes (Sent to user)</label>
                                    <textarea
                                        rows={4}
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Explain how the issue was resolved..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResolve}
                                disabled={resolvingId === selectedTicket.id}
                                className="flex-1 px-4 py-3 bg-slate-900 text-white flex justify-center font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50"
                            >
                                {resolvingId === selectedTicket.id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Resolution"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
