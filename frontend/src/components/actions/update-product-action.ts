'use server'

import { ErrorResponseSchema, Product, ProductFormSchema } from "@/schemas/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

const ProductPayloadSchema = ProductFormSchema.omit({
    id: true,
    imagenes: true,
})

export async function UpdateProduct(
    productId: Product['id'],
    prevState: ActionStateType,
    formData: FormData
) {
    const payload = ProductPayloadSchema.safeParse({
        nombre: formData.get('nombre'),
        subtitulo: formData.get('subtitulo'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        descuento: formData.get('descuento'),
        categoriaId: formData.get('categoriaId'),
    })

    if (!payload.success) {
        return {
            errors: payload.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${productId}`
    const req = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data),
    })

    const json = await req.json().catch(() => ({}))

    if (!req.ok) {
        const errors = ErrorResponseSchema.parse(json)
        return {
            errors: errors.message.map((m) => m),
            success: ''
        }
    }

    return { errors: [], success: 'Producto Actualizado Correctamente ✅' }
}
