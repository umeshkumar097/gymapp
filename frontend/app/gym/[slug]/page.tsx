import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Check, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";
import { cache } from "react";
import { extractIdFromSlug } from "@/lib/utils";

// Mock Server Fetch for Gym Details - wrap in React cache for deduplication
const getGymDetails = cache(async (id: string) => {
    try {
        const res = await fetch(`https://passfit.in/api/v1/gyms/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        return res.json();
    } catch (e) {
        return null;
    }
});

const getGymMemberships = cache(async (id: string) => {
    try {
        const res = await fetch(`https://passfit.in/api/v1/gyms/${id}/memberships`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        return res.json();
    } catch (e) {
        return [];
    }
});

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const gymId = extractIdFromSlug(resolvedParams.slug);

    if (!gymId) {
        return { title: "Invalid Gym | PassFit", description: "Invalid gym URL." };
    }

    const gym = await getGymDetails(gymId);

    if (!gym) {
        return {
            title: "Gym Not Found | PassFit",
            description: "The requested gym could not be found."
        };
    }

    const title = `${gym.name} - Gym in ${gym.location} | PassFit`;
    const description = `Book gym passes and memberships for ${gym.name} located in ${gym.location}. Check out their premium amenities, latest photos, and opening timings.`;
    const canonicalBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title,
        description,
        alternates: {
            canonical: `${canonicalBaseUrl}/gym/${resolvedParams.slug}`
        },
        openGraph: {
            title: gym.name,
            description,
            type: "website",
            url: `${canonicalBaseUrl}/gym/${resolvedParams.slug}`,
            images: [
                {
                    url: gym.photos || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
                    width: 1200,
                    height: 630,
                    alt: `${gym.name} preview image`,
                }
            ],
            siteName: "PassFit",
        }
    };
}

export default async function GymDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const gymId = extractIdFromSlug(resolvedParams.slug);

    if (!gymId) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Invalid Gym URL</h1>
                    <Link href="/search" className="text-indigo-600 hover:underline mt-2 inline-block">Back to search</Link>
                </div>
            </div>
        );
    }

    const gym = await getGymDetails(gymId);
    const memberships = await getGymMemberships(gymId);

    if (!gym) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Gym not found</h1>
                    <Link href="/search" className="text-indigo-600 hover:underline mt-2 inline-block">Back to search</Link>
                </div>
            </div>
        );
    }

    const rating = (4.0 + (gym.id % 10) / 10).toFixed(1);
    const amenitiesList = gym.amenities ? gym.amenities.split(',') : [];

    // Construct structured data (JSON-LD) for Google Rich Snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HealthAndBeautyBusiness",
        "name": gym.name,
        "image": gym.photos ? [gym.photos] : ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"],
        "telephone": "+91-0000000000",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": gym.location,
            "addressLocality": gym.location.split(',')[0],
            "addressCountry": "IN"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": "120"
        },
        "priceRange": "₹₹",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/gym/${resolvedParams.slug}`
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24 lg:pb-0 font-sans">
            {/* Inject JSON-LD Structure Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Premium Glassmorphism Header */}
            <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/search" className="text-slate-600 font-medium text-sm flex items-center gap-2 hover:text-indigo-600 transition-colors bg-white/50 px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
                        ← Back to results
                    </Link>
                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tighter">PassFit</div>
                </div>
            </header>

            {/* Premium Hero Image Gallery */}
            <div className="w-full h-[55vh] md:h-[70vh] relative bg-slate-900 overflow-hidden">
                <Image
                    src={gym.photos || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"}
                    alt={gym.name}
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/10 flex items-end p-6 md:p-14 pb-12 md:pb-24">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="bg-amber-400 text-amber-950 text-sm font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-400/20">
                                <Star className="w-4 h-4 fill-amber-950" /> {rating}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md text-white/90 border border-white/20 text-sm font-medium px-4 py-1 rounded-xl shadow-lg">
                                Excellent (120 reviews)
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight max-w-3xl drop-shadow-2xl mb-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            {gym.name}
                        </h1>
                        <p className="text-slate-200 mt-2 flex items-center gap-2 drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 max-w-xl">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                            <span className="text-lg md:text-xl font-medium">{gym.location}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar Layout */}
            <div className="container mx-auto px-6 py-12 max-w-6xl -mt-10 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Column (Main Content) */}
                    <div className="flex-1 w-full max-w-4xl space-y-10">

                        {/* About */}
                        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Info className="w-6 h-6" />
                                </div>
                                About this Gym
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Welcome to <span className="font-semibold text-slate-800">{gym.name}</span>, one of the premier fitness destinations in {gym.location}.
                                Fully equipped with state-of-the-art machines, free weights, and dedicated cardio zones.
                                Whether you're visiting for the day or looking for a monthly home base, we have everything you need to reach your fitness goals.
                            </p>
                        </section>

                        {/* Amenities Square Grid */}
                        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                                    <Star className="w-6 h-6" />
                                </div>
                                Amenities
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {(gym.amenities ? gym.amenities.split(',') : ['AC', 'Locker', 'Parking', 'Shower', 'Water Cooler', 'WiFi']).map((amenity: string, i: number) => {
                                    const cleanName = amenity.trim();
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl aspect-square hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all cursor-default group">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Check className="w-5 h-5 stroke-[2.5]" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                                                {cleanName}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Hygiene & Safety block */}
                        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-teal-50 rounded-xl text-emerald-600">
                                    <Check className="w-6 h-6 stroke-[3]" />
                                </div>
                                Studio Safety & Hygiene
                            </h2>
                            <ul className="space-y-4 pl-2 text-slate-700 text-[15px] font-medium marker:text-slate-300">
                                <li className="flex items-start gap-3"><span className="text-indigo-400 mt-0.5">•</span>This fitness centre guarantees a clean and hygienic environment for a delightful visitor experience.</li>
                                <li className="flex items-start gap-3"><span className="text-indigo-400 mt-0.5">•</span>Staff members diligently disinfect workout equipment after each use.</li>
                                <li className="flex items-start gap-3"><span className="text-indigo-400 mt-0.5">•</span>Visitors are kindly requested to maintain cleanliness throughout their workout sessions.</li>
                                <li className="flex items-start gap-3"><span className="text-indigo-400 mt-0.5">•</span>The centre also enforces a strict policy against misconduct; any misbehavior or negligence will not be tolerated.</li>
                            </ul>
                        </section>

                        {/* Interactive Location map area wrapper */}
                        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 pb-16">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-red-50 rounded-xl text-red-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                Location
                            </h2>
                            <div className="w-full h-80 bg-slate-200 rounded-3xl overflow-hidden border border-slate-300 shadow-inner relative">
                                <div className="absolute inset-0 bg-slate-800/20 z-10 pointer-events-none" />
                                <div className="absolute top-4 left-4 z-20 bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                                    <h4 className="font-bold text-slate-900 text-base">{gym.location.split(',')[0]}</h4>
                                    <a href="#" className="text-indigo-600 text-sm font-semibold hover:underline mt-1 block">View larger map</a>
                                </div>
                                {/* Mock Map Background to simulate the real map until mapped with leaflet */}
                                <Image
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200"
                                    alt="Map"
                                    layout="fill"
                                    objectFit="cover"
                                    className="opacity-50 grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </section>

                    </div>

                    {/* Right Column (Sticky Booking Widget) */}
                    <div className="w-full lg:w-[420px] shrink-0 pb-20">
                        <div className="sticky top-28 flex flex-col gap-6">

                            {/* Main Booking Panel */}
                            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] ring-1 ring-slate-200/50">
                                <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Select your pass</h3>

                                <form action="/checkout" className="space-y-6">
                                    <input type="hidden" name="gymId" value={gym.id} />
                                    <input type="hidden" name="gymName" value={gym.name} />

                                    {/* Date Ribbon */}
                                    <div>
                                        <h4 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase mb-3">Select Date</h4>
                                        <div className="flex gap-2 w-full overflow-x-auto no-scrollbar pb-2">
                                            {[...Array(4)].map((_, i) => {
                                                const d = new Date();
                                                d.setDate(d.getDate() + i);
                                                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                                                const monthName = d.toLocaleDateString("en-US", { month: "short" });
                                                const dateNum = d.getDate();
                                                const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                                
                                                return (
                                                    <label key={i} className="flex-1 min-w-[65px] cursor-pointer group relative">
                                                        <input type="radio" name="selectedDate" value={formattedDate} className="peer sr-only" defaultChecked={i === 0} required />
                                                        <div className="flex flex-col items-center justify-center py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-indigo-200 peer-checked:border-indigo-600 hover:bg-slate-50 group-hover:-translate-y-1 peer-checked:hover:-translate-y-0">
                                                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-0.5 peer-checked:opacity-80">
                                                                {i === 0 ? 'Today' : dayName}
                                                            </span>
                                                            <span className="text-[15px] font-black leading-none text-slate-800 peer-checked:text-white">
                                                                {dateNum} {monthName}
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Pass Type */}
                                    <div>
                                        <h4 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase mb-3">Workout / Pass Type</h4>
                                        <div className="space-y-3">
                                            {memberships.map((mem: any, i: number) => (
                                                <label key={mem.id} className="relative block cursor-pointer group">
                                                    <input type="radio" name="membershipId" value={mem.id} className="peer sr-only" defaultChecked={i === 0} required />

                                                    <div className="rounded-2xl border-2 border-slate-200/60 bg-white p-5 transition-all duration-300 hover:border-indigo-300 hover:shadow-md peer-checked:border-indigo-600 peer-checked:bg-indigo-50/30 peer-checked:shadow-indigo-100/50 peer-checked:shadow-lg flex items-center justify-between">
                                                        <div>
                                                            <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-indigo-700 transition-colors block mb-0.5">
                                                                {mem.type === 'DayPass' ? '1 Day Pass' : '1 Month Flexi'}
                                                            </span>
                                                            <span className="text-sm text-slate-500 font-medium line-clamp-1">{mem.description || 'Unlimited access to all zones'}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end shrink-0 pl-3">
                                                            <span className="font-black text-indigo-950 text-xl tracking-tighter">₹{mem.price}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 mt-8">
                                        <Button type="submit" size="lg" className="w-full h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_20px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_25px_-4px_rgba(79,70,229,0.4)] rounded-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
                                            Book Now
                                        </Button>
                                        <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>Secure 1-Click Checkout</span>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
