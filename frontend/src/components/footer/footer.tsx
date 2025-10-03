'use client'
import { IoLogoYoutube } from 'react-icons/io5'
import { FaFacebookSquare, FaInstagramSquare, FaWhatsapp } from 'react-icons/fa'
import { LiaAtomSolid } from 'react-icons/lia'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Category } from '@/schemas/schemas'

interface Props {
    categories: Category[]
}

const nosotros = [
    { name: 'Quiénes somos', link: '/info-sobre-nosotros/quienes-somos' },
    { name: 'Misión y Visión', link: '/info-sobre-nosotros/quienes-somos' },
    { name: 'Contáctenos', link: 'https://wa.me/' },
    { name: 'Términos y Condiciones', link: '/info-sobre-nosotros/legal/terminos-condiciones' },
    { name: 'Política de privacidad', link: '/info-sobre-nosotros/legal/politica-privacidad' },
]

const infoContacto = [
    { label: 'Dirección', value: 'Cra 1 N° 6 - 30 La Pola - La Plata - Huila' },
    { label: 'Correo', value: 'soporte@autocauchos.com' },
]

export default function Footer({ categories }: Props) {
    const pathname = usePathname()
    return (
        <footer className="w-full bg-gray-200 text-gray-800">
            <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 gap-10 text-center place-items-center">
                <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-4 text-justify">Sobre nosotros</h3>
                    <ul className="space-y-2 flex flex-col text-justify">
                        {nosotros.map((item) => (
                            <li key={item.name}>
                                <Link href={item.link} className="cursor-pointer hover:font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-4 text-justify">Enlaces rápidos</h3>
                    <ul className="space-y-2 text-justify">
                        {categories.map((category) => {
                            const isActive = pathname === `/${category.id}`
                            return(
                            <Link key={category.id} href={`/${category.id}`} className={`flex hover:font-bold  
                                ${isActive
                                    ? 'font-semibold text-[#023D71]'
                                    : ''} `}>{category.nombre}</Link>
                        )})}
                    </ul>
                </div>

                {/* Columna 3 - Contacto */}
                <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-4 text-justify">
                        Información de contacto
                    </h3>
                    <div className="flex flex-col justify-center text-center">
                        <p className="flex items-center gap-3 mb-3">
                        <span className="font-semibold">Cel: </span>
                            <FaWhatsapp className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">+57 321 576 ....</span>
                        </p>
                        <ul className="space-y-2 text-justify">
                            {infoContacto.map((item) => (
                                <li key={item.label}>
                                    <span className="font-bold">{item.label}: </span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Columna 4 - Redes sociales */}
                <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-4">Síguenos</h3>
                    <div className="flex gap-4 cursor-pointer">
                        <a aria-label="Facebook">
                            <FaFacebookSquare className="h-8 w-8 hover:text-blue-600" />
                        </a>
                        <a aria-label="Instagram">
                            <FaInstagramSquare className="h-8 w-8 hover:text-pink-500" />
                        </a>
                        <a aria-label="YouTube">
                            <IoLogoYoutube className="h-8 w-8 hover:text-red-600" />
                        </a>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-blue-500 mb-2">Hecho por</h4>
                        <div className="flex items-center gap-2">
                            <p className="font-bold">LR</p>
                            <LiaAtomSolid className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Línea de pago */}
            <div className="bg-blue-900 text-white py-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
                    <h3 className="text-lg font-bold">Formas de pago</h3>
                    <div className="flex gap-6 items-center">
                        <Image
                            src="/img/mastercard.png"
                            alt="Pago con Mastercard"
                            width={50}
                            height={50}
                        />
                        <Image src="/img/logo-pse.webp" alt="Pago con PSE" width={70} height={70} />
                        <Image
                            src="/img/img-bancolombia.png"
                            alt="Pago con Bancolombia"
                            width={120}
                            height={120}
                            className="rounded-md"
                        />
                    </div>
                    <p className="text-xs text-gray-300 mt-4">
                        © {new Date().getFullYear()} AutoCauchos. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}
