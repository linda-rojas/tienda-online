'use client'
import { useStore } from '@/useStore'
import { useTogglePanelStore } from '../toggleStore/toggleStore'

export const useCartToggle = () => {
    const isOpen = useTogglePanelStore((state) => state.isPanelOpen('cart'))
    const toggleCart = () => useTogglePanelStore.getState().togglePanel('cart')
    const closeCart = () => useTogglePanelStore.getState().closePanel('cart')

    const cartCount = useStore((state) =>
        state.contents.reduce((sum, item) => sum + item.quantity, 0)
    ) // suma las cantidades

    return {
        isOpen,
        toggleCart,
        closeCart,
        cartCount: cartCount
    }
}
