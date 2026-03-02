import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">About PassFit</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">We are on a mission to democratize premium fitness access without the burden of annual contracts.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <h2>Our Story</h2>
            <p>PassFit was born out of a simple frustration: why are premium gyms locked behind expensive 12-month contracts? We believe fitness should be flexible, accessible, and premium. That's why we created a network that gives you access to the best fitness centers in your city, on your terms.</p>
            <h2>Our Mission</h2>
            <p>To empower 1 million individuals to achieve their fitness goals by removing the friction of commitment. Whether you're traveling for work, trying out a new workout style, or just avoiding long-term lock-ins, PassFit is your ultimate fitness passport.</p>
            <h2>The Team</h2>
            <p>We are a group of fitness enthusiasts, technologists, and customer experience experts dedicated to building the ultimate fitness ecosystem. Built and maintained with passion by Aiclex Technologies.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
