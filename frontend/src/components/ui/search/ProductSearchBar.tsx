'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'
import { Product } from '@/schemas/schemas'
import { searchProducts } from '@/services/products/product.search.service'
import ProductCard from '@/components/ui/products/productCards'
import ProductSearchDropdownSkeleton from '../skeletons/ProductSearchDropdownSkeleton'
import ProductSearchOverlay from './ProductSearchOverlay'
import Link from 'next/link'


type Props = {
    className?: string
    inputClassName?: string
    placeholder?: string
}

export default function ProductSearchBar({
    className = '',
    inputClassName = '',
    placeholder = 'Buscar producto',
}: Props) {
    const [q, setQ] = useState('')
    const [items, setItems] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [topOffset, setTopOffset] = useState(0)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<number | null>(null)

    const trimmed = useMemo(() => q.trim(), [q])

    const router = useRouter()

    const closeSmooth = () => {
        setTimeout(() => {
        }, 140)
    }

    useEffect(() => {
        if (!open || trimmed.length < 2) return
        const el = document.getElementById('site-header')
        if (!el) return

        const update = () => setTopOffset(Math.ceil(el.getBoundingClientRect().height))

        update()

        const ro = new ResizeObserver(update)
        ro.observe(el)

        window.addEventListener('resize', update)
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [open, trimmed])

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [open])


    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSmooth()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    // Búsqueda con debounce
    useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current)

        if (trimmed.length < 2) {
            setItems([])
            setLoading(false)
            setOpen(false)
            return
        }

        setLoading(true)
        debounceRef.current = window.setTimeout(async () => {
            try {
                const { productos } = await searchProducts(trimmed, 8, 0)
                setItems(productos ?? [])
                setOpen(true)
            } catch (e) {
                console.error('searchProducts error:', e)
                setItems([])
                setOpen(true)
            } finally {
                setLoading(false)
            }
        }, 350)

        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
        }
    }, [trimmed])

    const showDropdown = open && (loading || items.length > 0 || trimmed.length >= 2)

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <input
                value={q}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && trimmed.length >= 2) {
                        closeSmooth()
                        router.push(`/buscar?q=${encodeURIComponent(trimmed)}`)
                    }
                }}

                onChange={(e) => {
                    setQ(e.target.value)
                    if (!open) setOpen(true)
                }}
                onFocus={() => {
                    if (trimmed.length >= 2) setOpen(true)
                }}
                type="text"
                placeholder={placeholder}
                className={inputClassName}
            />

            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 underline" />

            <ProductSearchOverlay
                open={showDropdown}
                onClose={() => closeSmooth()}
                topOffset={topOffset}
            >
                {loading && <ProductSearchDropdownSkeleton />}

                {trimmed.length >= 2 && (loading || items.length > 0) && (
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <Link
                                href="/"
                                className="inline-block text-center bg-white text-red-700 font-semibold py-1 px-2 rounded-full shadow-lg border-2 text-[13px]  border-red-700 hover:bg-red-700 hover:text-white transition-all duration-300 transform hover:scale-105"
                            >
                                Volver a la tienda
                            </Link>
                        </div>

                        <h3 className="text-gray-600 font-semibold text-center">
                            Resultados para <span className="font-bold">“{trimmed}”</span>
                        </h3>

                        <button
                            onClick={() => {
                                closeSmooth()
                                router.push(`/buscar?q=${encodeURIComponent(trimmed)}`)
                            }}
                            className="inline-block bg-white text-[#023d71] font-semibold py-1 px-2 rounded-full shadow-lg border-2 text-[13px]  border-[#023d71] hover:bg-[#023d71] hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            Ver todos →
                        </button>
                    </div>
                )}

                {!loading && items.length === 0 && trimmed.length >= 2 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-gray-700">
                            No se encontraron productos con el nombre{' '}
                            <span className="font-semibold text-gray-900">“{trimmed}”</span>.
                        </p>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((p) => (
                            <div key={p.id} onClick={closeSmooth}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}

            </ProductSearchOverlay>

        </div>
    )
}
