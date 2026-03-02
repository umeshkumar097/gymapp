import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { generateSlug } from "@/lib/utils";

interface GymCardProps {
    gym: {
        id: number;
        name: string;
        location: string;
        photos: string;
        amenities: string;
        rating?: number;
    },
    searchLocation?: string;
}

export function GymCard({ gym, searchLocation }: GymCardProps) {
    const rating = gym.rating || (4.0 + (gym.id % 10) / 10).toFixed(1);
    const reviewCount = 20 + (gym.id * 15);
    const amenitiesList = gym.amenities ? gym.amenities.split(',').slice(0, 3) : [];

    // Mock distance for UI purposes
    const distanceKm = ((gym.id * 1.5 % 7) + 0.8).toFixed(1);

    // Generate SEO friendly Slug instead of ID
    const gymSlug = generateSlug(gym.name, gym.location, gym.id);

    return (
        <Link href={`/gym/${gymSlug}`} className="block w-full">
            <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-200 transition-all duration-300 group bg-white rounded-2xl flex flex-col sm:flex-row h-auto sm:h-[240px] relative">

                {/* Left Side: Image */}
                <div className="relative w-full sm:w-[220px] lg:w-[250px] h-52 sm:h-full shrink-0 overflow-hidden bg-slate-100">
                    <img
                        src={gym.photos || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format"}
                        alt={gym.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for Top Badge */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-900/40 to-transparent z-10" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded shadow-sm z-20">
                        Premium Partner
                    </div>

                    {/* Image count preview (Fake feature for UI polish) */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md z-20">
                        +5 Photos
                    </div>
                </div>

                {/* Right/Bottom Side: Content */}
                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row gap-0 sm:gap-6 bg-white overflow-hidden">

                    {/* Middle Column (Full width on mobile) */}
                    <div className="flex-1 flex flex-col h-full">

                        {/* Title & Location (Always Top & Full Width) */}
                        <div className="mb-3 sm:mb-4 border-b border-slate-100 sm:border-0 pb-3 sm:pb-0">
                            <h3 className="font-extrabold text-[19px] sm:text-2xl text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 sm:line-clamp-none">
                                {gym.name}
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-center text-slate-600 text-[13px] sm:text-[15px] font-medium mt-1.5 sm:mt-2 gap-1 sm:gap-0">
                                <div className="flex items-start sm:items-center pr-2">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-indigo-500 shrink-0 mt-0.5 sm:mt-0 hidden sm:block" />
                                    <span className="leading-snug">
                                        <span className="text-indigo-700 font-bold">{gym.location.split(',')[0]}</span>
                                        <span className="mx-1.5 text-slate-300">|</span>
                                        <span className="text-slate-500">{gym.location}</span>
                                    </span>
                                </div>

                                {searchLocation && searchLocation !== "All Locations" && (
                                    <div className="flex items-center sm:ml-2 bg-indigo-50/80 border border-indigo-100 text-indigo-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold shadow-sm w-fit mt-1 sm:mt-0">
                                        <span className="opacity-80">📍 {distanceKm} km from</span>
                                        <span className="ml-1 text-indigo-900">{searchLocation}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Split Body (Ratings/Amenities Left, Price/Btn Right) */}
                        <div className="flex flex-row gap-3 sm:gap-0 sm:flex-col mt-1 sm:mt-0 flex-1">

                            {/* Left Side (Mobile): Ratings & Amenities */}
                            <div className="flex-1 flex flex-col">
                                {/* Mobile Rating */}
                                <div className="flex items-center gap-1.5 mb-3 sm:hidden">
                                    <div className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-0.5 shadow-sm">
                                        {rating} <Star className="w-2.5 h-2.5 fill-current" />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{reviewCount} Ratings</span>
                                </div>

                                {/* Amenities */}
                                <div className="space-y-1.5 sm:space-y-2 flex-1">
                                    {amenitiesList.map((amenity, i) => (
                                        <div key={i} className="flex items-start gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm text-slate-700 font-medium leading-tight max-w-[95%] sm:max-w-none">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Instant Confirmation Badge */}
                                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 w-fit px-1.5 py-1 rounded-md mt-3 sm:mt-auto shrink-0">
                                    ⚡ Instant Confirmation
                                </div>
                            </div>

                            {/* Right Side (Mobile): Pricing & Button */}
                            <div className="w-[125px] flex flex-col items-end justify-between sm:hidden shrink-0 pb-1">
                                <div className="flex flex-col items-end text-right">
                                    <span className="text-[10px] text-slate-400 font-bold line-through mb-0.5">₹499</span>
                                    <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none mt-0.5">₹299</span>
                                    <span className="text-[9px] text-slate-500 font-medium mt-1.5 whitespace-nowrap">+ ₹54 Taxes & fees</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">per day pass</span>
                                </div>

                                <div className="w-full mt-3">
                                    <div className="w-full text-indigo-700 font-bold text-[11px] border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-2 rounded-lg text-center uppercase tracking-wider shadow-sm transition-colors">
                                        View Options
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Vertical Divider (Desktop) */}
                    <div className="hidden sm:block w-px bg-slate-100 my-0 shrink-0" />

                    {/* Right Column (Desktop Only): Pricing & Ratings */}
                    <div className="hidden sm:flex sm:w-[150px] lg:w-[170px] flex-col justify-between shrink-0 h-full pl-2 sm:pl-0">

                        {/* Desktop Rating */}
                        <div className="flex flex-col items-end w-full">
                            <div className="flex flex-col items-end mb-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{reviewCount} Ratings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-green-700 uppercase">Superb</span>
                                <div className="bg-green-600 text-white rounded-md px-2 py-1 font-bold text-sm shadow-sm flex items-center justify-center min-w-[32px]">
                                    {rating}
                                </div>
                            </div>
                        </div>

                        {/* Pricing section (Desktop) */}
                        <div className="flex flex-col items-end justify-end w-full mt-auto">
                            <div className="flex flex-col items-end mb-4">
                                <span className="text-xs text-slate-400 font-bold line-through mb-1">₹499</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">₹299</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium block mt-0.5">+ ₹54 taxes & fees</span>
                                <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-widest mt-1">per day pass</span>
                            </div>

                            {/* Book Button */}
                            <div className="w-full shrink-0">
                                <div className="w-full text-white font-bold text-sm bg-indigo-600 border border-transparent hover:bg-indigo-700 px-3 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center whitespace-nowrap uppercase tracking-wider">
                                    View Options
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
