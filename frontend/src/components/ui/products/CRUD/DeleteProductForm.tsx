'use client'

import { deleteProductAction } from '@/components/actions/delete-product-action'
import { Product } from '@/schemas/schemas'
import { useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import ConfirmModal from '../../dialog/ConfirmModal'


export default function DeleteProductForm({ productId }: { productId: Product['id'] }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const onConfirm = () => {
        startTransition(async () => {
            const result = await deleteProductAction(Number(productId))

            if (!result.ok) {
                toast.error(result.message)
                setOpen(false)
                return
            }

            toast.success('Producto eliminado ✅', { autoClose: 2000 })
            setOpen(false)
        })
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-60"
                disabled={isPending}
            >
                Eliminar
            </button>

            <ConfirmModal
                open={open}
                title="Eliminar producto"
                description="Esta acción eliminará el producto y sus imágenes. ¿Deseas continuar?"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                loading={isPending}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
            />
        </>
    )
}
