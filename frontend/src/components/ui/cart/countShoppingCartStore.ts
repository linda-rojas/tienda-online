'use client'
import { create } from 'zustand'
import { CountCartState } from '@/interfaces/countCartState'

export const countShoppingCartStore = create<CountCartState>((set) => ({
    contents: [],

    addToCart: (item) =>
        set((state) => ({
            contents: [...state.contents, item],
        })),

    removeFromCart: (productId) =>
        set((state) => ({
            contents: state.contents.filter((item) => item.productId !== productId),
        })),

    clearCart: () => set({ contents: [] }),
}))
