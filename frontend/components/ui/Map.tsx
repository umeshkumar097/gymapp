"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { GymCard } from "./GymCard";

// Fix generic Leaflet icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// A component to re-center the map when the locations array changes (or center point changes)
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 12, { animate: true });
    }, [center, map]);
    return null;
}

export function MapView({ gyms }: { gyms: any[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />;

    // Default center if no gyms (Mumbai)
    const center: [number, number] = gyms.length > 0 && gyms[0].latitude
        ? [gyms[0].latitude, gyms[0].longitude]
        : [19.0760, 72.8777];

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
            <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="w-full h-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={center} />

                {gyms.map((gym) => (
                    gym.latitude && gym.longitude && (
                        <Marker key={gym.id} position={[gym.latitude, gym.longitude]} icon={icon}>
                            <Popup className="rounded-xl overflow-hidden p-0">
                                <div className="w-48 p-2">
                                    <div className="font-bold text-sm mb-1">{gym.name}</div>
                                    <div className="text-xs text-slate-500 mb-2 truncate">{gym.location}</div>
                                    <Link href={`/gym/${gym.id}`} className="block w-full text-center bg-indigo-600 text-white text-xs py-1.5 rounded-md hover:bg-indigo-700 transition">
                                        View Details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}
