'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { toast } from 'react-toastify'

export type DraftImage<TType extends string> = {
    file: File
    previewUrl: string
    type: TType
}

type DraftImagesPickerProps<TType extends string> = {
    value: DraftImage<TType>[]
    onChange: (next: DraftImage<TType>[]) => void

    maxFiles?: number
    accept?: Record<string, string[]>

    // Para asignación automática del tipo (si aplica)
    autoAssignType?: (args: {
        prev: DraftImage<TType>[]
        incomingIndex: number
    }) => TType

    // Para bloquear opciones en el select (ej: ya existe primary en DB)
    isTypeDisabled?: (type: TType) => boolean

    // Para construir las opciones del select
    typeOptions: Array<{ value: TType; label: string }>
}

export default function DraftImagesPicker<TType extends string>({
    value,
    onChange,
    maxFiles = 5,
    accept = {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
    },
    autoAssignType,
    isTypeDisabled,
    typeOptions,
}: DraftImagesPickerProps<TType>) {
    // limpiar URLs al desmontar
    useEffect(() => {
        return () => {
            value.forEach((img) => URL.revokeObjectURL(img.previewUrl))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeDraft = useCallback(
        (index: number) => {
            const img = value[index]
            if (img) URL.revokeObjectURL(img.previewUrl)
            onChange(value.filter((_, i) => i !== index))
        },
        [onChange, value]
    )

    const changeType = useCallback(
        (index: number, newType: TType) => {
            const next = value.map((img, i) => (i === index ? { ...img, type: newType } : img))
            onChange(next)
        },
        [onChange, value]
    )

    const onDrop = useCallback(
        (files: File[]) => {
            if (!files.length) return

            if (value.length + files.length > maxFiles) {
                toast.error(`Solo puedes subir hasta ${maxFiles} imágenes.`)
                return
            }

            const incoming: DraftImage<TType>[] = files.map((file, idx) => {
                const type = autoAssignType ? autoAssignType({ prev: value, incomingIndex: idx }) : typeOptions[0].value
                return { file, previewUrl: URL.createObjectURL(file), type }
            })

            onChange([...value, ...incoming])
        },
        [autoAssignType, maxFiles, onChange, typeOptions, value]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        accept,
        onDrop,
        maxFiles,
        multiple: true,
    })

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <label className="block text-md font-bold text-gray-700">Imágenes seleccionadas</label>

                <div
                    {...getRootProps({
                        className: `
              py-10 border-2 border-dashed text-center transition rounded cursor-pointer
              ${isDragActive ? 'border-gray-900 bg-gray-200 text-gray-900' : 'border-gray-300 bg-white text-gray-600'}
              ${isDragReject ? 'border-red-500 text-red-500' : ''}
            `,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragAccept && <p className="font-semibold">Suelta las imágenes</p>}
                    {isDragReject && <p className="font-semibold">Archivo no válido</p>}
                    {!isDragActive && (
                        <>
                            <p className="font-semibold">Arrastra y suelta imágenes aquí</p>
                            <p className="text-sm text-gray-500 mt-2">
                                o <span className="text-blue-800 underline">haz clic para seleccionarlas</span>
                            </p>
                        </>
                    )}
                </div>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {value.map((img, index) => (
                        <div key={img.previewUrl} className="w-[260px] h-[180px] relative border rounded bg-white">
                            <Image src={img.previewUrl} alt={`Draft ${index + 1}`} fill className="object-contain" />

                            <button
                                type="button"
                                onClick={() => removeDraft(index)}
                                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                            >
                                ✕
                            </button>

                            <select
                                value={img.type}
                                onChange={(e) => changeType(index, e.target.value as TType)}
                                className="absolute bottom-2 left-2 bg-white text-sm p-1 rounded shadow"
                            >
                                {typeOptions.map((opt) => (
                                    <option key={String(opt.value)} value={opt.value} disabled={isTypeDisabled?.(opt.value)}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}