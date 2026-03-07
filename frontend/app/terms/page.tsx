import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6 text-indigo-600">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                    Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Service</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Please read these terms carefully before using the PassFit platform. By joining our network, you agree to these guidelines designed to ensure a safe and premium experience for everyone.
                </p>
                <div className="mt-8 flex justify-center text-sm font-bold tracking-widest text-slate-400 uppercase">
                    Last Updated: March 2026
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Welcome to PassFit (Aiclex Technologies). By accessing our website, mobile application, or purchasing a gym pass through our platform, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please abstain from using our services.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. The PassFit Service</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            PassFit operates as a marketplace connecting health and fitness enthusiasts with independent Gym Partners. We sell access passes (Daily, Flexi, Monthly) that grant entry to partner facilities. We are a software provider and do not own, operate, or directly manage any of the fitness centers listed on our platform.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. User Conduct & Gym Etiquette</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We pride ourselves on community respect. When utilizing a PassFit pass, you must:
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">Strictly adhere to the specific rules (clothing, footwear, towel policies) of the individual Partner Gym.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">Present your active Booking OTP or PDF Voucher to the receptionist upon entry.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">Treat gym staff, equipment, and fellow members with utmost respect and courtesy.</span>
                            </li>
                        </ul>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6">
                            <p className="text-red-800 font-medium m-0 text-sm">
                                <strong>⚠️ Zero Tolerance Policy:</strong> Any reported misbehavior, aggression, violence, or intentional damage to partner property will result in an immediate and irreversible lifetime ban from the PassFit ecosystem without refund.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Payments, Cancellations & Refunds</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            All purchases made via PassFit are processed securely.
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 marker:text-indigo-400">
                            <li><strong>Daily Passes</strong> are generally non-refundable once the OTP is scanned at the venue.</li>
                            <li>Cancellations requested <em>prior</em> to the pass start time are eligible for a full refund (or credit to FitCoins wallet).</li>
                            <li>In the scenario of <strong>"Pay At Gym"</strong> bookings, repeated no-shows may lead to a temporary restriction on your account for cash-based reservations.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Disclaimer of Liability</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Fitness activities carry inherent risks of injury. By using the PassFit network to train at a partner facility, you acknowledge and accept these risks. PassFit (Aiclex Technologies) shall not be held liable for any physical injury, loss of property, or damages sustained within the premises of a partner gym.
                        </p>

                        <hr className="my-10 border-slate-200" />
                        <p className="text-slate-500 text-sm">
                            For any legal queries regarding these terms, please contact our administrative team at <a href="mailto:legal@passfit.in" className="text-indigo-600 font-bold hover:underline">legal@passfit.in</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
