import { FaSearch } from 'react-icons/fa';
import { MenuIcon } from '@/components/mobile/MenuIcon';
import { MobileMenuPanel } from '@/components/mobile/MobileMenuPanel';
import { LogoAutocaucho } from './LogoAutoCaucho';
import { CartIcon } from '@/components/cart/CartIcon';
import { CartPanel } from '@/components/cart/CartPanel';
import { Category } from '@/schemas/schemas';
import AccountLink from '@/components/ui/AccountLinkDesktop';

interface NavProps {
    categories: Category[];
}

export function Nav({ categories }: NavProps) {

    return (
        <nav className="w-full fixed top-0 z-50 color-red-bg flex items-center justify-between px-6 p-2 md:px-6 lg:px-12">
            <MenuIcon />
            <MobileMenuPanel categories={categories} />
            <LogoAutocaucho />
            <div className="color-gray-md-bg hidden rounded-[10px] md:relative md:block md:top-0 lg:block">
                <input
                    type="text"
                    placeholder="Buscar producto"
                    className="color-gray-md color-gray-sm rounded-[10px] p-[5px] pl-6 focus:outline-blue-500 bg-white sm:w-[400px]"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 underline" />
            </div>
            <section className="flex justify-center items-center gap-8 md:gap-3 lg:gap-8">
                <AccountLink />
                <CartIcon />
                <CartPanel />
            </section>
        </nav>
    );
}
