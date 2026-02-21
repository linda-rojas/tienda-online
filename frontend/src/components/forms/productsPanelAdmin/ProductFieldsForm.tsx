'use client'
import type { Category, Product } from '@/schemas/schemas'

export default function ProductFieldsForm({
    categories,
    product,
    onSubmit,
    submitLabel,
    note,
}: {
    categories: Category[]
    product?: Product
    onSubmit: (formData: FormData) => void | Promise<void>
    submitLabel: string
    note?: string
}) {
    return (
        <form
            className="space-y-4"
            action={onSubmit}
        >
            {note && <p className="text-sm text-gray-500">{note}</p>}

            <Field label="Nombre Producto" name="nombre" defaultValue={product?.nombre} />
            <Field label="Subtitulo Producto" name="subtitulo" defaultValue={product?.subtitulo} />

            <div className="space-y-2">
                <label className="block font-bold text-gray-600">Descripcion del Producto</label>
                <textarea
                    className="border border-gray-300 w-full p-2 resize-none min-h-[10rem]"
                    name="descripcion"
                    defaultValue={product?.descripcion || ''}
                />
            </div>

            <Field label="Precio" name="precio" type="number" defaultValue={product?.precio} min={0} />
            <Field label="Descuento" name="descuento" type="number" defaultValue={product?.descuento ?? 0} min={0} />
            <Field label="Inventario" name="stock" type="number" defaultValue={product?.stock} min={0} />

            <div className="space-y-2">
                <label className="block font-bold text-gray-600">Categoría</label>
                <select
                    className="border border-gray-300 w-full p-2 bg-white"
                    name="categoryId"
                    defaultValue={product?.categoriaId}
                >
                    <option value="">Seleccionar Categoría</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="rounded bg-blue-600 font-bold py-2 w-full cursor-pointer text-white hover:bg-blue-700"
            >
                {submitLabel}
            </button>
        </form>
    )
}

function Field({
    label,
    name,
    defaultValue,
    type = 'text',
    min,
}: {
    label: string
    name: string
    defaultValue?: any
    type?: string
    min?: number
}) {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-gray-600">{label}</label>
            <input
                type={type}
                name={name}
                min={min}
                defaultValue={defaultValue ?? ''}
                className="border border-gray-300 w-full p-2"
            />
        </div>
    )
}
