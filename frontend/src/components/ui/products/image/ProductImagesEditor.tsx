'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { changeProductImageType, deleteProductImage } from '@/components/actions/product-images-action'


type ImageType = 'primary' | 'secondary' | 'gallery'

type ProductImage = {
    id: number
    url: string
    type: ImageType
}

export default function ProductImagesEditor({
    productId,
    images,
    onChangeSuccess,
}: {
    productId: number
    images: ProductImage[]
    onChangeSuccess?: () => Promise<void>
}) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const handleChangeType = async (imageId: number, newType: ImageType) => {
        try {
            setLoadingId(imageId)
            await changeProductImageType(productId, imageId, newType)
            if (onChangeSuccess) {
                await onChangeSuccess()
            }
            toast.success('Tipo actualizado ✅', { autoClose: 2000 })
            // router.refresh()
        } catch (e: any) {
            toast.error(e?.message || 'Error cambiando tipo')
        } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = async (imageId: number) => {
        const ok = confirm('¿Eliminar esta imagen?')
        if (!ok) return

        try {
            setLoadingId(imageId)
            await deleteProductImage(productId, imageId)
            if (onChangeSuccess) {
                await onChangeSuccess()
            }
            toast.success('Imagen eliminada ✅', { autoClose: 2000 })
            // router.refresh()
        } catch (e: any) {
            toast.error(e?.message || 'Error eliminando imagen')
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="mt-6 space-y-3">
            <p className="font-bold text-gray-700">Imágenes actuales</p>

            <div className="flex flex-wrap gap-4">
                {images.map((img) => (
                    <div key={img.id} className="w-[240px] border rounded p-2 bg-white">
                        <div className="relative h-[150px] rounded overflow-hidden border">
                            <Image src={img.url} alt={`Imagen ${img.id}`} fill className="object-contain" />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <select
                                value={img.type}
                                disabled={loadingId === img.id}
                                onChange={(e) => handleChangeType(img.id, e.target.value as ImageType)}
                                className="border p-2 rounded text-sm w-full"
                            >
                                <option value="primary">Principal</option>
                                <option value="secondary">Secundaria</option>
                                <option value="gallery">Galería</option>
                            </select>

                            <button
                                type="button"
                                disabled={loadingId === img.id}
                                onClick={() => handleDelete(img.id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded disabled:opacity-60"
                            >
                                {loadingId === img.id ? 'Cargando...' : 'Eliminar'}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            ID: {img.id}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-500">
                Reglas: Debes sellecionar 1 Principal, 1 Secundaria y el resto como Galería. Si seleccionas otro tipo, se actualizará automáticamente.
            </p>
        </div>
    )
}
