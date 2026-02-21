'use server'
type ImageType = 'primary' | 'secondary' | 'gallery'


export async function uploadImage(productId: number,
    images: { file: File; type: ImageType }[]) {

    if (!productId) throw new Error('El producto aún no existe');

    const formData = new FormData();

    images.forEach((img, i) => {
        formData.append(`images[${i}][file]`, img.file);
        formData.append(`images[${i}][type]`, img.type);
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error('Error backend:', err);
        throw new Error(err?.message || 'Error al subir imágenes');
    }

    return res.json();
}
