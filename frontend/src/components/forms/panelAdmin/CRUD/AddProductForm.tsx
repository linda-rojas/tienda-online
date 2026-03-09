'use client'
import { useActionState, useEffect, useRef } from "react";
import { addProduct } from "@/components/actions/add-product-action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


export default function AddProductForm({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const formRef = useRef<HTMLFormElement | null>(null)

    const [state, dispatch] = useActionState(addProduct, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.errors?.length) state.errors.forEach(err => toast.error(err))

        if (state.success && state.productId) {
            toast.success(state.success, { autoClose: 2000 })
            router.push(`/admin/sales/products/${state.productId}/edit`)
        }

    }, [state, router])

    return (
        <form ref={formRef} className="space-y-5" action={dispatch}>
            {children}
            <input
                type='submit'
                className='rounded bg-green-500 font-bold py-2 w-full cursor-pointer text-gray-800'
                value='Agregar Producto'
            />
        </form>
    );
}
