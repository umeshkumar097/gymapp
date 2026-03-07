"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ScrollAuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [otp, setOtp] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) return;

        const handleScroll = () => {
            if (window.scrollY > 400 && !hasShown) {
                setIsOpen(true);
                setHasShown(true);
                sessionStorage.setItem("hasSeenAuthModal", "true");
            }
        };

        if (sessionStorage.getItem("hasSeenAuthModal") === "true") {
            setHasShown(true);
        } else {
            window.addEventListener("scroll", handleScroll);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasShown]);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const res = await fetch("https://passfit.in/api/v1/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_number: whatsappNumber }),
            });

            if (res.ok) {
                setSuccessMessage("OTP Sent to WhatsApp");
                setStep("otp");
            } else {
                const err = await res.json();
                setError(err.detail || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("https://passfit.in/api/v1/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_number: whatsappNumber, otp: otp }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.access_token);
                document.cookie = `user_role=Customer; path=/; max-age=86400`;
                setIsOpen(false);
                window.location.reload();
            } else {
                const err = await res.json();
                setError(err.detail || "Invalid OTP code");
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
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-2xl font-black text-white tracking-tight">PassFit</h2>
                        <p className="text-indigo-100 text-sm font-medium mt-1">Unlock Premium Fitness</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl mb-4">
                            <MessageCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {step === "phone" ? "Enter your WhatsApp" : "Verify OTP"}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {step === "phone" ? "We'll send you a secure login code via WhatsApp." : `OTP sent to +91 ${whatsappNumber}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && step === "otp" && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {successMessage}
                        </div>
                    )}

                    {step === "phone" ? (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
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
                                    required
                                    autoFocus
                                    className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-widest text-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || whatsappNumber.length < 10}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Login Code"}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                    placeholder="••••"
                                    required
                                    autoFocus
                                    className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-[1em] text-2xl"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || otp.length < 4}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] mt-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                            </Button>
                            <button
                                type="button"
                                onClick={() => { setStep("phone"); setError(""); setSuccessMessage(""); setOtp(""); }}
                                className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-800 mt-4 transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-xs text-slate-500">
                        By continuing, you agree to PassFit's <br />
                        <a href="#" className="underline hover:text-slate-900">Terms of Service</a> and <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
