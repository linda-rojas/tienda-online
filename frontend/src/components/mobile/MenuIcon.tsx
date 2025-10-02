'use client'
import { useMenuToggle } from '@/hooks/useMenuToggle'
import { IoMenu } from 'react-icons/io5'

export function MenuIcon() {
    const { toggleMenu } = useMenuToggle()

    return (
        <button
            onClick={toggleMenu} // Al hacer clic, se abre o cierra el menú
            className="flex md:hidden lg:hidden text-white z-50"
            aria-label="Abrir menú móvil"
        >
            <IoMenu className="h-9 w-9 cursor-pointer" />
        </button>
    )
}
