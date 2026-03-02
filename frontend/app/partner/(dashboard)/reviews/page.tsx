"use client";

import { Star, MessageSquareQuote, ThumbsUp, MessageSquare, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PartnerReviewsPage() {
    // Mock Data
    const metrics = {
        averageRating: 4.8,
        totalReviews: 124,
        recentFeedback: 12
    };

    const reviews = [
        {
            id: 1,
            author: "Rahul Varma",
            date: "2 days ago",
            rating: 5,
            passType: "1 Day Pass",
            text: "Amazing equipment and super clean showers. The staff at the front desk was very welcoming. Highly recommend the steam bath after a heavy session!",
            verified: true,
            status: "published"
        },
        {
            id: 2,
            author: "Sneha Desai",
            date: "1 week ago",
            rating: 4,
            passType: "Monthly Membership",
            text: "Great vibe during the evening hours. Zumba classes are energetic. Only issue is parking fills up fast.",
            verified: true,
            status: "published"
        },
        {
            id: 3,
            author: "Karan Johar",
            date: "2 weeks ago",
            rating: 2,
            passType: "1 Day Pass",
            text: "AC was not working properly in the cardio section. Expected better for the premium price.",
            verified: true,
            status: "flagged"
        }
    ];

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
        ));
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reviews & Feedback</h1>
                <p className="text-slate-500 font-medium mt-1">Monitor what your users are saying and manage your gym's reputation.</p>
            </div>

            {/* Reputation Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Average Rating</div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">{metrics.averageRating}</span>
                            <div className="flex">{renderStars(Math.round(metrics.averageRating))}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</div>
                        <div className="text-3xl font-black text-slate-900">{metrics.totalReviews}</div>
                        <div className="text-xs font-medium text-slate-400 mt-1">All time</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                        <MessageSquareQuote className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Recent Feedback</div>
                        <div className="text-3xl font-black text-slate-900">{metrics.recentFeedback}</div>
                        <div className="text-xs font-medium text-slate-400 mt-1">In the last 30 days</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <ThumbsUp className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        Customer Feedback
                    </h2>
                    <div className="flex items-center gap-2">
                        <select className="bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                            <option>Highest Rated</option>
                            <option>Lowest Rated</option>
                            <option>Newest First</option>
                        </select>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {reviews.map(review => (
                        <div key={review.id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-lg shrink-0">
                                        {review.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900">{review.author}</h3>
                                            {review.verified && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                                                </span>
                                            )}
                                            {review.status === 'flagged' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                                                    Moderation Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                            <div className="flex">{renderStars(review.rating)}</div>
                                            <span>•</span>
                                            <span>{review.date}</span>
                                            <span>•</span>
                                            <span>{review.passType}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-600 self-start sm:self-center shrink-0">
                                    <AlertTriangle className="w-3 h-3 mr-1.5" /> Flag Review
                                </Button>
                            </div>

                            <p className="text-slate-700 leading-relaxed sm:pl-16">
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
