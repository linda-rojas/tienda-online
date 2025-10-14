import { useTogglePanelStore } from '@/components/ui/toggleStore/toggleStore'

export const usePanel = (panelKey: string) => {
    const togglePanel = useTogglePanelStore((state) => state.togglePanel)
    const closePanel = useTogglePanelStore((state) => state.closePanel)
    const openPanel = useTogglePanelStore((state) => state.openPanel)
    const isPanelOpen = useTogglePanelStore((state) => state.isPanelOpen(panelKey))

    return {
        isPanelOpen,
        toggle: () => togglePanel(panelKey),
        close: () => closePanel(panelKey),
        open: () => openPanel(panelKey),
    }
}
