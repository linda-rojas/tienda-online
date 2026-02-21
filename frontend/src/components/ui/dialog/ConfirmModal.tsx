'use client'

type Props = {
    open: boolean
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmModal({
    open,
    title = 'Confirmar acción',
    description = '¿Seguro que quieres continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    loading = false,
    onConfirm,
    onClose,
}: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={loading ? undefined : onClose}
            />

            {/* modal */}
            <div className="relative w-[92%] max-w-md rounded-xl bg-white shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
                    >
                        {loading ? 'Eliminando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
