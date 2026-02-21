'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/schemas/schemas'
import Link from 'next/link'
import Skeleton from '../../skeletons/Skeleton'


export default function ProductImage({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Comprobamos si 'product.imagenes' está presente y tiene imágenes
    const primaryImages = product.imagenes?.filter(img => img.type?.toLowerCase() === 'primary') ?? [];
    const secondaryImages = product.imagenes?.filter(img => img.type?.toLowerCase() === 'secondary') ?? [];

    // Asegurarse de que 'imagenes' no sea undefined o null
    console.log('Product:', product); // Muestra el objeto completo product
    console.log('Product Images:', product.imagenes); // Muestra las imágenes

    const safePrimary = primaryImages[0]?.url ?? '/product-notFound.png';
    const safeSecondary = secondaryImages[0]?.url ?? safePrimary;

    const imageToShow = hovered ? safeSecondary : safePrimary;



    return (
        <Link href={`/producto/${product.id}`} prefetch>
            <div
                className="relative w-full h-[180px]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* ✅ Shimmer mientras carga */}
                {!imageLoaded && (<Skeleton className="absolute inset-0 rounded-t-lg bg-gray-200" />)}


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
