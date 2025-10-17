import { UserRegister, ErrorResponseSchema, SuccessResponseSchema } from '@/schemas/schemas'

export async function registerUser(formData: UserRegister) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
            const parsedError = ErrorResponseSchema.safeParse(data)
            return {
                success: false,
                // retornamos los errores (desde back) por campo si existen
                fieldErrors: parsedError.success ? parsedError.data.error : undefined,
                message: parsedError.success ? parsedError.data.message.join(', ') : 'Error en el registro',
            }
        }

        const parsedSuccess = SuccessResponseSchema.safeParse(data)
        if (!parsedSuccess.success) {
            return { success: false, message: 'Error al validar la respuesta del servidor' }
        }

        return {
            success: true, message: parsedSuccess.data.message, user: (data as any).user,
            token: (data as any).token,
        }
    } catch (err) {
        console.error('Error al registrar usuario:', err)
        return { success: false, message: 'Error de conexión con el servidor' }
    }
}
