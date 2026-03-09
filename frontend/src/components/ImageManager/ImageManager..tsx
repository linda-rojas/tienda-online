'use client';
import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import Image from 'next/image'

interface ImageData {
  id: number;
  file?: File;
  url: string;
}

interface ImageManagerProps<T extends ImageData> {
  images: T[];
  limit?: number;
  uploading: boolean;
  handleUpload: () => void;
  hideUploadButton?: boolean;
  removeImage?: (index: number) => void;
  addImages?: (files: T[]) => void;
  renderCard?: (image: T) => React.ReactNode;
}

const defaultLimit = 5;

const defaultConfigDropzone = {
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  multiple: true,
};

export const ImageManager = <T extends ImageData>(props: ImageManagerProps<T>) => {
  const {
    images,
    limit = defaultLimit,
    uploading,
    handleUpload,
    hideUploadButton = false,
    removeImage,
    addImages,
    renderCard,
  } = props;

  console.log('inside');

  const onDrop = useCallback(
    (files: File[]) => {
      const totalImages = images.length + files.length;
      if (totalImages > limit) {
        toast.error(`Solo puedes subir hasta ${limit} imágenes.`);
        return;
      }

      const imagesToSave = files.map((file) => ({
        id: 0, // Genera un ID único basado en el timestamp
        file,
        url: URL.createObjectURL(file), // Crea una URL temporal para mostrar la imagen
      }));

      addImages?.(imagesToSave as T[]);
    },
    [images, limit, addImages]
  );

  const configDropzone = useMemo(
    () => ({
      ...defaultConfigDropzone,
      onDrop,
      maxFiles: limit,
    }),
    [onDrop, limit]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone(configDropzone);

  const handleRemoveImage = useCallback(
    (index: number) => {
      const imageToRemove = images[index];
      if (imageToRemove.file) {
        URL.revokeObjectURL(imageToRemove.url); // Libera la URL temporal
      }
      removeImage?.(index);
    },
    [images, removeImage]
  );

  return (
    <>
      <div className="space-y-1 mt-7">
        <label className="block text-md font-bold text-gray-700">
          Gestión de Imágenes
        </label>

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

      {images.length > 0 && (
        <div className="py-5 space-y-3 mt-4 text-gray-700">
          <p className="font-bold">Imágenes del Producto:</p>

          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="w-[260px] h-[180px] relative border rounded">
                <Image src={image.url} alt={`Imagen ${index + 1}`} fill className="object-contain" />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                {renderCard?.(image as T)}
              </div>
            ))}
          </div>

          {/* {!hideUploadButton && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {uploading ? 'Subiendo...' : 'Subir imágenes'}
            </button>
          )} */}
        </div>
      )}
    </>
  )
}