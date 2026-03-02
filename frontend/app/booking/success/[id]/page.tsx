"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, PhoneCall, Download, ArrowRight, ShieldCheck, MapIcon, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BookingSuccessReveal() {
    const params = useParams();
    const searchParams = useSearchParams();

    // Fallback info from query string (if API unavailable)
    const urlGymName = searchParams.get("gymName") || "Premium Fitness Center";
    const urlMembership = searchParams.get("membership") || "Pass";
    const bookingId = params.id as string;

    const [revealData, setRevealData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mocking the backend /reveal endpoint for demo since actual checkout is mocked
        const fetchRevealData = async () => {
            setIsLoading(true);
            try {
                // In production, this hits: `/api/v1/bookings/${bookingId}/reveal`
                // const res = await fetch(`https://passfit.in/api/v1/bookings/${bookingId}/reveal`);
                // if (!res.ok) throw new Error("Not Authorized");
                // const data = await res.json();

                // Simulating network delay for realistic UI
                await new Promise(r => setTimeout(r, 1500));

                setRevealData({
                    gym_name: urlGymName,
                    pass_type: urlMembership,
                    date_str: new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    otp: Math.floor(1000 + Math.random() * 9000).toString(),
                    contact_phone: "+91 98765 43210",
                    manager_name: "Vikram Singh",
                    maps_url: "https://maps.google.com/?q=fitness+center"
                });
            } catch (e) {
                console.error("Reveal API Error:", e);
                // Fallback handle if unauthorized 
            } finally {
                setIsLoading(false);
            }
        };
        fetchRevealData();
    }, [bookingId, urlGymName, urlMembership]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-slate-800 animate-pulse">Confirming Payment...</h2>
                <p className="text-slate-500 text-sm mt-2">Generating your secure Entry PIN</p>
            </main>
        );
    }

    if (!revealData) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center bg-white p-8 rounded-3xl shadow-lg border border-red-100 max-w-sm">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Unauthorized Access</h2>
                    <p className="text-slate-500 mb-6 font-medium">You do not have permission to view these secure pass details.</p>
                    <Link href="/dashboard" className="text-indigo-600 font-bold hover:underline">Go to Dashboard</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-indigo-600 rounded-b-[3rem] z-0"></div>
            <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

            <div className="container max-w-lg relative z-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">

                {/* Status Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full shadow-xl shadow-indigo-900/20 mb-4 border border-white/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Booking Confirmed!</h1>
                    <p className="text-indigo-100 font-medium">Your pass is ready. Show your PIN at the desk to enter.</p>
                </div>

                {/* The Pass Card */}
                <div className="bg-white rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Tear-off dash pattern */}
                    <div className="absolute top-[180px] left-0 right-0 border-t-2 border-dashed border-slate-200"></div>
                    <div className="absolute top-[180px] left-[-12px] w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-[180px] right-[-12px] w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>

                    {/* Top half / Details */}
                    <div className="p-8 pb-10 bg-gradient-to-br from-white to-slate-50">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 leading-none">{revealData.pass_type}</h3>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight block truncate max-w-[240px]">{revealData.gym_name}</h2>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">ID</span>
                                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">#{bookingId.substring(0, 6)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-3">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> Local Studio
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Valid for Entry Today
                        </div>
                    </div>

                    {/* Bottom half / OTP Reveal */}
                    <div className="p-8 pt-10 text-center relative z-10 bg-white">
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3">Your Entry PIN</h4>
                        <div className="inline-block bg-slate-50 px-8 py-3 rounded-2xl border-2 border-dashed border-indigo-200 mb-8">
                            <span className="text-5xl font-black tracking-[0.15em] text-indigo-600 font-mono drop-shadow-sm ml-3">{revealData.otp}</span>
                        </div>

                        {/* Premium Detail Box (Only available post-booking) */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 flex flex-col gap-3 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">PassFit Verifed</div>
                                    <div className="text-sm font-semibold text-slate-900">100% Guaranteed Entry</div>
                                </div>
                            </div>

                            <hr className="border-slate-200 my-1" />

                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 mb-1">Direct Contact Details</div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <User className="w-4 h-4 text-slate-400" /> {revealData.manager_name} (Manager)
                                </div>
                                <a href={`tel:${revealData.contact_phone}`} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                    <PhoneCall className="w-3.5 h-3.5" /> Call
                                </a>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <MapIcon className="w-4 h-4 text-slate-400" /> Location Map
                                </div>
                                <a href={revealData.maps_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                    Get Directions <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Download PDF Action */}
                        <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 text-md">
                            <Download className="w-5 h-5 mr-2" /> Download Premium PDF Voucher
                        </Button>
                    </div>
                </div>

                <div className="mt-8 text-center text-indigo-100/60 text-xs font-medium">
                    <p>A copy of this voucher has been sent to your WhatsApp and Email.</p>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                        <Link href="/dashboard">Back to Home</Link>
                    </Button>
                </div>
            </div>

        </main>
    );
}
