'use client'
import { IoMdArrowDropdown } from 'react-icons/io'
import { montserrat } from '../ui/fonts'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
    {
        name: 'REFRIGERANTES',
        icon: IoMdArrowDropdown,
        href: '/panel/categorias/Refrigerantes',
    },
    {
        name: 'SUSPENCIÓN',
        icon: IoMdArrowDropdown,
        href: '/panel/categorias/Suspencion',
    },
    {
        name: 'SOPORTES',
        icon: IoMdArrowDropdown,
        href: '/panel/categorias/Soportes',
    },
    {
        name: 'RODAMIENTO',
        icon: IoMdArrowDropdown,
        href: '/panel/categorias/Rodamiento',
    },
    {
        name: 'CARBURACIÓN',
        icon: IoMdArrowDropdown,
        href: '/panel/categorias/Carburacion',
    },
]

export function NavLinks() {
    const pathname = usePathname()

    return (
        <div className="hidden md:w-full md:flex md:justify-around lg:flex lg:justify-center lg:gap-12 lg:px-6">
            {links.map((product) => {
                const Icon = product.icon

                const isActive = pathname === product.href
                return (
                    <Link
                        key={product.href}
                        href={product.href}
                        className={`${montserrat.className} ${
                            isActive ? 'text-white border-2 border-white p-1 rounded-md' : ''
                        } hidden items-center gap-2 font-semibold cursor-pointer hover:text-[17px] hover:p-1 hover:border-2 hover:border-white hover:rounded-md border-transparent transition-all duration-300 ease-in-out md:flex md:gap-1 lg:flex `}
                    >
                        <span className={`${montserrat.className} text-white text-center`}>
                            {product.name}
                        </span>
                        <Icon className="h-5 w-5 text-white" />
                    </Link>
                )
            })}
        </div>
    )
}
