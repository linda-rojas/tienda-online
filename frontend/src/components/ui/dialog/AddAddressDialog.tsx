'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { departamentos, getCiudadesByDepartamento } from '@/utils/colombiaData' // CAMBIO

type AddressForm = {
    direccion: string
    ciudad: string
    departamento: string
    celular: string
}

type Props = {
    open: boolean
    loading?: boolean
    onClose: () => void
    onSubmit: (data: AddressForm) => void
}

export default function AddAddressDialog({ open, loading = false, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<AddressForm>({
        direccion: '',
        ciudad: '',
        departamento: '',
        celular: '',
    })

    const [touched, setTouched] = useState<Record<keyof AddressForm, boolean>>({
        direccion: false,
        ciudad: false,
        departamento: false,
        celular: false,
    })

    useEffect(() => {
        if (!open) return
        setForm({ direccion: '', ciudad: '', departamento: '', celular: '' })
        setTouched({ direccion: false, ciudad: false, departamento: false, celular: false })
    }, [open])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, loading, onClose])

    // CAMBIO: ahora las ciudades salen del helper
    const cityOptions = useMemo(() => {
        return getCiudadesByDepartamento(form.departamento)
    }, [form.departamento])

    const errors = useMemo(() => {
        const e: Partial<Record<keyof AddressForm, string>> = {}

        if (!form.direccion.trim()) e.direccion = 'La dirección es obligatoria'
        if (!form.departamento.trim()) e.departamento = 'Selecciona un departamento'
        if (!form.ciudad.trim()) e.ciudad = 'Selecciona una ciudad'

        // Celular: 10 dígitos y empieza en 3 (igual que el registro)
        if (!form.celular.trim()) {
            e.celular = 'El celular es obligatorio'
        } else if (!/^[3]\d{9}$/.test(form.celular)) {
            e.celular = 'Debe tener 10 dígitos y comenzar con 3'
        }

        return e
    }, [form])

    const isValid = Object.keys(errors).length === 0

    const setField = (k: keyof AddressForm, v: string) => {
        setForm((prev) => ({ ...prev, [k]: v }))
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => {
                    if (!loading) onClose()
                }}
            />

            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-gray-700 font-semibold text-lg">Agregar dirección</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-500 hover:text-gray-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dirección */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Dirección</label>
                            <input
                                value={form.direccion}
                                onChange={(e) => setField('direccion', e.target.value)}
                                onBlur={() => setTouched((p) => ({ ...p, direccion: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 text-gray-800 outline-none focus:ring-2 ${touched.direccion && errors.direccion
                                    ? 'border-red-300 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Ej: Cra 10 # 20 - 30 Apto 301"
                            />
                            {touched.direccion && errors.direccion && (
                                <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
                            )}
                        </div>

                        {/* Departamento */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Departamento</label>
                            <select
                                value={form.departamento}
                                onChange={(e) => {
                                    const dept = e.target.value
                                    setField('departamento', dept)
                                    setTouched((p) => ({ ...p, departamento: true }))
                                    setField('ciudad', '') // reset al cambiar depto
                                }}
                                onBlur={() => setTouched((p) => ({ ...p, departamento: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 text-gray-800 outline-none focus:ring-2 bg-white ${touched.departamento && errors.departamento
                                    ? 'border-red-300 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            >
                                <option value="">Selecciona...</option>

                                {/* CAMBIO: viene del archivo utils */}
                                {departamentos.map((d) => (
                                    <option key={d.departamento} value={d.departamento}>
                                        {d.departamento}
                                    </option>
                                ))}
                            </select>
                            {touched.departamento && errors.departamento && (
                                <p className="mt-1 text-xs text-red-600">{errors.departamento}</p>
                            )}
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Ciudad</label>
                            <select
                                value={form.ciudad}
                                disabled={!form.departamento || cityOptions.length === 0}
                                onChange={(e) => setField('ciudad', e.target.value)}
                                onBlur={() => setTouched((p) => ({ ...p, ciudad: true }))}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 text-gray-800 outline-none focus:ring-2 bg-white ${!form.departamento || cityOptions.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                                    } ${touched.ciudad && errors.ciudad
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                            >
                                <option value="">
                                    {form.departamento ? 'Selecciona...' : 'Primero elige un departamento'}
                                </option>

                                {/* CAMBIO: viene del helper */}
                                {cityOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            {touched.ciudad && errors.ciudad && (
                                <p className="mt-1 text-xs text-red-600">{errors.ciudad}</p>
                            )}
                        </div>

                        {/* Celular */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Celular</label>
                            <input
                                value={form.celular}
                                onChange={(e) => {
                                    // solo números + max 10
                                    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10)
                                    setField('celular', onlyDigits)
                                }}
                                onBlur={() => setTouched((p) => ({ ...p, celular: true }))}
                                inputMode="numeric"
                                maxLength={10}
                                className={`mt-1 w-full rounded-xl border px-3 py-2 text-gray-800 outline-none focus:ring-2 ${touched.celular && errors.celular
                                    ? 'border-red-300 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Ej: 3001234567"
                            />
                            {touched.celular && errors.celular && (
                                <p className="mt-1 text-xs text-red-600">{errors.celular}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            cursor-pointer px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm
                            hover:bg-gray-50 transition
                            disabled:opacity-60 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-gray-300
                            "
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        disabled={loading || !isValid}
                        onClick={() => {
                            setTouched({ direccion: true, ciudad: true, departamento: true, celular: true })
                            if (!isValid) return

                            onSubmit({
                                direccion: form.direccion.trim(),
                                ciudad: form.ciudad.trim(),
                                departamento: form.departamento.trim(),
                                celular: form.celular.trim(),
                            })
                        }}
                        className="
                        cursor-pointer px-4 py-2 rounded-xl font-semibold text-sm transition
                        bg-blue-800 text-white hover:bg-blue-900
                        disabled:opacity-60 disabled:cursor-not-allowed
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                        "
                    >
                        {loading ? 'Guardando...' : 'Guardar dirección'}
                    </button>
                </div>
            </div>
        </div>
    )
}
