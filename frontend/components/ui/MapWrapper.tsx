"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MapView = dynamic(
    () => import("./Map").then((mod) => mod.MapView),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                <MapPin className="text-slate-300 w-12 h-12" />
            </div>
        ),
    }
);

export function MapWrapper({ gyms }: { gyms: any[] }) {
    return <MapView gyms={gyms} />;
}
