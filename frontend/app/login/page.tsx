"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, MessageCircle, CheckCircle2, Mail, Lock, User as UserIcon } from "lucide-react";

export default function CustomerLoginPage() {
    const [authMethod, setAuthMethod] = useState<"whatsapp" | "email_login" | "email_signup">("whatsapp");
    const [step, setStep] = useState<"phone" | "otp" | "email_details" | "email_otp">("phone");

    // Form fields
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [otp, setOtp] = useState("");

    // Status
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if ((step === "otp" || step === "email_otp") && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    // ---------- WHATSAPP AUTH FLOW ----------
    const handleRequestOTP = async (e: React.FormEvent, scenario: "login" | "signup" = "login") => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("https://passfit.in/api/v1/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp_number: whatsappNumber, scenario }),
            });

            if (res.ok) {
                setSuccessMessage("OTP Sent to your WhatsApp!");
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

    // ---------- EMAIL AUTH FLOW ----------
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
                router.push("/dashboard");
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
                const data = await res.json();
                // Instead of logging in automatically, let's login by issuing a token directly or redirect to login.
                // Or better, we can auto-login by calling the verify-otp route
                setSuccessMessage("Account created successfully! Logging you in...");

                // Login immediately
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
                    router.push("/dashboard");
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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <a href="/" className="inline-block text-3xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tighter mb-2">
                        PassFit
                    </a>
                    <p className="text-slate-500 font-medium">Log in or create an account instantly</p>
                </div>

                {/* Auth Mode Tabs */}
                {step !== "otp" && step !== "email_otp" && (
                    <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => { setAuthMethod("whatsapp"); setStep("phone"); setError(""); setSuccessMessage(""); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "whatsapp" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            WhatsApp OTP
                        </button>
                        <button
                            onClick={() => { setAuthMethod("email_login"); setStep("phone"); setError(""); setSuccessMessage(""); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "email_login" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Email Login
                        </button>
                    </div>
                )}

                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                    <div className="mb-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl mb-4">
                            {authMethod === "whatsapp" || step === "otp" || step === "email_otp" ? <MessageCircle className="w-6 h-6 text-indigo-600" /> : <Mail className="w-6 h-6 text-indigo-600" />}
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 mb-1">
                            {step === "phone" && authMethod === "whatsapp" && "Enter your WhatsApp"}
                            {step === "otp" && "Verify OTP"}
                            {step === "phone" && authMethod === "email_login" && "Welcome Back"}
                            {step === "email_details" && "Create Account"}
                            {step === "email_otp" && "Verify Phone Number"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {step === "phone" && authMethod === "whatsapp" && "We'll send you a secure login code via WhatsApp."}
                            {step === "otp" && `OTP sent to +91 ${whatsappNumber}`}
                            {step === "phone" && authMethod === "email_login" && "Login via Email & Password."}
                            {step === "email_details" && "Fill out the details to join PassFit."}
                            {step === "email_otp" && `OTP sent to +91 ${whatsappNumber}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
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
                                    className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-widest text-lg"
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
                                    placeholder="Enter 4-digit code"
                                    required
                                    autoFocus
                                    className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner tracking-[1em] text-2xl"
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
                                            : "text-indigo-600 hover:text-indigo-800"
                                        }`}
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep(step === "otp" ? "phone" : "email_details"); setError(""); setSuccessMessage(""); setOtp(""); }}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
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
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className="cursor-pointer w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-4 flex items-center justify-center disabled:opacity-50 transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In Securely"}
                            </button>

                            <div className="text-center mt-4">
                                <span className="text-sm text-slate-500">Don't have an account? </span>
                                <button type="button" onClick={() => { setAuthMethod("email_signup"); setStep("email_details"); setError(""); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
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
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create Password"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500 font-bold border-r border-slate-200 pr-2">
                                    <span>🇮🇳</span>
                                    <span>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                    placeholder="WhatsApp Number"
                                    required
                                    className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <p className="text-xs text-slate-500 text-center">We will send an OTP to verify your number.</p>
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password || whatsappNumber.length < 10}
                                className="cursor-pointer w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] mt-4 flex items-center justify-center disabled:opacity-50 transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Phone Number"}
                            </button>

                            <div className="text-center mt-4">
                                <span className="text-sm text-slate-500">Already have an account? </span>
                                <button type="button" onClick={() => { setAuthMethod("email_login"); setStep("phone"); setError(""); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                    Log In
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center text-xs text-slate-400">
                        By continuing, I agree to PassFit's <br />
                        <a href="/terms" className="underline hover:text-slate-700">Terms of Service</a> & <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
