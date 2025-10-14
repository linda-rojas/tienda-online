export default function ProductCarouselSkeleton({
    itemCount = 4,
}: {
    itemCount?: number
}) {
    return (
        <div className="relative flex gap-4 sm:gap-6 lg:gap-4 overflow-x-hidden px-4">
            {[...Array(itemCount)].map((_, index) => (
                <div
                    key={index}
                    className="flex-shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] h-[340px] rounded-2xl relative overflow-hidden 
                    bg-gradient-to-br from-gray-200/60 via-gray-300/50 to-gray-200/60 
                    shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md border border-white/20"
                >
                    {/* Efecto shimmer */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                        bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    {/* Reflejo sutil (superior izquierdo) */}
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent rounded-tl-2xl pointer-events-none" />

                    {/* Reflejo inferior */}
                    <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-white/10 to-transparent pointer-events-none" />

                    {/* Contenido simulado */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/50 backdrop-blur-md rounded-b-2xl">
                        <div className="h-4 w-3/4 mb-2 bg-gray-300/80 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-300/70 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
