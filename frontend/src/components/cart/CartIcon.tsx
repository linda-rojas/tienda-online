// components/cart/CartIcon.tsx
'use client'
import { FaShoppingCart } from 'react-icons/fa'
import { roboto } from '@/ui/fonts'
import { useCartToggle } from '../../ui/cart/useCartToggle'

export function CartIcon() {
    const { toggleCart, cartCount } = useCartToggle()

    return (
        <div className="relative cursor-pointer" onClick={toggleCart}>
            <span
                className={`color-blue-bg w-5 h-5 absolute text-center top-[-10px] left-1/2 text-[14px] font-bold ${roboto.className} text-white rounded-full`}
            >
                {cartCount}
            </span>
            <figure className="hover-bg-blue rounded-full bg-white p-2 transition-colors duration-300">
                <FaShoppingCart className="color-red h-5 w-5 hover:text-white" />
            </figure>
        </div>
    )
}
