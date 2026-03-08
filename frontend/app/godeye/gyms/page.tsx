"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, AlertCircle, Eye, ShieldAlert, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const pendingGyms = [
    {
        id: 1,
        name: "Iron Core Fitness",
        owner: "Rahul Sharma",
        email: "rahul@ironcore.com",
        location: "Koramangala, Bangalore",
        appliedDate: "2023-10-24",
        status: "Pending",
        details: {
            phone: "+91 9876543210",
            amenities: ["AC", "Cardio", "Strength", "Parking"],
            dayPassPrice: 299,
            monthlyPrice: 2499,
            kycDoc: "GSTIN_29ABCDE1234F1Z5",
            photos: [
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400"
            ]
        }
    },
    {
        id: 2,
        name: "Zenith Wellness Club",
        owner: "Priya Desai",
        email: "priya@zenith.com",
        location: "Andheri East, Mumbai",
        appliedDate: "2023-10-25",
        status: "Pending",
        details: {
            phone: "+91 9988776655",
            amenities: ["Yoga", "Pool", "Steam Bath", "Personal Training"],
            dayPassPrice: 499,
            monthlyPrice: 3999,
            kycDoc: "PAN_ABCDE1234F",
            photos: [
                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400",
            ]
        }
    }
];

const activeGyms = [
    {
        id: 101, name: "Gold's Gym Indiranagar", owner: "Amit Kumar", email: "amit@golds.com", location: "Bangalore", appliedDate: "2023-01-12", users: 1245, revenue: "₹4,50,000", status: "Active",
        details: { phone: "+91 9898989898", amenities: ["AC", "Cardio", "Strength", "Steam", "Parking"], dayPassPrice: 499, monthlyPrice: 4999, kycDoc: "GSTIN_29ABCDE1234G", photos: ["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400"] }
    },
    {
        id: 102, name: "Cult.Fit HSR", owner: "Neha Singh", email: "neha@cultfit.com", location: "Bangalore", appliedDate: "2023-03-22", users: 3421, revenue: "₹12,20,000", status: "Active",
        details: { phone: "+91 8888888888", amenities: ["Zumba", "Yoga", "Boxing", "AC"], dayPassPrice: 599, monthlyPrice: 5999, kycDoc: "GSTIN_29XYZAB8901L", photos: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"] }
    },
    {
        id: 103, name: "Anytime Fitness Malad", owner: "Vikram Sethi", email: "vikram@anytime.com", location: "Mumbai", appliedDate: "2023-05-05", users: 890, revenue: "₹2,80,000", status: "Active",
        details: { phone: "+91 7777777777", amenities: ["24/7", "Cardio", "Strength", "Parking"], dayPassPrice: 399, monthlyPrice: 3499, kycDoc: "GSTIN_27MNOPI5678Q", photos: ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400"] }
    },
];

export default function AdminGymsPage() {
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedGym, setSelectedGym] = useState<any>(null);
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleApprove = (gymName: string) => {
        showToast(`${gymName} has been APPROVED and is now live!`);
        setSelectedGym(null);
    };

    const handleReject = (gymName: string) => {
        showToast(`${gymName} application has been REJECTED.`);
        setSelectedGym(null);
    };

    const handleSuspend = (gymName: string) => {
        if (confirm(`Are you sure you want to suspend ${gymName}? They will be removed from customer search immediately.`)) {
            showToast(`${gymName} is now SUSPENDED.`);
        }
    };

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

            {/* Review Modal */}
            {selectedGym && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Application Review</h3>
                                <p className="text-sm text-slate-500 font-medium">Review KYC and partner details before approval.</p>
                            </div>
                            <button onClick={() => setSelectedGym(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8 flex-1">

                            {/* Gym Identity Info */}
                            <div className="flex gap-6">
                                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
                                    <Building2 className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedGym.name}</h2>
                                    <p className="text-slate-500 font-medium">{selectedGym.location}</p>
                                    <div className="mt-3 flex gap-4">
                                        <div className="text-sm">
                                            <span className="text-slate-400 font-bold block mb-0.5">Owner</span>
                                            <span className="text-slate-700 font-semibold">{selectedGym.owner}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-slate-400 font-bold block mb-0.5">Contact</span>
                                            <span className="text-slate-700 font-semibold">{selectedGym.details.phone}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-slate-400 font-bold block mb-0.5">Application Date</span>
                                            <span className="text-slate-700 font-semibold">{selectedGym.appliedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-8">
                                {/* KYC & Pricing */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-indigo-500" />
                                            KYC Details
                                        </h4>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registered ID / GSTIN</div>
                                            <div className="font-mono text-sm text-slate-800 font-bold bg-white px-3 py-2 border border-slate-200 rounded-lg inline-block">
                                                {selectedGym.details.kycDoc}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            Amenities Claimed
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGym.details.amenities.map((am: string, idx: number) => (
                                                <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                                    {am}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Photos & Plans */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-amber-500" />
                                            Pricing Plans Configured
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50">
                                                <span className="font-bold text-slate-600 text-sm">Day Pass</span>
                                                <span className="font-black text-indigo-600">₹{selectedGym.details.dayPassPrice}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50">
                                                <span className="font-bold text-slate-600 text-sm">Monthly Plan</span>
                                                <span className="font-black text-indigo-600">₹{selectedGym.details.monthlyPrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-3">Facility Photos</h4>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {selectedGym.details.photos.map((url: string, idx: number) => (
                                                <img key={idx} src={url} alt="Gym Facility" className="w-32 h-24 object-cover rounded-xl border border-slate-200 shrink-0" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                            {selectedGym.status === "Pending" ? (
                                <>
                                    <Button variant="outline" onClick={() => handleReject(selectedGym.name)} className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-32">
                                        Reject
                                    </Button>
                                    <Button onClick={() => handleApprove(selectedGym.name)} className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white w-40">
                                        Approve Gym
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setSelectedGym(null)} className="font-bold bg-slate-900 hover:bg-slate-800 text-white w-32">
                                    Close Menu
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gym Verification & Directory</h1>
                <p className="text-slate-500 font-medium mt-1">Review onboarding applications and manage active partner gyms.</p>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex p-1 bg-slate-200/50 rounded-xl w-max">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Verification
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Gyms
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search gyms..."
                            className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64 shadow-sm"
                        />
                    </div>
                    <Button variant="outline" className="font-bold border-slate-200 bg-white text-slate-700 shadow-sm shrink-0">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Tables Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                {activeTab === "pending" && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Name</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Applied Date</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingGyms.map((gym, idx) => (
                                <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 md:p-6">
                                        <div className="font-bold text-slate-900">{gym.name}</div>
                                        <div className="text-sm text-slate-500 font-medium">{gym.owner}</div>
                                    </td>
                                    <td className="p-4 md:p-6 hidden md:table-cell">
                                        <span className="text-sm font-medium text-slate-600">{gym.location}</span>
                                    </td>
                                    <td className="p-4 md:p-6 hidden sm:table-cell">
                                        <span className="text-sm font-medium text-slate-600">{gym.appliedDate}</span>
                                    </td>
                                    <td className="p-4 md:p-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                                            <AlertCircle className="w-3 h-3" />
                                            {gym.status}
                                        </span>
                                    </td>
                                    <td className="p-4 md:p-6 text-right">
                                        <Button onClick={() => setSelectedGym(gym)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-200">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Review
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "active" && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Name</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Users (Mth)</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Revenue (YTD)</th>
                                <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeGyms.map((gym) => (
                                <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 md:p-6">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            {gym.name}
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </td>
                                    <td className="p-4 md:p-6 hidden md:table-cell">
                                        <span className="text-sm font-medium text-slate-600">{gym.location}</span>
                                    </td>
                                    <td className="p-4 md:p-6 hidden sm:table-cell">
                                        <span className="text-sm font-bold text-slate-700">{gym.users.toLocaleString()}</span>
                                    </td>
                                    <td className="p-4 md:p-6 hidden sm:table-cell">
                                        <span className="text-sm font-black text-indigo-600">{gym.revenue}</span>
                                    </td>
                                    <td className="p-4 md:p-6 text-right flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedGym(gym)} className="font-bold border-slate-200 hover:bg-slate-100">
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleSuspend(gym.name)} className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white">
                                            Suspend
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}
