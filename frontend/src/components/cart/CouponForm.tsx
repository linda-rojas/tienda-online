import { useStore } from '@/useStore'
import { FormEvent } from 'react'

export default function CouponForm() {
    const applyCoupon = useStore((state) => state.applyCoupon)
    const coupon = useStore((state) => state.coupon)

    const hadleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const couponName = formData.get('coupon_name')?.toString()!
        console.log('Cupón enviado:', couponName)
        if (!couponName.length) return
        await applyCoupon(couponName)
        // e.currentTarget.reset() // limpia el campo después
    }

    return (
        <>
            <p className="py-2 text-[15px] font-semibold border-t border-gray-300 text-gray-600">
                Canjear Cupón
            </p>
            <form className="flex" onSubmit={hadleSubmit}>
                <input
                    type="text"
                    className="p-2 bg-gray-200 border border-gray-300 rounded-l-lg px-3 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-400 w-full"
                    placeholder="Ingresa un cupón"
                    name="coupon_name"
                />
                <input
                    type="submit"
                    className="p-3 bg-green-500 font-semibold text-white rounded-r-lg border border-l-0 border-gray-300 hover:cursor-pointer"
                    value="Canjear"
                />
            </form>
            {coupon.message ? (
                <p className="text-gray-700 py-4 text-center text-sm font-semibold">
                    {coupon.message}
                </p>
            ) : null}
        </>
    )
}
