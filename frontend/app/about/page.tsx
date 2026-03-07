import { CheckCircle2, Users, Target, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-4 block">Our Story</span>
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6">
                    Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Fitness</span> for Everyone
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    PassFit was built with a single mission: to eliminate the friction between you and your next workout. No contracts, no massive upfront fees, just pure flexibility.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Why We Started PassFit</h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                The traditional gym industry is broken. It forces locked-in annual contracts, limits you to a single location, and penalizes you when life gets in the way. We believe fitness should adapt to your schedule, not the other way around.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                By partnering with top fitness centers across the country, PassFit acts as your universal gym membership. Whether you are traveling for work, want to try a new Zumba class, or just need to hit the weights for a day, we've got you covered.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            {[
                                "No confusing contracts or hidden cancellation fees.",
                                "Access hundreds of premium gyms with a single account.",
                                "Pay only for what you use – day passes or flexible packages."
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-indigo-100 aspect-square max-w-md mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                                alt="Athletes working out in a gym"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <p className="text-white font-bold text-lg">"Fitness should be accessible, flexible, and stress-free."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-white py-24 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Our Core Values</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">The principles that guide every decision we make at PassFit.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Target, title: "Simplicity First", desc: "If an action takes more than 3 clicks, it's too complicated." },
                            { icon: Users, title: "Partner Growth", desc: "We only succeed if our partner gyms succeed. We drive new revenue, not cannibalize it." },
                            { icon: Shield, title: "Trust & Safety", desc: "Every transaction is secure, and every gym is physically verified." },
                            { icon: Zap, title: "Zero Friction", desc: "Instant OTPs, instant bookings, and instant access." }
                        ].map((Value, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-3xl p-8 hover:shadow-lg transition-shadow border border-slate-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                    <Value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{Value.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{Value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Ready to change how you workout?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/search" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]">
                        Find a Gym Near Me
                    </a>
                    <a href="/contact" className="bg-white text-slate-900 border border-slate-200 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition shadow-sm">
                        Partner with us
                    </a>
                </div>
            </div>
        </div>
    );
}
