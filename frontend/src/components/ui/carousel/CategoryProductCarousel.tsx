'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Category, Product } from '@/schemas/schemas';
import { getCategoryWithProducts } from '@/services/categories/categories.service';
import ProductCard from '../products/productCards';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import CategoryCarouselSkeleton from '../skeletons/CategoryCarouselSkeleton';

type Props = {
    categoryId: number;

    // autoplay
    autoPlay?: boolean;
    autoPlayIntervalMs?: number;   // cada cuánto avanza
    autoPlayDelayMs?: number;      // delay antes de ejecutar el next ("latencia")

    // UI / layout
    itemsSkeleton?: number;
    itemClassName?: string;        // ancho por item
    className?: string;            // wrapper
};

export default function CategoryProductCarousel({
    categoryId,
    autoPlay = true,
    autoPlayIntervalMs = 2000,
    autoPlayDelayMs = 0,
    itemsSkeleton = 4,
    itemClassName = 'flex-shrink-0 w-[250px] scroll-snap-align-start',
    className = '',
}: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollToIndex = useCallback((index: number) => {
        const container = carouselRef.current;
        if (!container) return;

        const child = container.children[index] as HTMLElement | undefined;
        if (!child) return;

        // ancho variable
        container.scrollTo({
            left: child.offsetLeft,
            behavior: 'smooth',
        });
    }, []);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => {
            const nextIndex = prev === 0 ? products.length - 1 : prev - 1;
            scrollToIndex(nextIndex);
            return nextIndex;
        });
    }, [products.length, scrollToIndex]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const nextIndex = (prev + 1) % products.length;
            scrollToIndex(nextIndex);
            return nextIndex;
        });
    }, [products.length, scrollToIndex]);

    // fetch productos de la categoría
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const categoryData: Category = await getCategoryWithProducts(categoryId);
                if (!mounted) return;
                setProducts(categoryData.productos ?? []);
                setCurrentIndex(0);
            } catch (err) {
                console.error('Error al obtener productos por categoría:', err);
                if (!mounted) return;
                setProducts([]);
            } finally {
                if (!mounted) return;
                setIsLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [categoryId]);

    // autoplay (interval + delay)
    useEffect(() => {
        if (!autoPlay || !products.length) return;

        const interval = setInterval(() => {
            if (autoPlayDelayMs > 0) {
                const t = setTimeout(goToNext, autoPlayDelayMs);
                return () => clearTimeout(t);
            }
            goToNext();
        }, autoPlayIntervalMs);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayIntervalMs, autoPlayDelayMs, products.length, goToNext]);

    if (isLoading) return <CategoryCarouselSkeleton items={itemsSkeleton} />;
    if (!products.length) return <div>No hay productos para esta categoría.</div>;

    return (
        <div className={`relative ${className}`}>
            <div
                ref={carouselRef}
                className="flex gap-4 sm:gap-6 lg:gap-4 overflow-x-hidden"
                style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
            >
                {products.map((product) => (
                    <div key={product.id} className={itemClassName}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white p-2 rounded-full cursor-pointer hover:bg-[#408FD8] color-blue-footer-bg"
                aria-label="Anterior"
            >
                <IoIosArrowBack size={24} />
            </button>

            <button
                onClick={goToNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white p-2 rounded-full cursor-pointer hover:bg-[#408FD8] color-blue-footer-bg"
                aria-label="Siguiente"
            >
                <IoIosArrowForward size={24} />
            </button>
        </div>
    );
}
