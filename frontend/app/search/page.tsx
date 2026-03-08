import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, SlidersHorizontal, User, Calendar, Filter } from "lucide-react";
import { GymCard } from "@/components/ui/GymCard";
import { SearchClientWrapper } from "@/components/ui/SearchClientWrapper";
import { MapWrapper } from "@/components/ui/MapWrapper";

// Fetch gyms from backend
async function getGyms(resolvedSearchParams: { [key: string]: string | undefined }) {
    const query = new URLSearchParams();
    if (resolvedSearchParams.q) query.append("keyword", resolvedSearchParams.q);

    try {
        const res = await fetch(`https://passfit.in/api/v1/gyms/search?${query.toString()}`, {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch gyms", error);
        return [];
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const gyms = await getGyms(resolvedSearchParams);

    const queryLoc = resolvedSearchParams.q || 'All Locations';
    const queryDate = resolvedSearchParams.date || new Date().toISOString().split('T')[0];
    const queryType = resolvedSearchParams.type || 'day';

    const passTypeLabel = queryType === 'monthly' ? 'Monthly Pass' : queryType === 'flexi' ? 'Flexi Pass' : 'Day Pass';

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 font-sans">

            {/* Search Header Ribbon (Goibibo Style Edit Bar) */}
            <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-indigo-500/30">
                <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-white hover:text-indigo-400 transition-colors">
                            PassFit
                        </Link>

                        {/* Search Details Ribbon */}
                        <Link href="/" className="hidden lg:flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-5 py-2.5 border border-white/10 cursor-pointer group">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Location</span>
                                <span className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {queryLoc}</span>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Date</span>
                                <span className="text-sm font-semibold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {queryDate}</span>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Type</span>
                                <span className="text-sm font-semibold">{passTypeLabel}</span>
                            </div>
                            <button className="ml-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                EDIT
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Top Bar (Fallback of the ribbon) */}
            <div className="lg:hidden bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex justify-between items-center z-40">
                <div className="flex flex-col">
                    <span className="text-xs font-bold">{queryLoc}</span>
                    <span className="text-[11px] text-slate-300">{queryDate} • {passTypeLabel}</span>
                </div>
                <Link href="/">
                    <button className="bg-white/10 text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        Modify
                    </button>
                </Link>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-80px)] overflow-hidden">

                {/* Left Sidebar Filters (Only Desktop) */}
                <aside className="hidden lg:flex w-[280px] shrink-0 bg-white border-r border-slate-200 flex-col h-full overflow-y-auto no-scrollbar shadow-sm relative z-20">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <Filter className="w-5 h-5 text-indigo-600" /> Filters
                        </h3>
                        <span className="text-indigo-600 text-xs font-bold cursor-pointer hover:underline">CLEAR ALL</span>
                    </div>

                    {/* Price Range */}
                    <div className="p-6 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Price per day</h4>
                        <div className="space-y-3">
                            {['₹0 - ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', '₹2000+'].map((range, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                                        {/* Custom tick can go here */}
                                    </div>
                                    <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900">{range}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="p-6 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Amenities</h4>
                        <div className="space-y-3">
                            {['Air Conditioning', 'Cardio Section', 'Free Weights', 'Crossfit Zone', 'Steam Bath', 'Zumba Classes'].map((amenity, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-indigo-500 transition-colors" />
                                    <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className="p-6 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Customer Ratings</h4>
                        <div className="space-y-3">
                            {[4.5, 4.0, 3.5].map((rating, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-indigo-500 transition-colors" />
                                    <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900 flex items-center gap-1">
                                        {rating}+ <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1 rounded ml-1">★</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Middle Column: Scrollable List - Added max width and centered content to reduce empty space */}
                <section className="flex-1 bg-slate-50 relative h-full flex flex-col z-10 px-4 py-6 lg:px-8 lg:py-8 overflow-y-auto w-full max-w-[1100px] mx-auto xl:mx-0">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Properties in {queryLoc}
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-black shadow-sm">{gyms.length}</span>
                                {gyms.length === 1 ? 'property' : 'properties'} available
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-500">Sort by:</span>
                            <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                                <option>Most Popular</option>
                                <option>Price - Low to High</option>
                                <option>Price - High to Low</option>
                                <option>Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {gyms.length > 0 ? (
                        <SearchClientWrapper gyms={gyms} searchLocation={queryLoc} />
                    ) : (
                        <div className="w-full h-64 flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                            <p className="text-slate-500 max-w-sm">Try removing some filters or change your search destination.</p>
                        </div>
                    )}

                    <div className="pb-12"></div> {/* Bottom padding */}
                </section>

                {/* Right Side: Map - Keep Fixed Width but proportional */}
                <div className="hidden lg:block w-[380px] xl:w-[500px] 2xl:w-[600px] h-full bg-slate-200 relative shrink-0 border-l border-slate-200 shadow-inner">
                    <div className="absolute inset-0">
                        <MapWrapper gyms={gyms} />
                    </div>
                </div>

            </div>
        </main>
    );
}
