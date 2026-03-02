import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSlug(name: string, location: string, id: number | string): string {
    const base = `${name} ${location}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    return `${base}-${id}`;
}

export function extractIdFromSlug(slug: string): string | null {
    const match = slug.match(/-(\d+)$/);
    return match ? match[1] : null;
}
