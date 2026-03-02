import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
            <div className="w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Contact Us</h1>
                    <p className="text-lg text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">We'd love to hear from you. Get in touch with our team for support, partnerships, or general inquiries.</p>
                    
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500" dangerouslySetInnerHTML={{ __html: `
            <h2>Get in Touch</h2>
            <p><strong>Customer Support:</strong> support@passfit.in<br/>
               <strong>Partner Inquiries:</strong> partners@passfit.in<br/>
               <strong>Press & Media:</strong> press@passfit.in</p>
            <h2>Headquarters</h2>
            <p>PassFit Technologies (Aiclex Technologies)<br/>
               123 Tech Park, Hitec City,<br/>
               Hyderabad, Telangana 500081, India</p>
            <h2>Operating Hours</h2>
            <p>Our digital platform operates 24/7. Our human support team is available Monday through Saturday, 9 AM to 7 PM IST.</p>
        ` }}>
                    </div>
                </div>
            </div>
        </main>
    );
}
