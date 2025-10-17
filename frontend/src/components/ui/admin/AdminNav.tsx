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
        <header className="px-10 py-5 bg-blue-900 flex justify-between">
            <div className="flex gap-5 text-white">
                <h1 className="font-bold text-lg tracking-wide">Panel de Administración</h1>
            </div>

            <div className="flex gap-3 items-center">
                <Link
                    href={'/admin/products'}
                    className="rounded text-white font-bold p-2 hover:text-gray-300 transition-colors"
                >
                    Productos
                </Link>

                <Link
                    href={'/admin/sales'}
                    className="rounded text-white font-bold p-2 hover:text-gray-300 transition-colors"
                >
                    Ventas
                </Link>

                <Link
                    href={'/'}
                    className="rounded bg-green-400 font-bold py-2 px-6 hover:bg-green-500 transition-all"
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
