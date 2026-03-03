"use client";

import { useEffect, useState } from "react";
import { Activity, Ticket, IndianRupee, Ban, Loader2, RefreshCw } from "lucide-react";

export default function LiveOperationsPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchLiveFeed = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://passfit.in/api/v1/godeye/live-feed", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
                setLastRefresh(new Date());
            }
        } catch (error) {
            console.error("Error fetching live feed", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveFeed();
        // Poll every 30 seconds
        const interval = setInterval(fetchLiveFeed, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <div className="text-slate-500 font-bold animate-pulse">Establishing secure uplink to operations feed...</div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-red-500 animate-pulse" />
                        Live Operations
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time marketplace feed tracking walk-ins, revenue, and failures.</p>
                </div>
                <button
                    onClick={fetchLiveFeed}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? "Refreshing..." : "Refresh Feed"}
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                    <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><Ticket className="w-4 h-4" /> Active Passes Today</div>
                    <div className="text-3xl font-black text-slate-900">{data.metrics.active_passes}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                    <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><Ticket className="w-4 h-4" /> Verified / Checked-In</div>
                    <div className="text-3xl font-black text-slate-900">{data.metrics.verified_passes}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
                    <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><Ban className="w-4 h-4" /> Expired / No-Shows</div>
                    <div className="text-3xl font-black text-slate-900">{data.metrics.no_shows}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                    <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Gross Revenue (Today)</div>
                    <div className="text-3xl font-black text-slate-900">₹{data.metrics.gross_revenue.toLocaleString()}</div>
                </div>
            </div>

            {/* Recent Bookings Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Pulse Radar (Recent Activity)</h2>
                    <div className="text-xs font-semibold text-slate-400">Last updated: {lastRefresh.toLocaleTimeString()}</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-extrabold uppercase tracking-wider">
                                <th className="p-4 pl-6">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Facility</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4 pr-6 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-900 font-mono divide-y divide-slate-100">
                            {data.live_feed.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-blue-600">#{booking.id}</td>
                                    <td className="p-4 font-sans font-bold">{booking.user_name}</td>
                                    <td className="p-4 font-sans">{booking.gym_name}</td>
                                    <td className="p-4">
                                        {booking.is_cancelled ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">Cancelled</span>
                                        ) : booking.status === "Active" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Active</span>
                                        ) : booking.status === "Used" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">Verified</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">{booking.status}</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-slate-900 font-sans">₹{booking.amount}</td>
                                    <td className="p-4 pr-6 text-right text-slate-500 text-xs">
                                        {new Date(booking.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {data.live_feed.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium font-sans">
                                        No recent bookings traced.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
