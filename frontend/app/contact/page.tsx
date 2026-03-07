import { ArrowLeft, Mail, PhoneCall, MapPin, MessagesSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-4 block">Say Hello</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                    We're here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">help you</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Whether you’re a user needing booking support, or a gym owner looking to partner with us, our dedicated teams are on standby to ensure a flawless experience.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Contact Methods */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <MessagesSquare className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Member Support</h3>
                            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                                Need help with an active booking, OTP failure, or refund dispute? Our 24/7 technical ops team responds lightning fast.
                            </p>
                            <a href="mailto:support@passfit.in" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" /> support@passfit.in
                            </a>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                <PhoneCall className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Business & Partnerships</h3>
                            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                                Are you a premium fitness facility? Join our 300+ network and monetize your empty slots with zero upfront costs.
                            </p>
                            <a href="tel:+919871881183" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-2 mb-3">
                                <PhoneCall className="w-4 h-4" /> +91 9871881183
                            </a>
                            <a href="mailto:partners@passfit.in" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" /> partners@passfit.in
                            </a>
                        </div>
                    </div>

                    {/* Right Column: HQ and Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-2xl font-black text-white mb-8 relative z-10">Our Headquarters</h3>

                            <div className="flex items-start gap-4 mb-10 relative z-10">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <MapPin className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg mb-1">PassFit Technologies</p>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        (Aiclex Technologies Project)<br />
                                        123 Tech Park, Phase 2, Hitec City<br />
                                        Hyderabad, Telangana 500081, India
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800 mb-10 relative z-10" />

                            <div className="relative z-10">
                                <h4 className="text-lg font-bold text-white mb-6">Operating Hours (IST)</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Digital Platform</span>
                                        <span className="text-emerald-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 24/7 Automated</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Human Support</span>
                                        <span className="text-white font-medium">Mon - Sat: 9:00 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Partner Integrations</span>
                                        <span className="text-white font-medium">Mon - Fri: 10:00 AM - 5:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 text-center">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return to PassFit
                </Link>
            </div>
        </div>
    );
}
