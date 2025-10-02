import { CategoriesResponseSchemas } from '@/schemas/schemas'
interface DynamicComponentProps {
    Component: React.ElementType
}

export default async function NavLinksServer({ Component }: DynamicComponentProps) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`, {
        cache: 'no-store',
    })
    const json = await res.json()
    const categories = CategoriesResponseSchemas.parse(json)

    return <Component categories={categories} />
}
