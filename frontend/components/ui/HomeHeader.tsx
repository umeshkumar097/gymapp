"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { User } from "lucide-react";

export function HomeHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
          PassFit
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/partner" className="text-[13px] font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block uppercase tracking-wider">
          List your Gym
        </Link>
        
        {isAuthenticated === null ? (
            <div className="w-32 h-9 bg-slate-200 animate-pulse rounded-xl"></div>
        ) : isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="rounded-xl shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4">
                <User className="w-4 h-4 mr-2" />
                My Account
              </Button>
            </Link>
        ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-xl shadow-sm border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 font-bold px-4 text-slate-700">
                <User className="w-4 h-4 mr-2 text-indigo-500" />
                Log In / Register
              </Button>
            </Link>
        )}
      </div>
    </nav>
  );
}
