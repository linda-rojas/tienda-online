'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { UserRegister } from '@/schemas/schemas'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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

    const [showPasswordWarning, setShowPasswordWarning] = useState(false)
    const [checkingEmail, setCheckingEmail] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showEmailWarning, setShowEmailWarning] = useState(false);

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
        const value = data.contrasena || "";
        const regex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        const minLength = value.length >= 6;

        // Validación completa de la contraseña
        const valid = regex.test(value) && minLength;

        setShowPasswordWarning(value.length > 0 && !valid);
    }, [data.contrasena]);

    // 🔹 Efecto para mostrar advertencia de correo inválido
    useEffect(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo);
        setShowEmailWarning(data.correo.trim().length > 0 && !isEmailValid);
    }, [data.correo]);

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

    const renderInput = (field: SimpleField, type: string, placeholder: string, label: string,) => {
        const hasError = (errors[field] || serverErrors?.[field]) && touched[field];

        const inputType =
            field === "contrasena" ? (showPassword ? "text" : "password") : type;

        return (
            <div>
                <label className="block text-[14px] sm:text-[15px] font-semibold text-gray-500 mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        type={inputType}
                        placeholder={placeholder}
                        value={data[field]}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (field === "celular") {
                                value = value.replace(/\D/g, "").slice(0, 10);
                            }
                            onChange(field, value);
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, [field]: true }))}
                        className={`border p-2 rounded-lg outline-none text-gray-700 w-full focus:ring-2 ${field === "contrasena" ? "pr-12" : ""
                            } ${hasError ? "border-red-500" : "focus:ring-blue-500 border-gray-500"
                            }`}
                    />
                    {field === "contrasena" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition
                            bg-transparent border-0 outline-none focus:outline-none focus:ring-0"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? (
                                <AiOutlineEye className="text-xl" />
                            ) : (
                                <AiOutlineEyeInvisible className="text-xl" />
                            )}
                        </button>
                    )}

                    {field === "correo" && showEmailWarning && (
                        <div className="text-yellow-600 text-xs p-2 absolute left-0 right-0 top-[42px] z-10 px-2 items-center rounded-lg bg-yellow-100 shadow-md">
                            El correo debe tener el símbolo '@' y un punto ('.') en la dirección.
                        </div>
                    )}

                    {/* Alerta para contraseña */}
                    {field === "contrasena" && showPasswordWarning && (
                        <div className="text-yellow-600 text-xs p-2 absolute left-0 right-0 top-full px-2 items-center rounded-lg bg-yellow-100 shadow-md" role="tooltip" id="passwordHelp">
                            La contraseña debe tener mínimo 6 caracteres, una mayúscula, una minúscula y un número o símbolo.
                        </div>
                    )}
                </div>

                {hasError && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors[field] || serverErrors?.[field]}
                    </p>
                )}

            </div>
        );
    };

    const isValid =
        Object.values(errors).every((v) => !v) &&
        !showPasswordWarning

    return (
        <div className="space-y-6 max-h-fit">
            <h3 className="text-gray-600 font-semibold text-lg">
                Información personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput("nombre", "text", "Escribe tu nombre", "Nombre")}
                {renderInput("apellidos", "text", "Apellidos", "Apellidos")}
                {renderInput("celular", "text", "Celular", "Celular")}
                {renderInput("correo", "email", "Correo electrónico", "Correo")}
                {renderInput("contrasena", "password", "Contraseña", "Contraseña")}
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
