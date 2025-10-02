'use client'
import { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useMenuToggle } from '@/hooks/useMenuToggle'
import { Category } from '@/schemas/schemas'
import { CategoryLinks } from '@/ui/mainNav/CategoryLinks'

interface Props {
    categories: Category[]
}

export function MobileMenuPanel({ categories }: Props) {
    const { isOpen, closeMenu } = useMenuToggle()

    useEffect(() => {
        const handlePopState = () => {
            closeMenu()
        }

        if (isOpen) {
            history.pushState(null, '', location.href)
            window.addEventListener('popstate', handlePopState)
        }

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [isOpen, closeMenu])

    if (!isOpen) return null

    return (
        <>
            {/* Panel lateral */}
            <div
                className={`fixed top-[65px] right-0 z-50 w-full h-screen bg-white shadow-lg overflow-y-auto transition-all ${isOpen ? '' : '-translate-x-full '} flex flex-col gap-2 font-semibold w-full h-full md:hidden lg:hidden`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-400">
                    <span className="font-bold text-lg text-gray-700">Menú</span>
                    <IoClose
                        className="w-7 h-7 cursor-pointer text-red-700"
                        onClick={closeMenu}
                        aria-label="Cerrar menú móvil"
                    />
                </div>
                <div className="px-4">
                    {/* Aquí renderizamos las categorías */}
                    <CategoryLinks categories={categories} variant="mobile" onClick={closeMenu} />
                </div>
                <div className="border-b border-gray-200"></div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent bg-opacity-40 z-30 md:hidden lg:hidden"
                    onClick={closeMenu}
                />
            )}
        </>
    )
}
