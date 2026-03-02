import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    TrendingUp,
    Users,
    Wallet,
    Clock
} from "lucide-react";

const benefits = [
    {
        title: "Boost Your Daily Walk-ins",
        description: "Fill empty slots during off-peak hours by selling flexible day passes to hundreds of daily active app users.",
        icon: Users,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
        title: "Zero Upfront Cost",
        description: "Listing your gym is 100% free. We only charge a small commission when a booking is successfully made and completed.",
        icon: Wallet,
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
        title: "Automated Payouts",
        description: "Track your earnings in real-time through our partner dashboard. Receive automated payouts directly to your bank account safely.",
        icon: TrendingUp,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
        title: "Easy Validation",
        description: "No complex software needed. Verify passes in seconds with a simple OTP at your reception desk to let members in instantly.",
        icon: Clock,
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }
];

export function ValueProps() {
    return (
        <section className="w-full py-24 bg-slate-50 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-6xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-slate-900">
                        Why Partner with <span className="text-indigo-600">PassFit?</span>
                    </h2>
                    <p className="max-w-[800px] text-slate-600 md:text-xl lg:text-lg">
                        We handle the marketing and technology so you can focus on what you do best: running a great fitness center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                            <Card className="relative h-full bg-white border-slate-200 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
                                <CardHeader>
                                    <div className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-4 ${benefit.color}`}>
                                        <benefit.icon className="w-7 h-7" />
                                    </div>
                                    <CardTitle className="text-2xl text-slate-900">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                                        {benefit.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
