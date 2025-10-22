'use client'
import Link from 'next/link'

export default function AdminNav() {

    const logout = () => {
        // Eliminar datos del usuario y token del almacenamiento local y cookies
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/';
        document.cookie = 'role=; Max-Age=0; path=/';
        window.location.href = '/admin/login';
    };

    return (
        <header className="px-10 py-5 color-blue-footer-bg flex justify-between a">
            <div className="flex gap-5 text-white items-center">
                <h1 className="text-center font-bold text-[16px] sm:text-[17px] lg:text-lg tracking-wide">Panel de Administración</h1>
            </div>

            <div className="flex gap-3 items-center">
                <Link
                    href={'/admin/sales/products'}
                    className="rounded text-white font-bold p-2 hover:text-gray-300 transition-colors text-[14px] sm:text-[16px] lg:text-[17px]"
                >
                    Productos
                </Link>

                <Link
                    href={'/admin/sales'}
                    className="rounded text-white font-bold p-2 hover:text-gray-300 transition-colors text-[15px] sm:text-[16px] lg:text-[17px]"
                >
                    Ventas
                </Link>

                <Link
                    href={'/'}
                    className="rounded bg-green-400 font-bold py-1 px-4 sm:py-2 sm:px-5 lg:py-2 lg:px-6 hover:bg-green-500 transition-all text-gray-50"
                >
                    Tienda
                </Link>

                <button
                    onClick={logout}
                    className="rounded bg-red-600 text-white font-bold py-2 px-6 hover:bg-red-700 transition-all"
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}
