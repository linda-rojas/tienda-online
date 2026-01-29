import { FaSearch } from 'react-icons/fa'
import { LogoAutocaucho } from './LogoAutoCaucho'
import { CartIcon } from '@/components/cart/CartIcon'
import { CartPanel } from '@/components/cart/CartPanel'
import { NavLinksClient } from './NavLinksClient'
import { MobileMenuPanel } from '@/components/mobile/MobileMenuPanel'
import { MenuIcon } from '@/components/mobile/MenuIcon'
import { Category } from '@/schemas/schemas'
import AccountLinkDesktop from '@/components/ui/AccountLinkDesktop'
import NavLinksServer from '@/server/NavLinksServer'
import ProductSearchBar from '../search/ProductSearchBar'


interface HeaderProps {
    categories: Category[]
}

export function Header({ categories }: HeaderProps) {
    return (
        <header id="site-header" className="sticky top-0 z-50">
            <nav
                className={`color-red-bg flex items-center justify-between px-6 p-2 md:px-6 lg:px-12`}
            >
                {' '}
                <MenuIcon />
                <MobileMenuPanel categories={categories} />
                <LogoAutocaucho />
                {/* Search para desktop */}
                <ProductSearchBar
                    className="hidden md:block fixed left-6 right-6 z-[9999]"
                    inputClassName="color-gray-md color-gray-sm rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white sm:w-[400px]"
                />

                <section className="flex justify-center items-center gap-8 md:gap-3 lg:gap-8">
                    <AccountLinkDesktop />
                    <CartIcon />
                    <CartPanel />
                </section>
            </nav>
            <section className={`color-blue-bg h-[50px] w-full flex items-center justify-center `}>
                {/* Search para mobile */}
                <ProductSearchBar
                    className="md:hidden fixed left-3 right-3 z-[9999]"
                    inputClassName="color-gray-md color-gray-sm w-full rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white"
                />
                <NavLinksServer Component={NavLinksClient} />
            </section>
        </header>
    )
}