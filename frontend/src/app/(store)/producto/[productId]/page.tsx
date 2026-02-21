import AddProductButton from '@/components/ui/products/AddProductButton'
import { formatCOP } from '@/utils/format-currency'
import { getProduct, getCategory } from '@/services/categories/categories.service'
import ProductImageDisplay from '@/components/ui/products/image/ProductImageDisplay'
import HeaderServer from '@/components/ui/mainNav/HeaderServer'
import FooterServer from '@/components/footer/foooterServer'

type Params = Promise<{ productId: string }>

export default async function ProductDetailPage({ params }: { params: Params }) {
    const { productId } = await params
    const product = await getProduct(productId)
    const category = await getCategory(product.categoriaId)

    const images = (product.imagenes ?? []).map(img => ({
        url: img.url ?? '/product-notFound.png',
        type: img.type ?? 'primary',
    }));

    return (
        <>
            <HeaderServer />
            <div className="max-w-7xl mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-gray-800">
                <div>
                    <ProductImageDisplay
                        imagenes={images}
                        nombre={product.nombre}
                    />
                </div>
                <div className="flex flex-col gap-12 bg-gray-100 p-6">
                    <h1 className="text-2xl font-bold ">{product.nombre}</h1>
                    <article className="flex flex-col gap-6">
                        <span className="font-semibold text-[20px] text-gray-700">
                            Descripción del Producto:{' '}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
                    </article>
                </div>
                <div className="w-full flex flex-col gap-6 text-gray-800 bg-gray-100 p-4">
                    <article className="flex flex-col gap-2">
                        <span className="font-bold  text-[18px]">Referencia: </span>
                        <span className="ml-10 text-[15px]">{product.subtitulo}</span>
                    </article>
                    <article className="flex flex-col gap-2">
                        <span className="font-bold text-[18px]">Categoría: </span>
                        <span className="ml-10">{category.nombre}</span>
                    </article>
                    <div className="flex flex-row justify-between gap-4 w-[80%] md:w-[90%] lg:w-[90%]">
                        <span className="font-bold text-[18px]">Precio: </span>
                        <div>

                            {product.descuento ? (
                                <span className="block text-gray-500 line-through">
                                    Antes: {formatCOP(product.precio)}
                                </span>
                            ) : null}
                            <div className='flex gap-3'>
                                <span className="text-[18px] font-semibold text-red-700">
                                    {formatCOP(
                                        product.descuento
                                            ? product.precio - (product.precio * product.descuento) / 100
                                            : product.precio
                                    )}
                                </span>
                                {product.descuento && (
                                    <span className="color-blue-footer-bg text-[14px] text-white font-semibold px-3 py-[1px] shadow-lg rounded">
                                        ¡{product.descuento}% de descuento!
                                    </span>
                                )}

                            </div>
                        </div>
                    </div>
                    {/* Stock */}
                    <div className="flex flex-row gap-4 text-gray-700">
                        <span className="text-sm font-bold">Stock disponible:</span>
                        <span className="font-semibold text-red-700">{product.stock}</span>
                    </div>
                    {/* Botón carrito */}
                    <aside className="w-full flex justify-center text-center">
                        <div className="w-[50%]">
                            <AddProductButton product={product} />
                        </div>
                    </aside>
                </div>
            </div>
            <FooterServer />
        </>
    )
}
