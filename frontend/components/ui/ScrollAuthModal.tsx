"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ArrowRight, Loader2, CheckCircle2, Mail, Lock } from "lucide-react";

export function ScrollAuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [authMethod, setAuthMethod] = useState<"whatsapp" | "email_login" | "email_signup">("whatsapp");
    const [step, setStep] = useState<"phone" | "otp" | "email_details" | "email_otp">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if ((step === "otp" || step === "email_otp") && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

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

    const handleRequestOTP = async (e: React.FormEvent, scenario: "login" | "signup" = "login") => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const res = await fetch("https://passfit.in/api/v1/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_number: whatsappNumber, scenario }),
            });

            if (res.ok) {
                setSuccessMessage("OTP Sent to WhatsApp");
                setStep(scenario === "login" ? "otp" : "email_otp");
                setResendTimer(30);
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

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch("https://passfit.in/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.access_token);
                document.cookie = `user_role=Customer; path=/; max-age=86400`;
                setIsOpen(false);
                window.location.reload();
            } else {
                const err = await res.json();
                setError(err.detail || "Invalid email or password");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`https://passfit.in/api/v1/auth/signup?otp=${otp}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    whatsapp_number: whatsappNumber,
                    role: "Customer"
                }),
            });

            if (res.ok) {
                // Auto login upon successful account creation
                const loginFormData = new URLSearchParams();
                loginFormData.append('username', email);
                loginFormData.append('password', password);
                const loginRes = await fetch("https://passfit.in/api/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: loginFormData,
                });

                if (loginRes.ok) {
                    const tokenData = await loginRes.json();
                    localStorage.setItem("token", tokenData.access_token);
                    document.cookie = `user_role=Customer; path=/; max-age=86400`;
                    setIsOpen(false);
                    window.location.reload();
                }
            } else {
                const err = await res.json();
                setError(err.detail || "Failed to complete signup");
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
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="h-28 bg-gradient-to-br from-indigo-600 to-purple-700 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-2xl font-black text-white tracking-tight">PassFit</h2>
                        <p className="text-indigo-100 text-sm font-medium mt-1">Unlock Premium Fitness</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Auth Mode Tabs */}
                    {step !== "otp" && step !== "email_otp" && (
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => { setAuthMethod("whatsapp"); setStep("phone"); setError(""); setSuccessMessage(""); }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authMethod === "whatsapp" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                WhatsApp OTP
                            </button>
                            <button
                                onClick={() => { setAuthMethod("email_login"); setStep("phone"); setError(""); setSuccessMessage(""); }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authMethod === "email_login" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Email Login
                            </button>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <div className="mx-auto w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-2xl mb-3">
                            {authMethod === "whatsapp" || step === "otp" || step === "email_otp" ? <MessageCircle className="w-5 h-5 text-indigo-600" /> : <Mail className="w-5 h-5 text-indigo-600" />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {step === "phone" && authMethod === "whatsapp" && "Enter your WhatsApp"}
                            {step === "otp" && "Verify OTP"}
                            {step === "phone" && authMethod === "email_login" && "Welcome Back"}
                            {step === "email_details" && "Create Account"}
                            {step === "email_otp" && "Verify Phone Number"}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {step === "phone" && authMethod === "whatsapp" && "We'll send you a secure login code via WhatsApp."}
                            {step === "otp" && `OTP sent to +91 ${whatsappNumber}`}
                            {step === "phone" && authMethod === "email_login" && "Login via Email & Password."}
                            {step === "email_details" && "Fill out the details to join PassFit."}
                            {step === "email_otp" && `OTP sent to +91 ${whatsappNumber}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded-xl text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {successMessage}
                        </div>
                    )}

                    {/* WhatsApp Passwordless Form */}
                    {authMethod === "whatsapp" && step === "phone" && (
                        <form onSubmit={(e) => handleRequestOTP(e, "login")} className="space-y-4">
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
                                    className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-widest"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || whatsappNumber.length < 10}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-2 flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Login Code"}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </button>
                        </form>
                    )}

                    {/* OTP Shared Input */}
                    {(step === "otp" || step === "email_otp") && (
                        <form onSubmit={step === "otp" ? handleVerifyOTP : handleEmailSignupSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                    placeholder="••••"
                                    required
                                    autoFocus
                                    className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-[1em] text-xl"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || otp.length < 4}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] mt-2 flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === "otp" ? "Verify & Login" : "Complete Signup")}
                            </button>

                            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                                <button
                                    type="button"
                                    disabled={resendTimer > 0 || isLoading}
                                    onClick={(e) => handleRequestOTP(e, step === "otp" ? "login" : "signup")}
                                    className={`text-sm font-bold transition-colors ${resendTimer > 0
                                            ? "text-slate-400 cursor-not-allowed"
                                            : "text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                        }`}
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep(step === "otp" ? "phone" : "email_details"); setError(""); setSuccessMessage(""); setOtp(""); }}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                >
                                    Go Back
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Email Login Form */}
                    {authMethod === "email_login" && step === "phone" && (
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-4 flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In Securely"}
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-xs text-slate-500">Don't have an account? </span>
                                <button type="button" onClick={() => { setAuthMethod("email_signup"); setStep("email_details"); setError(""); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Email Signup Details Form */}
                    {authMethod === "email_signup" && step === "email_details" && (
                        <form onSubmit={(e) => handleRequestOTP(e, "signup")} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create Password"
                                    required
                                    minLength={6}
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500 font-bold border-r border-slate-200 pr-2">
                                    <span>🇮🇳</span>
                                    <span className="text-xs">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                    placeholder="WhatsApp Number"
                                    required
                                    className="w-full pl-[4.5rem] pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wide font-bold">Verify via WhatsApp</p>
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password || whatsappNumber.length < 10}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-2 flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Phone Number"}
                            </button>

                            <div className="text-center mt-3">
                                <span className="text-xs text-slate-500">Already have an account? </span>
                                <button type="button" onClick={() => { setAuthMethod("email_login"); setStep("phone"); setError(""); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                    Log In
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-[10px] text-slate-400">
                        By continuing, you agree to PassFit's <br />
                        <a href="/terms" className="underline hover:text-slate-900">Terms of Service</a> and <a href="/privacy" className="underline hover:text-slate-900">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
