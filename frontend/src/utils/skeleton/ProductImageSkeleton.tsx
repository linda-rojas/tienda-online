export default function ProductImageSkeleton() {
    return (
        <div className="relative w-full h-[180px] bg-gray-300/60 rounded-t-lg overflow-hidden">
            {/* Efecto shimmer */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Reflejo superior */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Sombra inferior suave */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-400/10 to-transparent pointer-events-none" />
        </div>
    )
}
