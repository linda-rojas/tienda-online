'use client';
import Skeleton from "./Skeleton";

interface Props {
    items?: number; // cuántas cards “falsas” mostrar
}

export default function CategoryCarouselSkeleton({ items = 4 }: Props) {
    return (
        <div className="relative">
            <div className="flex gap-4 sm:gap-6 lg:gap-4 overflow-x-hidden">
                {Array.from({ length: items }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[250px]">
                        <div className="bg-white rounded-lg shadow p-3">
                            {/* Imagen */}
                            <Skeleton className="h-[160px] w-full rounded-md bg-gray-200" />

                            {/* Título */}
                            <div className="mt-3 space-y-2">
                                <Skeleton className="h-4 w-3/4 rounded bg-gray-200" />
                                <Skeleton className="h-4 w-1/2 rounded bg-gray-200" />
                            </div>

                            {/* Precio / botón */}
                            <div className="mt-4 flex items-center justify-between">
                                <Skeleton className="h-5 w-20 rounded bg-gray-200" />
                                <Skeleton className="h-9 w-24 rounded-lg bg-gray-200" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones (solo visual, deshabilitados) */}
            <button
                disabled
                className="absolute top-1/2 left-0 -translate-y-1/2 text-white p-2 rounded-full opacity-60 cursor-not-allowed color-blue-footer-bg"
            >
                ‹
            </button>

            <button
                disabled
                className="absolute top-1/2 right-0 -translate-y-1/2 text-white p-2 rounded-full opacity-60 cursor-not-allowed color-blue-footer-bg"
            >
                ›
            </button>
        </div>
    );
}
