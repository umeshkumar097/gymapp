import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-indigo-500/30">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-2xl mb-6 text-amber-600 shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                    Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Disclaimer</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Important legal and medical disclosures regarding your use of PassFit.
                </p>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-amber-600 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-amber-600 hover:prose-a:text-amber-500">

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Independent Gym Operations</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            <strong>PassFit is a technology aggregator.</strong> We do not own, manage, direct, or control any of the fitness centers ("Gym Partners") listed on our platform. The condition, safety, cleanliness, and maintenance of the equipment and facilities are the exclusive responsibility of the respective Gym Partner.
                        </p>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            While we conduct periodic quality verifications to onboard partners, PassFit cannot guarantee the uninterrupted availability of specific machinery, trainers, or amenities (like swimming pools or steam rooms) which may be out of service at the time of your visit.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Medical & Health Notice</h2>
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                            <p className="text-orange-800 font-medium m-0 text-sm">
                                <strong>Consult a Physician:</strong> The physical activity undertaken at our partner facilities involves inherent risks. PassFit strongly advises consulting with a qualified healthcare provider before beginning any strenuous workout regimen.
                            </p>
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            PassFit (Aiclex Technologies), its employees, developers, and directors shall not be held liable for any cardiovascular episodes, musculoskeletal injuries, or any health-related complications resulting directly or indirectly from utilizing a gym pass booked through our platform.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. External Links & Trainers</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Our platform may occasionally link to third-party dieticians or independent Personal Trainers. These connections are provided for convenience only. PassFit does not endorse any specific medical or dietary advice given by individual trainers at partner facilities.
                        </p>

                        <hr className="my-10 border-slate-200" />
                        <p className="text-slate-500 text-sm">
                            For claims, disputes, or further legal declarations, please correspond directly with <a href="mailto:legal@passfit.in" className="text-amber-600 font-bold hover:underline">legal@passfit.in</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
