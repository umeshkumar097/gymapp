"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Fingerprint, Lock, Mail, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const res = await fetch("https://passfit.in/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
            });

            if (!res.ok) {
                const errData = await res.json();
                setError(errData.detail || "Authentication Failed.");
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            const token = data.access_token;

            // Verify Clearance Level
            const meRes = await fetch("https://passfit.in/api/v1/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!meRes.ok) {
                setError("Clearance verification failed.");
                setIsLoading(false);
                return;
            }

            const userData = await meRes.json();

            if (userData.role !== "Admin") {
                setError("ACCESS DENIED: Insufficient Clearance Level.");
                setIsLoading(false);
                return;
            }

            // Authentication & Clearance Confirmed
            localStorage.setItem("token", token);
            document.cookie = `user_role=Admin; path=/; max-age=86400`;

            router.push("/godeye/dashboard");
        } catch (err) {
            setError("Secure server connection failed.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black font-sans selection:bg-rose-500/30">

            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Scanner Line Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-rose-500/50 to-purple-600/50 rounded-[2rem] blur opacity-20 animate-pulse" />

                <div className="bg-slate-950/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/5 relative z-10">

                    <div className="flex flex-col items-center mb-10 text-center relative">
                        <div className="absolute inset-0 bg-rose-500/20 blur-3xl w-24 h-24 mx-auto rounded-full" />
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(225,29,72,0.4)] relative">
                            <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-widest uppercase">GodEye <span className="text-rose-500">Access</span></h1>
                        <p className="text-slate-400 font-mono text-xs mt-3 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Restricted Area
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Admin Ident (Email)"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 font-mono text-sm text-slate-200 placeholder:text-slate-600 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Security Passkey"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 font-mono text-sm text-slate-200 placeholder:text-slate-600 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono p-4 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-widest uppercase text-sm py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(225,29,72,0.5)] hover:shadow-[0_0_30px_-5px_rgba(225,29,72,0.7)] flex items-center justify-center gap-2 group mt-4 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying Clearance...
                                </>
                            ) : (
                                <>
                                    <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" /> Authenticate
                                </>
                            )}
                            {/* Button shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                        </button>

                        <div className="pt-6 text-center">
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="text-slate-500 hover:text-slate-300 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mx-auto"
                            >
                                <ArrowRight className="w-3 h-3 rotate-180" /> Abort \ Return Home
                            </button>
                        </div>
                    </form>
                </div>

                {/* Watermark */}
                <div className="fixed bottom-6 right-6 text-slate-700 font-mono text-[10px] uppercase tracking-widest pointer-events-none">
                    PassFit Core // A product by Aiclex Technologies
                </div>
            </div>
        </div>
    );
}
