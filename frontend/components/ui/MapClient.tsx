"use client";

import dynamic from "next/dynamic";

export const MapView = dynamic(
    () => import("@/components/ui/Map").then(mod => mod.MapView),
    { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" /> }
);
