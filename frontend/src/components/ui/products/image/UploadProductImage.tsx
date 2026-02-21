'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage } from '../../../actions/upload-images-action'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

type ImageType = 'primary' | 'secondary' | 'gallery'

export type DraftImage = {
  file: File
  previewUrl: string
  type: ImageType
}


export default function UploadProductImage({
  productId,
  value,
  onChange,
  hideUploadButton = false,
  autoClearAfterUpload = true,
  existingTypes,
  onUploadSuccess,
}: {
  productId: number
  value?: DraftImage[]  // Controlado
  onChange?: (imgs: DraftImage[]) => void
  hideUploadButton?: boolean
  autoClearAfterUpload?: boolean,
  existingTypes?: {
    hasPrimary: boolean
    hasSecondary: boolean
  },
  onUploadSuccess?: () => Promise<void>
}) {

  const router = useRouter()
  const [images, setImages] = useState<DraftImage[]>([])
  const [uploading, setUploading] = useState(false)

  const isControlled = Array.isArray(value) && typeof onChange === 'function'
  const imagesState = (isControlled ? value! : images)

  // Detectar tipos existentes en DB (modo edición)
  // const dbHasPrimary = existingTypes?.hasPrimary ?? false
  // const dbHasSecondary = existingTypes?.hasSecondary ?? false

  // // Detectar tipos en draft actual
  // const draftHasPrimary = imagesState.some(i => i.type === 'primary')
  // const draftHasSecondary = imagesState.some(i => i.type === 'secondary')

  // Bloqueo inteligente:
  // Solo bloquear si ya existe en DB y no lo estamos reemplazando en draft
  const blockPrimary = existingTypes?.hasPrimary ?? false; // Bloquear si ya hay una imagen primary
  const blockSecondary = existingTypes?.hasSecondary ?? false; // Bloquear si ya hay una imagen secondary



  // Mantener las imágenes previas con useRef
  const imagesRef = useRef<DraftImage[]>(imagesState)

  useEffect(() => {
    // Establecer las imágenes cuando el componente se monta
    if (value) {
      setImages(value)
      imagesRef.current = value
    }
  }, [value])  // Actualizar cuando 'value' cambia

  const setImagesState = useCallback(
    (next: DraftImage[] | ((prev: DraftImage[]) => DraftImage[])) => {
      // Si el estado es controlado (con onChange), pasamos las imágenes al parent
      if (!isControlled) {
        setImages(next as any)
        return
      }

      const base = imagesRef.current
      const resolved = typeof next === 'function' ? (next as any)(base) : next
      onChange!(resolved)
    },
    [isControlled, onChange]
  )

  // Normaliza las imágenes, asegurándose de que sólo haya 1 'primary' y 1 'secondary'
  const normalizeTypes = (list: DraftImage[]): DraftImage[] => {
    const copy = [...list]

    if (copy.length > 0 && !copy.some(i => i.type === 'primary')) {
      copy[0] = { ...copy[0], type: 'primary' }
    }

    if (copy.length > 1 && !copy.some(i => i.type === 'secondary')) {
      const idx = copy.findIndex(i => i.type !== 'primary')
      if (idx >= 0) copy[idx] = { ...copy[idx], type: 'secondary' }
    }

    let primaryUsed = false
    let secondaryUsed = false

    return copy.map((img) => {
      if (img.type === 'primary') {
        if (primaryUsed) return { ...img, type: 'gallery' }
        primaryUsed = true
        return img
      }
      if (img.type === 'secondary') {
        if (secondaryUsed) return { ...img, type: 'gallery' }
        secondaryUsed = true
        return img
      }
      return img
    })
  }

  const onDrop = useCallback((files: File[]) => {
    setImagesState((prev: DraftImage[]) => {
      if (prev.length + files.length > 5) {
        toast.error('Solo puedes subir hasta 5 imágenes.');
        return prev;
      }

      const hasPrimary = prev.some((i) => i.type === 'primary');
      const hasSecondary = prev.some((i) => i.type === 'secondary');

      let assignedPrimary = hasPrimary;
      let assignedSecondary = hasSecondary;

      const newImages: DraftImage[] = files.map((file) => {
        let type: ImageType = 'gallery'; // Por defecto 'gallery'
        if (!assignedPrimary) {
          type = 'primary';
          assignedPrimary = true;
        } else if (!assignedSecondary) {
          type = 'secondary';
          assignedSecondary = true;
        }

        return { file, previewUrl: URL.createObjectURL(file), type };
      });

      // Añadir las nuevas imágenes al estado, pero no borrar las anteriores
      return normalizeTypes([...prev, ...newImages]);
    });
  }, [setImagesState]);



  const handleTypeChange = (index: number, newType: ImageType) => {
    setImagesState((prev) => {
      const next = prev.map((img, i): DraftImage => {
        // Si ya existe una imagen con este tipo, y la nueva es diferente, la pasamos a 'gallery'
        if (newType === 'primary' && prev.some(i => i.type === 'primary')) {
          img.type = 'gallery';
        }
        if (newType === 'secondary' && prev.some(i => i.type === 'secondary')) {
          img.type = 'gallery';
        }

        // Luego, actualizamos la imagen seleccionada
        if (i === index) return { ...img, type: newType };
        return img;
      });

      return normalizeTypes(next);  // Normaliza las imágenes para mantener las reglas de solo 1 primary y 1 secondary
    });
  };

  const removeImage = (index: number) => {
    setImagesState((prev: DraftImage[]) => {
      const img = prev[index]
      if (img) URL.revokeObjectURL(img.previewUrl)

      const next = prev.filter((_, i) => i !== index)
      return normalizeTypes(next)
    })
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    onDrop,
    maxFiles: 5,
    multiple: true,
  })

  const handleUpload = async (): Promise<void> => {
    if (!productId) { toast.error('Primero guarda el producto'); return }
    if (imagesState.length === 0) { toast.warning('Selecciona al menos una imagen'); return }

    const primaries = imagesState.filter(i => i.type === 'primary').length
    const secondaries = imagesState.filter(i => i.type === 'secondary').length

    if (primaries !== 1) { toast.error('Debes tener exactamente 1 imagen Principal (primary).'); return }
    if (secondaries > 1) { toast.error('Solo puedes tener 1 imagen Secundaria (secondary).'); return }

    const payload = imagesState.map((img) => ({ file: img.file, type: img.type }))

    try {
      setUploading(true)
      await uploadImage(productId, payload)

      if (onUploadSuccess) {
        await onUploadSuccess();
      }

      toast.success('Imágenes subidas ✅', { autoClose: 2500 })

      if (autoClearAfterUpload) {
        imagesState.forEach((img) => URL.revokeObjectURL(img.previewUrl))
        setImagesState([])
      }

      if (!isControlled) router.refresh()
    } catch (e: any) {
      toast.error(e?.message || 'Error subiendo imágenes')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="space-y-1">
        <label className="block text-md font-bold text-gray-700">Imágenes del Producto</label>

        <div
          {...getRootProps({
            className: `
              py-16 border-2 border-dashed text-center transition rounded cursor-pointer
              ${isDragActive ? 'border-gray-900 bg-gray-200 text-gray-900' : 'border-gray-300 bg-white text-gray-600'}
              ${isDragReject ? 'border-red-500 text-red-500' : ''}
            `,
          })}
        >
          <input {...getInputProps()} />
          {isDragAccept && <p className="font-semibold">Suelta las imágenes</p>}
          {isDragReject && <p className="font-semibold">Archivo no válido</p>}
          {!isDragActive && (
            <>
              <p className="font-semibold">Arrastra y suelta imágenes aquí</p>
              <p className="text-sm text-gray-500 mt-2">
                o <span className="text-blue-800 underline">haz clic para seleccionarlas</span>
              </p>
            </>
          )}
        </div>
      </div>

      {imagesState.length > 0 && (
        <div className="py-5 space-y-3">
          <p className="font-bold">Imágenes seleccionadas:</p>

          <div className="flex flex-wrap gap-4">
            {imagesState.map((image, index) => (
              <div key={index} className="w-[260px] h-[180px] relative border rounded">
                <Image src={image.previewUrl} alt={`Imagen ${index + 1}`} fill className="object-contain" />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <select
                  value={image.type}
                  onChange={(e) => handleTypeChange(index, e.target.value as ImageType)}
                  className="absolute bottom-2 left-2 bg-white text-sm p-1 rounded shadow"
                  disabled={blockPrimary || blockSecondary} // Deshabilitamos las opciones si ya hay una imagen primary/secondary
                >
                  <option value="primary" disabled={blockPrimary}>
                    Principal {blockPrimary ? '(ya existe)' : ''}
                  </option>

                  <option value="secondary" disabled={blockSecondary}>
                    Secundaria {blockSecondary ? '(ya existe)' : ''}
                  </option>

                  <option value="gallery">
                    Galería
                  </option>
                </select>

              </div>
            ))}
          </div>

          {!hideUploadButton && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {uploading ? 'Subiendo...' : 'Subir imágenes'}
            </button>
          )}
        </div>
      )}
    </>
  )
}
