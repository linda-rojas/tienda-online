'use client'
import { Category } from '@/schemas/schemas'
import { CategoryLinks } from './CategoryLinks'

export function NavLinksClient({ categories }: { categories: Category[] }) {
    return (
        <div className="md:w-full md:flex md:justify-around lg:flex lg:justify-center lg:gap-12">
            <nav className="flex flex-row gap-6 flex-wrap lg:gap-12">
                <CategoryLinks categories={categories} variant="desktop" isLoading={!categories.length} />
            </nav>
        </div>
    )
}
