'use server'
import { ErrorResponseSchema, Product, ProductFormSchema } from "@/schemas/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function UpdateProduct(productId: Product['id'], prevState: ActionStateType, formData: FormData) {

    const product = ProductFormSchema.safeParse({
        name: formData.get('nombre'),
        price: formData.get('precio'),
        inventory: formData.get('stock'),
        categoryId: formData.get('categoriaId')
    })

    if (!product.success) {
        return {
            errors: product.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${productId}`
    const req = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product.data),
    });
    const json = await req.json()

    if (!req.ok) {
        const errors = ErrorResponseSchema.parse(json)
        return {
            errors: errors.message.map(issue => issue),
            success: 'Producto Actualizado Correctamente'
        }
    }


    return {
        errors: [],
        success: ''
    }
}