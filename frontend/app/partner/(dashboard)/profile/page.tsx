"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, UploadCloud, MapPin, Search, Star, Building2, Store, TrendingUp, Zap, Clock } from "lucide-react";

export default function PartnerProfileSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const [brandInfo, setBrandInfo] = useState({
        name: "Iron Paradise Fitness",
        description: "Premium strength training and conditioning center equipped with state-of-the-art machinery.",
        rating: "5", // Self-reported rating for now
    });

    const [pricingRules, setPricingRules] = useState({
        surgeEnabled: true,
        surgeMultiplier: 15,
        peakStart: "17:00",
        peakEnd: "21:00",
        flashSaleEnabled: true,
        flashDiscount: 20
    });

    const [branches, setBranches] = useState([
        { id: 1, location: "Bandra West", address: "14th Road, Near Khar Danda", active: true },
        { id: 2, location: "Andheri Lokhandwala", address: "Main Road, Opp Axis Bank", active: true }
    ]);

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert("Brand Settings Saved Successfully!");
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Store className="w-8 h-8 text-indigo-500" />
                        Brand & Location Settings
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Customize how your gym appears to thousands of users on PassFit.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-bold h-12 px-6 shadow-xl shadow-slate-200">
                    {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Brand Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Brand Identity Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Brand Identity</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Logo Upload Section */}
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-colors">
                                    <UploadCloud className="w-8 h-8 mb-1 text-slate-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Logo</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-700 mb-1">Brand Logo</h3>
                                    <p className="text-sm text-slate-500 mb-4">Upload your high-resolution logo. PNG or JPG, max 2MB. Square format recommended.</p>
                                    <Button variant="outline" size="sm" className="font-bold border-slate-300">Choose File</Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">Gym Chain / Brand Name</label>
                                    <Input
                                        value={brandInfo.name}
                                        onChange={e => setBrandInfo({ ...brandInfo, name: e.target.value })}
                                        className="h-12 bg-slate-50"
                                    />
                                    <p className="text-xs text-slate-400 font-medium">This is your primary identifier on the platform.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">Brand Description</label>
                                    <textarea
                                        value={brandInfo.description}
                                        onChange={e => setBrandInfo({ ...brandInfo, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">Platform Rating Tier (Self-Reported)</label>
                                    <p className="text-xs text-slate-500 font-medium mb-3">
                                        Select the tier that best describes your aggregate facilities. This will be verified during the physical inspection.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {["2", "3", "4", "5"].map(tier => (
                                            <div
                                                key={tier}
                                                onClick={() => setBrandInfo({ ...brandInfo, rating: tier })}
                                                className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all ${brandInfo.rating === tier ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
                                            >
                                                <Star className={`w-6 h-6 mb-1 ${brandInfo.rating === tier ? 'fill-amber-400 text-amber-400' : ''}`} />
                                                <span className="text-xs font-bold">{tier} Star</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Pricing Engine Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dynamic Revenue Engine</h2>
                            </div>
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">Premium Feature</span>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Surge Pricing */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div
                                        onClick={() => setPricingRules({ ...pricingRules, surgeEnabled: !pricingRules.surgeEnabled })}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${pricingRules.surgeEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pricingRules.surgeEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        Peak Hour Surge Pricing <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">Automatically increase pass prices when your gym is most crowded to maximize revenue.</p>

                                    {pricingRules.surgeEnabled && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">Peak Time Window</label>
                                                <div className="flex items-center gap-2">
                                                    <Input type="time" value={pricingRules.peakStart} onChange={e => setPricingRules({ ...pricingRules, peakStart: e.target.value })} className="h-10 bg-white" />
                                                    <span className="text-slate-400 text-sm">to</span>
                                                    <Input type="time" value={pricingRules.peakEnd} onChange={e => setPricingRules({ ...pricingRules, peakEnd: e.target.value })} className="h-10 bg-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">Surge Multiplier</label>
                                                <div className="relative">
                                                    <Input type="number" value={pricingRules.surgeMultiplier} onChange={e => setPricingRules({ ...pricingRules, surgeMultiplier: parseInt(e.target.value) || 0 })} className="h-10 bg-white pl-3 pr-8" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Flash Sales */}
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div
                                        onClick={() => setPricingRules({ ...pricingRules, flashSaleEnabled: !pricingRules.flashSaleEnabled })}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${pricingRules.flashSaleEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pricingRules.flashSaleEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                        Off-Peak Flash Sales <Clock className="w-4 h-4 text-emerald-500" />
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">Increase footfall during quiet hours by offering automated targeted discounts.</p>

                                    {pricingRules.flashSaleEnabled && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                            <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">Apply off-peak hours discount of</label>
                                                <div className="relative">
                                                    <Input type="number" value={pricingRules.flashDiscount} onChange={e => setPricingRules({ ...pricingRules, flashDiscount: parseInt(e.target.value) || 0 })} className="h-10 bg-white pl-3 pr-8" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Sidebar: Branches & Locations */}
                <div className="space-y-8">

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                Branches
                            </h2>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-indigo-200 text-indigo-700 bg-indigo-50">
                                + Add New
                            </Button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {branches.map(branch => (
                                <div key={branch.id} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{branch.location}</h4>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2 pr-4">{branch.address}</p>
                                        </div>
                                        <div className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600 bg-white shadow-sm border border-slate-200">
                                                <Search className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2">Need to add Pricing?</h3>
                        <p className="text-sm text-indigo-700/80 mb-4 font-medium leading-relaxed">
                            Pricing is configured per-branch. Click on a specific branch above to manage its day passes, monthly memberships, and amenities.
                        </p>
                        <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-100 shadow-sm border border-indigo-200 font-bold">
                            View Pricing Tutorial
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
