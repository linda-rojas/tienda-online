import Link from 'next/link'
import { searchProducts } from '@/services/products/product.search.service'
import ProductCard from '@/components/ui/products/productCards'
import { Nav } from '@/components/ui/mainNav/Nav'

export const dynamic = 'force-dynamic' // resultados dependen de query

type Props = {
    searchParams?: {
        q?: string
        page?: string
        take?: string
    }
}

export async function generateMetadata({ searchParams }: Props) {
    const q = (searchParams?.q ?? '').trim()
    const title = q ? `Buscar: ${q} | AutoCaucho` : 'Buscar productos | AutoCaucho'
    const description = q
        ? `Resultados de búsqueda para "${q}".`
        : 'Busca productos por nombre o palabra clave.'

    return { title, description }
}

export default async function BuscarPage({ searchParams }: Props) {
    const q = (searchParams?.q ?? '').trim()
    const page = Math.max(1, Number(searchParams?.page ?? '1') || 1)
    const take = Math.min(48, Math.max(8, Number(searchParams?.take ?? '24') || 24))
    const skip = (page - 1) * take

    if (!q || q.length < 2) {
        return (
            <main className="min-h-screen bg-gray-100 px-6 py-8">
                <h1 className="text-gray-800 text-xl font-semibold">Buscar</h1>
                <p className="text-gray-600 mt-2">
                    Escribe al menos 2 caracteres para buscar
                </p>
            </main>
        )
    }

    const { productos, total } = await searchProducts(q, take, skip)
    const totalPages = Math.max(1, Math.ceil(total / take))

    return (
        <>
            <Nav categories={[]} />
            <main className="min-h-screen bg-gray-100 px-6 py-8 mt-16">
                <div className="flex flex-row gap-2 mb-6">
                    <div>

                        <h1 className="text-gray-600 text-xl font-semibold">
                            Resultados para: <span className="font-bold">“{q}”</span>
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {total} resultado(s) — Página {page} de {totalPages}
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/"
                            className="inline-block text-center bg-white text-red-700 font-semibold py-1 px-2 rounded-full shadow-lg border-2 text-[13px]  border-red-700 hover:bg-red-700 hover:text-white transition-all duration-300 transform hover:scale-105"
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                </div>

                {productos.length === 0 ? (
                    <div className="text-gray-700">No se encontraron productos</div>
                ) : (
                    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productos.map((p) => (
                            <div key={p.id}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}

                {/* paginación SEO-friendly */}
                <div className="flex items-center justify-between mt-10">
                    <Link
                        href={`/buscar?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}&take=${take}`}
                        className={`px-4 py-2 rounded-lg border text-[15px] sm:text-[16px] lg:text-[17px] ${page <= 1 ? 'pointer-events-none opacity-50 bg-white' : 'color-red-bg text-white hover:bg-gray-50 cursor-pointer font-semibold'
                            }`}
                    >
                        ← Anterior
                    </Link>

                    <Link
                        href={`/buscar?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}&take=${take}`}
                        className={`px-4 py-2 rounded-lg border text-[15px] sm:text-[16px] lg:text-[17px] ${page >= totalPages ? 'pointer-events-none opacity-50 bg-white' : 'color-blue-footer-bg text-white hover:bg-gray-50 cursor-pointer font-semibold'
                            }`}
                    >
                        Siguiente →
                    </Link>
                </div>
            </main>
        </>
    )
}
