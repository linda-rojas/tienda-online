'use client'
import { useState } from 'react'
import Image from 'next/image'

type ProductImageDisplayProps = {
  imagenes: { url: string | null; type: string }[] // Asegúrate de que las imágenes y su tipo estén bien definidos
  nombre: string
}

const ProductImageDisplay = ({ imagenes, nombre }: ProductImageDisplayProps) => {
  // Estado para manejar la imagen seleccionada (principal por defecto)
  const [currentImage, setCurrentImage] = useState(
    imagenes.find(img => img.type === 'primary')?.url || // Primero intenta con la imagen primaria
    imagenes.find(img => img.type === 'secondary')?.url || // Si no, intenta con la secundaria
    imagenes.find(img => img.type === 'gallery')?.url || // Si no, intenta con la de galería
    '/product-notFound.png' // Si no hay imágenes disponibles, usa la imagen de no encontrado
  )

  // Función para manejar el cambio de imagen
  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl) // Actualiza la imagen mostrada
  }

  // Filtramos las imágenes según su tipo
  const primaryImage = imagenes.find(img => img.type === 'primary')
  const secondaryImages = imagenes.filter(img => img.type === 'secondary')
  const galleryImages = imagenes.filter(img => img.type === 'gallery')

  return (
    <div>
      {/* Imagen principal (tamaño grande) */}
      <div className="relative w-[70%] md:w-[80%] lg:w-[80%] h-[400px] mx-auto flex justify-center mb-4">
        <Image
          src={currentImage}
          alt={nombre}
          fill
          className="object-contain rounded-lg shadow-lg"
          priority
        />
      </div>

      {/* Contenedor de las miniaturas */}
      <div className="flex space-x-2 justify-center mb-6 relative">
        {/* Imagen principal (miniatura) */}
        {primaryImage && (
          <div
            className={`w-20 h-20 relative cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden transition-opacity ${currentImage === primaryImage.url ? '' : 'opacity-50'
              }`}
            onClick={() => handleImageClick(primaryImage.url ?? '')}
          >
            <Image
              src={primaryImage.url ?? '/product-notFound.png'}
              alt={nombre}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Imagen secundaria */}
        {secondaryImages.map((image, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden transition-opacity ${currentImage === image.url ? '' : 'opacity-50'
              }`}
            onClick={() => handleImageClick(image.url ?? '')}
          >
            <Image
              src={image.url ?? '/product-notFound.png'}
              alt={nombre}
              fill
              className="object-contain"
            />
          </div>
        ))}

        {/* Imagen de galería (miniatura) */}
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`w-20 h-20 relative cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden transition-opacity ${currentImage === image.url ? '' : 'opacity-50'
              }`}
            onClick={() => handleImageClick(image.url ?? '')}
          >
            <Image
              src={image.url ?? '/product-notFound.png'}
              alt={nombre}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImageDisplay
