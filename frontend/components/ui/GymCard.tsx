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
        <Link href={`/gym/${gymSlug}`} className="block w-full h-full">
            <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 group bg-white rounded-2xl flex flex-col h-full relative">

                {/* Top Half: Image */}
                <div className="relative w-full h-48 sm:h-52 shrink-0 overflow-hidden bg-slate-100">
                    <img
                        src={gym.photos || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format"}
                        alt={gym.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay for Badges */}
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-10" />

                    {/* Premium Badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded shadow-sm z-20">
                        Premium Partner
                    </div>

                    {/* Image count preview */}
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md z-20">
                        +5 Photos
                    </div>

                    {/* Rating inside Image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 z-20">
                        <div className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 shadow-md border border-green-500/50">
                            {rating} <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-[10px] text-white/90 font-bold tracking-widest uppercase drop-shadow-md">({reviewCount})</span>
                    </div>
                </div>

                {/* Bottom Half: Content */}
                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col bg-white">

                    {/* Title & Location */}
                    <div className="mb-3">
                        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {gym.name}
                        </h3>

                        <div className="flex items-start text-slate-600 text-[13px] font-medium mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="leading-snug line-clamp-1">
                                <span className="text-indigo-700 font-bold">{gym.location.split(',')[0]}</span>
                                <span className="mx-1 text-slate-300">|</span>
                                <span className="text-slate-500">{gym.location}</span>
                            </span>
                        </div>

                        {searchLocation && searchLocation !== "All Locations" && (
                            <div className="flex items-center text-indigo-700 text-[10px] sm:text-[11px] font-bold mt-1.5 w-fit">
                                <span className="opacity-80">📍 {distanceKm} km from</span>
                                <span className="ml-1 text-indigo-900">{searchLocation}</span>
                            </div>
                        )}
                    </div>

                    {/* Amenities List */}
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-1">
                        {amenitiesList.map((amenity, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                                <svg className="w-2.5 h-2.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-slate-100 my-auto mb-3" />

                    {/* Footer: Price & Action */}
                    <div className="flex items-end justify-between w-full mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold line-through mb-0.5">₹499</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">₹299</span>
                                <span className="text-[10px] text-slate-500 font-medium">/ day</span>
                            </div>
                            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1 flex items-center gap-0.5">
                                ⚡ Instant Book
                            </span>
                        </div>

                        <div className="text-white font-bold text-[11px] sm:text-xs bg-indigo-600 group-hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-200 uppercase tracking-wider">
                            View Pass
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
