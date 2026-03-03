"use client";

import { useState, useEffect } from "react";
import { Tag, Star, Plus, CheckCircle2, XCircle, X, Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const initialFeaturedGyms = [
    { id: "G-102", name: "Iron Core Fitness", location: "Koramangala, Bangalore", featuredUntil: "2023-11-30" },
    { id: "G-089", name: "Zenith Wellness Club", location: "Andheri East, Mumbai", featuredUntil: "2023-12-15" },
];

export default function AdminMarketingPage() {
    const [activeTab, setActiveTab] = useState("promos");
    const [toastMessage, setToastMessage] = useState("");

    // Promo State
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [isLoadingPromos, setIsLoadingPromos] = useState(true);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [newPromo, setNewPromo] = useState({ code: "", type: "percentage", value: "", maxUses: "" });

    // Fetch Promos on Mount
    useEffect(() => {
        fetchPromos();
    }, []);

    const fetchPromos = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("https://passfit.in/api/v1/promos/admin", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPromoCodes(data);
            }
        } catch (error) {
            console.error("Failed to fetch promos", error);
        } finally {
            setIsLoadingPromos(false);
        }
    };

    // Featured Gyms State
    const [featuredGyms, setFeaturedGyms] = useState(initialFeaturedGyms);
    const [showFeatureModal, setShowFeatureModal] = useState(false);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleCreatePromo = async () => {
        if (!newPromo.code || !newPromo.value) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://passfit.in/api/v1/promos/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: newPromo.code.toUpperCase(),
                    discount_percentage: parseFloat(newPromo.value),
                    max_uses: newPromo.maxUses ? parseInt(newPromo.maxUses) : null
                })
            });

            if (res.ok) {
                const data = await res.json();
                setPromoCodes([data, ...promoCodes]);
                setShowPromoModal(false);
                setNewPromo({ code: "", type: "percentage", value: "", maxUses: "" });
                showToast(`Promo code ${data.code} activated!`);
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to create promo");
            }
        } catch (error) {
            alert("Error creating promo code.");
        }
    };

    const togglePromoStatus = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://passfit.in/api/v1/promos/admin/${id}/toggle`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const updatedPromo = await res.json();
                setPromoCodes(promoCodes.map(p => p.id === id ? updatedPromo : p));
                showToast(`Promo ${updatedPromo.is_active ? 'activated' : 'deactivated'}`);
            }
        } catch (error) {
            alert("Error toggling promo status");
        }
    };

    const handleRemoveFeature = (id: string) => {
        if (confirm("Remove this gym from the featured home page section?")) {
            setFeaturedGyms(featuredGyms.filter(g => g.id !== id));
            showToast("Gym removed from featured list");
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

            {/* Create Promo Modal */}
            {showPromoModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">Create Discount Code</h3>
                            <button onClick={() => setShowPromoModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Promo Code Name</label>
                                <input
                                    type="text"
                                    value={newPromo.code}
                                    onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="e.g. GETFIT20"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount Type</label>
                                    <select
                                        value={newPromo.type}
                                        onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Value</label>
                                    <input
                                        type="number"
                                        value={newPromo.value}
                                        onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder={newPromo.type === 'percentage' ? 'e.g. 20' : 'e.g. 150'}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Usage Limit (Optional)</label>
                                <input
                                    type="number"
                                    value={newPromo.maxUses}
                                    onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="Leave blank for infinite"
                                />
                            </div>
                            <Button onClick={handleCreatePromo} className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 h-12 mt-2 shadow-md shadow-indigo-200">
                                Generate Promo Code
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Gym Modal */}
            {showFeatureModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">Pin Gym to Homepage</h3>
                            <button onClick={() => setShowFeatureModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-center pb-8 border-b border-slate-100">
                            <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                            <h4 className="font-bold text-slate-900">Select Gym to Feature</h4>
                            <p className="text-sm text-slate-500">This feature requires a backend search hook. For the MVP mock, this UI is a placeholder demonstrating the flow.</p>
                            <Button onClick={() => setShowFeatureModal(false)} className="w-full mt-4 font-bold">
                                Close Mock Modal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Gen & Marketing</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure global discount codes and manage premium homepage placements.</p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === "promos" ? (
                        <Button onClick={() => setShowPromoModal(true)} className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> New Promo Code
                        </Button>
                    ) : (
                        <Button onClick={() => setShowFeatureModal(true)} className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-sm">
                            <Star className="w-4 h-4 mr-2" /> Feature a Gym
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-200/50 rounded-xl w-max mb-6">
                <button
                    onClick={() => setActiveTab("promos")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'promos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Tag className="w-4 h-4" /> Discount Codes
                </button>
                <button
                    onClick={() => setActiveTab("featured")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'featured' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Star className="w-4 h-4" /> Featured Placements
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {activeTab === "promos" && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Promo Code</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Usage Limit</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Valid Until</th>
                                <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoadingPromos ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">Loading Promo Codes...</td></tr>
                            ) : promoCodes.map((promo) => (
                                <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 md:px-6 py-4">
                                        <div className={`inline-flex items-center px-3 py-1 rounded border font-mono text-sm font-bold tracking-wider ${promo.is_active ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-100 border-slate-200 text-slate-500 line-through'}`}>
                                            {promo.code}
                                        </div>
                                    </td>
                                    <td className="p-4 md:px-6 py-4">
                                        <div className={`font-bold text-lg ${promo.is_active ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {promo.discount_percentage}% OFF
                                        </div>
                                    </td>
                                    <td className="p-4 md:px-6 py-4 hidden sm:table-cell">
                                        <div className="font-bold text-slate-700 text-sm">{promo.current_uses} <span className="text-slate-400 font-medium">/ {promo.max_uses === null ? 'Unlimited' : promo.max_uses}</span></div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                            {promo.max_uses !== null && (
                                                <div className={`h-full ${promo.is_active ? 'bg-indigo-500' : 'bg-slate-300'}`} style={{ width: `${Math.min((promo.current_uses / promo.max_uses) * 100, 100)}%` }}></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 md:px-6 py-4 hidden md:table-cell">
                                        <span className="text-sm font-medium text-slate-600">No Expiry</span>
                                    </td>
                                    <td className="p-4 md:px-6 py-4 text-right">
                                        <Button onClick={() => togglePromoStatus(promo.id)} variant={promo.is_active ? "outline" : "default"} size="sm" className={`font-bold ${!promo.is_active ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'border-slate-200 text-slate-600'}`}>
                                            {promo.is_active ? "Deactivate" : "Activate Code"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === "featured" && (
                    <div>
                        <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                            <Megaphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-amber-900">Premium Real Estate</h4>
                                <p className="text-sm text-amber-800 font-medium mt-1">Gyms listed here are pinned to the top of the Customer App homepage under the "Featured Gyms" horizontal scroller.</p>
                            </div>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-200">
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gym Partner</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Featured Until</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {featuredGyms.map((gym) => (
                                    <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                {gym.name}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium mt-0.5">{gym.id}</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600">{gym.location}</span>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{gym.featuredUntil}</span>
                                        </td>
                                        <td className="p-4 md:px-6 py-4 text-right flex justify-end">
                                            <Button onClick={() => handleRemoveFeature(gym.id)} variant="outline" size="sm" className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {featuredGyms.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-slate-400 font-medium">
                                            No gyms are currently featured.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
