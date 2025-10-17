'use client'
import { useState } from 'react'
import { UserRegister } from '@/schemas/schemas'
import { motion } from 'framer-motion'

interface Props {
    data: UserRegister
    onBack: () => void
    onConfirm: () => Promise<void> // puede ser async
}

export default function RegisterStep3({ data, onBack, onConfirm }: Props) {
    const [loading, setLoading] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [error, setError] = useState('')
    const address = data.direcciones[0]

    const handleConfirm = async () => {
        if (loading) return

        if (!accepted) {
            setError('Debes aceptar los términos y condiciones antes de continuar.')
            return
        }

        setError('')
        setLoading(true)
        try {
            await onConfirm()
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            className="flex justify-center items-center w-full"
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <motion.div
                className="bg-white/80 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl w-full max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="w-fit bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm font-semibold">
                    Revisión final
                </div>

                <h3 className="text-gray-700 font-bold text-[19px] text-center mb-6 mt-4">
                    Confirmar información de registro
                </h3>

                <div className="space-y-6">
                    <section>
                        <h4 className="text-gray-600 font-semibold mb-2 text-[16px]">Datos personales</h4>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li><strong>Nombre:</strong> {data.nombre} {data.apellidos}</li>
                                <li><strong>Correo:</strong> {data.correo}</li>
                                <li><strong>Celular:</strong> {data.celular}</li>
                                <li><strong>Rol:</strong> Usuario</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-gray-600 font-semibold mb-2 text-[16px]">Dirección</h4>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li><strong>Departamento:</strong> {address.departamento}</li>
                                <li><strong>Ciudad:</strong> {address.ciudad}</li>
                                <li><strong>Dirección:</strong> {address.direccion}</li>
                                <li><strong>Celular de contacto:</strong> {address.celular}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Aceptación de términos */}
                    <div className="mt-4">
                        <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                className="mt-1"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">
                                Acepto los <a href="/terminos" className="text-blue-600 underline">términos y condiciones</a> del servicio.
                            </span>
                        </label>
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="py-2 px-2 lg:py-2 lg:px-3 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition-all duration-300 cursor-pointer text-[14px] lg:text-[15px]"
                    >
                        Atrás
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`py-2 px-2 lg:py-2 lg:px-3 rounded-lg text-white font-semibold flex items-center justify-center transition-all duration-300 cursor-pointer text-[14px] lg:text-[15px] ${loading
                            ? 'bg-green-500 cursor-not-allowed opacity-80'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                                    ></path>
                                </svg>
                                Registrando...
                            </>
                        ) : (
                            'Confirmar y registrar'
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}
