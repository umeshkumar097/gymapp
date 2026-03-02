"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PartnerLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Using a mock single state for Login/Register to demonstrate flow
    const [isRegistering, setIsRegistering] = useState(true);
    const [whatsappNumber, setWhatsappNumber] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API Call for Auth
        await new Promise(resolve => setTimeout(resolve, 800));

        // Set Auth Cookie
        document.cookie = "user_role=GymOwner; path=/; max-age=86400"; // 1 day expiration

        if (isRegistering) {
            // New Gym Owners must pay the ₹299 Onboarding Fee
            router.push("/partner/onboarding");
        } else {
            // Returning Gym Owners (Assuming fee is paid, would check DB in real app)
            router.push("/partner/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center rotate-3 shadow-sm border border-indigo-200">
                        <Sparkles className="w-8 h-8 text-indigo-600 -rotate-3" />
                    </div>
                </div>
                <h2 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
                    {isRegistering ? "Join PassFit as a Partner" : "Welcome Back"}
                </h2>
                <p className="mt-2 text-sm text-slate-600 font-medium">
                    {isRegistering ? "Start your 3-Month Zero Commission Trial today." : "Log in to manage your premium gym listing."}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {isRegistering && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700">Gym Name</label>
                                    <div className="mt-2 relative rounded-xl shadow-sm">
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Iron Core Fitness"
                                            className="block w-full rounded-xl border-slate-200 pl-4 py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium bg-slate-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700">WhatsApp Number</label>
                                    <div className="mt-2 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-slate-200 pr-2">
                                            <span className="text-slate-500 font-bold sm:text-sm">🇮🇳 +91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                            placeholder="98765 43210"
                                            className="block w-full rounded-xl border-slate-200 pl-20 py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium bg-slate-50"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700">Email address</label>
                            <div className="mt-2 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="owner@gymmp.com"
                                    className="block w-full rounded-xl border-slate-200 pl-10 py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium bg-slate-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700">Password</label>
                            <div className="mt-2 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-xl border-slate-200 pl-10 py-3 text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium bg-slate-50"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-indigo-200"
                            >
                                {isLoading ? "Processing..." : isRegistering ? "Continue to Payment (₹299)" : "Sign In"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">
                            {isRegistering ? "Already have a partner account?" : "Don't have an account?"}
                        </span>
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            {isRegistering ? "Log in" : "Sign up"}
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Secure Partner Portal
                    </div>
                </div>
            </div>
        </div>
    );
}
