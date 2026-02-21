'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Category } from '@/schemas/schemas'
import { addProduct } from '@/components/actions/add-product-action'
import { uploadImage } from '@/components/actions/upload-images-action'
import UploadProductImage, { DraftImage } from '../../ui/products/image/UploadProductImage'
import { UpdateProduct } from '@/components/actions/update-product-action'


type ImageType = 'primary' | 'secondary' | 'gallery'

type ProductDraft = {
    nombre: string
    subtitulo: string
    descripcion: string
    precio: string
    descuento: string
    stock: string
    categoryId: string
}

const initialDraft: ProductDraft = {
    nombre: '',
    subtitulo: '',
    descripcion: '',
    precio: '',
    descuento: '',
    stock: '',
    categoryId: '',
}

export default function ProductWizardCreateModal({
    categories,
}: {
    categories: Category[]
}) {
    const router = useRouter()

    // Wizard
    const [open, setOpen] = useState(true)
    const [step, setStep] = useState<1 | 2 | 3>(1)
    // const [uploadFn, setUploadFn] = useState<null | (() => Promise<void>)>(null)


    // Paso 1: datos
    const [draft, setDraft] = useState<ProductDraft>(initialDraft)

    // Al crear en backend necesitamos el id
    const [productId, setProductId] = useState<number | null>(null)

    // Paso 2: imágenes (controladas por wizard)
    const [draftImages, setDraftImages] = useState<DraftImage[]>([])
    const [uploading, setUploading] = useState(false)

    // Paso 2: ya subió imágenes?
    const [imagesUploaded, setImagesUploaded] = useState(false)

    // ==========================
    // Helpers
    // ==========================
    const canGoNextFromStep1 = useMemo(() => {
        // validación mínima UI (la real la hace el server action)
        return (
            draft.nombre.trim().length > 0 &&
            draft.subtitulo.trim().length > 0 &&
            draft.descripcion.trim().length > 0 &&
            Number(draft.precio) > 0 &&
            Number(draft.stock) > 0 &&
            String(draft.categoryId).trim().length > 0
        )
    }, [draft])

    const closeModal = () => {
        setOpen(false)
        router.push('/admin/sales/products?page=1')
        router.refresh()
    }

    const handleFinalize = async () => {
        if (!productId) {
            toast.error('Primero crea el producto.')
            setStep(1)
            return
        }

        try {
            setUploading(true)

            // 1) Asegurar que lo del paso 1 queda actualizado
            const fd = new FormData()
            fd.set('nombre', draft.nombre)
            fd.set('subtitulo', draft.subtitulo)
            fd.set('descripcion', draft.descripcion)
            fd.set('precio', draft.precio)
            fd.set('stock', draft.stock)
            fd.set('descuento', draft.descuento || '0')
            fd.set('categoriaId', draft.categoryId)

            const updateRes = await UpdateProduct(productId, { errors: [], success: '' }, fd)
            if (updateRes.errors?.length) {
                updateRes.errors.forEach((e) => toast.error(e))
                setUploading(false)
                return
            }

            // 2) Subir imágenes SI el admin seleccionó
            if (draftImages.length > 0) {
                const primaries = draftImages.filter((i) => i.type === 'primary').length
                const secondaries = draftImages.filter((i) => i.type === 'secondary').length

                if (primaries !== 1) {
                    toast.error('Debes tener exactamente 1 imagen Principal.')
                    setUploading(false)
                    setStep(2)
                    return
                }
                if (secondaries > 1) {
                    toast.error('Solo puedes tener 1 imagen Secundaria.')
                    setUploading(false)
                    setStep(2)
                    return
                }

                const payload = draftImages.map((img) => ({ file: img.file, type: img.type }))
                await uploadImage(productId, payload)
            }

            toast.success('Producto guardado ✅', { autoClose: 1500 })
            closeModal() // redirige a ProductsPage
        } catch (e: any) {
            toast.error(e?.message || 'Error finalizando')
        } finally {
            setUploading(false)
        }
    }

    // ==========================
    // Paso 2: Subir imágenes y continuar (SIN uploadFn)
    // ==========================
    const handleUploadImagesAndContinue = async () => {
        if (!productId) {
            toast.error('Primero crea el producto (Paso 1).')
            setStep(1)
            return
        }

        if (draftImages.length === 0) {
            toast.warning('Selecciona al menos una imagen.')
            return
        }

        const primaries = draftImages.filter((i) => i.type === 'primary').length
        const secondaries = draftImages.filter((i) => i.type === 'secondary').length

        if (primaries !== 1) return toast.error('Debes tener exactamente 1 imagen Principal.')
        if (secondaries > 1) return toast.error('Solo puedes tener 1 imagen Secundaria.')

        try {
            setUploading(true)

            const payload = draftImages.map((img) => ({ file: img.file, type: img.type as ImageType }))
            await uploadImage(productId, payload)

            setImagesUploaded(true)
            toast.success('Imágenes subidas ✅', { autoClose: 1200 })
            setStep(3)
        } catch (e: any) {
            toast.error(e?.message || 'Error subiendo imágenes')
        } finally {
            setUploading(false)
        }
    }




    // Evitar scroll bloqueado del body cuando modal esté abierto
    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    // ==========================
    // Paso 1: Crear producto
    // ==========================
    const handleCreateAndContinue = async () => {
        if (!canGoNextFromStep1) {
            toast.error('Completa todos los campos obligatorios antes de continuar.')
            return
        }

        try {
            // Armamos FormData tal como esperan tus actions
            const fd = new FormData()
            fd.set('nombre', draft.nombre)
            fd.set('subtitulo', draft.subtitulo)
            fd.set('descripcion', draft.descripcion)
            fd.set('precio', draft.precio)
            fd.set('stock', draft.stock)
            fd.set('descuento', draft.descuento || '0')
            fd.set('categoriaId', draft.categoryId)

            // ✅ Si NO hay productId → creamos (POST)
            if (!productId) {
                const res = await addProduct({ errors: [], success: '' }, fd)

                if (res.errors?.length) {
                    res.errors.forEach((e) => toast.error(e))
                    return
                }

                if (!res.productId) {
                    toast.error('No se pudo obtener el ID del producto.')
                    return
                }

                setProductId(res.productId)
                toast.success('Producto creado ✅ Ahora agrega imágenes', { autoClose: 1500 })
                setStep(2)
                return
            }

            // ✅ Si YA hay productId → actualizamos (PATCH) y seguimos
            const updateRes = await UpdateProduct(productId, { errors: [], success: '' }, fd)

            if (updateRes.errors?.length) {
                updateRes.errors.forEach((e) => toast.error(e))
                return
            }

            toast.success('Cambios actualizados ✅', { autoClose: 1200 })
            setStep(2)
        } catch (e: any) {
            toast.error(e?.message || 'Error guardando cambios')
        }
    }

    // ==========================
    // UI
    // ==========================
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <p className="text-sm text-gray-500">Crear producto</p>
                        <h2 className="text-lg font-bold text-gray-800">
                            Paso {step} de 3
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                    >
                        Cerrar
                    </button>
                </div>

                {/* Content (scroll del modal, no del body) */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
                    {step === 1 && (
                        <div className="space-y-4">
                            <Field
                                label="Nombre Producto"
                                value={draft.nombre}
                                onChange={(v) => setDraft((p) => ({ ...p, nombre: v }))}
                            />
                            <Field
                                label="Subtitulo Producto"
                                value={draft.subtitulo}
                                onChange={(v) => setDraft((p) => ({ ...p, subtitulo: v }))}
                            />
                            <Textarea
                                label="Descripción"
                                value={draft.descripcion}
                                onChange={(v) => setDraft((p) => ({ ...p, descripcion: v }))}
                            />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Precio"
                                    type="number"
                                    value={draft.precio}
                                    onChange={(v) => setDraft((p) => ({ ...p, precio: v }))}
                                />
                                <Field
                                    label="Descuento"
                                    type="number"
                                    value={draft.descuento}
                                    onChange={(v) => setDraft((p) => ({ ...p, descuento: v }))}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Inventario"
                                    type="number"
                                    value={draft.stock}
                                    onChange={(v) => setDraft((p) => ({ ...p, stock: v }))}
                                />
                                <Select
                                    label="Categoría"
                                    value={draft.categoryId}
                                    onChange={(v) => setDraft((p) => ({ ...p, categoryId: v }))}
                                    options={[
                                        { value: '', label: 'Seleccionar Categoría' },
                                        ...categories.map((c) => ({ value: String(c.id), label: c.nombre })),
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Regla: Debes tener <b>1 Principal</b>, <b>1 Secundaria</b> (opcional) y el resto <b>Galería</b>.
                            </p>

                            {/* Aquí usamos UploadProductImage en modo controlado */}
                            <UploadProductImage
                                productId={productId ?? 0}
                                value={draftImages}
                                onChange={setDraftImages}
                                hideUploadButton
                                autoClearAfterUpload={false}
                            />

                            {!productId && (
                                <p className="text-sm text-red-600">
                                    ⚠️ Aún no existe el producto. Regresa al paso 1 y créalo.
                                </p>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5">
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <p className="font-bold text-gray-700">Resumen</p>

                                <div className="mt-3 space-y-2 text-sm text-gray-700">
                                    <Row label="Nombre" value={draft.nombre} />
                                    <Row label="Subtítulo" value={draft.subtitulo} />
                                    <Row label="Descripción" value={draft.descripcion} />
                                    <Row label="Precio" value={draft.precio} />
                                    <Row label="Descuento" value={draft.descuento || '0'} />
                                    <Row label="Stock" value={draft.stock} />
                                    <Row
                                        label="Categoría"
                                        value={
                                            categories.find((c) => String(c.id) === String(draft.categoryId))?.nombre || ''
                                        }
                                    />
                                    <Row label="ID Producto" value={productId ? String(productId) : '-'} />
                                </div>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="font-bold text-gray-700">Imágenes</p>

                                {!imagesUploaded ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        ⚠️ Aún no has subido imágenes. Regresa al paso 2.
                                    </p>
                                ) : draftImages.length === 0 ? (
                                    <p className="mt-2 text-sm text-gray-500">
                                        (No hay previews en memoria. Si quieres verlas aquí, no borres el estado.)
                                    </p>
                                ) : (
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {draftImages.map((img, idx) => (
                                            <div key={idx} className="w-[160px] rounded border bg-white p-2">
                                                {/* previewUrl es local */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img.previewUrl} alt="preview" className="h-[90px] w-full object-contain" />
                                                <p className="mt-2 text-xs text-gray-600">Tipo: <b>{img.type}</b></p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (step === 1) return
                            setStep((s) => (s === 2 ? 1 : 2))
                        }}
                        className="rounded border px-4 py-2 text-sm font-bold text-gray-700"
                    >
                        Atrás
                    </button>

                    {step === 1 && (
                        <button
                            type="button"
                            onClick={handleCreateAndContinue}
                            disabled={!canGoNextFromStep1 || uploading}
                            className="rounded bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                            {uploading ? 'Guardando...' : 'Siguiente'}
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            type="button"
                            onClick={handleUploadImagesAndContinue}
                            disabled={!productId || uploading}
                            className="rounded bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                            {uploading ? 'Subiendo...' : 'Subir imágenes y continuar'}
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            type="button"
                            onClick={handleFinalize}
                            disabled={uploading}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                            {uploading ? 'Finalizando...' : 'Finalizar'}
                        </button>
                    )}
                </div>


            </div>
        </div>
    )

}

// =========================
// Mini componentes UI
// =========================

function Field({
    label,
    value,
    onChange,
    type = 'text',
}: {
    label: string
    value: string
    onChange: (v: string) => void
    type?: string
}) {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-gray-600">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-gray-700"
            />
        </div>
    )
}

function Textarea({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-gray-600">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[10rem] w-full resize-none rounded border border-gray-300 p-2 text-gray-700"
            />
        </div>
    )
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
}) {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-gray-600">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="text-right">{value}</span>
        </div>
    )
}
