'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IoMdArrowDropdown } from 'react-icons/io'
import { montserrat } from '../fonts'
import { Category } from '@/schemas/schemas'

export function NavLinksClient({ categories }: { categories: Category[] }) {
    const pathname = usePathname()

    return (
        <div className="md:w-full md:flex md:justify-around lg:flex lg:justify-center lg:gap-12">
            <nav className="flex flex-row gap-6 flex-wrap lg:gap-12">
                {categories.map((category) => {
                    const isActive = pathname === `/${category.id}`

                    return (
                        <Link
                            key={category.id}
                            href={`/${category.id}`}
                            className={`${montserrat.className} ${
                                isActive ? 'text-white border-2 border-white p-1 rounded-md' : ''
                            } hidden items-center gap-2 font-semibold cursor-pointer hover:text-[17px] hover:p-1 hover:border-2 hover:border-white hover:rounded-md border-transparent transition-all duration-300 ease-in-out md:flex md:gap-1 lg:flex `}
                        >
                            <span className="text-white text-center">{category.nombre}</span>
                            <IoMdArrowDropdown className="h-5 w-5 text-white" />
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
