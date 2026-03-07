"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

export default function CustomerLoginPage() {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === "otp" && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("https://passfit.in/api/v1/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_number: whatsappNumber }),
            });

            if (res.ok) {
                setSuccessMessage("OTP Sent to your WhatsApp!");
                setStep("otp");
                setResendTimer(30); // reset timer on fresh request
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
                router.push("/dashboard");
            } else {
                const err = await res.json();
                setError(err.detail || "Invalid OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <a href="/" className="inline-block text-3xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tighter mb-2">
                        PassFit
                    </a>
                    <p className="text-slate-500 font-medium">Log in or create an account instantly</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                    <div className="mb-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl mb-4">
                            <MessageCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 mb-1">
                            {step === "phone" ? "Enter your WhatsApp" : "Verify OTP"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {step === "phone" ? "We'll send you a secure login code via WhatsApp." : `OTP sent to +91 ${whatsappNumber}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && step === "otp" && (
                        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {successMessage}
                        </div>
                    )}

                    {step === "phone" ? (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div className="relative">
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
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || whatsappNumber.length < 10}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-2 flex items-center justify-center disabled:opacity-50 transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Login Code"}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                    placeholder="Enter 4-digit code"
                                    required
                                    autoFocus
                                    className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-[1em] text-2xl"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 4}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] mt-2 flex items-center justify-center disabled:opacity-50 transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                            </button>
                            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                                <button
                                    type="button"
                                    disabled={resendTimer > 0 || isLoading}
                                    onClick={handleRequestOTP}
                                    className={`text-sm font-bold transition-colors ${resendTimer > 0
                                            ? "text-slate-400 cursor-not-allowed"
                                            : "text-indigo-600 hover:text-indigo-800"
                                        }`}
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep("phone"); setError(""); setSuccessMessage(""); setOtp(""); }}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    Change Phone Number
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center text-xs text-slate-400">
                        By signing in, I agree to PassFit's <br />
                        <a href="/terms" className="underline hover:text-slate-700">Terms of Service</a> & <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
