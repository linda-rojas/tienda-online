'use server'

export async function uploadImage(productId: number, files: File[], type: string) {

    if (!productId) {
        throw new Error('El producto aún no existe');
    }

    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }
    formData.append('type', type);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}`, {
        method: 'POST',
        body: formData,
    });

    // Si no es exitosa, obtenemos el detalle del error
    if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error en el backend:", errorResponse);  // Aquí verás el detalle del error
        throw new Error('Error al subir imágenes');
    }

    return await res.json();
}
