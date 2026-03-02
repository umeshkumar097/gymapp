import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Careers at PassFit</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">Join us in revolutionizing the Indian fitness industry. We are always looking for passionate builders.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <h2>Why Join Us?</h2>
            <p>At PassFit, you are not just an employee; you are an owner of the mission. We operate at a hyper-fast pace, shipping features that directly impact the health and wellness of thousands of users every day.</p>
            <h2>Open Roles</h2>
            <ul class="list-disc pl-5 mt-4 space-y-2">
                <li><strong>Senior Full-Stack Engineer (Next.js/Python)</strong> - Hyderabad / Remote</li>
                <li><strong>Partner Success Manager</strong> - Mumbai, Bangalore, Delhi NCR</li>
                <li><strong>Growth & Performance Marketer</strong> - Hyderabad</li>
            </ul>
            <p class="mt-6">Don't see a role that fits? Send your resume and a brief 'Why PassFit' note to careers@passfit.in.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
