'use client'
import { useTogglePanelStore } from "@/components/ui/toggleStore/toggleStore"

export const useMenuToggle = () => {
    const isOpen = useTogglePanelStore((state) => state.isPanelOpen('menu'))
    const toggleMenu = () => useTogglePanelStore.getState().togglePanel('menu')
    const closeMenu = () => useTogglePanelStore.getState().closePanel('menu')

    return {
        isOpen,
        toggleMenu,
        closeMenu,
    }
}
