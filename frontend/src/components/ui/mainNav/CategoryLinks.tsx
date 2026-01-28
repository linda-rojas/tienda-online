'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Category } from '@/schemas/schemas'
import { IoMdArrowDropdown } from 'react-icons/io'
import { montserrat } from '../../../ui/fonts'
import CategoryLinksSkeleton from '../skeletons/CategoryLinksSkeleton'


interface Props {
    categories: Category[]
    variant?: 'mobile' | 'desktop'
    onClick?: () => void // opcional, para cerrar el panel móvil
    isLoading?: boolean
}

export function CategoryLinks({ categories, variant = 'desktop', onClick, isLoading = false }: Props) {
    const pathname = usePathname()

    if (isLoading) return <CategoryLinksSkeleton variant={variant} />;

    return (
        <ul
            className={
                variant === 'mobile'
                    ? 'flex flex-col gap-4 p-4'
                    : ' items-center md:gap-6 md:w-full md:justify-around md:flex lg:flex lg:justify-center lg:gap-12'
            }
        >
            {categories.map((category) => {
                const isActive = pathname === `/${category.id}`

                return (
                    <li key={category.id}>
                        <Link
                            href={`/${category.id}`}
                            onClick={onClick}
                            className={
                                variant === 'mobile'
                                    ? `block px-3 py-2 rounded-md font-semibold transition-colors ${isActive
                                        ? 'text-blue-600 bg-gray-200 max-w-fit ml-4 border-blue-600 border'
                                        : 'text-gray-600 hover:bg-gray-300 max-w-fit'
                                    }`
                                    : `${montserrat.className} ${isActive
                                        ? 'text-white border-2 border-white p-1 rounded-md'
                                        : ''
                                    } hidden items-center gap-2 font-semibold cursor-pointer hover:text-[17px] hover:p-1 hover:border-2 hover:border-white hover:rounded-md border-transparent transition-all duration-300 ease-in-out md:flex md:gap-1 lg:flex`
                            }
                        >
                            {variant === 'desktop' ? (
                                <>
                                    <span className="text-white text-center">
                                        {category.nombre}
                                    </span>
                                    <IoMdArrowDropdown className="h-5 w-5 text-white" />
                                </>
                            ) : (
                                category.nombre
                            )}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}