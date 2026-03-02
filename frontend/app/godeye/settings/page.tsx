"use client";

import { useState } from "react";
import { Settings2, Save, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const initialSettings = {
    platformFeePct: 15,
    autoVerifyGyms: false,
    supportEmail: "support@gymmp.com",
    supportPhone: "+91 80001 02030",
    maxActiveBookingsPerUser: 5,
    cancellationWindowHours: 4,
    maintenanceMode: false
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleSave = () => {
        setIsSaving(true);
        // Mock API Call
        setTimeout(() => {
            setIsSaving(false);
            showToast("Global settings successfully updated!");
        }, 800);
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 relative">

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

            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-indigo-500" />
                        Global Settings
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Configure foundational business rules and platform parameters.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-200 min-w-[140px]">
                    {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>

            <div className="space-y-6">

                {/* Financial Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-900">Financial Rules</h2>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="max-w-xl">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Default Platform Commission (%)</label>
                            <p className="text-xs text-slate-500 font-medium mb-3">The standard cut taken from every verified booking gross amount. Custom rates can be set per gym via the backend.</p>
                            <input
                                type="number"
                                min="0" max="100"
                                value={settings.platformFeePct}
                                onChange={(e) => setSettings({ ...settings, platformFeePct: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations & Booking Limits */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-900">Operations & Logistics</h2>
                    </div>
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Max Active Bookings (Per User)</label>
                            <p className="text-xs text-slate-500 font-medium mb-3">Stop users from hoarding passes simultaneously.</p>
                            <input
                                type="number"
                                min="1" max="20"
                                value={settings.maxActiveBookingsPerUser}
                                onChange={(e) => setSettings({ ...settings, maxActiveBookingsPerUser: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cancellation Window (Hours)</label>
                            <p className="text-xs text-slate-500 font-medium mb-3">Hours before start time free cancellation is allowed.</p>
                            <input
                                type="number"
                                min="0" max="72"
                                value={settings.cancellationWindowHours}
                                onChange={(e) => setSettings({ ...settings, cancellationWindowHours: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${settings.autoVerifyGyms ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.autoVerifyGyms ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Auto-Approve New Gyms (Skip Verification)</div>
                                    <div className="text-xs font-medium text-slate-500">Not recommended. If enabled, gyms bypass the pending queue and go live instantly.</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Support Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-900">Support Directory</h2>
                    </div>
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Support Helpline</label>
                            <input
                                type="text"
                                value={settings.supportPhone}
                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                        <h2 className="font-bold text-red-900">System Controls</h2>
                    </div>
                    <div className="p-6 md:p-8">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-red-200 rounded-xl bg-red-50">
                            <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-red-200'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-red-900">Enable Maintenance Mode</div>
                                <div className="text-xs font-medium text-red-700">Warning: This will lock all regular users and gym owners out of the platform with a "We'll be right back" page.</div>
                            </div>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
}
