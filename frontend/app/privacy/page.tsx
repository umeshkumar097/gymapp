import { ArrowLeft, Lock, ShieldCheck, EyeOff } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-6 text-emerald-600">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                    Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Policy</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Your personal information is your own. We do not sell your data. We use industry-standard encryption to ensure that your fitness journey remains entirely private.
                </p>
                <div className="mt-8 flex justify-center text-sm font-bold tracking-widest text-slate-400 uppercase">
                    Last Updated: March 2026
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600 hover:prose-a:text-emerald-500">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Data Collection</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We collect information directly provided by you, such as your Name, Email, and WhatsApp number when creating a PassFit account. Additionally, location data is collected (if you explicitly opt-in) solely to display the closest gyms within a 10km radius.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <Lock className="w-6 h-6 text-slate-400 mb-3" />
                                <h4 className="font-bold text-slate-900 mb-2">Secure Passwords</h4>
                                <p className="text-sm text-slate-500 leading-relaxed m-0">All passwords are mathematically hashed using bcrypt and are irretrievable even by our internal developers.</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <EyeOff className="w-6 h-6 text-slate-400 mb-3" />
                                <h4 className="font-bold text-slate-900 mb-2">Payment Tokens</h4>
                                <p className="text-sm text-slate-500 leading-relaxed m-0">Card details are never touched by our servers; they are encrypted by Razorpay directly.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Zero Advertisements Policy</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            PassFit operates exclusively on pass sales and subscription margins. We do not participate in third-party data brokering, meaning your personal health indicators and visit frequency will never be sold to target ads.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Partner Data Masking (Anti-Leakage)</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            When you book a gym on PassFit, we only share your Name and a masked version of your phone number for validation purposes at the entrance. Your direct contact details are shielded from gym partners, ensuring you never receive unsolicited marketing calls from individual facilities.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. WhatsApp Notifications</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We utilize the official Meta WhatsApp Cloud API to deliver your OTPs, session invoices, and PDF vouchers securely. By registering a PassFit account, you consent to receive direct transactional alerts necessary to fulfill your bookings.
                        </p>

                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6">
                            <p className="text-emerald-800 font-medium m-0 text-sm">
                                <strong>Opt-Out Easy:</strong> You can mute our notification channel via WhatsApp at any time, however, please note this may restrict your ability to receive gate passcode OTPs.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Account Deletion Request</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Under the Digital Personal Data Protection guidelines, you have the right to entirely erase your digital footprint from the PassFit database. You can request full data deletion by mailing our compliance officer from your registered email address.
                        </p>

                        <hr className="my-10 border-slate-200" />
                        <p className="text-slate-500 text-sm">
                            For data retrieval or deletion requests, please contact our privacy officer at <a href="mailto:privacy@passfit.in" className="text-emerald-600 font-bold hover:underline">privacy@passfit.in</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
