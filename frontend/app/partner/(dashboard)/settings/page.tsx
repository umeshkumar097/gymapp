"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, PauseCircle, Trash2, Tag, ShieldCheck, Zap, Power, X, CheckCircle2 } from "lucide-react";

export default function PartnerSettingsPage() {
    // Mock Plans Data
    const [plans, setPlans] = useState([
        { id: 1, type: "1 Day Pass", price: 299, active: true },
        { id: 2, type: "Monthly Membership", price: 2499, active: true },
        { id: 3, type: "Flexi Pass (10 Days)", price: 1499, active: false },
    ]);

    const [acceptingPasses, setAcceptingPasses] = useState(true);
    const [dynamicPricing, setDynamicPricing] = useState({
        enabled: false,
        discountPercent: 15,
        startTime: "12:00",
        endTime: "16:00"
    });

    // Custom Modals & Toasts State
    const [toastMessage, setToastMessage] = useState("");
    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
    const [newPlanData, setNewPlanData] = useState({ type: "", price: "" });
    const [editingPlan, setEditingPlan] = useState<any>(null);

    // Auto-hide toast
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const showToast = (msg: string) => setToastMessage(msg);

    const togglePlan = (id: number) => {
        setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
        showToast("Plan status updated");
    };

    const handleEditPriceSubmit = () => {
        if (!editingPlan || !editingPlan.newPrice) return;
        setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, price: parseInt(editingPlan.newPrice) } : p));
        setEditingPlan(null);
        showToast("Plan price successfully updated");
    };

    const handleDeletePlan = (plan: any) => {
        if (confirm(`Are you sure you want to delete the ${plan.type} plan?`)) {
            setPlans(plans.filter(p => p.id !== plan.id));
            showToast("Plan deleted successfully");
        }
    };

    const handleCreatePlanSubmit = () => {
        if (!newPlanData.type || !newPlanData.price) return;
        setPlans([...plans, {
            id: Date.now(),
            type: newPlanData.type,
            price: parseInt(newPlanData.price),
            active: true
        }]);
        setShowCreatePlanModal(false);
        setNewPlanData({ type: "", price: "" });
        showToast("New plan created successfully");
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 relative">

            {/* Custom Toast Notification */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">{toastMessage}</span>
                    <button onClick={() => setToastMessage("")} className="ml-2 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Create Plan Modal */}
            {showCreatePlanModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">Create New Plan</h3>
                            <button onClick={() => setShowCreatePlanModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Plan Name (e.g. Weekly Pass)</label>
                                <input
                                    type="text"
                                    value={newPlanData.type}
                                    onChange={(e) => setNewPlanData({ ...newPlanData, type: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="Enter plan name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Price (INR)</label>
                                <input
                                    type="number"
                                    value={newPlanData.price}
                                    onChange={(e) => setNewPlanData({ ...newPlanData, price: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="Example: 599"
                                />
                            </div>
                            <Button onClick={handleCreatePlanSubmit} className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 h-12 mt-2">
                                Save Plan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Price Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900">Edit Price</h3>
                            <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">New Price for {editingPlan.type}</label>
                                <input
                                    type="number"
                                    value={editingPlan.newPrice || editingPlan.price}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, newPrice: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <Button onClick={handleEditPriceSubmit} className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 h-10 mt-2">
                                Update Price
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pricing & Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure pricing, offers, and availability of your gym passes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => { setAcceptingPasses(!acceptingPasses); showToast(acceptingPasses ? "Bookings Paused" : "Accepting Bookings Check Enabled"); }} variant={acceptingPasses ? "outline" : "default"} className={`font-bold shadow-md ${!acceptingPasses ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-slate-200'}`}>
                        <Power className={`w-4 h-4 mr-2 ${acceptingPasses ? 'text-emerald-500' : ''}`} />
                        {acceptingPasses ? "Accepting Bookings" : "Paused All Bookings"}
                    </Button>
                    <Button onClick={() => setShowCreatePlanModal(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Plan
                    </Button>
                </div>
            </div>

            <div className="space-y-6">

                {/* Global Status Alert */}
                {!acceptingPasses && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                        <PauseCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-900 text-sm">Online Bookings Paused</h3>
                            <p className="text-sm font-medium opacity-80 mt-1">Your gym is currently disconnected from public searches. No new day passes or memberships can be purchased until you resume bookings. Active subscriptions are unaffected.</p>
                        </div>
                    </div>
                )}

                {/* Plans List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-indigo-500" />
                            Active Memberships & Passes
                        </h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {plans.map(plan => (
                            <div key={plan.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`text-xl font-bold ${plan.active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                                            {plan.type}
                                        </h3>
                                        {plan.active ? (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-wider">Paused</span>
                                        )}
                                    </div>
                                    <div className="text-2xl font-black text-indigo-600">
                                        ₹{plan.price} <span className="text-sm font-medium text-slate-400">/ pass</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 shrink-0">
                                    <Button onClick={() => setEditingPlan(plan)} variant="outline" size="sm" className="font-bold border-slate-200 hover:bg-slate-100">
                                        <Edit2 className="w-4 h-4 mr-2 text-slate-500" /> Edit Price
                                    </Button>

                                    <Button onClick={() => togglePlan(plan.id)} variant="outline" size="sm" className={`font-bold border-slate-200 ${plan.active ? 'hover:bg-amber-50 hover:text-amber-700 border-amber-200' : 'hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200'}`}>
                                        <PauseCircle className="w-4 h-4 mr-2" /> {plan.active ? "Pause Plan" : "Activate Plan"}
                                    </Button>

                                    <Button onClick={() => handleDeletePlan(plan)} variant="outline" size="sm" className="font-bold border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {plans.length === 0 && (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <Tag className="w-12 h-12 mb-3 opacity-20" />
                                <p className="font-medium">No plans created yet. Add a new plan to start accepting bookings.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Pricing / Offers */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
                        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-indigo-500" />
                            Dynamic Pricing (Off-Peak Hours)
                        </h2>

                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => { setDynamicPricing({ ...dynamicPricing, enabled: !dynamicPricing.enabled }); showToast(dynamicPricing.enabled ? "Dynamic Pricing Disabled" : "Dynamic Pricing Enabled"); }}
                        >
                            <span className="text-sm font-bold text-slate-500 select-none">{dynamicPricing.enabled ? 'Enabled' : 'Disabled'}</span>
                            <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${dynamicPricing.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${dynamicPricing.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    {dynamicPricing.enabled && (
                        <div className="p-6 md:p-8 bg-white space-y-6">
                            <p className="text-sm font-medium text-slate-500">
                                Automatically apply discounts during slow hours to increase walk-ins and maximize floor usage.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount Amount (%)</label>
                                    <input
                                        type="number"
                                        min="5" max="50" step="5"
                                        value={dynamicPricing.discountPercent}
                                        onChange={(e) => setDynamicPricing({ ...dynamicPricing, discountPercent: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={dynamicPricing.startTime}
                                        onChange={(e) => setDynamicPricing({ ...dynamicPricing, startTime: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={dynamicPricing.endTime}
                                        onChange={(e) => setDynamicPricing({ ...dynamicPricing, endTime: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                                <span className="flex items-center justify-center shrink-0 w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full font-bold text-xs">i</span>
                                Users booking between {dynamicPricing.startTime} and {dynamicPricing.endTime} will get a {dynamicPricing.discountPercent}% off on Day Passes.
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Security Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            Security & Withdrawals
                        </h2>
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                            <div>
                                <div className="font-bold text-slate-900">Bank Account Details</div>
                                <div className="text-sm text-slate-500 font-medium">HDFC Bank ending in ****4012</div>
                            </div>
                            <Button onClick={() => showToast("Bank update flow initiated. A verification code has been sent to your email.")} variant="outline" size="sm" className="font-bold">Update Bank</Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                            <div>
                                <div className="font-bold text-slate-900">Account Password</div>
                                <div className="text-sm text-slate-500 font-medium">Last changed 3 months ago</div>
                            </div>
                            <Button onClick={() => showToast("Check your registered email for password reset instructions.")} variant="outline" size="sm" className="font-bold">Change Password</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
