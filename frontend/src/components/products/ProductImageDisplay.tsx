'use client'
import { useState } from 'react'
import Image from 'next/image'

type ProductImageDisplayProps = {
  imagen_url: string | null
  imagen_url2: string | null
  nombre: string
}

const ProductImageDisplay = ({ imagen_url, imagen_url2, nombre }: ProductImageDisplayProps) => {
  // Estado para manejar la imagen principal mostrada
  const [currentImage, setCurrentImage] = useState(imagen_url ?? '/product-notFound.png')

  // Función para manejar el cambio de imagen
  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
      setCurrentImage(imageUrl)
    }
  }

  return (
    <div>
      {/* Imagen tamaño grandee */}
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
      <div className="flex space-x-2 justify-center mb-6">
        {/* Imagen principal (miniatura) */}
        <div
          className={`w-20 h-20 cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden transition-opacity ${
            currentImage === imagen_url ? '' : 'opacity-50'
          }`}
          onClick={() => handleImageClick(imagen_url ?? '')}
        >
          <Image
            src={imagen_url ?? '/product-notFound.png'}
            alt={nombre}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        {/* Imagen secundaria (miniatura), solo si existe */}
        {imagen_url2 && (
          <div
          className={`w-20 h-20 cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden transition-opacity ${
            currentImage === imagen_url2 ? '' : 'opacity-50'
          }`}
            onClick={() => handleImageClick(imagen_url2)}
          >
            <Image
              src={imagen_url2}
              alt={nombre}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductImageDisplay
