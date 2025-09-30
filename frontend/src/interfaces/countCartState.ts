import { CartItem } from "@/schemas/schemas"

export interface CountCartState {
    contents: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (productId: number) => void
    clearCart: () => void
}