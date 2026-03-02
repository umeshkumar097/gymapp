import { HeroSection } from "@/components/partner/HeroSection";
import { ValueProps } from "@/components/partner/ValueProps";
import { LeadForm } from "@/components/partner/LeadForm";

export default function PartnerPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-slate-50">
            <HeroSection />
            <ValueProps />
            <LeadForm />

            {/* Simple Footer just for the Sales Page */}
            <footer className="w-full bg-slate-950 text-slate-400 py-12 text-center border-t border-slate-900">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        PassFit
                    </div>
                    <p className="max-w-md text-sm">
                        Empowering fitness centers to maximize revenue and reach thousands of users daily.
                    </p>
                    <div className="pt-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                        © {new Date().getFullYear()} PassFit, Inc. All rights reserved. <span className="ml-2 lowercase font-normal capitalize">A product by <a href="https://www.aiclex.in" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">Aiclex Technologies</a></span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
