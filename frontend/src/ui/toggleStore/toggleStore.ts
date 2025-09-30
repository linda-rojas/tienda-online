'use client'
import { create } from 'zustand'

interface TogglePanelStore {
    panels: Record<string, boolean>
    togglePanel: (key: string) => void
    openPanel: (key: string) => void
    closePanel: (key: string) => void
    isPanelOpen: (key: string) => boolean
}

export const useTogglePanelStore = create<TogglePanelStore>((set, get) => ({
    panels: {},

    togglePanel: (key) => {
        const { panels } = get()
        set({ panels: { ...panels, [key]: !panels[key] } })
    },

    openPanel: (key) => {
        const { panels } = get()
        set({ panels: { ...panels, [key]: true } })
    },

    closePanel: (key) => {
        const { panels } = get()
        set({ panels: { ...panels, [key]: false } })
    },

    isPanelOpen: (key) => {
        const { panels } = get()
        return !!panels[key]
    }
}))
