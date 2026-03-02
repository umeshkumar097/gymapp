"use client";

import { useState } from "react";
import { CheckCircle2, Ticket, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        // Auto submit if full
        if (value && index === 3 && newOtp.every(v => v !== "")) {
            verifyOtp(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const verifyOtp = async (code: string) => {
        setLoading(true);
        setStatus("idle");

        try {
            // Placeholder: Call actual API here
            // const res = await fetch("https://passfit.in/api/v1/partner/verify-otp", { ... })
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            if (code === "1234") { // Mock success condition
                setStatus("success");
                setMessage("Pass Verified! Welcome, user@example.com");
            } else {
                setStatus("error");
                setMessage("Invalid PIN or Pass has expired.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to reach server.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setOtp(["", "", "", ""]);
        setStatus("idle");
        setMessage("");
        document.getElementById("otp-0")?.focus();
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <Ticket className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-2">Verify Customer PIN</h1>
            <p className="text-slate-500 font-medium text-center mb-10 max-w-md">
                Ask the customer for their 4-digit booking PIN to validate their pass and start the session.
            </p>

            {status === "idle" && (
                <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInput(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={loading}
                                className="w-16 h-20 sm:w-20 sm:h-24 text-center text-4xl font-black text-indigo-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white transition-all disabled:opacity-50"
                            />
                        ))}
                    </div>

                    <Button
                        className="w-full py-6 text-lg font-bold rounded-2xl"
                        disabled={loading || otp.some(v => v === "")}
                        onClick={() => verifyOtp(otp.join(""))}
                    >
                        {loading ? "Verifying..." : "Verify Pass"}
                        {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            )}

            {status === "success" && (
                <div className="w-full bg-emerald-50 border-2 border-emerald-200 p-8 rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6 drop-shadow-md" />
                    <h2 className="text-2xl font-black text-emerald-900 mb-2">Access Granted!</h2>
                    <p className="text-emerald-700 font-medium text-lg mb-8">{message}</p>
                    <Button onClick={reset} variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-xl px-8 font-bold">
                        Scan Another Pass
                    </Button>
                </div>
            )}

            {status === "error" && (
                <div className="w-full bg-red-50 border-2 border-red-200 p-8 rounded-3xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <XCircle className="w-20 h-20 text-red-500 mb-4 drop-shadow-md" />
                    <h2 className="text-xl font-black text-red-900 mb-2">Verification Failed</h2>
                    <p className="text-red-700 font-medium mb-8">{message}</p>
                    <Button onClick={reset} className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold">
                        Try Again
                    </Button>
                </div>
            )}

            {/* Quick Numpad for Touch devices (Optional but great for MVP) */}
            {status === "idle" && (
                <div className="mt-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Select the first box and type
                </div>
            )}
        </div>
    );
}
