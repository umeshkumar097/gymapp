"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Globe2, Zap, ShieldCheck, Loader2 } from "lucide-react";

export default function UniversalPassPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch("https://passfit.in/api/v1/users/buy-flexi-credits", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Payment Successful! 1 Universal Credit has been added to your wallet.");
                router.push("/dashboard");
            } else {
                const err = await res.json();
                alert(err.detail || "Purchase failed.");
            }
        } catch (error) {
            console.error("Error purchasing pass:", error);
            alert("Network error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
            {/* Header */}
            <header className="border-b border-slate-800/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
                    <Link href="/search" className="text-xl font-black text-white flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">PassFit</span>
                    </Link>
                    <Link href="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                        My Dashboard
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold uppercase tracking-widest text-xs mb-8">
                    <Globe2 className="w-4 h-4" /> The Masterstroke
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                    One Pass. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Any Gym, Anywhere.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                    Stop paying multiple memberships. Buy Universal Flexi-Credits and access our entire network of premium gyms across the city.
                </p>

                <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden text-left max-w-3xl mx-auto">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-black text-white">Universal Pass</h2>
                            <ul className="space-y-4">
                                {[
                                    "1 Flexi-Credit Valid at 150+ Gyms",
                                    "Use today, tomorrow, or next month",
                                    "No expiration date",
                                    "Premium AC & Equipment included"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 w-full md:w-80 text-center shadow-inner">
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Pay Once</p>
                            <div className="text-5xl font-black text-white mb-6 flex items-start justify-center">
                                <span className="text-2xl mt-1 text-slate-500">₹</span>2000
                            </div>

                            <Button
                                onClick={handlePurchase}
                                disabled={isLoading}
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Buy Flexi-Credit"}
                                {!isLoading && <Zap className="w-5 h-5 ml-2" />}
                            </Button>

                            <p className="text-xs text-slate-500 font-medium mt-4 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> Secure Encrypted Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
