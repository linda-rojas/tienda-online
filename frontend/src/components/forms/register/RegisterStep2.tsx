'use client'
import { departamentos } from '@/utils/colombiaData'
import { Address } from '@/schemas/schemas'
import { useEffect, useState } from 'react'

interface Props {
    data: { direcciones: Address[] }
    onChangeAddress: (field: keyof Address, value: string, label: string) => void
    onBack: () => void
    onSubmit: () => void
}

export default function RegisterStep2({
    data,
    onChangeAddress,
    onBack,
    onSubmit,
}: Props) {
    const address = data.direcciones[0]
    const selectedDept = departamentos.find(
        (d) => d.departamento === address.departamento
    )

    const [touched, setTouched] = useState<Record<keyof Address, boolean>>({
        departamento: false,
        ciudad: false,
        direccion: false,
        celular: false,
    })

    const [errors, setErrors] = useState<Record<keyof Address, string>>({
        departamento: '',
        ciudad: '',
        direccion: '',
        celular: '',
    })

    const validate = () => {
        const newErrors: Record<keyof Address, string> = {
            departamento: '',
            ciudad: '',
            direccion: '',
            celular: '',
        }

        if (!address.departamento.trim())
            newErrors.departamento = 'Selecciona un departamento'

        if (!address.ciudad.trim()) newErrors.ciudad = 'Selecciona una ciudad'

        if (!address.direccion.trim())
            newErrors.direccion = 'La dirección es obligatoria'

        if (!address.celular.trim()) {
            newErrors.celular = 'El celular es obligatorio'
        } else if (!/^[3]\d{9}$/.test(address.celular)) {
            newErrors.celular = 'Debe tener 10 dígitos y comenzar con 3'
        }

        setErrors(newErrors)
        return newErrors
    }

    useEffect(() => {
        validate()
    }, [address])

    const handleNext = () => {
        const newErrors = validate()
        const hasErrors = Object.values(newErrors).some((msg) => msg !== '')

        if (hasErrors) {
            const allTouched = Object.keys(newErrors).reduce((acc, key) => {
                acc[key as keyof Address] = true
                return acc
            }, {} as Record<keyof Address, boolean>)

            setTouched(allTouched)
            return
        }

        onSubmit()
    }

    return (
        <div className="space-y-6">
            <h3 className="text-gray-600 font-semibold text-lg">Dirección</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departamento */}
                <div>
                    <label
                        htmlFor="departamento"
                        className="block text-[14px] sm:text-[16px] font-semibold text-gray-500 mb-1"
                    >
                        Departamento
                    </label>
                    <select
                        value={address.departamento}
                        onChange={(e) =>
                            onChangeAddress('departamento', e.target.value, 'Departamento')
                        }
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, departamento: true }))
                        }
                        className={`text-gray-700 border p-2 rounded-lg outline-none w-full focus:ring-2 ${errors.departamento && touched.departamento
                            ? 'border-red-500'
                            : 'focus:ring-blue-500 border-gray-500'
                            }`}
                    >
                        <option value="">Seleccione un departamento</option>
                        {departamentos.map((dep) => (
                            <option key={dep.departamento} value={dep.departamento}>
                                {dep.departamento}
                            </option>
                        ))}
                    </select>
                    {errors.departamento && touched.departamento && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.departamento}
                        </p>
                    )}
                </div>

                {/* Ciudad */}
                <div>
                    <label htmlFor="ciudad" className="block text-[14px] sm:text-[16px] font-semibold text-gray-500 mb-1">
                        Ciudad
                    </label>
                    <select
                        value={address.ciudad}
                        onChange={(e) => onChangeAddress('ciudad', e.target.value, 'Ciudad')}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, ciudad: true }))
                        }
                        disabled={!selectedDept}
                        className={`border text-gray-700 p-2 rounded-lg outline-none w-full focus:ring-2 ${errors.ciudad && touched.ciudad
                            ? 'border-red-500'
                            : 'focus:ring-blue-500 border-gray-500'
                            }`}
                    >
                        <option value="">Seleccione una ciudad</option>
                        {selectedDept?.ciudades.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    {errors.ciudad && touched.ciudad && (
                        <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
                    )}
                </div>

                {/* Dirección */}
                <div>
                    <label htmlFor="direccion" className="block text-[14px] sm:text-[16px] font-semibold text-gray-500 mb-1">
                        Dirección
                    </label>
                    <input
                        type="text"
                        placeholder="Dirección (Ej: Cra 1 N° 6-30)"
                        value={address.direccion}
                        onChange={(e) =>
                            onChangeAddress('direccion', e.target.value, 'Dirección')
                        }
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, direccion: true }))
                        }
                        className={`border text-gray-700 p-2 rounded-lg outline-none w-full focus:ring-2 ${errors.direccion && touched.direccion
                            ? 'border-red-500'
                            : 'focus:ring-blue-500 border-gray-500'
                            }`}
                    />
                    {errors.direccion && touched.direccion && (
                        <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                    )}
                </div>

                {/* Celular */}
                <div>
                    <label htmlFor="celular" className="block text-[14px] sm:text-[16px] font-semibold text-gray-500 mb-1">
                        Celular de contacto
                    </label>
                    <input
                        type="text"
                        placeholder="Celular de contacto"
                        value={address.celular}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, '').slice(0, 10)
                            onChangeAddress('celular', onlyNumbers, 'Celular')
                        }}
                        onBlur={() =>
                            setTouched((prev) => ({ ...prev, celular: true }))
                        }
                        className={`border p-2 rounded-lg outline-none w-full focus:ring-2 ${errors.celular && touched.celular
                            ? 'border-red-500'
                            : 'focus:ring-blue-500 border-gray-500'
                            }`}
                    />
                    {errors.celular && touched.celular && (
                        <p className="text-red-500 text-sm mt-1">{errors.celular}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="py-2 px-2 lg:py-2 lg:px-3 cursor-pointer text-[14px] lg:text-[15px] rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                    Atrás
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className={`py-2 px-2 lg:py-2 lg:px-3 cursor-pointer text-[14px] lg:text-[15px] rounded-lg text-white font-semibold transition-all duration-300 ${Object.values(errors).some((e) => e !== '')
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:scale-105'
                        }`}
                >
                    Confirmar
                </button>
            </div>
        </div>
    )
}
