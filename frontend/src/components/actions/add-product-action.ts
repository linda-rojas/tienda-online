'use server'
import { AddProductFormSchema, ErrorResponseSchema } from "@/schemas/schemas"

type ActionStateType = {
    errors: string[],
    success: string,
    productId?: number
}

export async function addProduct(prevState: ActionStateType, formData: FormData) {

    console.log(Object.fromEntries(formData.entries()))

    const product = AddProductFormSchema.safeParse({
        nombre: formData.get('nombre'),
        subtitulo: formData.get('subtitulo'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        descuento: formData.get('descuento'),
        categoriaId: formData.get('categoriaId')
    })

    if (!product.success) {
        return {
            errors: product.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos`
    const req = await fetch(url, {
        method: 'POST',
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
            success: '',

        }
    }

    return {
        errors: [],
        success: 'Producto creado con Exito será redirigido a crear la imágenes ✅',
        productId: json.id,
    }

}