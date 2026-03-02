"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Navigation, Dumbbell } from "lucide-react";

export function HeroSearch({ initialQuery = "" }: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
    const dropdownRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // 1. Request Location on Mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLoc({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    // For MVP, if we had a reverse geocoding API, we'd set the placeholder to their city.
                },
                (error) => {
                    console.log("Geolocation denied or failed.", error);
                }
            );
        }
    }, []);

    // 2. Fetch Suggestions when Query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try {
                const url = `https://passfit.in/api/v1/gyms/search?keyword=${encodeURIComponent(query)}&limit=5${userLoc ? `&lat=${userLoc.lat}&lng=${userLoc.lng}` : ""}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchSuggestions();
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (gym: any) => {
        setShowSuggestions(false);
        setQuery(gym.name); // Fill input
        // For MVP, router.push directly to gym or to search page with exact query
        router.push(`/search?q=${encodeURIComponent(gym.name)}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 relative w-full" ref={dropdownRef}>

            {/* Unified Smart Input */}
            <div className="flex-1 min-w-[300px] relative hover:bg-slate-50 transition-colors rounded-2xl p-2.5 border border-transparent hover:border-slate-200 cursor-text group bg-white">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1">
                    Location or Gym Name
                </label>
                <div className="flex items-center gap-3">
                    {userLoc ? (
                        <Navigation className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 shrink-0" />
                    ) : (
                        <Search className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 shrink-0" />
                    )}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => {
                            if (query.length >= 2) setShowSuggestions(true);
                        }}
                        placeholder="e.g. Golds Gym, Andheri..."
                        className="w-full bg-transparent text-base md:text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none truncate"
                        autoComplete="off"
                    />
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && (query.length >= 2) && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-slate-500 font-medium">Searching nearby...</div>
                        ) : suggestions.length > 0 ? (
                            <ul className="py-2">
                                {suggestions.map((gym: any) => (
                                    <li
                                        key={gym.id}
                                        onClick={() => handleSuggestionClick(gym)}
                                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-start gap-3 transition-colors group/item"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover/item:bg-indigo-100 transition-colors">
                                            <Dumbbell className="w-4 h-4 text-slate-500 group-hover/item:text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover/item:text-indigo-700 transition-colors">{gym.name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {gym.location}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-500 font-medium">No exact matches found. Hit enter to search broadly.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px bg-slate-200 my-4 mx-2" />

            {/* Date Input */}
            <div className="flex-1 md:max-w-[180px] relative hover:bg-slate-50 transition-colors rounded-2xl p-2.5 border border-transparent hover:border-slate-200 cursor-pointer bg-white">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1">Start Date</label>
                <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-base md:text-lg font-bold text-slate-900 focus:outline-none cursor-pointer"
                />
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px bg-slate-200 my-4 mx-2" />

            {/* Pass Type Selector */}
            <div className="flex-1 md:max-w-[200px] relative hover:bg-slate-50 transition-colors rounded-2xl p-2.5 border border-transparent hover:border-slate-200 cursor-pointer bg-white">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1">Pass Type</label>
                <select className="w-full bg-transparent text-base md:text-lg font-bold text-slate-900 focus:outline-none cursor-pointer appearance-none">
                    <option value="day">1 Day Pass</option>
                    <option value="monthly">Monthly Membership</option>
                </select>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center px-1 py-1 md:py-0 w-full md:w-auto mt-2 md:mt-0">
                <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[15px] md:text-lg font-extrabold py-4 md:py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 hover:-translate-y-0.5 whitespace-nowrap">
                    SEARCH
                </button>
            </div>
        </form>
    );
}
