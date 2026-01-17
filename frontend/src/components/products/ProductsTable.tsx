import { ProductForm } from "@/schemas/schemas"
import { formatCOP } from "@/utils/format-currency"
import Image from "next/image"
import Link from "next/link"
import DeleteProductForm from "./DeleteProductForm"
import { getImagePath } from "@/utils/get-image-path"

export default function ProductsTable({ products }: { products: ProductForm[] }) {

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-10">
            <div className="mt-8 flow-root ">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5 ">
                        <table className="min-w-full divide-y divide-gray-300 ">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3  text-center text-sm font-semibold text-gray-800 sm:pl-0">
                                        Imagen
                                    </th>

                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-800 sm:pl-0">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-800">
                                        Precio
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-800">
                                        Inventario
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-center">
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Image
                                                src={getImagePath(
                                                    product.imagenes?.find(img => img.type === 'primary')?.url ||
                                                    product.imagenes?.[0]?.url ||
                                                    '/product-notFound.png'
                                                )}
                                                alt={product.nombre}
                                                width={140}
                                                height={140}
                                                priority
                                            />
                                        </td>
                                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {product.nombre}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            {formatCOP(product.precio)}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
                                            <div className='flex gap-5 justify-end items-center'>
                                                <Link className="text-blue-800 hover:text-indigo-800 cursor-pointer"
                                                    href={`/admin/sales/products/${product.id}/edit`}>
                                                    Editar <span className="sr-only">, {product.nombre}</span>
                                                </Link>

                                                <DeleteProductForm
                                                    productId={product.id}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}