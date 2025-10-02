import { Coupon, Product, ShoppingCart } from "@/schemas/schemas"

export interface Store {
    total: number,
    discount: number,
    contents: ShoppingCart,
    coupon: Coupon,
    addToCard: (product: Product) => void,
    updateQuantity: (id: Product['id'], quantity: number) => void,
    removeFromCart: (id: Product['id']) => void,
    calculateTotal: () => void,
    applyCoupon: (nombre: string) => Promise<void>,
    applyDiscount: () => void,
    clearOrder: () => void,
}