export default function CategoryLinksSkeleton({
    variant = 'desktop',
}: {
    variant?: 'mobile' | 'desktop'
}) {
    return (
        <ul
            className={
                variant === 'mobile'
                    ? 'flex flex-col gap-4 p-4'
                    : 'flex items-center justify-center md:gap-6 lg:gap-12 py-4'
            }
        >
            {[...Array(5)].map((_, i) => (
                <li
                    key={i}
                    className="relative w-24 h-6 rounded-md overflow-hidden bg-gray-300/60"
                >
                    {/* Efecto shimmer */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </li>
            ))}
        </ul>
    )
}
