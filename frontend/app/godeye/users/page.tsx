"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, ShieldAlert, Trash2, CheckCircle2, X, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const usersList = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "Customer", joinDate: "2023-01-15", bookings: 12, status: "Active" },
    { id: 2, name: "Kavya Desai", email: "kavya@example.com", role: "Customer", joinDate: "2023-03-22", bookings: 45, status: "Active" },
    { id: 3, name: "Iron Core Admin", email: "admin@ironcore.com", role: "GymOwner", joinDate: "2023-10-24", bookings: 0, status: "Active" },
    { id: 4, name: "Spammer Account", email: "fake123@xyz.com", role: "Customer", joinDate: "2023-11-01", bookings: 0, status: "Suspended" },
];

const reviewQueue = [
    {
        id: 101,
        gymName: "Iron Core Fitness",
        user: "Kavya Desai",
        rating: 1,
        comment: "Worst gym ever! The AC never works and the staff is completely rude. Do not go here!",
        date: "2023-11-02",
        status: "Flagged"
    },
    {
        id: 102,
        gymName: "Zenith Wellness Club",
        user: "Rahul Sharma",
        rating: 5,
        comment: "Excellent facilities and very clean. Loved the steam bath!",
        date: "2023-11-01",
        status: "Pending" // waiting for auto-publish or manual review if strict mode is on
    }
];

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState("users");
    const [reviews, setReviews] = useState(reviewQueue);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    const fetchLiveUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://passfit.in/api/v1/godeye/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching live users map:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveUsers();
    }, []);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleSuspendUser = (id: number) => {
        if (confirm("Are you sure you want to suspend this user? They will not be able to log in or book passes.")) {
            setUsers(users.map(u => u.id === id ? { ...u, status: "Suspended" } : u));
            showToast("User account has been suspended.");
        }
    };

    const handleDeleteReview = (id: number) => {
        if (confirm("Permanently delete this review? It will be removed from the gym's public page.")) {
            setReviews(reviews.filter(r => r.id !== id));
            showToast("Review deleted successfully.");
        }
    };

    const handleApproveReview = (id: number) => {
        setReviews(reviews.filter(r => r.id !== id));
        showToast("Review approved and published.");
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 relative">

            {/* Custom Toast */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">{toastMessage}</span>
                    <button onClick={() => setToastMessage("")} className="ml-2 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users & Moderation</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage platform accounts and moderate customer reviews for safety.</p>
                </div>
                <button
                    onClick={fetchLiveUsers}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? "Syncing Directory..." : "Refresh Live Network"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-200/50 rounded-xl w-max mb-6">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Users className="w-4 h-4" /> User Directory
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MessageSquare className="w-4 h-4" /> Review Moderation
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {activeTab === "users" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Account</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Join Date</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bookings</th>
                                    <th className="p-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status & Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 md:px-6 py-4">
                                            <div className="font-bold text-slate-900">{user.name}</div>
                                            <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${user.role === 'GymOwner' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600">{user.joinDate}</span>
                                        </td>
                                        <td className="p-4 md:px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{user.bookings}</span>
                                        </td>
                                        <td className="p-4 md:px-6 py-4 text-right">
                                            {user.status === "Active" ? (
                                                <Button onClick={() => handleSuspendUser(user.id)} variant="outline" size="sm" className="font-bold border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                                                    <ShieldAlert className="w-3 h-3" /> Suspended
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="divide-y divide-slate-100">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-900">Content Moderation Queue</h4>
                                <p className="text-sm text-slate-600 font-medium mt-1">Review flagged comments for hate speech, spam, or false information before they are published to gym profiles.</p>
                            </div>
                        </div>

                        {reviews.map((review) => (
                            <div key={review.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50 transition-colors">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${review.status === 'Flagged' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                    {review.status}
                                                </span>
                                                <span className="text-sm font-bold text-slate-500">for {review.gymName}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                {review.user}
                                                <span className="text-amber-500 text-sm flex items-center">
                                                    ★ {review.rating}/5
                                                </span>
                                            </h4>
                                        </div>
                                        <div className="text-sm font-medium text-slate-500">{review.date}</div>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm shadow-sm relative">
                                        <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                                        "{review.comment}"
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-end md:justify-start gap-3 shrink-0">
                                    <Button onClick={() => handleApproveReview(review.id)} className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-200 w-full md:w-32">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                    <Button onClick={() => handleDeleteReview(review.id)} variant="outline" className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full md:w-32">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {reviews.length === 0 && (
                            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-emerald-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Queue is Empty</h3>
                                <p className="font-medium max-w-sm">All flagged reviews have been processed. Great job keeping the community safe!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
