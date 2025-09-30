'use client'
import { Product } from '@/schemas/schemas'
import { useStore } from '@/useStore'

export default function AddProductButton({ product }: { product: Product }) {
    const addToCard = useStore((state) => state.addToCard)
    return (
        <button
            type="button"
            onClick={() => addToCard(product)}
            className="color-red-bg hover-bg-red w-full text-white py-[6px] rounded-lg  transition duration-200 cursor-pointer font-medium text-[14px]"
        >
            Agregar al carrito
        </button>
    )
}
