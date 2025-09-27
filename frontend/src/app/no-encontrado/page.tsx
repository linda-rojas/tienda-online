'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NotFound() {
    const router = useRouter()

    // Redirección automática a los 8 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/')
        }, 12000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <main className="max-h-screen flex flex-col items-center justify-center text-gray-500 px-4 pt-[30px] text-center">
            <Image
                src="/404-illustration2.webp"
                alt="Página no encontrada"
                width={250}
                height={250}
                className="mb-6"
                priority
            />
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">¡Página no encontrada!</h1>
            <p className="text-sm lg:text-lg mb-6">
                No pudimos encontrar la página que buscabas. Puede que la categoría no exista o que
                hayas escrito mal la dirección.
            </p>

            <button
                onClick={() => router.push('/')}
                className="color-red-bg px-5 py-2 lg:px-6 lg:py-3 text-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition mb-2"
            >
                Regresar a la tienda
            </button>

            <p className="text-sm">Serás redirigido automáticamente en 12 segundos...</p>
        </main>
    )
}
