import { submitOrder } from '@/actions/submit-order-action'
import { useStore } from '@/useStore'
import { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function SubmitOrderForm() {
    const total = useStore((state) => state.total)
    const coupon = useStore((state) => state.coupon.nombre)
    const contents = useStore((state) => state.contents)
    const clearOrder = useStore((state) => state.clearOrder)

    const order = {
        total,
        coupon,
        contents,
    }

    const submitOrderWithData = submitOrder.bind(null, order)

    const [state, dispatch] = useActionState(submitOrderWithData, {
        errors: [],
        success: '',
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            clearOrder()
        }
    }, [state])
    return (
        <form action={dispatch}>
            <input
                type="submit"
                className="mt-4 w-full color-blue-footer-bg hover:bg-blue-500 text-white py-2 rounded cursor-pointer"
                value="CONFIRMAR COMPRA"
            />
        </form>
    )
}
