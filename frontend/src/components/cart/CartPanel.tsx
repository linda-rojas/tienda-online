'use client'
import { useEffect } from 'react'
import { useCartToggle } from '../../ui/cart/useCartToggle'
import { useStore } from '@/useStore'
import ShoppingCartItem from './ShopingCartItem'
import Amount from '@/ui/cart/Amount'
import CouponForm from './CouponForm'
import SubmitOrderForm from './SubmitOrderForm'

export function CartPanel() {
    const contents = useStore((state) => state.contents)
    const total = useStore((state) => state.total)
    const discount = useStore((state) => state.discount)

    const { isOpen, closeCart } = useCartToggle()

    useEffect(() => {
        const handlePopState = () => {
            closeCart()
        }

        if (isOpen) {
            history.pushState(null, '', location.href)
            window.addEventListener('popstate', handlePopState)
        }

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [isOpen, closeCart])

    if (!isOpen) return null

    return (
        <aside className="fixed top-[65px] xl:top-[76px] right-0 z-50 w-full md:w-[400px] h-screen bg-white shadow-lg overflow-y-auto transition-all">
            <div className="p-6 overflow-y-auto h-[calc(100vh-65px)] xl:h-[calc(100vh-76px)]">
                {contents.length ? (
                    <>
                        <h2 className="text-center text-xl font-bold mb-4 text-gray-700">
                            Productos seleccionados
                        </h2>
                        <ul role="list" className="mt-6 text-sm font-medium text-gray-500">
                            {contents.map((item) => (
                                <ShoppingCartItem key={item.productId} item={item} />
                            ))}
                        </ul>
                        <dl className="space-y-5 text-sm py-6 border-gray-300 boder-t text-gray-800">
                            {discount ? (
                                <Amount label="Descuento" amount={discount} discount={true} />
                            ) : null}
                            <Amount label="Total a Pagar:" amount={total} />
                        </dl>
                        <CouponForm />
                        <SubmitOrderForm />
                    </>
                ) : (
                    <p className="text-center text-xl font-bold mb-4 text-gray-700">
                        El Carrito está vacio
                    </p>
                )}
            </div>
        </aside>
    )
}
