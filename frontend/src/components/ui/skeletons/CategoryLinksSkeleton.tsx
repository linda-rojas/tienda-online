'use client';
import Skeleton from "./Skeleton";


type Variant = 'mobile' | 'desktop';

export default function CategoryLinksSkeleton({ variant = 'desktop' }: { variant?: Variant }) {
    if (variant === 'mobile') {
        return (
            <ul className="flex flex-col gap-4 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                        <Skeleton className="h-10 w-[70%] rounded-md bg-gray-200" />
                    </li>
                ))}
            </ul>
        );
    }

    // desktop
    return (
        <ul className="hidden md:flex md:gap-6 md:w-full md:justify-around lg:flex lg:justify-center lg:gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24 rounded-md bg-white/20" />
                    <Skeleton className="h-5 w-5 rounded-md bg-white/20" />
                </li>
            ))}
        </ul>
    );
}
