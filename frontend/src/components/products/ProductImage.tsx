'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/schemas/schemas'
import Link from 'next/link'
import ProductImageSkeleton from '@/utils/skeleton/ProductImageSkeleton'


export default function ProductImage({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const imageToShow =
        hovered && product.imagen_url2
            ? product.imagen_url2
            : product.imagen_url ?? '/product-notFound.png'

    return (
        <Link href={`/producto/${product.id}`} prefetch>
            <div
                className="relative w-full h-[180px]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* ✅ Shimmer mientras carga */}
                {!imageLoaded && <ProductImageSkeleton />}

                {/* Imagen real */}
                <Image
                    src={imageToShow}
                    alt={product.nombre}
                    fill
                    priority
                    onLoadingComplete={() => setImageLoaded(true)} // <- marca como cargada
                    className={`object-contain rounded-t-lg cursor-pointer transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
                        }`}
                />

                {/* Descuento */}
                {(product.descuento ?? 0) > 0 && (
                    <div className="color-blue-footer-bg absolute top-0 right-0 text-[12px] text-white font-semibold px-3 py-[2px] shadow-lg z-10 rounded-tl rounded-bl">
                        ¡{product.descuento}% descuento!
                    </div>
                )}
            </div>
        </Link>
    )
}
