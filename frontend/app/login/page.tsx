"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, Loader2, Dumbbell, CheckCircle2 } from "lucide-react";

export default function CustomerLoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (isLogin) {
                const params = new URLSearchParams();
                params.append("username", email);
                params.append("password", password);

                const res = await fetch("https://passfit.in/api/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: params,
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("token", data.access_token);
                    document.cookie = `user_role=Customer; path=/; max-age=86400`;
                    router.push("/dashboard");
                } else {
                    const err = await res.json();
                    setError(err.detail || "Invalid credentials");
                }
            } else {
                const res = await fetch("https://passfit.in/api/v1/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role: "Customer", whatsapp_number: whatsappNumber }),
                });

                if (res.ok) {
                    setSuccessMessage("Account created successfully! Switching to login...");
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMessage("");
                    }, 2000);
                } else {
                    const err = await res.json();
                    setError(err.detail || "Registration failed");
                }
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="/" className="inline-block text-3xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tighter mb-2">
                        PassFit
                    </a>
                    <p className="text-slate-500 font-medium">Unlock Premium Fitness Everywhere</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => { setIsLogin(true); setError(""); setSuccessMessage(""); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(""); setSuccessMessage(""); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {isLogin ? "Access your bookings and saved gyms." : "Join the largest fitness network."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            required={!isLogin}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">WhatsApp Number</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500 font-bold border-r border-slate-200 pr-2">
                                            <span>🇮🇳</span>
                                            <span>+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                            placeholder="98765 43210"
                                            required={!isLogin}
                                            className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 block">Password</label>
                                {isLogin && <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</a>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md mt-4 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                            ) : (
                                <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
