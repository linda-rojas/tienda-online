'use server'

type ImageType = 'primary' | 'secondary' | 'gallery'

export async function deleteProductImage(productId: number, imageId: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}/${imageId}`,
        { method: 'DELETE' }
    )

    if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Error eliminando imagen')
    }

    return res.json().catch(() => ({}))
}

export async function changeProductImageType(
    productId: number,
    imageId: number,
    type: ImageType
) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}/${imageId}/type`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type }),
        }
    )

    if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Error cambiando tipo')
    }

    return res.json().catch(() => ({}))
}
