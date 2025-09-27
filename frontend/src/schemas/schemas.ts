import z from "zod";

export const ProductSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string(),
    subtitulo: z.string(),
    descripcion: z.string().nullable().optional(),
    precio: z.coerce.number(),
    imagen_url: z.string().nullable().optional(),
    imagen_url2: z.string().nullable().optional(),
    descuento: z.coerce.number().nullable().optional(),
    stock: z.coerce.number(),
    categoriaId: z.coerce.number()
})

export const CategorySchema = z.object({
    id: z.coerce.number(),
    nombre: z.string()
})

export const CategoriesResponseSchemas = z.array(CategorySchema)

export const CategoryWithProductsResponseSchema = CategorySchema.extend({
    productos: z.array(ProductSchema)
});

export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>