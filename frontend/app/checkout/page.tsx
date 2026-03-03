"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Building2, Plus, Info } from "lucide-react";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const gymId = searchParams.get("gymId");
    const gymName = searchParams.get("gymName") || "Fitness Center";
    const membershipId = searchParams.get("membershipId");

    const [membershipDetails, setMembershipDetails] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Phase 19: Promo Engine State
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);
    const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);

    // Phase 20: Guest Passes & Flexi-Credits
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [useFlexiCredit, setUseFlexiCredit] = useState(false);
    const [userBalance, setUserBalance] = useState({ fitcoins: 0, flexi_credits: 0 });

    // Auth and Hydration Check
    useEffect(() => {
        const fetchUserData = async (token: string) => {
            try {
                const res = await fetch("https://passfit.in/api/v1/users/me/dashboard", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserBalance({
                        fitcoins: data.user_profile.fitcoins,
                        flexi_credits: data.user_profile.flexi_credits
                    });
                }
            } catch (e) {
                console.error("Failed fetching user data");
            }
        };

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        } else {
            setIsCheckingAuth(false);
            fetchUserData(token);
        }
    }, []);

    // Phase 13: Add-On Services State
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [availableAddons, setAvailableAddons] = useState([
        { id: 1, name: "1-on-1 Personal Training", description: "60 min focused session", price: 500, icon: "🏋️" },
        { id: 2, name: "Zumba Group Class", description: "Evening batch access", price: 200, icon: "💃" },
        { id: 3, name: "Premium Towel & Locker", description: "Fresh towels & secure storage", price: 50, icon: "🧳" },
    ]);

    const toggleAddon = (id: number) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        // In a real app we'd fetch the exact membership details from the API using membershipId
        // Mocking here for the MVP based on the ID
        if (membershipId) {
            const isDayPass = Number(membershipId) % 2 !== 0; // rough mock logic
            setMembershipDetails({
                type: isDayPass ? 'Day Pass' : 'Monthly Membership',
                price: isDayPass ? 299 : 2499,
            });
        }
    }, [membershipId]);

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        setIsVerifyingPromo(true);
        try {
            const res = await fetch("https://passfit.in/api/v1/promos/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await res.json();
            if (data.is_valid) {
                setAppliedPromo({ code: promoCode.toUpperCase(), discount: data.discount_percentage });
            } else {
                setAppliedPromo(null);
                alert(data.message);
            }
        } catch (e) {
            alert("Error verifying promo code");
        } finally {
            setIsVerifyingPromo(false);
        }
    };

    const handleBooking = async () => {
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to book a pass.");
                window.location.href = "/login";
                return;
            }

            const startDate = new Date();
            const endDate = new Date();
            if (membershipDetails.type.includes("Month")) {
                endDate.setMonth(endDate.getMonth() + 1);
            } else {
                endDate.setDate(endDate.getDate() + 1);
            }

            // Pay-At-Gym Simplified Booking (No Payment Gateway for 3 Months)
            const res = await fetch("https://passfit.in/api/v1/bookings/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    gym_id: parseInt(gymId || "0"),
                    membership_id: parseInt(membershipId || "0"),
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    promo_code: appliedPromo ? appliedPromo.code : null,
                    final_amount: parseFloat(total.toFixed(2)),
                    use_flexi_credits: useFlexiCredit,
                    guest_name: guestName || null,
                    guest_phone: guestPhone || null
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to create booking");
            }

            const data = await res.json();

            // Redirect to SECURE REVEAL with real Booking ID generated by Postgres
            window.location.href = `/booking/success/${data.booking_id}?gymName=${encodeURIComponent(gymName)}&membership=${encodeURIComponent(membershipDetails.type)}`;
        } catch (error: any) {
            alert(error.message);
            setIsProcessing(false);
        }
    };

    if (isCheckingAuth || !membershipDetails) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-bold animate-pulse">Loading Checkout Details...</div>
            </div>
        );
    }

    const basePrice = membershipDetails.price;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
        const addon = availableAddons.find(a => a.id === id);
        return sum + (addon?.price || 0);
    }, 0);

    const subtotal = basePrice + addonsTotal;
    const discountAmount = appliedPromo ? (subtotal * (appliedPromo.discount / 100)) : 0;
    const postDiscountSubtotal = subtotal - discountAmount;

    // Tax is applied ON the post-discount amount
    const taxes = +(postDiscountSubtotal * 0.18).toFixed(2);
    // If Flexi-credit is used, total cash payment drops to 0 artificially in the preview
    const total = useFlexiCredit ? 0 : postDiscountSubtotal + taxes;

    // Removed inline isSuccess block in favor of dedicated redirect route

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-xl font-black text-indigo-600">PassFit Checkout</div>
                    <Link href={`/gym/${gymId}`} className="text-slate-500 hover:text-slate-900 text-sm font-medium">Cancel</Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Review your booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Order Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Booking Details</h2>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                                    <Image src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200" layout="fill" objectFit="cover" alt="gym" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{gymName}</h3>
                                    <div className="inline-block bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm font-semibold mb-2">
                                        {membershipDetails.type}
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant Confirmation
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 13: Add-On Services */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4 flex items-center justify-between">
                                Enhance Your Visit
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">Optional</span>
                            </h2>
                            <div className="space-y-3">
                                {availableAddons.map(addon => {
                                    const isSelected = selectedAddons.includes(addon.id);
                                    return (
                                        <div
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isSelected ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                                    {addon.icon}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-tight">{addon.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{addon.description}</div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="font-bold text-slate-900">+ ₹{addon.price}</div>
                                                <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Phase 20: universal Pass Toggle */}
                        {userBalance.flexi_credits > 0 ? (
                            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm mt-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2 relative z-10 flex items-center justify-between">
                                    Use Universal Credit
                                    <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded font-black">Balance: {userBalance.flexi_credits}</span>
                                </h2>
                                <p className="text-sm text-slate-600 font-medium mb-4 relative z-10">Bypass cash payments entirely. Use 1 Universal Flexi-Credit for this booking.</p>
                                
                                <button 
                                    onClick={() => setUseFlexiCredit(!useFlexiCredit)}
                                    className={`w-full relative z-10 font-bold h-12 rounded-xl border-2 transition-all ${useFlexiCredit ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                                >
                                    {useFlexiCredit ? "Applied! Total is now ₹0" : "Apply 1 Universal Credit"}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl mt-6 text-center">
                                <h3 className="font-bold text-slate-800 mb-2">Want to hop gyms easily?</h3>
                                <p className="text-sm text-slate-500 font-medium mb-4">Buy Universal Flexi-Credits and access our entire network seamlessly.</p>
                                <Button asChild variant="outline" className="border-indigo-200 text-indigo-700 font-bold bg-white w-full">
                                    <Link href="/pass">Learn More</Link>
                                </Button>
                            </div>
                        )}

                        {/* Phase 20: Bring a Friend (+1 Guest) */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 p-1 rounded"><Plus className="w-5 h-5"/></span> Bring a Buddy
                            </h2>
                            <p className="text-sm text-slate-500 mb-4 font-medium">Add a friend to this booking. We'll send them a standalone Entry OTP on WhatsApp.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Guest Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Guest WhatsApp <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input
                                        type="tel"
                                        placeholder="+91 99999 99999"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 mt-6">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm mb-1">PassFit Guarantee</h4>
                                <p className="text-emerald-700 text-xs">If the gym is closed or denies entry within validity, you get a 100% refund instantly.</p>
                            </div>
                        </div>

                    </div>

                    {/* Payment Summary */}
                    <div>
                        {/* Phase 19: Promo Engine */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 p-1 rounded">🎫</span> Apply Coupon
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Code (e.g. FIRST10)"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-widest"
                                    disabled={appliedPromo !== null || isVerifyingPromo}
                                />
                                {appliedPromo ? (
                                    <Button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="bg-rose-100 hover:bg-rose-200 text-rose-700 h-auto rounded-xl px-6 font-bold shadow-none">
                                        Remove
                                    </Button>
                                ) : (
                                    <Button onClick={handleApplyPromo} disabled={!promoCode || isVerifyingPromo} className="bg-indigo-600 hover:bg-indigo-700 text-white h-auto rounded-xl px-6 font-bold">
                                        {isVerifyingPromo ? "..." : "Apply"}
                                    </Button>
                                )}
                            </div>
                            {appliedPromo && (
                                <div className="mt-3 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg flex items-center justify-between">
                                    <span>Code {appliedPromo.code} applied!</span>
                                    <span>-{appliedPromo.discount}%</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg relative overflow-hidden">
                            {/* Top Accent */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Price Summary</h2>

                            <div className="space-y-4 mb-8 text-slate-600 font-medium text-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Base Pass</span>
                                    <span className="text-slate-900 font-bold">₹{basePrice.toFixed(2)}</span>
                                </div>
                                {selectedAddons.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Add-On Services ({selectedAddons.length})</span>
                                        <span className="text-indigo-600 font-bold">+ ₹{addonsTotal.toFixed(2)}</span>
                                    </div>
                                )}
                                {appliedPromo && (
                                    <div className="flex justify-between items-center text-emerald-600">
                                        <span className="font-semibold">Discount ({appliedPromo.discount}%)</span>
                                        <span className="font-bold">- ₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Taxes (GST 18%)</span>
                                    <span className="text-slate-900 font-bold">₹{taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/50 p-2 -mx-2 rounded-lg">
                                    <span className="font-semibold">Platform Fee</span>
                                    <span className="font-bold">FREE</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed border-slate-200 pt-6 mb-8 flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Total Amount</h3>
                                    <p className="text-sm text-slate-400 font-medium">Includes all applicable taxes</p>
                                </div>
                                <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 tracking-tighter">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <Button
                                onClick={handleBooking}
                                className="w-full text-lg h-16 font-extrabold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl relative overflow-hidden group shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_15px_25px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-1"
                                disabled={isProcessing || (useFlexiCredit && userBalance.flexi_credits < 1)}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-3">
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Check-in...
                                    </span>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {useFlexiCredit ? "Check-in with Flexi-Credit" : "Confirm Booking (Pay at Gym)"}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </span>
                                    </>
                                )}
                            </Button>

                            <div className="mt-8 flex items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                                <ShieldCheck className="w-4 h-4 text-slate-400" />
                                <div className="text-[11px] font-bold font-mono tracking-widest text-slate-500 uppercase">
                                    {useFlexiCredit ? "Credits deducted instantly from Universal Wallet" : "Cash collected directly by gym reception"}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Cart...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
