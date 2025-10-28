import { CategoriesResponseSchemas, Product } from "@/schemas/schemas"

async function getCategories() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorias`
    const req = await fetch(url)
    const json = await req.json()
    const categories = CategoriesResponseSchemas.parse(json)

    return categories;
}


export default async function ProductForm({ product }: { product?: Product }) {

    const categories = await getCategories();

    return (
        <>
            <div className="space-y-2 ">
                <label
                    htmlFor="nombre"
                    className="block"
                >Nombre Producto</label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Nombre Producto"
                    className="border border-gray-300 w-full p-2"
                    name="nombre"
                    defaultValue={product?.nombre}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="subtitulo"
                    className="block"
                >Subtitulo Producto</label>
                <input
                    id="subtitulo"
                    type="text"
                    placeholder="Subtitulo Producto"
                    className="border border-gray-300 w-full p-2"
                    name="subtitulo"
                    defaultValue={product?.subtitulo}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descripcion"
                    className="block"
                >Descripcion Producto</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripcion Producto"
                    className="border border-gray-300 w-full p-2 resize-none min-h-[10rem]"
                    name="descripcion"
                    defaultValue={product?.descripcion!}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="precio"
                    className="block"
                >Precio</label>
                <input
                    id="precio"
                    type="number"
                    placeholder="Precio Producto"
                    className="border border-gray-300 w-full p-2"
                    name="precio"
                    min={0}
                    defaultValue={product?.precio}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="descuento"
                    className="block"
                >Descuento</label>
                <input
                    id="descuento"
                    type="number"
                    placeholder="Descuento Producto"
                    className="border border-gray-300 w-full p-2"
                    name="descuento"
                    min={0}
                    defaultValue={product?.precio}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="stock"
                    className="block"
                >Inventario</label>
                <input
                    id="stock"
                    type="number"
                    placeholder="Cantidad Disponible"
                    className="border border-gray-300 w-full p-2"
                    name="stock"
                    min={0}
                    defaultValue={product?.stock}
                />
            </div>

            <div className="space-y-2 ">
                <label
                    htmlFor="categoryId"
                    className="block"
                >Categoría</label>
                <select
                    id="categoryId"
                    className="border border-gray-300 w-full p-2 bg-white"
                    name="categoryId"
                    defaultValue={product?.categoriaId}
                >
                    <option value=''>Seleccionar Categoría</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                    ))}
                </select>
            </div>

        </>
    )
}