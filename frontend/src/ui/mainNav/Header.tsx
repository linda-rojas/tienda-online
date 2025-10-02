import { FaUser, FaSearch } from 'react-icons/fa'
import { LogoAutocaucho } from './LogoAutoCaucho'
import { montserrat } from '../fonts'
import NavLinksServer from './NavLinksServer'
import { CartIcon } from '@/components/cart/CartIcon'
import { CartPanel } from '@/components/cart/CartPanel'
import { NavLinksClient } from './NavLinksClient'
import { MobileMenuPanel } from '@/components/mobile/MobileMenuPanel'
import { MenuIcon } from '@/components/mobile/MenuIcon'
import { Category } from '@/schemas/schemas'

interface HeaderProps {
    categories: Category[]
}

export function Header({ categories }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50">
            <nav
                className={`color-red-bg flex items-center justify-between px-6 p-2 md:px-6 lg:px-12`}
            >
                {' '}
                <MenuIcon />
                <MobileMenuPanel categories={categories} />
                <LogoAutocaucho />
                <div
                    className={`color-gray-md-bg hidden rounded-[10px] md:relative md:block md:top-0 lg:block`}
                >
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        className={`color-gray-md color-gray-sm rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white sm:w-[400px]`}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 underline" />
                </div>
                <section className="flex justify-center items-center gap-8 md:gap-3 lg:gap-8">
                    <div className="hidden items-center gap-2 cursor-pointer md:flex md:gap-1 lg:flex ">
                        <span
                            className={`${montserrat.className} text-white text-center md:hidden lg:flex`}
                        >
                            Mi cuenta
                        </span>
                        <FaUser className="h-5 w-5 text-white" />
                    </div>
                    <CartIcon />
                    <CartPanel />
                </section>
            </nav>
            <section className={`color-blue-bg h-[50px] w-full flex items-center justify-center `}>
                <div
                    className={`color-gray-md-bg relative rounded-[10px] w-[60%] md:hidden lg:hidden`}
                >
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        className={`color-gray-md color-gray-sm w-full rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white md:w-[400px] lg:hidden`}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 underline" />
                </div>
                <NavLinksServer Component={NavLinksClient} />
            </section>
        </header>
    )
}
