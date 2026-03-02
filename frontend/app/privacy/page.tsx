import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">How we collect, use, and protect your personal information.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <p><em>Last Updated: March 2026</em></p>
            <h2>Information Collection</h2>
            <p>We collect information you provide directly to us when creating an account, booking a pass, or contacting support. This includes your name, email, phone number, and encrypted payment tokens.</p>
            <h2>How We Use Your Data</h2>
            <p>We utilize your data to facilitate gym bookings, generate secure OTPs, and provide personalized fitness recommendations. We do not sell your personal data to third-party ad networks.</p>
            <h2>Partner Data Sharing</h2>
            <p>When you book a gym, we share your name and masked phone number with the specific Gym Partner for security and operational verification (e.g., verifying you at the front desk). Gym partners are contractually strictly prohibited from using this data for external marketing.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
