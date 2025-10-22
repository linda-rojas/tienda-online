import { Transaction } from "@/schemas/schemas"
import { formatCOP } from "@/utils/format-currency"
import Image from "next/image"

export default function TransactionSummary({ transaction }: { transaction: Transaction }) {

    return (
        <>
            <div className='mb-6  text-sm font-medium text-gray-500 border border-gray-200'>
                <p className='text-sm font-black text-gray-900 p-2 bg-gray-200 '>ID: {transaction.id}</p>
                <ul
                    role="list"
                    className="divide-y divide-gray-200 border-t border-gray-200 border-b"
                >
                    {transaction.contents.map((item) => (
                        <li className="p-5 ">
                            <div className='flex items-center space-x-6 '>
                                <div className='relative'>
                                    <figure className="w-32 h-32">

                                        <Image
                                            src={item.producto.imagen_url || '/product-notFound.png'}
                                            alt={item.producto.nombre}
                                            className='absolute'
                                            fill
                                        />
                                    </figure>
                                </div>
                                <div className="flex-auto space-y-1 ">
                                    <h3 className="text-gray-900">{item.producto.nombre}</h3>
                                    <p className="text-lg font-extrabold  text-gray-900">{formatCOP(+item.producto.precio)}</p>
                                    <p className="text-lg  text-gray-900">Cantidad: {item.cantidad}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <dl className="space-y-6  text-sm font-medium text-gray-500 p-5">
                    {transaction.cupon && (
                        <>
                            <div className="flex justify-between">
                                <dt>Cupón Utilizado</dt>
                                <dd className="text-gray-900">{transaction.cupon}</dd>
                            </div>

                            <div className="flex justify-between">
                                <dt>Descuento</dt>
                                <dd className="text-gray-900">- {formatCOP(+ transaction.descuento)}</dd>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between">
                        <dt className="text-lg text-black font-black">Total</dt>
                        <dd className="text-lg text-black font-black">{formatCOP(+ transaction.total)}</dd>
                    </div>
                </dl>
            </div>
        </>
    )
}