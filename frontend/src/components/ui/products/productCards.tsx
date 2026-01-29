import { Product } from '@/schemas/schemas'
import { formatCOP } from '@/utils/format-currency'
import ProductImage from './ProductImage'
import AddProductButton from './AddProductButton'

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="w-[230px] h-[388px] flex flex-col gap-1 justify-center rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <div>
                <ProductImage product={product} />
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
                <AddProductButton product={product} />
            </div>
        </div>
    )
}
