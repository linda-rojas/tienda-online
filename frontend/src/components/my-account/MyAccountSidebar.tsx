'use client';

import Link from 'next/link';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import type { ActiveTab } from '@/types/my-account';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';

type Props = {
    activeTab: ActiveTab;
    setActiveTab: (t: ActiveTab) => void;
    usuarioNombre: string;
    avatarUrl?: string | null;
    uploadingAvatar?: boolean;
    onUploadAvatar?: (file: File) => Promise<void>;
};

export default function MyAccountSidebar({
    activeTab,
    setActiveTab,
    usuarioNombre,
    avatarUrl,
    uploadingAvatar,
    onUploadAvatar,
}: Props) {

    const fileRef = useRef<HTMLInputElement | null>(null);

    const pickFile = () => fileRef.current?.click();

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUploadAvatar) return;

        await onUploadAvatar(file);
        e.target.value = '';
    };

    return (
        <div className="w-[50%] bg-white text-white shadow-lg p-4 sm:p-6 lg:p-6 rounded-l-lg color-blue-footer-bg">
            {/* avatar con overlay */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-4xl text-gray-600">
                        {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUserCircle />
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={pickFile}
                        disabled={uploadingAvatar}
                        className="
                        absolute -bottom-1 -right-1
                        w-9 h-9 rounded-full
                        bg-blue-900 text-white
                        flex items-center justify-center
                        shadow-lg
                        hover:bg-blue-950 transition
                        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                        "
                        title="Cambiar foto"
                    >
                        <FaCamera className="text-sm" />
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />
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
                        location.href = '/admin/login';
                    }}
                >
                    Cerrar sesión
                </Link>
            </div>
        </div>
    );
}
