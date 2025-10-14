'use client'
import { submitOrder } from '@/components/actions/submit-order-action'
import { useStore } from '@/useStore'
import { useActionState, useEffect, useState, startTransition } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function SubmitOrderForm() {
    const router = useRouter()
    const total = useStore((state) => state.total)
    const coupon = useStore((state) => state.coupon.nombre)
    const contents = useStore((state) => state.contents)
    const clearOrder = useStore((state) => state.clearOrder)

    const [usuario, setUsuario] = useState<any>(null)

    useEffect(() => {
        // leer usuario solo en cliente
        const stored = JSON.parse(localStorage.getItem('usuario') || 'null')
        setUsuario(stored)
    }, [])

    const transacciones = {
        total,
        cupon: coupon,
        usuarioId: Number(usuario?.id),
        contents: contents.map((item) => ({
            productoId: item.productId,
            cantidad: item.quantity,
            precio: item.precio,
        })),
    }

    console.log("Transacción enviada:", transacciones)
    console.log("Tipo de usuarioId:", typeof transacciones.usuarioId)

    const submitOrderWithData = submitOrder.bind(null, transacciones)
    const [state, dispatch] = useActionState(submitOrderWithData, {
        errors: [],
        success: '',
    })

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            clearOrder()
        }
    }, [state])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validar si el usuario está logueado
        if (!usuario || !usuario.id) {
            toast.warn('Debes iniciar sesión para confirmar la compra.', {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
            })

            setTimeout(() => {
                router.push('/admin/login')
            }, 1000)
            return
        }

        // Ejecutar la acción dentro de una transición (corrige el warning)
        startTransition(() => {
            dispatch()
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="submit"
                className="mt-4 w-full bg-[#023D71] hover:bg-green-500 text-white py-2 rounded cursor-pointer transition-colors duration-200"
                value="CONFIRMAR COMPRA"
            />
        </form>
    )
}
