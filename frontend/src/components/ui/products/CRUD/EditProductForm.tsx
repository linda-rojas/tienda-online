'use client'
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { UpdateProduct } from "../../../actions/update-product-action";


export default function EditProductForm({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const { id } = useParams<{ id: string }>()

    const UpdateProductWithId = UpdateProduct.bind(null, +id)
    const [state, dispatch] = useActionState(UpdateProductWithId, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.errors?.length) state.errors.forEach(error => toast.error(error))
        if (state.success) {
            toast.success(state.success, { autoClose: 2000 })
            router.refresh()
        }
    }, [state, router])

    return (
        <form
            className='space-y-5'
            action={dispatch}
        >
            {children}
            <input
                type='submit'
                className='rounded bg-green-500 font-bold py-2 w-full cursor-pointer text-gray-800'
                value='Guardar Cambios'
            />
        </form>
    );
}
