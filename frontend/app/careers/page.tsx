import { ArrowLeft, Briefcase, Zap, Heart, MapPin, Code2 } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-4 block">Careers</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                    Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Future</span> of Fitness
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    We're a fast-moving, deeply technical team at Aiclex Technologies aiming to democratize premium gym access for millions of users worldwide. Come build with us.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Perks */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Why Join PassFit?</h3>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">Free Gym Access</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">Every employee gets a complimentary Tier-1 universal pass. Your fitness is on us, anywhere in our network.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Code2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">Modern Tech Stack</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">No legacy code. Build blazing fast applications using Next.js, React Native, FastAPI, and PostgreSQL.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">High Velocity Execution</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">We ship to production daily. If you hate bureaucratic hold-ups and love deploying impactful features quickly, this is home.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Open Roles */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 px-2">Open Roles</h3>
                        <p className="text-slate-500 mb-8 pl-2">Currently hiring out of our beautiful Hyderabad HQ.</p>

                        {/* Role 1 */}
                        <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Senior Product Designer</h4>
                                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Design</span>
                                </div>
                                <div className="flex items-center text-slate-400 text-sm font-medium gap-1">
                                    <MapPin className="w-4 h-4" /> Hyderabad
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                Take full ownership of the PassFit aesthetic. Redefining how physical fitness interfaces with digital software across iOS, Android, and Web components.
                            </p>
                            <a href="mailto:careers@passfit.in?subject=Senior Product Designer App" className="text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors flex items-center gap-1">
                                Apply Now <ArrowLeft className="w-4 h-4 rotate-180" />
                            </a>
                        </div>

                        {/* Role 2 */}
                        <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Performance Marketing Manager</h4>
                                    <span className="inline-block mt-2 px-3 py-1 bg-fuchsia-50 text-fuchsia-700 text-xs font-bold rounded-full">Growth</span>
                                </div>
                                <div className="flex items-center text-slate-400 text-sm font-medium gap-1">
                                    <MapPin className="w-4 h-4" /> Remote (India)
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                Drive our user acquisition engine. Manage high-budget Meta/Google Ad campaigns to onboard thousands of gym-goers daily.
                            </p>
                            <a href="mailto:careers@passfit.in?subject=Perf Marketing App" className="text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors flex items-center gap-1">
                                Apply Now <ArrowLeft className="w-4 h-4 rotate-180" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 text-center">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return to PassFit
                </Link>
            </div>
        </div>
    );
}
