'use client'
import { CategoriesResponseSchemas, Category, Product } from "@/schemas/schemas"
import UploadProductImage from "./image/UploadProductImage"
import ProductImagesEditor from "./image/ProductImagesEditor"
import { useEffect, useState } from "react"

// async function getCategories() {
//     const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`
//     const req = await fetch(url)
//     const json = await req.json()
//     const categories = CategoriesResponseSchemas.parse(json)
//     return categories;
// }

export default function ProductForm({ product }: { product?: Product }) {
    const [categories, setCategories] = useState<Category[]>([]);

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`;
            const res = await fetch(url);
            const json = await res.json();
            const categories = CategoriesResponseSchemas.parse(json);
            setCategories(categories);
        };

        fetchCategories();
    }, []); // El arreglo vacío asegura que solo se ejecute una vez cuando el componente se monta

    const [values, setValues] = useState({
        nombre: product?.nombre ?? '',
        subtitulo: product?.subtitulo ?? '',
        descripcion: product?.descripcion ?? '',
        precio: product?.precio ?? 0,
        descuento: product?.descuento ?? 0,
        stock: product?.stock ?? 0,
        categoriaId: product?.categoriaId ?? '',
    });


    return (
        <>
            <div className="space-y-2 ">
                <label
                    htmlFor="nombre"
                    className="block font-bold text-gray-600"
                >Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Nombre Producto"
                    className="border border-gray-300 w-full p-2"
                    name="nombre"
                    value={values.nombre} onChange={(e) => setValues(v => ({ ...v, nombre: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="subtitulo"
                    className="block font-bold text-gray-600"
                >Subtitulo</label>
                <input
                    id="subtitulo"
                    type="text"
                    placeholder="Subtitulo Producto"
                    className="border border-gray-300 w-full p-2"
                    name="subtitulo"
                    value={values.subtitulo} onChange={(e) => setValues(v => ({ ...v, subtitulo: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descripcion"
                    className="block font-bold text-gray-600"
                >Descripcion</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripcion Producto"
                    className="border border-gray-300 w-full p-2 resize-none min-h-[10rem]"
                    name="descripcion"
                    value={values.descripcion} onChange={(e) => setValues(v => ({ ...v, descripcion: e.target.value }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="precio"
                    className="block font-bold text-gray-600"
                >Precio</label>
                <input
                    id="precio"
                    type="number"
                    placeholder="Precio Producto"
                    className="border border-gray-300 w-full p-2"
                    name="precio"
                    min={0}
                    value={values.precio} onChange={(e) => setValues(v => ({ ...v, precio: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descuento"
                    className="block font-bold text-gray-600"
                >Descuento</label>
                <input
                    id="descuento"
                    type="number"
                    placeholder="Descuento Producto"
                    className="border border-gray-300 w-full p-2"
                    name="descuento"
                    min={0}
                    value={values.descuento} onChange={(e) => setValues(v => ({ ...v, descuento: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="stock"
                    className="block font-bold text-gray-600"
                >Inventario</label>
                <input
                    id="stock"
                    type="number"
                    placeholder="Cantidad Disponible"
                    className="border border-gray-300 w-full p-2"
                    name="stock"
                    min={0}
                    value={values.stock} onChange={(e) => setValues(v => ({ ...v, stock: Number(e.target.value) }))}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="categoryId"
                    className="block font-bold text-gray-600"
                >Categoría</label>
                <select
                    id="categoryId"
                    className="border border-gray-300 w-full p-2 bg-white"
                    name="categoryId"
                    value={values.categoriaId} onChange={(e) => setValues(v => ({ ...v, categoriaId: e.target.value }))}
                >
                    <option value=''>Seleccionar Categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                    ))}
                </select>
            </div>
            {product?.id ? (
                product?.imagenes?.length ? (
                    <ProductImagesEditor productId={product.id} images={product.imagenes as any} />
                ) : (
                    <p className="text-sm text-gray-500 mt-3">Este producto aún no tiene imágenes.</p>
                )
            ) : null}


            {product?.id ? (
                <UploadProductImage productId={product.id} />
            ) : (
                <p className="text-sm text-gray-500 mt-3">
                    Primero guarda el producto para subir imágenes
                </p>
            )}
        </>
    )
}