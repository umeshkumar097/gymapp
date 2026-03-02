import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">The rules and guidelines for using the PassFit platform.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <p><em>Last Updated: March 2026</em></p>
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using PassFit, you agree to comply with these terms. If you do not agree, please do not use our services.</p>
            <h2>User Conduct & Gym Etiquette</h2>
            <p>Users must adhere to the specific rules, dress codes, and etiquette guidelines of the individual Partner Gyms they visit. Any misbehavior, violence, or damage to property will result in immediate lifetime suspension from PassFit without refund.</p>
            <h2>Payments and Refunds</h2>
            <p>All payments are processed securely via our gateway partners. Refunds for cancelled passes are processed within 5-7 business days to the original payment method.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
