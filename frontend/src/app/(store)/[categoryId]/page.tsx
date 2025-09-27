import ProductCard from '@/components/products/productCards'
import { CategoryWithProductsResponseSchema } from '@/schemas/schemas'

type Params = Promise<{ categoryId: string }>

async function getProducts(categoryId: string) {
    const url = `http://localhost:3000/categorias/${categoryId}?productos=true`
    const req = await fetch(url)
    const json = await req.json()
    console.log('Productos:', JSON.stringify(json.productos, null, 2))
    const products = CategoryWithProductsResponseSchema.parse(json)

    return products
}

export default async function StorePage({ params }: { params: Params }) {
    const { categoryId } = await params
    const category = await getProducts(categoryId)

    return (
        <div className="grid place-items-center grid-cols-1 gap-5 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 my-10">
            {category.productos.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
