import { Header } from '@/ui/mainNav/Header'
import { CategoriesResponseSchemas } from '@/schemas/schemas'
import Footer from './footer'

export default async function FooterServer() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`, {
        cache: 'no-store', //  datos siempre frescos
    })

    if (!res.ok) {
        console.error('Error cargando categorías')
        return <Footer categories={[]} />
    }

    const json = await res.json()
    const categories = CategoriesResponseSchemas.parse(json)

    return <Footer categories={categories} />
}
