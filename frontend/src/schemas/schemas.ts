import z from "zod";


// ===============================
// 📦 PRODUCTOS Y CATEGORÍAS
// ===============================

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
    nombre: z.string(),
    productos: z.array(ProductSchema).optional()
})

export const CategoriesResponseSchemas = z.array(CategorySchema)

export const CategoryWithProductsResponseSchema = CategorySchema.extend({
    productos: z.array(ProductSchema)
});


// ===============================
// 🛒 CARRITO DE COMPRAS
// ===============================

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


// ===============================
// 🎟️ CUPONES
// ===============================

export const CouponResponseSchema = z.object({
    nombre: z.string().default(''),
    message: z.string(),
    porcentaje: z.coerce.number().min(0).max(100).default(0)
})

// export const CouponResponseSuccessSchema = z.object({
//     nombre: z.string(),
//     porcentaje: z.coerce.number().min(0).max(100).default(0)
// })

// export const CouponResponseErrorSchema = z.object({
//     message: z.string(),
// })


// ===============================
// 📦 PEDIDOS
// ===============================

const OrderContentSchema = z.object({
    productoId: z.number(),
    cantidad: z.number(),
    precio: z.number()
})

export const OrderSchema = z.object({
    total: z.number(),
    cupon: z.string(),
    contents: z.array(OrderContentSchema).min(1, { message: 'El Carrito no puede ir vacio' }),
    usuarioId: z.number()
})


// ===============================
// 👤 USUARIOS
// ===============================

// esquema para direcciones del usuario
export const AddressSchema = z.object({
    departamento: z.string().min(1, 'Seleccione un departamento'),
    ciudad: z.string().min(1, 'Seleccione una ciudad'),
    direccion: z.string().min(5, 'La dirección es obligatoria'),
    celular: z.string().min(10, 'El celular debe tener al menos 10 dígitos'),
});

export const RoleSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string(),
});

export const UserSchema = z.object({
    id: z.coerce.number(),
    nombre: z.string(),
    apellidos: z.string(),
    celular: z.string(),
    correo: z.string().email(),
    contrasena: z.string(),
    role: RoleSchema,
    direcciones: z.array(AddressSchema),
});

// ===============================
// 🔐 RESPUESTAS DE API
// ===============================

export const SuccessResponseSchema = z.object({
    message: z.string()
})
export const ErrorResponseSchema = z.object({
    message: z.array(z.string()),
    error: z.string(),
    statusCode: z.number()
})

export const UserRegisterResponseSchema = z.object({
    message: z.string(),
    user: UserSchema,
    token: z.string(),
});


// ===============================
// 🧾 REGISTRO DE USUARIOS (FORM FRONTEND)
// ===============================
export const UserRegisterSchema = z.object({
    nombre: z.string(),
    apellidos: z.string(),
    celular: z.string(),
    correo: z.string().email(),
    contrasena: z.string(),
    roleId: z.coerce.number().default(2),
    direcciones: z.array(
        z.object({
            departamento: z.string(),
            ciudad: z.string(),
            direccion: z.string(),
            celular: z.string(),
        })
    ),
})

// ===============================
// 📘 TIPOS INFERIDOS
// ===============================
export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>
export type CartItem = z.infer<typeof ShoppingCartContentsSchema>
// export type Coupon = z.infer<typeof CouponResponseSuccessSchema | typeof CouponResponseErrorSchema>

export type Coupon = z.infer<typeof CouponResponseSchema>

export type User = z.infer<typeof UserSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>
export type UserRegisterResponse = z.infer<typeof UserRegisterResponseSchema>;

