import { ProductSchema, Product, CategorySchema, Category } from '@/schemas/schemas'
import { redirect } from 'next/navigation'

export async function getProduct(productId: string): Promise<Product> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/productos/${productId}`
    const req = await fetch(url, {
        next: { tags: ['product-detail'] },
    })
    if (!req.ok) redirect('/no-encontrado')

    const json = await req.json()
    return ProductSchema.parse(json)
}

export async function getCategory(categoryId: number): Promise<Category> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias/${categoryId}`
    const req = await fetch(url, { next: { tags: ['category-detail'] } })
    if (!req.ok) redirect('/no-encontrado')

    const json = await req.json()
    return CategorySchema.parse(json)
}
