"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, CreditCard, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Assuming we have a way to know if user is authenticated. 
// For MVP, we'll verify this page handles the payment simulation

export default function GymOnboardingGateway() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"intro" | "payment" | "success">("intro");

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initiatePayment = async () => {
        setIsLoading(true);
        try {
            // 1. Call our backend to get the Razorpay Order ID
            // For MVP mock, we simulate this API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockOrder = {
                id: "order_mock_12345",
                amount: 35300, // ₹353 (₹299 + GST)
                currency: "INR",
                key: "rzp_test_mockkey123"
            };

            // 2. Open Razorpay Checkout Widget
            const options = {
                key: mockOrder.key,
                amount: mockOrder.amount,
                currency: mockOrder.currency,
                name: "PassFit Partner Access",
                description: "3-Month Zero Commission Trial",
                image: "https://your-logo-url.com/logo.png",
                order_id: mockOrder.id,
                theme: { color: "#4f46e5" }, // Indigo-600
                handler: async function (response: any) {
                    // 3. Verify Payment on Backend
                    setIsLoading(true);
                    // Mock verification call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Proceed to Success Screen
                    setStep("success");
                    setIsLoading(false);
                },
                prefill: {
                    name: "Gym Owner", // Usually filled from logged-in user context
                    email: "owner@gymmp.com",
                    contact: "9999999999"
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
                setIsLoading(false);
            });

            rzp.open();

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setIsLoading(false); // Only unset if widget fails to open, otherwise widget handler takes over
        }
    };

    if (step === "success") {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Payment Successful!</h1>
                    <p className="text-lg text-slate-600 font-medium mb-8">
                        Welcome to PassFit. Your 3-Month Zero Commission Trial is now active.
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-left space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            Next Steps
                        </h3>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0 text-sm">1</div>
                            <p className="text-slate-600"><span className="font-bold text-slate-900 block">Complete Profile Setup</span> Upload your brand logo and configure your pricing plans.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0 text-sm">2</div>
                            <p className="text-slate-600"><span className="font-bold text-slate-900 block">Physical Inspection</span> Our team will contact you to schedule a quick venue verification.</p>
                        </div>
                    </div>
                    <Button onClick={() => router.push("/partner/dashboard")} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg font-bold shadow-xl shadow-indigo-200">
                        Go to Partner Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Left Side: Value Proposition */}
                <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-bold text-indigo-300 mb-6">
                            <Zap className="w-4 h-4" /> Gym Partner Program
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                            Grow your gym with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Zero Commission.</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium mb-12">
                            Join PassFit today. Pay a flat one-time onboarding fee and keep 100% of your earnings for the next 3 months.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Unlimited Premium Leads</h3>
                                    <p className="text-slate-400 font-medium">Get discovered by thousands of active fitness enthusiasts in your area.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                    <Building2 className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Full Brand Control</h3>
                                    <p className="text-slate-400 font-medium">Customize your storefront, manage multi-location branches, and set your own pricing freely.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Gateway Widget */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Access Fee</h2>
                            <p className="text-slate-500 font-medium mt-2">Unlock your 3-Month Free Trial instantly.</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                                <span className="font-bold text-slate-600">3-Month Trial Access</span>
                                <span className="font-black text-slate-900">₹299.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 text-sm">
                                <span className="font-medium text-slate-500">GST (18%)</span>
                                <span className="font-bold text-slate-700">₹53.82</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Due Today</span>
                                    <span className="text-3xl font-black text-indigo-600">₹352.82</span>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> No hidden charges or commitments.
                            </li>
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Instant access to Partner Dashboard.
                            </li>
                            <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Includes official physical verification.
                            </li>
                        </ul>

                        <Button
                            onClick={initiatePayment}
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-black text-white h-14 text-lg font-bold shadow-xl flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Integrating Razorpay..." : (
                                <>
                                    <CreditCard className="w-5 h-5" /> Pay securely via Razorpay
                                </>
                            )}
                        </Button>
                        <div className="text-center mt-4 text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> 100% Secure & Encrypted Transaction
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
