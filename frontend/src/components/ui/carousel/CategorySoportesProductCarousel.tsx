'use client'
import { useEffect, useState, useRef } from 'react'
import { Product, Category } from '@/schemas/schemas'
import ProductCard from '../../products/productCards'
import { getCategoryWithProducts } from '@/services/product.service'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import ProductCarouselSkeleton from '@/utils/skeleton/ProductCarouselSkeleton'

export default function CategorySoportesProductCarousel({ categoryId }: { categoryId: number }) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData: Category = await getCategoryWithProducts(categoryId)
                setProducts(categoryData.productos ?? [])
            } catch (err) {
                console.error('Error al obtener productos por categoría:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [categoryId])

    useEffect(() => {
        if (!products.length) return
        const interval = setInterval(() => {
            setTimeout(goToNext, 1000) // añade una pequeña latencia
        }, 2000)
        return () => clearInterval(interval)
    }, [products])

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? products.length - 1 : prevIndex - 1
            updateCarouselScroll(newIndex)
            return newIndex
        })
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % products.length
            updateCarouselScroll(newIndex)
            return newIndex
        })
    }

    const updateCarouselScroll = (index: number) => {
        if (!carouselRef.current) return

        const child = carouselRef.current.children[index]
        if (!child) return // ⬅️ evita el error si el índice no existe

        const itemWidth = (child as HTMLElement).clientWidth
        carouselRef.current.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth',
        })
    }

    if (isLoading) return <ProductCarouselSkeleton itemCount={4} />
    if (!products.length) return <div>No hay productos para esta categoría.</div>

    return (
        <div className="relative">
            <div
                ref={carouselRef}
                className="flex gap-4 sm:gap-6 lg:gap-4 overflow-x-hidden"
                style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
            >
                {products.map((product, index) => (
                    <div key={index} className="flex-shrink-0 w-[250px] scroll-snap-align-start" >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white p-2 rounded-full cursor-pointer hover:bg-[#408FD8] color-blue-footer-bg"
            >
                <IoIosArrowBack size={24} />
            </button>

            <button
                onClick={goToNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white p-2 rounded-full cursor-pointer hover:bg-[#408FD8] color-blue-footer-bg"
            >
                <IoIosArrowForward size={24} />
            </button>
        </div>
    )
}
