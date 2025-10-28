import { Product } from "@/schemas/schemas";
import { revalidatePath } from "next/cache";

export default function DeleteProductForm({ productId }: { productId: Product['id'] }) {

    const handleDeleteProduct = async () => {
        'use server'

        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmDelete) return;

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${productId}`
        const req = await fetch(url, {
            method: 'DELETE',
        });

        if (!req.ok) {
            alert("Hubo un problema al eliminar el producto");
            return;
        }

        await req.json()
        revalidatePath('/admin/sales/products')
    }


    return (
        <form
            action={handleDeleteProduct}
        >
            <input
                type='submit'
                className='text-red-600 hover:text-red-800 cursor-pointer'
                value='Eliminar'
            />
        </form>
    );
}
