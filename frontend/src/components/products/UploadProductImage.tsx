'use client'
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { uploadImage } from '../actions/upload-images-action';
import Image from 'next/image';


type ImageType = 'primary' | 'secondary' | 'gallery'

type DraftImage = {
  file: File
  previewUrl: string
  type: 'primary' | 'secondary' | 'gallery'
}


export default function UploadProductImage({ productId }: { productId: number }) {

  const [images, setImages] = useState<DraftImage[]>([])

  console.log('images', images);


  const onDrop = useCallback((files: File[]) => {
    if (images.length + files.length > 5) {
      alert('Solo puedes subir hasta 5 imágenes.')
      return
    }

    const newImages: DraftImage[] = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: images.length === 0 ? 'primary' : 'gallery', // primera primary
    }))

    setImages(prev => [...prev, ...newImages])
  }, [images])



  // Función para manejar el cambio de tipo de imagen
  const handleTypeChange = (index: number, newType: ImageType) => {
    setImages(prev =>
      prev.map((img, i) => {
        // liberar el tipo si ya existe en otra imagen
        if (
          (newType === 'primary' || newType === 'secondary') &&
          img.type === newType &&
          i !== index
        ) {
          return { ...img, type: 'gallery' }
        }

        if (i === index) {
          return { ...img, type: newType }
        }

        return img
      })
    )
  }

  // ❌ Eliminar imagen
  const removeImage = (index: number) => {
    setImages(prev => {
      const img = prev[index]
      URL.revokeObjectURL(img.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } =
    useDropzone({
      accept: {
        'image/jpeg': ['.jpg'],
        'image/png': ['.png'],
      },
      onDrop,
      maxFiles: 5,
      multiple: true,
    })

  return (
    <>
      {/* DROPZONE */}
      <div className="space-y-1">
        <label className="block text-md font-bold text-gray-700">
          Imágenes del Producto
        </label>

        <div
          {...getRootProps({
            className: `
              py-20 border-2 border-dashed text-center transition
              ${isDragActive
                ? 'border-gray-900 bg-gray-200 text-gray-900'
                : 'border-gray-400 bg-white text-gray-400'
              }
              ${isDragReject ? 'border-red-500 text-red-500' : ''}
            `,
          })}
        >
          <input {...getInputProps()} />
          {isDragAccept && <p>Suelta la imagen</p>}
          {isDragReject && <p>Archivo no válido</p>}
          {!isDragActive && <p>Arrastra y suelta imágenes aquí</p>}
        </div>
      </div>

      {/* PREVIEW */}
      {images.length > 0 && (
        <div className="py-5 space-y-3">
          <p className="font-bold">Imágenes seleccionadas:</p>

          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="w-[260px] h-[180px] relative border rounded">
                <Image
                  src={image.previewUrl}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-contain"
                />

                {/* ❌ Eliminar */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                {/* Tipo */}
                <select
                  value={image.type}
                  onChange={(e) =>
                    handleTypeChange(index, e.target.value as ImageType)
                  }
                  className="absolute bottom-2 left-2 bg-white text-sm p-1 rounded shadow"
                >
                  <option value="primary">Principal</option>
                  <option value="secondary">Secundaria</option>
                  <option value="gallery">Galería</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INPUT OCULTO PARA SUBMIT */}
      {/* <input
        type="hidden"
        name="images"
        value={JSON.stringify(
          images.map(({ type }) => ({ type }))
        )}
      /> */}

      {/* SUBMIT IMÁGENES */}
      {images.map((image, indexImage) => (
        <div key={`image-${indexImage}`} className='hidden'>
          <input
            type="hidden"
            name={`images[${indexImage}][file]`}
            value={image.file as any}
          />

          <input
            type="hidden"
            name={`images[${indexImage}][type]`}
            value={image.type}
          />
        </div>
      ))}
    </>
  )
}
