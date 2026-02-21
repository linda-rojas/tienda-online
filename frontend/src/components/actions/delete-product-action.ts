'use server'

import { revalidatePath } from 'next/cache'

export async function deleteProductAction(productId: number) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${productId}`

    const req = await fetch(url, { method: 'DELETE', cache: 'no-store' })

    if (!req.ok) {
        let message = 'Hubo un problema al eliminar el producto'
        try {
            const data = await req.json()
            message = data?.message || message
        } catch { }
        return { ok: false as const, message }
    }

    revalidatePath('/admin/sales/products')
    return { ok: true as const }
}
