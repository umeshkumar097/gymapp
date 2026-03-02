import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Help & Support</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">Everything you need to know about booking, managing, and utilizing your PassFit access.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <h2>Frequently Asked Questions</h2>
            <h3>How do I use a Day Pass?</h3>
            <p>Once you book a pass, an OTP is immediately generated in your dashboard. Simply walk into the partner gym, state you have a PassFit booking, and share your OTP with the reception desk to begin your workout.</p>
            <h3>Can I cancel a booking?</h3>
            <p>Yes, all Day Passes can be cancelled up to 2 hours before the scheduled time for a full refund. Monthly and flexible memberships have specific pause and cancellation terms visible during checkout.</p>
            <h3>My OTP isn't working at the gym.</h3>
            <p>Ensure that the gym verifies the OTP through their dedicated Partner Portal. If there is a massive network failure, gyms can use the "Scan QR Fallback" feature, or you can instantly contact our priority support hotline visible in your active booking tab.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
