'use client'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import type { Category, Product } from '@/schemas/schemas'
import { addProduct } from '@/components/actions/add-product-action'
import { UpdateProduct } from '@/components/actions/update-product-action'
import ProductFieldsForm from './ProductFieldsForm'
import UploadProductImage from '@/components/ui/products/image/UploadProductImage'
import ProductImagesEditor from '@/components/ui/products/image/ProductImagesEditor'

type Props = {
    categories: Category[]
    product?: Product
}

type Step = 1 | 2 | 3

export default function ProductWizardModal({ categories, product }: Props) {
    const isEdit = !!product?.id
    const [open, setOpen] = useState(true)
    const [step, setStep] = useState<Step>(1)
    const [currentImages, setCurrentImages] = useState(product?.imagenes ?? []);


    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [])


    // En create: se llena después de crear en paso 1
    const [createdProductId, setCreatedProductId] = useState<number | null>(product?.id ?? null)

    const productId = createdProductId

    const reloadImages = async () => {
        if (!productId) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-images/${productId}`
        );

        if (res.ok) {
            const data = await res.json();
            setCurrentImages(data);
        }
    };


    const title = isEdit ? `Editar producto #${product?.id}` : 'Nuevo producto'

    // Paso 1: guardar (create) o actualizar (edit)
    const handleStep1Submit = async (formData: FormData) => {
        try {
            if (!isEdit) {
                // Crear producto
                const res = await addProduct({ errors: [], success: '' }, formData)
                if (res.errors?.length) {
                    res.errors.forEach((e) => toast.error(e))
                    return
                }
                setCreatedProductId(res.productId!)
                setStep(2)
                return
            }

            // Editar producto
            if (!productId) {
                toast.error('No se encontró el ID del producto.')
                return
            }

            const res = await UpdateProduct(productId, { errors: [], success: '' }, formData)


            if (res.errors?.length) {
                res.errors.forEach((e) => toast.error(e))
                return
            }

            toast.success('Producto actualizado ✅', { autoClose: 1800 })
            setStep(2)
        } catch (err: any) {
            toast.error(err?.message || 'Error guardando producto')
        }
    }

    const close = () => setOpen(false)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={close} />

            {/* modal */}
            <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <p className="text-sm text-gray-500">{isEdit ? 'Modo edición' : 'Modo creación'}</p>
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="rounded px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {/* stepper */}
                <div className="px-6 py-3 border-b bg-gray-50 flex gap-2 text-sm">
                    <StepPill active={step === 1} label="1. Datos" />
                    <StepPill active={step === 2} label="2. Imágenes" />
                    <StepPill active={step === 3} label="3. Resumen" />
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 && (
                        <ProductFieldsForm
                            categories={categories}
                            product={product}
                            onSubmit={handleStep1Submit}
                            submitLabel="Siguiente"
                            note={!isEdit ? 'Al continuar se crea el producto para poder subir imágenes.' : undefined}
                        />
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            {!productId ? (
                                <p className="text-sm text-gray-500">
                                    Primero guarda el producto para subir imágenes.
                                </p>
                            ) : (
                                <>
                                    <UploadProductImage
                                        productId={productId}
                                        existingTypes={{
                                            hasPrimary: currentImages.some(i => i.type === 'primary'),
                                            hasSecondary: currentImages.some(i => i.type === 'secondary'),
                                        }}
                                        onUploadSuccess={reloadImages}
                                    />

                                    {productId ? (
                                        <ProductImagesEditor
                                            productId={productId}
                                            images={currentImages}
                                            onChangeSuccess={reloadImages}
                                        />

                                    ) : null}

                                </>
                            )}

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="rounded bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200"
                                >
                                    Atrás
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!productId) {
                                            toast.warning('Primero crea/guarda el producto.')
                                            return
                                        }
                                        setStep(3)
                                    }}
                                    className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}


                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded border p-4 bg-gray-50">
                                <p className="font-bold text-gray-700 mb-2">Resumen</p>

                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li><b>Nombre:</b> {product?.nombre}</li>
                                    <li><b>Subtítulo:</b> {product?.subtitulo}</li>
                                    <li><b>Descripción:</b> {product?.descripcion}</li>
                                    <li><b>Precio:</b> {product?.precio}</li>
                                    <li><b>Descuento:</b> {product?.descuento}</li>
                                    <li><b>Stock:</b> {product?.stock}</li>
                                    <li><b>Categoría ID:</b> {String(product?.categoriaId ?? '')}</li>
                                    <li><b>Imágenes:</b> {product?.imagenes?.length ?? 0}</li>
                                </ul>
                            </div>

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="rounded bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200"
                                >
                                    Atrás
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        toast.success(isEdit ? 'Cambios guardados ✅' : 'Producto listo ✅', { autoClose: 1800 })
                                        close()
                                    }}
                                    className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                                >
                                    {isEdit ? 'Guardar producto' : 'Finalizar'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

function StepPill({ active, label }: { active: boolean; label: string }) {
    return (
        <span
            className={`px-3 py-1 rounded-full border text-xs font-semibold ${active ? 'bg-white text-gray-900' : 'bg-transparent text-gray-500'
                }`}
        >
            {label}
        </span>
    )
}
