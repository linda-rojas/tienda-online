'use client'
import { useActionState, useEffect } from "react";
import { addProduct } from "../actions/add-product-action";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


export default function AddProductForm({ children }: { children: React.ReactNode }) {

    const router = useRouter()
    const [state, dispatch] = useActionState(addProduct, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/admin/sales/products')
        }
    }, [state])

    return (
        <form
            className='space-y-5'
            action={dispatch}
        >
            {children}
            <input
                type='submit'
                className='rounded bg-green-500 font-bold py-2 w-full cursor-pointer text-gray-800'
                value='Agregar Producto'
            />
        </form>
    );
}
