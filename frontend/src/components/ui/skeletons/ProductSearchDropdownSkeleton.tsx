'use client'
import Skeleton from './Skeleton'

export default function ProductSearchDropdownSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="w-[230px] h-[388px] rounded-lg border border-gray-300 shadow-md bg-white overflow-hidden"
                >
                    {/* Imagen */}
                    <Skeleton className="h-[180px] w-full bg-gray-200" />

                    {/* Contenido */}
                    <div className="px-4 py-3 flex flex-col gap-3">
                        <Skeleton className="h-4 w-[85%] rounded bg-gray-200" />
                        <Skeleton className="h-3 w-[65%] rounded bg-gray-200" />

                        <div className="mt-1 flex flex-col gap-2">
                            <Skeleton className="h-3 w-[45%] rounded bg-gray-200" />
                            <Skeleton className="h-5 w-[55%] rounded bg-gray-200" />
                        </div>

                        {/* Botón */}
                        <div className="mt-auto">
                            <Skeleton className="h-9 w-full rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
