'use client';

import type { Transaccion } from '@/types/my-account';

type Props = {
    transacciones: Transaccion[];
};

export default function PurchasesSection({ transacciones }: Props) {
    return (
        <div>
            <h3 className="font-semibold text-gray-700 text-[16px] sm:text-[18px] lg:text-xl">Mis Compras</h3>

            <div className="mt-4">
                {transacciones.length > 0 ? (
                    transacciones.map((transaccion, index) => (
                        <div key={index} className="border p-4 mb-4 rounded-lg shadow text-gray-700">
                            <p className="text-sm">
                                <strong className="font-semibold mr-2">Fecha:</strong>
                                {new Date(transaccion.transaccionDate).toLocaleDateString()}
                            </p>

                            <p className="text-sm">
                                <strong className="font-semibold mr-2">Total:</strong>${transaccion.total}
                            </p>

                            <p className="text-sm">
                                <strong className="font-semibold mr-2">Cupón de descuento:</strong>
                                {transaccion.cupon || 'Sin cupón'}
                            </p>

                            <p className="text-sm font-semibold mt-4">Productos:</p>
                            <ul className="list-disc list-inside text-sm ml-2">
                                {transaccion.contents?.map((item: any, i: number) => (
                                    <li key={i}>
                                        {item.producto?.nombre} — {item.cantidad} × ${item.precio}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No hay compras aún.</p>
                )}
            </div>
        </div>
    );
}
