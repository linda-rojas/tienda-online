export interface CartToggleStore {
    isOpen: boolean
    toggleCart: () => void
    closeCart: () => void
    cartCount: number
}