import { Header } from '@/components/ui/mainNav/Header'
import { CategoriesResponseSchemas } from '@/schemas/schemas'

export default async function HeaderServer() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`, {
        cache: 'no-store', //  datos siempre frescos
    })

    if (!res.ok) {
        console.error('Error cargando categorías')
        return <Header categories={[]} />
    }

    const json = await res.json()
    const categories = CategoriesResponseSchemas.parse(json)

    return <Header categories={categories} />
}
