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

// shoping cart
const ShoppingCartContentsSchema = ProductSchema.pick({
    nombre: true,
    imagen_url: true,
    precio: true,
    stock: true
}).extend({
    // renombramos productId(id) y adicionalmente agregamos quantity(cantidad)
    productId: z.coerce.number(),
    quantity: z.coerce.number()
})
// lo necesitamos como un array y no como objeto z.array()
export const ShoppingCartSchema = z.array(ShoppingCartContentsSchema)

export const CouponResponseSchema = z.object({
    nombre: z.string(),
    message: z.string(),
    porcentaje: z.coerce.number().min(0).max(100).default(0)
})


export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>
export type CartItem = z.infer<typeof ShoppingCartContentsSchema>
export type Coupon = z.infer<typeof CouponResponseSchema>

