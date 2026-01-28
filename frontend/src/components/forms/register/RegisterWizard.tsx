'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import RegisterStep1 from './RegisterStep1'
import RegisterStep2 from './RegisterStep2'
import RegisterStep3 from './RegisterStep3'
import { registerUser } from '@/services/user/registerUser'
import { validateUserData } from '@/services/user/validation'

export default function RegisterWizard() {
    const router = useRouter() // Para redirigir sin recargar la app

    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        celular: '',
        correo: '',
        contrasena: '',
        roleId: 2,
        direcciones: [
            { departamento: '', ciudad: '', direccion: '', celular: '' },
        ],
    })

    // Errores por campo
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof typeof formData, string>>
    >({})

    const nextStep = () => {
        setDirection(1)
        setStep((prev) => Math.min(prev + 1, 3))
    }

    const prevStep = () => {
        setDirection(-1)
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddressChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            direcciones: [{ ...prev.direcciones[0], [field]: value }],
        }))
    }

    const handleSubmit = async () => {
        // 🔹 Validación con Zod antes de enviar
        const error = validateUserData(formData)
        if (error) {
            toast.error(error)
            return
        }

        // 🔹 Llamada al backend
        const { success, message, fieldErrors, token, user } = await registerUser(formData)

        if (success) {
            // 💾 Guardar token y usuario en localStorage (para sesión automática)
            if (token) {
                localStorage.setItem('token', token)
            }
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
            }

            toast.success('Registro exitoso, redirigiendo...', {
                onClose: () => router.push('/'), // 👈 Redirige sin recargar
            })
        } else {
            // 🔸 Mostrar errores si los hay
            if (typeof fieldErrors === 'object' && fieldErrors !== null) {
                setFieldErrors(fieldErrors)
            } else {
                toast.error(message || 'Error en el registro')
            }
        }
    }

    // Animaciones entre pasos
    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
    }

    return (
        <div className="w-full">
            {/* Indicador de progreso */}
            <div className="flex justify-center items-center mb-6">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className={`h-3 w-3 rounded-full mx-2 transition-all duration-300 ${step === n ? 'bg-blue-600' : 'bg-gray-300'}`}
                    />
                ))}
            </div>

            {/* Contenedor de pasos */}
            <div className="min-h-screen pt-2">
                <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    className="w-full"
                >
                    {step === 1 && (
                        <RegisterStep1
                            data={formData}
                            onChange={handleChange}
                            onNext={nextStep}
                            serverErrors={fieldErrors}
                        />
                    )}

                    {step === 2 && (
                        <RegisterStep2
                            data={formData}
                            onChangeAddress={handleAddressChange}
                            onBack={prevStep}
                            onSubmit={nextStep}
                        />
                    )}

                    {step === 3 && (
                        <RegisterStep3
                            data={formData}
                            onBack={prevStep}
                            onConfirm={handleSubmit}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    )
}
