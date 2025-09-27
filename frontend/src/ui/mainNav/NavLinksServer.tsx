import { CategoriesResponseSchemas } from '@/schemas/schemas'
import { NavLinksClient } from './NavLinksClient'

export default async function NavLinksServer() {
    const res = await fetch('http://localhost:3000/categorias')
    const json = await res.json()
    const categories = CategoriesResponseSchemas.parse(json)

    return <NavLinksClient categories={categories} />
}
