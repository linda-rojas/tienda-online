'use client'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

type Props = {
    open: boolean
    onClose: () => void
    topOffset?: number
    children: React.ReactNode
}

export default function ProductSearchOverlay({ open, onClose, topOffset = 0, children }: Props) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    if (!mounted || !open) return null
    if (!open) return null

    return createPortal(
        <>
            <div className="fixed inset-0 z-40">
                {/* backdrop */}
                <div
                    className="absolute inset-0 bg-black/30"
                    onClick={onClose}
                />

                {/* panel debajo del header */}
                <div
                    className="absolute left-0 right-0 overflow-auto bg-white"
                    style={{
                        top: topOffset,
                        height: `calc(100vh - ${topOffset}px)`,
                    }}
                >
                    <div className="p-4">{children}</div>
                </div>
            </div>
        </>,
        document.body
    )
}
