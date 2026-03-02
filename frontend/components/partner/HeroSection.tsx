import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative w-full py-24 lg:py-32 xl:py-48 overflow-hidden bg-slate-950 text-slate-50 flex items-center justify-center">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 z-0" />

            <div className="container px-4 md:px-6 relative z-10 text-center max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
                    <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
                        PassFit Partner Program
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
                        Grow Your Gym's Revenue with PassFit
                    </h1>

                    <p className="max-w-[700px] text-lg text-slate-300 md:text-xl/relaxed lg:text-2xl/relaxed">
                        Fill empty slots, attract new members, and manage day passes effortlessly. Join the fastest growing fitness marketplace.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="#lead-form" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105">
                                Partner With Us
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl backdrop-blur-sm">
                            Learn More
                        </Button>
                    </div>

                    <div className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-400 font-bold">✓</span> Zero Upfront Fees
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-400 font-bold">✓</span> Instant Payouts
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-400 font-bold">✓</span> Free Marketing
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
