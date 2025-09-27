'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/schemas/schemas'

export default function ProductImage({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false)

    const imageToShow =
        hovered && product.imagen_url2
            ? product.imagen_url2
            : (product.imagen_url ?? '/product-notFound.png')

    return (
        <div
            className="relative w-full h-[180px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={imageToShow}
                alt={product.nombre}
                fill
                priority
                className="object-contain rounded-t-lg cursor-pointer transition-all duration-500"
            />

            {(product.descuento ?? 0) > 0 && (
                <div className="color-blue-footer-bg absolute top-0 right-0 text-[12px] text-white font-semibold px-3 py-[2px] shadow-lg z-10 rounded-tl rounded-bl">
                    ¡{product.descuento}% descuento!
                </div>
            )}
        </div>
    )
}
