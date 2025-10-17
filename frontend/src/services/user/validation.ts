import { z } from 'zod'
import { UserRegisterSchema } from '@/schemas/schemas'

/**
 * Valida los datos del usuario antes de enviarlos al backend.
 * Devuelve un string con el mensaje de error si hay problemas,
 * o `null` si todo está correcto.
 */
export function validateUserData(formData: unknown): string | null {
    const parsed = UserRegisterSchema.safeParse(formData)

    if (!parsed.success) {
        // Type assertion explícito para evitar el error de TypeScript
        const zodError = parsed.error as z.ZodError
        const firstError = zodError.issues?.[0]?.message || 'Verifica los campos del formulario'
        return firstError
    }

    const user = parsed.data
    const address = user.direcciones?.[0]

    // Validaciones adicionales
    if (!address?.departamento || !address?.ciudad || !address?.direccion) {
        return 'Completa todos los campos de dirección'
    }

    if (!user.nombre || !user.apellidos || !user.correo || !user.contrasena) {
        return 'Todos los campos personales son obligatorios'
    }

    return null
}
