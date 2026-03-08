"use client";

import { useState } from "react";
import { GymCard } from "./GymCard";
import { X, Scale, Check, Star } from "lucide-react";
import Image from "next/image";

interface SearchClientWrapperProps {
    gyms: any[];
    searchLocation: string;
}

export function SearchClientWrapper({ gyms, searchLocation }: SearchClientWrapperProps) {
    const [compareList, setCompareList] = useState<any[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const toggleCompare = (gym: any) => {
        setCompareList(prev => {
            const exists = prev.find(g => g.id === gym.id);
            if (exists) {
                return prev.filter(g => g.id !== gym.id);
            } else {
                if (prev.length >= 3) {
                    alert("You can only compare up to 3 gyms at a time.");
                    return prev;
                }
                return [...prev, gym];
            }
        });
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {gyms.map((gym: any) => (
                    <div key={gym.id} className="relative group/wrapper">
                        <GymCard gym={gym} searchLocation={searchLocation} />

                        {/* Compare Checkbox Overlay - Larger hit area for mobile */}
                        <div className="absolute top-3 right-3 z-30">
                            <label className="flex items-center gap-2 cursor-pointer bg-white/95 backdrop-blur-md px-3 py-2 md:px-3 md:py-1.5 rounded-full shadow-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors active:scale-95">
                                <div className={`w-5 h-5 md:w-5 md:h-5 rounded-md border flex items-center justify-center transition-colors ${compareList.find(g => g.id === gym.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                    {compareList.find(g => g.id === gym.id) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </div>
                                <span className={`text-[12px] md:text-[11px] font-bold uppercase tracking-wider ${compareList.find(g => g.id === gym.id) ? 'text-indigo-700' : 'text-slate-600'}`}>
                                    Compare
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={!!compareList.find(g => g.id === gym.id)}
                                    onChange={() => toggleCompare(gym)}
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Compare Floating Action Button - App Native Feel on Mobile */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 animate-in slide-in-from-bottom-full fade-in duration-300">
                    <div className="bg-slate-900 border-t border-slate-800 md:border md:rounded-full shadow-[0_-8px_30px_rgb(0,0,0,0.15)] md:shadow-[0_8px_30px_rgb(0,0,0,0.3)] shadow-indigo-500/10 md:shadow-indigo-500/20 flex items-center justify-between md:justify-start p-4 md:p-1.5 pb-safe pb-6 md:pb-1.5 w-full">
                        
                        <div className="flex items-center gap-3 md:px-4 md:py-2 md:mr-2">
                            <div className="flex -space-x-3">
                                {compareList.map((g, i) => (
                                    <div key={i} className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden relative shadow-sm">
                                        <img src={g.photos || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200&auto=format"} alt={g.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {compareList.length < 3 && (
                                    <div className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[11px] md:text-[10px] font-bold text-slate-400 border-dashed">
                                        +{3 - compareList.length}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center">
                                <span className="text-white font-bold text-sm leading-none">
                                    {compareList.length} Selected
                                </span>
                                <span className="text-slate-400 text-[10px] md:hidden mt-1 uppercase tracking-widest font-bold">For Comparison</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsCompareModalOpen(true)}
                                disabled={compareList.length < 2}
                                className="bg-indigo-600 active:bg-indigo-700 md:hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3.5 md:px-6 md:py-3 rounded-xl md:rounded-full flex items-center gap-2 transition-colors disabled:opacity-50 disabled:bg-slate-700 shadow-sm"
                            >
                                <Scale className="w-4 h-4" />
                                <span className="hidden sm:inline">Compare</span>
                            </button>
                            
                            <button 
                                onClick={() => setCompareList([])}
                                className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center text-slate-400 active:text-white md:hover:text-white rounded-xl md:rounded-full md:ml-1 active:bg-slate-800 md:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-6 h-6 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compare Modal */}
            {isCompareModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCompareModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                    <Scale className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">Compare Gyms</h2>
                                    <p className="text-indigo-200 text-sm font-medium">Side-by-side analysis of your top picks</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCompareModalOpen(false)} className="w-10 h-10 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                                <X className="w-5 h-5 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Modal Body - Optimized for Mobile Scroll */}
                        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6 pb-24 md:pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {compareList.map(gym => (
                                    <div key={gym.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
                                        <button
                                            onClick={() => setCompareList(prev => prev.filter(g => g.id !== gym.id))}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="h-40 bg-slate-100 relative shrink-0">
                                            <img src={gym.photos || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format"} alt={gym.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="font-extrabold text-lg text-slate-900 leading-tight mb-1">{gym.name}</h3>
                                            <p className="text-xs font-semibold text-slate-500 mb-6">{gym.location}</p>

                                            <div className="space-y-4 flex-1">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-xs uppercase font-bold text-slate-400">Rating</span>
                                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 text-sm">
                                                        {gym.rating || (4.0 + (gym.id % 10) / 10).toFixed(1)} <Star className="w-3 h-3 fill-current" />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-xs uppercase font-bold text-slate-400">Day Pass</span>
                                                    <span className="font-bold text-slate-900">{gym.memberships?.find((m: any) => m.type === 'Day')?.price ? `₹${gym.memberships?.find((m: any) => m.type === 'Day')?.price}` : 'Varies'}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                                    <span className="text-xs uppercase font-bold text-slate-400">Month Pass</span>
                                                    <span className="font-bold text-slate-900">{gym.memberships?.find((m: any) => m.type === 'Monthly')?.price ? `₹${gym.memberships?.find((m: any) => m.type === 'Monthly')?.price}` : 'Varies'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase font-bold text-slate-400 mb-2 block">Top Amenities</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {gym.amenities ? gym.amenities.split(',').slice(0, 4).map((a: string, i: number) => (
                                                            <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{a.trim()}</span>
                                                        )) : <span className="text-xs text-slate-400 italic">No amenities listed</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <a href={`/gym/${gym.id}`} className="mt-6 w-full text-center bg-indigo-50 active:bg-indigo-200 md:hover:bg-indigo-100 text-indigo-700 font-bold text-sm md:text-sm py-4 md:py-3 rounded-xl transition-colors shrink-0 outline-none">
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                ))}

                                {/* Placeholder for less than 3 */}
                                {compareList.length === 2 && (
                                    <div className="bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                            <span className="text-slate-400 font-black text-2xl">+</span>
                                        </div>
                                        <h3 className="font-bold text-slate-600 mb-2">Add one more gym</h3>
                                        <p className="text-sm text-slate-400">Select another property to compare pricing and features side-by-side.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
