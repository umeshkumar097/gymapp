"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // For MVP, if they fill out the lead form, we route them directly 
        // to the Registration / Login page to start Onboarding
        window.location.href = "/partner/login";
    };

    return (
        <section id="lead-form" className="w-full py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-6">
                        <div className="inline-block rounded-lg bg-indigo-50 px-3 py-1 text-sm text-indigo-700 font-semibold mb-2">
                            Join 500+ Gyms
                        </div>
                        <h2 className="text-3xl tracking-tight sm:text-4xl font-extrabold text-slate-900">
                            Ready to modernize your fitness business?
                        </h2>
                        <p className="max-w-[500px] text-slate-600 md:text-lg">
                            Leave your details and our partnership team will reach out to you within 24 hours to set up your dashboard and get you listed.
                        </p>

                        <ul className="space-y-4 pt-4">
                            {[
                                "Free professional photo shoot (selected cities)",
                                "Dedicated account manager",
                                "Advanced pricing analytics"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20 blur-lg" />

                        <Card className="relative border-0 shadow-2xl rounded-2xl bg-white overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                            <CardHeader className="pt-8 pb-4 px-8">
                                <CardTitle className="text-2xl text-slate-900">Apply for Partnership</CardTitle>
                                <CardDescription className="text-base text-slate-500">
                                    Takes less than a minute. No commitment required.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-8 pb-8 pt-2">
                                {isSuccess ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-800 mb-2">Application Received!</h3>
                                        <p className="text-emerald-600">
                                            Thank you for your interest. Our team will contact you shortly to begin the onboarding process.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">First Name</label>
                                                <Input required placeholder="John" className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                                <Input required placeholder="Doe" className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 h-12" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Gym Name</label>
                                            <Input required placeholder="Iron Paradise Fitness" className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 h-12" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                            <Input required type="tel" placeholder="+91 98765 43210" className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 h-12" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">City</label>
                                            <Input required placeholder="Mumbai" className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 h-12" />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all mt-6"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </span>
                                            ) : "Submit Application"}
                                        </Button>
                                        <p className="text-xs text-center text-slate-400 mt-4">
                                            By submitting this form, you agree to our Partner Terms of Service and Privacy Policy.
                                        </p>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
