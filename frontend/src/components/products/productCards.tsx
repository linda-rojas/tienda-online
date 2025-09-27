import { Product } from '@/schemas/schemas'
import { formatCOP } from '@/utils/format-currency'
import ProductImage from './ProductImage'

export default function ProductCard({ product }: { product: Product }) {
    // console.log(`Producto: ${product.nombre}, Descuento: ${product.descuento}`)

    return (
        <div className="w-[230px] h-[388px] flex flex-col gap-1 justify-center rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <div>
                <ProductImage product={product} />
                {/* <div className="relative overflow-visible h-45 w-full z-0">
                    <Image
                        src={product.imagen_url ?? '/product-notFound.png'}
                        alt={product.nombre}
                        fill
                        priority
                        className={`rounded-t-lg object-contain cursor-pointer transition-opacity duration-500 ${
                            product.imagen_url2 ? 'group-hover:opacity-0' : ''
                        }`}
                    />
                    {(product.descuento ?? 0) > 0 && (
                        <div className="color-blue-footer-bg absolute w-max transform top-[-5] right-0 text-[12px] text-white font-semibold px-3 py-[2px] shadow-lg z-10 rounded-tl rounded-bl">
                            ¡{product.descuento}% descuento!
                        </div>
                    )}
                </div> */}
            </div>
            <div className="px-4">
                <h3 className="text-[14px] font-bold text-gray-800 mb-2">{product.nombre}</h3>
                <p className="text-[13px] text-gray-600 mb-2 overflow-hidden font-medium text-ellipsis whitespace-nowrap max-w-full">
                    {product.subtitulo}
                </p>
                <div className="flex flex-col items-start space-x-3 mb-2">
                    {(product.descuento ?? 0) > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatCOP(product.precio)}
                        </span>
                    )}

                    <span className="color-red text-lg font-semibold">
                        {formatCOP(
                            (product.descuento ?? 0) > 0
                                ? product.precio - (product.precio * (product.descuento ?? 0)) / 100
                                : product.precio
                        )}
                    </span>
                </div>
                <button className="color-red-bg hover-bg-red w-full text-white py-[6px] rounded-lg  transition duration-200 cursor-pointer font-medium text-[14px]">
                    Agregar al carrito
                </button>
            </div>
        </div>
    )
}
