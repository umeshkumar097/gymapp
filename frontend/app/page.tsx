import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, SlidersHorizontal, User, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GymCard } from "@/components/ui/GymCard";
import { HeroSearch } from "@/components/ui/HeroSearch";
import { HomeHeader } from "@/components/ui/HomeHeader";
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const gyms = await getGyms(resolvedSearchParams);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      {/* Dynamic Nav Header */}
      <HomeHeader />

      {/* Hero Section */}
      <div className="relative w-full min-h-[580px] md:min-h-[500px] flex items-center justify-center -mt-20 pt-28 pb-16 md:pt-20 md:pb-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000"
            alt="Hero background"
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-[0.4]"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 mt-10 md:mt-16 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white text-center tracking-tight mb-3 md:mb-4 drop-shadow-xl">
            Book Gym Passes & Memberships
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 md:mb-10 font-medium tracking-wide drop-shadow-md text-center">
            Discover premium fitness centers near you
          </p>

          {/* Premium OTA Search Widget */}
          <div className="w-full bg-white/20 rounded-3xl p-3 md:p-4 shadow-2xl backdrop-blur-xl border border-white/40 max-w-4xl relative z-50">
            <HeroSearch initialQuery={resolvedSearchParams?.q || ""} />
          </div>
        </div>
      </div>

      {/* Popular Locations Quick Links section */}
      <div className="relative -mt-6 z-20 container mx-auto px-6 mb-8 flex justify-center">
        <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-100 flex gap-6 items-center flex-wrap justify-center overflow-x-auto whitespace-nowrap">
          <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">Popular:</span>
          {['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune'].map(city => (
            <Link key={city} href={`/search?q=${city}`} className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Trusted Partner Brands */}
      <div className="container mx-auto px-6 pb-12 pt-4 max-w-5xl">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by Premium Fitness Brands</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-xl md:text-2xl font-black font-sans tracking-tighter">CULT<span className="text-indigo-600">.FIT</span></div>
          <div className="text-xl md:text-2xl font-black font-serif italic tracking-wide">Gold's Gym</div>
          <div className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-slate-800">Anytime <span className="text-rose-500 -ml-1">.</span></div>
          <div className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1"><span className="text-indigo-600">FIT</span>PASS</div>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-slate-700 text-[1.3rem]">Talwalkars</div>
        </div>
      </div>

      {/* Featured Gyms Section */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Editor's Choice</h2>
            <p className="text-slate-500 text-lg">Top rated premium fitness centers handpicked for you</p>
          </div>
          <Link href="/search">
            <Button variant="outline" className="rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold">
              View All <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {gyms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center gap-x-6 gap-y-12 pb-10">
            {gyms.slice(0, 6).map((gym: any) => (
              <div key={gym.id} className="w-full max-w-[380px]">
                <GymCard gym={gym} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Loading Gyms...</h3>
          </div>
        )}
      </div>

      {/* Global Footer */}
      <footer className="w-full bg-slate-950 text-slate-300 py-16 border-t border-slate-900 mt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter mb-4 inline-block">
                PassFit
              </Link>
              <p className="text-slate-400 max-w-sm">
                Discover, compare, and book the most premium fitness centers and gyms near you. No contracts, just fitness.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">For Partners</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/partner" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 transition-colors">
                    Partner With Us <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </li>
                <li><Link href="/partner/login" className="hover:text-white transition-colors">Gym Owner Login</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div>© {new Date().getFullYear()} PassFit, Inc. All rights reserved. <span className="ml-2 text-slate-500">A product by <a href="https://www.aiclex.in" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">Aiclex Technologies</a></span></div>
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              <Link href="/support" className="hover:text-white transition-colors">Help & Support</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>

    </main >
  );
}
