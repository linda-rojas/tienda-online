import { create } from "zustand";
import { Store } from "./interfaces/store.interface";
import { devtools } from "zustand/middleware";
import { CouponResponseSchema, ShoppingCart } from "./schemas/schemas";

export const useStore = create<Store>()(devtools((set, get) => ({
    total: 0,
    contents: [],
    coupon: {
        porcentaje: 0,
        nombre: '',
        message: ''
    },
    addToCard: (product) => {
        const { id: productId, categoriaId, ...data } = product
        let contents: ShoppingCart = []
        const duplicated = get().contents.findIndex(item => item.productId === productId)

        if (duplicated >= 0) {
            // no se agrega mas de lo que hay en el stock
            if (get().contents[duplicated].quantity >= get().contents[duplicated].stock) return
            contents = get().contents.map(item => item.productId === productId ? {
                ...item,
                quantity: item.quantity + 1
            } : item)
        } else {
            contents = [...get().contents, {
                ...data,
                quantity: 1,
                productId
            }]
        }
        set(() => ({
            contents
        }))

        get().calculateTotal()
    },

    updateQuantity: (id, quantity) => {
        const contents = get().contents.map(item => item.productId === id ? { ...item, quantity } : item)
        set(() => ({
            contents: contents
        }))

        get().calculateTotal()
    },
    removeFromCart: (id) => {
        set((state) => ({
            contents: state.contents.filter(item => item.productId !== id)
        }))

        get().calculateTotal()
    },
    calculateTotal: () => {
        const total = get().contents.reduce((total, item) => total + (item.quantity * item.precio), 0)
        set(() => ({
            total
        }))
    },
    applyCoupon: async (nombre) => {
        const req = await fetch('api/coupones', {
            method: 'POST',
            body: JSON.stringify({
                nombre: nombre
            })
        })

        const json = await req.json()
        const coupon = CouponResponseSchema.parse(json)
        set(() => ({
            coupon
        }))
    }
})))