'use client'
import { useEffect } from 'react'

type Props = {
    open: boolean
    title?: string
    message: React.ReactNode
    confirmText?: string
    cancelText?: string
    danger?: boolean
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    open,
    title = 'Confirmar acción',
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}: Props) {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_.15s_ease-out]"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-[popIn_.16s_ease-out]">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-gray-900 font-semibold text-[16px] sm:text-[17px]">
                            {title}
                        </h3>
                    </div>

                    <div className="px-5 py-4 text-gray-700 text-[14px] sm:text-[15px] leading-relaxed">
                        {message}
                    </div>

                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 cursor-pointer rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-60"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`px-4 py-2 cursor-pointer rounded-xl font-semibold text-sm transition disabled:opacity-60
                ${danger
                                    ? 'bg-red-700 text-white hover:bg-red-800'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Eliminando...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>

            {/* Animaciones */}
            <style jsx global>{`
            @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
            }
            @keyframes popIn {
            from { opacity: 0; transform: translateY(10px) scale(.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `}</style>
        </div>
    )
}
