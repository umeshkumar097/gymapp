"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ScrollAuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Not in backend schema, but good for UI

    useEffect(() => {
        // Check if user is already logged in (MVP: check localStorage token)
        const token = localStorage.getItem("token");
        if (token) return; // Don't show if authenticated

        const handleScroll = () => {
            if (window.scrollY > 400 && !hasShown) {
                setIsOpen(true);
                setHasShown(true);
                // Also set in session storage so we don't annoy them constantly if they refresh
                sessionStorage.setItem("hasSeenAuthModal", "true");
            }
        };

        // If they've seen it this session, don't show it again on scroll
        if (sessionStorage.getItem("hasSeenAuthModal") === "true") {
            setHasShown(true);
        } else {
            window.addEventListener("scroll", handleScroll);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasShown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            if (isLogin) {
                // Login Flow
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
                    setIsOpen(false);
                    window.location.reload(); // Refresh to update UI states
                } else {
                    const err = await res.json();
                    setError(err.detail || "Invalid credentials");
                }
            } else {
                // Register Flow
                const res = await fetch("https://passfit.in/api/v1/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role: "Customer" }),
                });

                if (res.ok) {
                    setSuccessMessage("Account created! Check your email for a welcome message.");
                    // After short delay, switch to login or auto-close
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMessage("");
                        // Auto-login logic could go here
                    }, 3000);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Graphic */}
                <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-2xl font-black text-white tracking-tight">PassFit</h2>
                        <p className="text-indigo-100 text-sm font-medium mt-1">Unlock Premium Fitness</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => { setIsLogin(true); setError(""); setSuccessMessage(""); }}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(""); setSuccessMessage(""); }}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {isLogin ? "Welcome Back" : "Create an Account"}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isLogin
                                ? "Log in to view your bookings and saved gyms."
                                : "Join the coolest fitness community. No commitments."}
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
                            <div className="relative">
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
                        )}

                        <div className="relative">
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

                        <div className="relative">
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

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-2"
                        >
                            {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        By continuing, you agree to PassFit's <br />
                        <a href="#" className="underline hover:text-slate-900">Terms of Service</a> and <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
