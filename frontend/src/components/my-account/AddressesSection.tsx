'use client';

import type { Direccion } from '@/types/my-account';

type Props = {
    usuarioData: any;
    onOpenAdd: () => void;
    onOpenDelete: (id: number) => void;
};

export default function AddressesSection({ usuarioData, onOpenAdd, onOpenDelete }: Props) {
    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-[16px] sm:text-[18px] lg:text-xl text-gray-700">Direcciones</h3>

                <button
                    type="button"
                    onClick={onOpenAdd}
                    className="w-full sm:w-auto cursor-pointer px-2 sm:px-3 md:px-3 lg:px-4 py-2 rounded-xl bg-blue-900 text-white font-semibold text-[11px] sm:text-sm transition"
                >
                    Agregar dirección
                </button>
            </div>

            <div className="mt-4">
                {usuarioData.direcciones?.map((direccion: Direccion, index: number) => (
                    <div
                        key={direccion.id ?? index}
                        className="flex flex-col gap-3 mb-4 border-1 border-[#023D71] p-4 rounded-lg bg-gray-50 shadow text-gray-700"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span className="font-normal text-[14px] sm:text-[16px] lg:text-[17px]">Dirección - {index + 1}</span>

                            <div className="flex sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => onOpenDelete(direccion.id)}
                                    className="w-full sm:w-auto text-[11px] sm:text-[14px] px-2 sm:px-3 py-2 rounded-lg color-red-bg text-white font-semibold transition cursor-pointer"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        <p className="flex flex-col justify-between">
                            <strong className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Dirección:</strong>
                            <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{direccion.direccion}</span>
                        </p>

                        <p className="flex flex-col justify-between">
                            <strong className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Ciudad:</strong>
                            <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{direccion.ciudad}</span>
                        </p>

                        <p className="flex flex-col justify-between">
                            <strong className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Departamento:</strong>
                            <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{direccion.departamento}</span>
                        </p>

                        <p className="flex flex-col justify-between">
                            <strong className="font-semibold text-[14px] sm:text-[16px] lg:text-[17px]">Celular:</strong>
                            <span className="ml-3 text-[14px] sm:text-[15px] lg:text-[16px]">{direccion.celular}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
