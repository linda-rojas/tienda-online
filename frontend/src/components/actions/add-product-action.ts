'use server'
import { AddProductFormSchema, ErrorResponseSchema, ProductFormSchema } from "@/schemas/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function addProduct(prevState: ActionStateType, formData: FormData) {

    const product = AddProductFormSchema.safeParse({
        nombre: formData.get('nombre'),
        subtitulo: formData.get('subtitulo'),
        descripcion: formData.get('descripcion'),
        precio: formData.get('precio'),
        stock: formData.get('stock'),
        descuento: formData.get('descuento'),
        categoriaId: formData.get('categoryId')
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
            success: 'Producto Agregado Correctamente'
        }
    }

    const productId = json.id

    // 🟢 2. Asociar imágenes (campo oculto del formulario)
    const hasOneImage = formData.get('images[0][type]')

    console.log('file', formData.get('images[0][file]'));


    if (hasOneImage) {
        const requestImages = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData,
        })

        const responseImages = await requestImages.json()

        if (!requestImages.ok) {
            return {
                errors: [
                    'Error al subir las imágenes',
                ],
                success: ''
            }
        }

        console.log(responseImages);
    }

    return {
        errors: [],
        success: ''
    }
}