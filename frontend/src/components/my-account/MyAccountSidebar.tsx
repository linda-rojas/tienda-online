'use client';

import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import type { ActiveTab } from '@/types/my-account';

type Props = {
    activeTab: ActiveTab;
    setActiveTab: (t: ActiveTab) => void;
    usuarioNombre: string;
};

export default function MyAccountSidebar({ activeTab, setActiveTab, usuarioNombre }: Props) {
    return (
        <div className="w-[50%] bg-white text-white shadow-lg p-4 sm:p-6 lg:p-6 rounded-l-lg color-blue-footer-bg">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-600">
                    <FaUserCircle />
                </div>
            </div>

            <div className="flex flex-col items-center text-[16px] sm:text-[18px] lg:text-xl">
                <h2 className="text-center font-semibold">¡Bienvenido!</h2>
                <h3 className="text-center font-semibold">{usuarioNombre}</h3>
            </div>

            <div className="mt-6 space-y-4">
                <div
                    className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === 'perfil' ? 'bg-gray-500' : ''
                        }`}
                    onClick={() => setActiveTab('perfil')}
                >
                    Perfil
                </div>

                <div
                    className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === 'direcciones' ? 'bg-gray-500' : ''
                        }`}
                    onClick={() => setActiveTab('direcciones')}
                >
                    Direcciones
                </div>

                <div
                    className={`p-2 cursor-pointer hover:bg-gray-500 rounded text-[15px] sm:text-[16px] lg:text-[17px] ${activeTab === 'compras' ? 'bg-gray-500' : ''
                        }`}
                    onClick={() => setActiveTab('compras')}
                >
                    Mis compras
                </div>
            </div>

            <div className="mt-12 text-center w-full">
                <Link
                    href="/"
                    className="bg-red-700 hover:bg-red-800 text-white font-medium sm:font-semibold lg:font-semibold py-2 px-2 lg:px-4 rounded-lg text-[12px] md:text-[15px] sm:text-[15px] lg:text-[17px]"
                    onClick={() => {
                        localStorage.removeItem('usuario');
                        localStorage.removeItem('token');
                        document.cookie = 'token=; Max-Age=0; path=/';
                        document.cookie = 'role=; Max-Age=0; path=/';
                    }}
                >
                    Cerrar sesión
                </Link>
            </div>
        </div>
    );
}
