import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Legal Disclaimer</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">Important limitations of liability regarding health and fitness activities.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <h2>Health and Safety</h2>
            <p>PassFit operates solely as an aggregration and booking platform. We do not own, operate, or directly employ staff at any of the Partner Gyms listed on our platform.</p>
            <p>Engaging in physical exercise and using gym equipment involves inherent risks. Users are strongly advised to consult a physician before beginning any new exercise program. PassFit is not liable for any injuries, accidents, or health complications that occur on the premises of Partner Gyms.</p>
            <h2>Platform Accuracy</h2>
            <p>While we strive to keep gym amenities, photos, and timings as accurate as possible, Gym Partners retain the right to alter their offerings. PassFit cannot guarantee 100% real-time accuracy of all third-party facility details at all times.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
