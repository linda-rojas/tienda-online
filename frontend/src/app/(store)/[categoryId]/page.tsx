import FooterServer from '@/components/footer/foooterServer'
import ProductCard from '@/components/ui/products/productCards'
import { CategoryWithProductsResponseSchema } from '@/schemas/schemas'
import HeaderServer from '@/components/ui/mainNav/HeaderServer'
import { redirect } from 'next/navigation'

type Params = Promise<{ categoryId: string }>

async function getProducts(categoryId: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias/${categoryId}?productos=true`
    const req = await fetch(url, {
        next: {
            tags: ['products-by-category'],
        },
    })
    const json = await req.json()
    if (!req.ok) {
        redirect('../../no-encontrado')
    }
    const products = CategoryWithProductsResponseSchema.parse(json)

    return products
}

export default async function StorePage({ params }: { params: Params }) {
    const { categoryId } = await params
    const category = await getProducts(categoryId)

    return (
        <div>
            <HeaderServer />
            <div className="grid place-items-center grid-cols-1 gap-5 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 my-10">
                {category.productos.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <FooterServer />
        </div>
    )
}
