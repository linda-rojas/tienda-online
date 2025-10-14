import Link from 'next/link'
import { GiFlatTire } from 'react-icons/gi'

export function LogoAutocaucho() {
    return (
        <Link
            href="/"
            className={`w-[140px] md:w-[170px] h-[50px] md:h-[60px] flex justify-center items-center rounded-full cursor-pointer `}
        >
            <div className="flex items-center ">
                {' '}
                {/* Espaciado entre los elementos */}
                <span className="text-amber-300 hover:text-gray-300 font-extrabold text-[23px] md:text-[25px] lg:text-[25px] border-t-[3px] border-gray-300 transition-all duration-300 ease-in-out hover:border-t-4 hover:border-amber-300">
                    AutoCauch
                </span>
                <div className="flex items-center justify-center bg-gray-300 p-1 rounded-full">
                    <GiFlatTire className="text-gray-800 h-6 w-6" />
                </div>
            </div>
        </Link>
    )
}
