"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, MapPin, Search, Dumbbell, ShieldCheck, MessageCircle, Share2, Target, CheckCircle2, ChevronDown, ArrowRight } from "lucide-react";

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState("discover");
    const [searchQuery, setSearchQuery] = useState("");
    const [connectedUsers, setConnectedUsers] = useState<number[]>([]);

    const MOCK_USERS = [
        {
            id: 1,
            name: "Rohit Sharma",
            bio: "Early bird lifter. Looking for a spotter at Iron Paradise.",
            location: "Bandra West, Mumbai",
            goal: "Strength Training",
            gym: "Iron Paradise Fitness",
            imageParams: "man,gym",
            verified: true,
            level: "Advanced"
        },
        {
            id: 2,
            name: "Priya Patel",
            bio: "Zumba enthusiast! Need someone to drag me to evening classes.",
            location: "Andheri Lokhandwala",
            goal: "Weight Loss",
            gym: "Zenith Wellness Club",
            imageParams: "woman,fitness",
            verified: true,
            level: "Beginner"
        },
        {
            id: 3,
            name: "Rahul Verma",
            bio: "Post-work stress buster. High intensity interval training.",
            location: "Juhu, Mumbai",
            goal: "Cardio & HIIt",
            gym: "Golds Gym",
            imageParams: "man,runner",
            verified: false,
            level: "Intermediate"
        },
        {
            id: 4,
            name: "Anjali Gupta",
            bio: "Yoga and Pilates focus. Looking for a mindful workout buddy.",
            location: "Colaba, Mumbai",
            goal: "Flexibility",
            gym: "Yoga Studio Plus",
            imageParams: "woman,yoga",
            verified: true,
            level: "Intermediate"
        },
    ];

    const filteredUsers = MOCK_USERS.filter(user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.gym.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (activeTab === "discover" ? !connectedUsers.includes(user.id) : connectedUsers.includes(user.id))
    );

    const handleConnect = (id: number) => {
        setConnectedUsers(prev => [...prev, id]);
        // Simple toast mock
        alert("Connection Request Sent! Once they accept, you can start messaging.");
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="max-w-6xl mx-auto px-4 md:px-6">

                {/* Header Section */}
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Workout <span className="text-indigo-600">Buddy Hub</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto md:mx-0">
                        Fitness is better together. Discover local gym-goers, find a spotter, or join group classes with new friends in your city.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar - Profile & Filters */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Mini Profile Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-md mb-4 bg-[url('https://source.unsplash.com/random/200x200/?portrait,fitness')] bg-cover bg-center">
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center justify-center gap-1">
                                    Alex J. <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mb-4 flex items-center justify-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> Mumbai
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-center border-t border-slate-100 pt-4">
                                    <div>
                                        <div className="text-2xl font-black text-indigo-600">{connectedUsers.length}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buddies</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-emerald-600">14</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workouts</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab("discover")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'discover' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Search className="w-5 h-5" /> Discover
                                </button>
                                <button
                                    onClick={() => setActiveTab("connections")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${activeTab === 'connections' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Users className="w-5 h-5" /> My Connections
                                    {connectedUsers.length > 0 && (
                                        <span className="ml-auto bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{connectedUsers.length}</span>
                                    )}
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                    <MessageCircle className="w-5 h-5" /> Messages
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Main Feed */}
                    <div className="lg:col-span-3">

                        {/* Feed Header */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, location, or gym..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <Button variant="outline" className="w-full sm:w-auto font-bold border-slate-300">
                                Filters <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        {/* User Grid */}
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No buddies found</h3>
                                <p className="text-slate-500">Try adjusting your search filters to find more gym-goers.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 bg-cover bg-center shadow-inner"
                                                style={{ backgroundImage: `url(https://source.unsplash.com/random/200x200/?${user.imageParams})` }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 leading-tight mb-1">
                                                    {user.name}
                                                    {user.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                                </h3>
                                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mb-2">
                                                    {user.level}
                                                </div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" /> {user.location}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 font-medium mb-4 line-clamp-2">
                                            "{user.bio}"
                                        </p>

                                        <div className="flex flex-col gap-2 mb-6">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <Target className="w-4 h-4 text-slate-400" /> <span className="font-bold text-slate-700">Goal:</span> {user.goal}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <Dumbbell className="w-4 h-4 text-slate-400" /> <span className="font-bold text-slate-700">Gym:</span> {user.gym}
                                            </div>
                                        </div>

                                        {activeTab === "discover" ? (
                                            <Button
                                                onClick={() => handleConnect(user.id)}
                                                className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl"
                                            >
                                                Connect <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold h-12 rounded-xl"
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" /> Message
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
