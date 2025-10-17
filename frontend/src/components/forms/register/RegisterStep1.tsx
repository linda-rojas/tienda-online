'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UserRegister } from '@/schemas/schemas'

type SimpleField = 'nombre' | 'apellidos' | 'celular' | 'correo' | 'contrasena'

interface Props {
    data: Pick<UserRegister, SimpleField>
    onChange: (field: SimpleField, value: string) => void
    onNext: () => void
    serverErrors?: Partial<Record<SimpleField, string>>
}

export default function RegisterStep1({
    data,
    onChange,
    onNext,
    serverErrors = {},
}: Props) {
    const [touched, setTouched] = useState<Record<SimpleField, boolean>>({
        nombre: false,
        apellidos: false,
        celular: false,
        correo: false,
        contrasena: false,
    })

    const [errors, setErrors] = useState<Record<SimpleField, string>>({
        nombre: '',
        apellidos: '',
        celular: '',
        correo: '',
        contrasena: '',
    })

    const [showPasswordWarning, setShowPasswordWarning] = useState(true)
    const [checkingEmail, setCheckingEmail] = useState(false) // 👈 nuevo estado

    const validate = () => {
        const newErrors: Record<SimpleField, string> = {
            nombre: '',
            apellidos: '',
            celular: '',
            correo: '',
            contrasena: '',
        }

        if (!data.nombre.trim()) newErrors.nombre = 'Este campo es obligatorio'
        if (!data.apellidos.trim()) newErrors.apellidos = 'Este campo es obligatorio'

        if (!data.celular.trim()) {
            newErrors.celular = 'Este campo es obligatorio'
        } else if (!/^[3]\d{9}$/.test(data.celular)) {
            newErrors.celular = 'Debe tener 10 dígitos y comenzar con 3'
        }

        if (!data.correo.trim()) {
            newErrors.correo = 'Este campo es obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
            newErrors.correo = 'Correo no válido'
        }

        if (!data.contrasena.trim()) {
            newErrors.contrasena = 'Este campo es obligatorio'
        }

        setErrors(newErrors)
        return newErrors
    }

    useEffect(() => {
        validate()
    }, [data])

    useEffect(() => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
        setShowPasswordWarning(!regex.test(data.contrasena))
    }, [data.contrasena])

    // 🔹 Nueva función para verificar si el correo ya está registrado
    const checkEmailExists = async (correo: string): Promise<boolean> => {
        try {
            setCheckingEmail(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/check-email/${correo}`)
            const result = await res.json()
            return result.exists
        } catch (err) {
            console.error('Error al verificar correo:', err)
            return false
        } finally {
            setCheckingEmail(false)
        }
    }

    const handleNext = async () => {
        const currentErrors = validate()
        const hasErrors = Object.values(currentErrors).some((val) => val !== '')

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
        const passwordWeak = !passwordRegex.test(data.contrasena)

        if (passwordWeak) {
            toast.error('La contraseña debe tener al menos una letra mayúscula, una minúscula y un número.')
            setTouched(prev => ({ ...prev, contrasena: true }))
            return
        }

        if (hasErrors) {
            toast.error('Por favor completa todos los campos correctamente.')
            const allTouched = Object.fromEntries(
                Object.keys(currentErrors).map((key) => [key, true])
            ) as Record<SimpleField, boolean>
            setTouched(allTouched)
            return
        }

        // 🔹 Verificar correo duplicado antes de continuar
        const exists = await checkEmailExists(data.correo)
        if (exists) {
            toast.error('El correo ya está registrado. Por favor ingresa otro.')
            setErrors((prev) => ({ ...prev, correo: 'El correo ya está registrado' }))
            return // ❌ no deja avanzar
        }

        onNext()
    }

    const renderInput = (field: SimpleField, type: string, placeholder: string) => (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={data[field]}
                onChange={(e) => {
                    let value = e.target.value
                    if (field === 'celular') {
                        value = value.replace(/\D/g, '').slice(0, 10)
                    }
                    onChange(field, value)
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
                className={`border p-2 rounded-lg outline-none w-full focus:ring-2 ${(errors[field] || serverErrors?.[field]) && touched[field]
                    ? 'border-red-500'
                    : 'focus:ring-blue-500'
                    }`}
            />

            {(errors[field] || serverErrors?.[field]) && touched[field] && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[field] || serverErrors?.[field]}
                </p>
            )}

            {field === 'contrasena' && showPasswordWarning && data.contrasena.length > 0 && (
                <p className="text-yellow-500 text-sm mt-2">
                    La contraseña debe tener al menos una letra mayúscula, una minúscula y un número.
                </p>
            )}
        </div>
    )

    const isValid =
        Object.values(errors).every((v) => !v) &&
        !showPasswordWarning

    return (
        <div className="space-y-6 max-h-fit">
            <h3 className="text-gray-600 font-semibold text-lg">
                Información personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('nombre', 'text', 'Nombre')}
                {renderInput('apellidos', 'text', 'Apellidos')}
                {renderInput('celular', 'text', 'Celular')}
                {renderInput('correo', 'email', 'Correo electrónico')}
                {renderInput('contrasena', 'password', 'Contraseña')}

                <input
                    type="text"
                    value="Usuario"
                    disabled
                    className="border p-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:border-blue-500 border-gray-500"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isValid || checkingEmail} // 👈 no deja avanzar mientras verifica
                    className={`py-2 px-2 lg:py-2 lg:px-3 cursor-pointer rounded-lg text-white font-semibold transition-all duration-300 ${isValid && !checkingEmail
                        ? 'bg-blue-600 hover:scale-105'
                        : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    {checkingEmail ? 'Verificando...' : 'Siguiente'}
                </button>
            </div>
        </div>
    )
}
